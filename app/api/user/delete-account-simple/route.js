import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    console.log('🗑️ Simple account deletion request received');
    console.log('🕐 Timestamp:', new Date().toISOString());

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

    console.log('🔍 Deleting account data for user:', user.id);

    // Step 1: Get user's profile data to check for subscriptions
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // Use maybeSingle to avoid errors if no profile exists

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
        // Continue even if subscription cancellation fails
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
        console.log('🔍 Profile to delete:', { id: user.id, email: profile.email });
        
        // First try to count how many rows match our delete condition
        const { count: beforeCount, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('id', user.id);
        
        console.log('📊 Profiles found before deletion:', beforeCount);
        if (countError) {
          console.error('❌ Error counting profiles:', countError);
        }
        
        const { error: profileDeleteError, count: deletedCount } = await supabase
          .from('profiles')
          .delete({ count: 'exact' })
          .eq('id', user.id);
        
        if (profileDeleteError) {
          console.error('❌ Profile deletion error:', profileDeleteError);
          console.error('❌ Profile deletion error details:', JSON.stringify(profileDeleteError, null, 2));
        } else {
          console.log('✅ Profile deletion completed');
          console.log('📊 Rows deleted:', deletedCount);
          if (deletedCount > 0) {
            console.log('✅ Profile actually deleted from database');
            deletionResults.profile = true;
          } else {
            console.warn('⚠️ No rows were deleted - profile may not exist or permission denied');
            deletionResults.profile = false;
          }
        }
      } catch (error) {
        console.error('❌ Profile deletion exception:', error);
      }
    } else {
      console.log('⚠️ No profile to delete');
      deletionResults.profile = true; // No profile to delete = success
    }

    // Delete analytics
    try {
      console.log('🗑️ Deleting analytics...');
      const { error: analyticsDeleteError } = await supabase
        .from('analytics')
        .delete()
        .eq('profile_id', user.id);
      
      if (analyticsDeleteError && analyticsDeleteError.code !== 'PGRST116') {
        console.error('❌ Analytics deletion error:', analyticsDeleteError);
        console.error('❌ Analytics deletion error details:', JSON.stringify(analyticsDeleteError, null, 2));
      } else {
        console.log('✅ Analytics deleted successfully (or no data found)');
        deletionResults.analytics = true;
      }
    } catch (error) {
      console.error('❌ Analytics deletion exception:', error);
    }

    // Delete testimonials
    try {
      console.log('🗑️ Deleting testimonials...');
      const { error: testimonialsDeleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('user_id', user.id);
      
      if (testimonialsDeleteError && testimonialsDeleteError.code !== 'PGRST116') {
        console.error('❌ Testimonials deletion error:', testimonialsDeleteError);
        console.error('❌ Testimonials deletion error details:', JSON.stringify(testimonialsDeleteError, null, 2));
      } else {
        console.log('✅ Testimonials deleted successfully (or no data found)');
        deletionResults.testimonials = true;
      }
    } catch (error) {
      console.error('❌ Testimonials deletion exception:', error);
    }
    
    console.log('✅ User data cleanup completed:', deletionResults);

    // Step 4: Return success - client will handle signout
    console.log('🎉 Sending success response...');
    
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
    console.error('💥 Error during account deletion:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during account deletion',
        details: error.message
      },
      { status: 500 }
    );
  }
}
