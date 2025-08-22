import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';

export async function DELETE(request) {
  try {
    console.log('🗑️ Token-based account deletion request received');
    console.log('🕐 Timestamp:', new Date().toISOString());

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header found');
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🎫 Token extracted, length:', token.length);

    // Initialize Stripe if configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { 
      apiVersion: '2025-07-30.basil'
    }) : null;

    // Create Supabase client with the token
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

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log('🔍 Auth verification result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      error: authError 
    });
    
    if (authError || !user) {
      console.error('❌ Token authentication failed:', authError);
      return NextResponse.json(
        { error: 'Invalid or expired token', details: authError?.message },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated via token:', user.id);

    // Step 1: Get user's profile data
    console.log('🔍 Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
    } else if (profile) {
      console.log('✅ Profile found');
    } else {
      console.log('⚠️ No profile found for user');
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

    // Step 3: Delete all user data
    console.log('🗑️ Starting data deletion...');
    
    let deletionResults = {
      profile: false,
      analytics: false,
      testimonials: false
    };

    // Delete profile
    if (profile) {
      try {
        console.log('🗑️ Deleting profile...');
        
        const { error: profileDeleteError, count: deletedCount } = await supabase
          .from('profiles')
          .delete({ count: 'exact' })
          .eq('id', user.id);
        
        if (profileDeleteError) {
          console.error('❌ Profile deletion error:', profileDeleteError);
        } else {
          console.log('✅ Profile deletion completed, rows deleted:', deletedCount);
          deletionResults.profile = deletedCount > 0;
        }
      } catch (error) {
        console.error('❌ Profile deletion exception:', error);
      }
    }

    // Delete analytics
    try {
      console.log('🗑️ Deleting analytics...');
      const { error: analyticsDeleteError, count: deletedCount } = await supabase
        .from('analytics')
        .delete({ count: 'exact' })
        .eq('profile_id', user.id);
      
      if (analyticsDeleteError && analyticsDeleteError.code !== 'PGRST116') {
        console.error('❌ Analytics deletion error:', analyticsDeleteError);
      } else {
        console.log('✅ Analytics deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.analytics = true;
      }
    } catch (error) {
      console.error('❌ Analytics deletion exception:', error);
    }

    // Delete testimonials
    try {
      console.log('🗑️ Deleting testimonials...');
      const { error: testimonialsDeleteError, count: deletedCount } = await supabase
        .from('testimonials')
        .delete({ count: 'exact' })
        .eq('user_id', user.id);
      
      if (testimonialsDeleteError && testimonialsDeleteError.code !== 'PGRST116') {
        console.error('❌ Testimonials deletion error:', testimonialsDeleteError);
      } else {
        console.log('✅ Testimonials deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.testimonials = true;
      }
    } catch (error) {
      console.error('❌ Testimonials deletion exception:', error);
    }
    
    console.log('✅ Data cleanup completed:', deletionResults);

    // Check if any critical deletion failed
    const criticalFailure = !deletionResults.profile;
    if (criticalFailure) {
      console.error('❌ Critical deletion failure - profile not deleted');
      return NextResponse.json({
        success: false,
        error: 'Account deletion failed - profile could not be deleted',
        details: {
          userId: user.id,
          subscriptionCancelled,
          deletionResults,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 });
    }

    // Step 4: Return success response
    console.log('🎉 Token-based account deletion completed');
    
    return NextResponse.json({
      success: true,
      message: 'Account data deleted successfully. You will now be signed out.',
      details: {
        userId: user.id,
        subscriptionCancelled,
        deletionResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Error during token-based account deletion:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during account deletion',
        details: error.message
      },
      { status: 500 }
    );
  }
}
