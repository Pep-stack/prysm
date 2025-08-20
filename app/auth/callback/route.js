import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { syncSocialProfile } from '../../../src/lib/socialAuth';

// Helper function to create unique slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Helper function to get unique slug
async function getUniqueSlug(baseSlug, supabase) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_slug', slug)
      .single();
    
    if (!data) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Helper function to setup user profile after email verification
async function setupUserProfile(user, supabase) {
  try {
    // Check if profile already has required data
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('name, custom_slug, subscription_plan')
      .eq('id', user.id)
      .single();

    // If profile already has name and slug, skip setup
    if (existingProfile?.name && existingProfile?.custom_slug) {
      return;
    }

    // Get user metadata from signup
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    const selectedPlan = user.user_metadata?.selected_plan || 'free';
    const fullName = user.user_metadata?.full_name || `${firstName} ${lastName}`.trim();

    // Generate unique slug
    const baseSlug = slugify(fullName || user.email.split('@')[0]);
    const uniqueSlug = await getUniqueSlug(baseSlug, supabase);
    
    // Prepare subscription data
    const subscriptionData = {
      subscription_plan: selectedPlan,
      subscription_status: selectedPlan === 'free' ? 'active' : 'trialing',
      subscription_start_date: new Date().toISOString(),
      trial_end_date: selectedPlan !== 'free' ? 
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null
    };

    // Update profile with all necessary data
    await supabase
      .from('profiles')
      .update({
        name: fullName,
        custom_slug: uniqueSlug,
        ...subscriptionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    console.log(`Profile setup completed for user ${user.id} with plan ${selectedPlan}`);
  } catch (error) {
    console.error('Error setting up user profile:', error);
    // Don't throw - let the user proceed even if profile setup fails
  }
}

// This route handles the callback after email verification
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      // Create server-side Supabase client
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get(name) {
              return cookieStore.get(name)?.value;
            },
            set(name, value, options) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name, options) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        console.error('Error details:', { 
          message: error.message, 
          status: error.status, 
          code: error.error_code 
        });
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent('Failed to authenticate. Please try again.')}`
        );
      }
      
      // If successful and user data is available, setup user profile
      if (data?.user) {
        // First check if this is a social login (has provider metadata)
        const isSocialLogin = data.user.app_metadata?.providers?.some(p => p !== 'email');
        
        if (isSocialLogin) {
          // Handle social login profile sync
          await syncSocialProfile(data.user);
        } else {
          // Handle email signup profile setup
          await setupUserProfile(data.user, supabase);
        }
      }
      
      // Create response to set cookies
      const response = NextResponse.redirect(`${requestUrl.origin}${next}`);
      
      // Determine redirect based on user's subscription plan
      const selectedPlan = data.user?.user_metadata?.selected_plan;
      
      if (selectedPlan && selectedPlan !== 'free') {
        // For paid plans, redirect to dashboard with plan info
        return NextResponse.redirect(`${requestUrl.origin}/dashboard?plan=${selectedPlan}&new_user=true`);
      } else {
        // For free plan or default, redirect to dashboard
        return response;
      }
    } catch (error) {
      console.error('Unexpected error during auth callback:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('An unexpected error occurred.')}`
      );
    }
  }

  // If no code is provided, redirect to the login page
  return NextResponse.redirect(`${requestUrl.origin}/login`);
} 