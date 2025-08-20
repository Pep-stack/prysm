// Social authentication utilities

import { supabase } from './supabase';

// Function to sync user profile data after OAuth login
export const syncSocialProfile = async (user) => {
  if (!user) return;

  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing profile:', fetchError);
      return;
    }

    // Extract data from OAuth provider
    const { user_metadata, identities } = user;
    const primaryIdentity = identities?.[0];
    
    let profileData = {};
    
    // Extract name from various OAuth providers
    if (user_metadata.full_name) {
      profileData.name = user_metadata.full_name;
    } else if (user_metadata.name) {
      profileData.name = user_metadata.name;
    } else if (user_metadata.first_name || user_metadata.last_name) {
      profileData.name = `${user_metadata.first_name || ''} ${user_metadata.last_name || ''}`.trim();
    } else if (user_metadata.user_name) {
      // GitHub and X often use user_name
      profileData.name = user_metadata.user_name;
    } else if (user_metadata.login) {
      // GitHub login
      profileData.name = user_metadata.login;
    }

    // Extract avatar URL from various providers
    if (user_metadata.avatar_url) {
      profileData.avatar_url = user_metadata.avatar_url;
    } else if (user_metadata.picture) {
      profileData.avatar_url = user_metadata.picture;
    } else if (user_metadata.profile_image_url) {
      // X profile image
      profileData.avatar_url = user_metadata.profile_image_url;
    }

    // Extract additional social links based on provider
    const provider = primaryIdentity?.provider;
    if (provider === 'github' && user_metadata.login) {
      profileData.github_username = user_metadata.login;
    } else if (provider === 'twitter' && user_metadata.user_name) {
      profileData.twitter_username = user_metadata.user_name;
    }

    // Generate slug if name is available and no profile exists
    if (profileData.name && !existingProfile) {
      const baseSlug = slugify(profileData.name);
      profileData.custom_slug = await getUniqueSlug(baseSlug);
    }

    // Only update if we have new data and either no profile exists or profile is incomplete
    if (Object.keys(profileData).length > 0) {
      const shouldUpdate = !existingProfile || 
        !existingProfile.name || 
        !existingProfile.avatar_url ||
        !existingProfile.custom_slug;

      if (shouldUpdate) {
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            ...profileData,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error('Error updating profile after OAuth:', updateError);
        } else {
          console.log('Profile synced successfully after OAuth login');
        }
      }
    }
  } catch (error) {
    console.error('Error syncing social profile:', error);
  }
};

// Helper function to create URL-friendly slugs
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

// Helper function to get unique slug
async function getUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_slug', slug)
      .single();
      
    if (!data || error) break;
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Function to handle OAuth errors
export const handleOAuthError = (error, provider) => {
  console.error(`OAuth error for ${provider}:`, error);
  
  // Common OAuth error messages
  const errorMessages = {
    'access_denied': `You denied access to ${provider}. Please try again if you want to sign in.`,
    'invalid_request': 'Invalid OAuth request. Please try again.',
    'unauthorized_client': 'OAuth client not authorized. Please contact support.',
    'unsupported_response_type': 'OAuth configuration error. Please contact support.',
    'invalid_scope': 'Invalid OAuth scope. Please contact support.',
    'server_error': `${provider} server error. Please try again later.`,
    'temporarily_unavailable': `${provider} is temporarily unavailable. Please try again later.`
  };

  // Extract error code from error object or URL
  let errorCode = null;
  if (error?.message) {
    const match = error.message.match(/error=([^&]+)/);
    errorCode = match?.[1];
  }

  return errorMessages[errorCode] || `Failed to sign in with ${provider}. Please try again.`;
};

// Check if OAuth providers are configured
export const checkOAuthConfig = () => {
  const config = {
    google: {
      enabled: !!process.env.NEXT_PUBLIC_SUPABASE_URL, // This will be properly configured in Supabase
      configured: true // Will be set based on actual Supabase config
    },
    apple: {
      enabled: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      configured: true // Will be set based on actual Supabase config
    },
    twitter: {
      enabled: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      configured: true // Will be set based on actual Supabase config
    },
    github: {
      enabled: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      configured: true // Will be set based on actual Supabase config
    }
  };

  return config;
};
