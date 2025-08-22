import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    console.log('🗑️ Account deletion request received');

    // Initialize Stripe if configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { 
      apiVersion: '2025-07-30.basil'
    }) : null;

    // Get authenticated user
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('🔍 Deleting account for user:', user.id);

    // Step 1: Get user's profile data to check for subscriptions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    let subscriptionCancelled = false;

    // Step 2: Cancel Stripe subscription if exists
    if (profile && profile.stripe_subscription_id && stripe) {
      try {
        console.log('🚫 Cancelling Stripe subscription:', profile.stripe_subscription_id);
        
        await stripe.subscriptions.cancel(profile.stripe_subscription_id, {
          prorate: false // Don't prorate, just cancel immediately
        });
        
        subscriptionCancelled = true;
        console.log('✅ Stripe subscription cancelled successfully');
      } catch (stripeError) {
        console.error('❌ Error cancelling Stripe subscription:', stripeError);
        // Continue with account deletion even if subscription cancellation fails
        // The webhook will handle cleanup later
      }
    }

    // Step 3: Delete user data from database
    const deletionResults = [];

    // Delete profile data (this includes subscription info)
    if (profile) {
      try {
        const { error: profileDeleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (profileDeleteError) {
          console.error('Error deleting profile:', profileDeleteError);
          deletionResults.push({ table: 'profiles', success: false, error: profileDeleteError });
        } else {
          deletionResults.push({ table: 'profiles', success: true });
          console.log('✅ Profile data deleted');
        }
      } catch (error) {
        console.error('Exception deleting profile:', error);
        deletionResults.push({ table: 'profiles', success: false, error });
      }
    }

    // Delete analytics data if exists
    try {
      const { error: analyticsDeleteError } = await supabase
        .from('analytics')
        .delete()
        .eq('profile_id', user.id);

      if (analyticsDeleteError && analyticsDeleteError.code !== 'PGRST116') {
        console.error('Error deleting analytics:', analyticsDeleteError);
        deletionResults.push({ table: 'analytics', success: false, error: analyticsDeleteError });
      } else {
        deletionResults.push({ table: 'analytics', success: true });
        console.log('✅ Analytics data deleted');
      }
    } catch (error) {
      console.error('Exception deleting analytics:', error);
      deletionResults.push({ table: 'analytics', success: false, error });
    }

    // Delete testimonials if exists
    try {
      const { error: testimonialsDeleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('profile_id', user.id);

      if (testimonialsDeleteError && testimonialsDeleteError.code !== 'PGRST116') {
        console.error('Error deleting testimonials:', testimonialsDeleteError);
        deletionResults.push({ table: 'testimonials', success: false, error: testimonialsDeleteError });
      } else {
        deletionResults.push({ table: 'testimonials', success: true });
        console.log('✅ Testimonials data deleted');
      }
    } catch (error) {
      console.error('Exception deleting testimonials:', error);
      deletionResults.push({ table: 'testimonials', success: false, error });
    }

    // Step 4: Delete user from Supabase Auth (this will cascade delete related data)
    try {
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authDeleteError) {
        console.error('❌ Error deleting user from auth:', authDeleteError);
        return NextResponse.json(
          { 
            error: 'Failed to delete user account', 
            details: authDeleteError.message,
            partialSuccess: {
              subscriptionCancelled,
              deletionResults
            }
          },
          { status: 500 }
        );
      }

      console.log('✅ User deleted from Supabase Auth');
    } catch (error) {
      console.error('Exception deleting user from auth:', error);
      return NextResponse.json(
        { 
          error: 'Failed to delete user account', 
          details: error.message,
          partialSuccess: {
            subscriptionCancelled,
            deletionResults
          }
        },
        { status: 500 }
      );
    }

    // Step 5: Return success response
    console.log('🎉 Account deletion completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      details: {
        userId: user.id,
        subscriptionCancelled,
        deletionResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Unexpected error during account deletion:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred during account deletion',
        details: error.message
      },
      { status: 500 }
    );
  }
}
