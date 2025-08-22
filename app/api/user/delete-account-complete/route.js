import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    console.log('🗑️ Complete account deletion request received');
    console.log('🕐 Timestamp:', new Date().toISOString());

    // Initialize Stripe if configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { 
      apiVersion: '2025-07-30.basil'
    }) : null;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header found');
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token extracted, length:', token.length);

    // Create regular Supabase client with token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get() { return undefined; },
          set() {},
          remove() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Token authentication failed:', authError);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated via token:', user.id);

    // Check if we have service role key for admin operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      console.error('❌ No service role key found - cannot delete auth user');
      return NextResponse.json(
        { error: 'Service role key required for complete account deletion' },
        { status: 500 }
      );
    }

    // Create admin client
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey,
      {
        cookies: {
          get() { return undefined; },
          set() {},
          remove() {},
        },
      }
    );

    console.log('🔑 Admin client created');

    // Step 1: Get user's profile data for subscription info
    console.log('🔍 Fetching user profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
    } else if (profile) {
      console.log('✅ Profile found');
    } else {
      console.log('⚠️ No profile found for user (may already be deleted)');
    }

    let subscriptionCancelled = false;

    // Step 2: Cancel Stripe subscription if exists
    if (profile && profile.stripe_subscription_id && stripe) {
      try {
        console.log('🚫 Cancelling Stripe subscription:', profile.stripe_subscription_id);
        
        await stripe.subscriptions.cancel(profile.stripe_subscription_id, {
          prorate: false
        });
        
        subscriptionCancelled = true;
        console.log('✅ Stripe subscription cancelled successfully');
      } catch (stripeError) {
        console.error('❌ Error cancelling Stripe subscription:', stripeError);
      }
    }

    // Step 3: Delete all user data with admin privileges
    console.log('🗑️ Starting admin data deletion...');
    
    let deletionResults = {
      profile: false,
      analytics: false,
      testimonials: false
    };

    // Delete profile with admin privileges
    if (profile) {
      try {
        console.log('🗑️ Admin deleting profile...');
        
        const { error: profileDeleteError, count: deletedCount } = await supabaseAdmin
          .from('profiles')
          .delete({ count: 'exact' })
          .eq('id', user.id);
        
        if (profileDeleteError) {
          console.error('❌ Admin profile deletion error:', profileDeleteError);
        } else {
          console.log('✅ Admin profile deletion completed, rows deleted:', deletedCount);
          deletionResults.profile = deletedCount > 0;
        }
      } catch (error) {
        console.error('❌ Admin profile deletion exception:', error);
      }
    } else {
      console.log('⚠️ No profile to delete (already deleted)');
      deletionResults.profile = true; // Consider it successful if already deleted
    }

    // Delete analytics if table exists
    try {
      console.log('🗑️ Admin deleting analytics...');
      const { error: analyticsDeleteError, count: deletedCount } = await supabaseAdmin
        .from('analytics')
        .delete({ count: 'exact' })
        .eq('profile_id', user.id);
      
      if (analyticsDeleteError && analyticsDeleteError.code !== '42P01') { // Ignore table not exists
        console.error('❌ Admin analytics deletion error:', analyticsDeleteError);
      } else {
        console.log('✅ Admin analytics deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.analytics = true;
      }
    } catch (error) {
      console.error('❌ Admin analytics deletion exception:', error);
      deletionResults.analytics = true; // Don't fail if table doesn't exist
    }

    // Delete testimonials if table exists
    try {
      console.log('🗑️ Admin deleting testimonials...');
      const { error: testimonialsDeleteError, count: deletedCount } = await supabaseAdmin
        .from('testimonials')
        .delete({ count: 'exact' })
        .eq('user_id', user.id);
      
      if (testimonialsDeleteError && testimonialsDeleteError.code !== '42P01') { // Ignore table not exists
        console.error('❌ Admin testimonials deletion error:', testimonialsDeleteError);
      } else {
        console.log('✅ Admin testimonials deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.testimonials = true;
      }
    } catch (error) {
      console.error('❌ Admin testimonials deletion exception:', error);
      deletionResults.testimonials = true; // Don't fail if table doesn't exist
    }
    
    console.log('✅ Admin data cleanup completed:', deletionResults);

    // Step 4: Delete user from Supabase Auth (THE CRITICAL STEP)
    let authDeleteSuccess = false;
    try {
      console.log('🗑️ Admin deleting user from Supabase Auth...');
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (authDeleteError) {
        console.error('❌ Admin auth deletion error:', authDeleteError);
        console.error('❌ Auth deletion error details:', JSON.stringify(authDeleteError, null, 2));
      } else {
        console.log('✅ User successfully deleted from Supabase Auth');
        authDeleteSuccess = true;
      }
    } catch (error) {
      console.error('❌ Admin auth deletion exception:', error);
    }

    // Step 5: Return comprehensive result
    console.log('🎉 Complete account deletion finished');
    
    const isCompleteSuccess = authDeleteSuccess && (deletionResults.profile || !profile);
    
    return NextResponse.json({
      success: isCompleteSuccess,
      message: isCompleteSuccess 
        ? 'Account completely deleted from both database and auth'
        : 'Partial deletion completed - some steps may have failed',
      details: {
        userId: user.id,
        subscriptionCancelled,
        deletionResults,
        authDeleteSuccess,
        profileExisted: !!profile,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Error during complete account deletion:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during complete account deletion',
        details: error.message
      },
      { status: 500 }
    );
  }
}
