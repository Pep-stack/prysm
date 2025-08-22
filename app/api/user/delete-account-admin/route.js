import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    console.log('🗑️ Admin account deletion request received');
    console.log('🕐 Timestamp:', new Date().toISOString());

    // Initialize Stripe if configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { 
      apiVersion: '2025-07-30.basil'
    }) : null;

    // Get authenticated user first with regular client
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
    
    console.log('🔍 Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      error: authError 
    });
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
      console.error('❌ User object:', user);
      console.error('❌ Cookies available:', cookieStore.getAll().map(c => c.name));
      return NextResponse.json(
        { error: 'Authentication required', details: authError?.message },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Create admin client for database operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      console.error('❌ No service role key found');
      return NextResponse.json(
        { error: 'Server configuration error - admin operations not available' },
        { status: 500 }
      );
    }

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

    // Step 1: Get user's profile data
    console.log('🔍 Fetching user profile with admin client...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Error fetching profile with admin client:', profileError);
    } else if (profile) {
      console.log('✅ Profile found with admin client');
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

    // Step 3: Delete all user data with admin client
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
          console.log('✅ Admin profile deletion completed');
          console.log('📊 Rows deleted:', deletedCount);
          deletionResults.profile = deletedCount > 0;
        }
      } catch (error) {
        console.error('❌ Admin profile deletion exception:', error);
      }
    }

    // Delete analytics with admin privileges
    try {
      console.log('🗑️ Admin deleting analytics...');
      const { error: analyticsDeleteError, count: deletedCount } = await supabaseAdmin
        .from('analytics')
        .delete({ count: 'exact' })
        .eq('profile_id', user.id);
      
      if (analyticsDeleteError && analyticsDeleteError.code !== 'PGRST116') {
        console.error('❌ Admin analytics deletion error:', analyticsDeleteError);
      } else {
        console.log('✅ Admin analytics deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.analytics = true;
      }
    } catch (error) {
      console.error('❌ Admin analytics deletion exception:', error);
    }

    // Delete testimonials with admin privileges
    try {
      console.log('🗑️ Admin deleting testimonials...');
      const { error: testimonialsDeleteError, count: deletedCount } = await supabaseAdmin
        .from('testimonials')
        .delete({ count: 'exact' })
        .eq('profile_id', user.id);
      
      if (testimonialsDeleteError && testimonialsDeleteError.code !== 'PGRST116') {
        console.error('❌ Admin testimonials deletion error:', testimonialsDeleteError);
      } else {
        console.log('✅ Admin testimonials deletion completed, rows deleted:', deletedCount || 0);
        deletionResults.testimonials = true;
      }
    } catch (error) {
      console.error('❌ Admin testimonials deletion exception:', error);
    }
    
    console.log('✅ Admin data cleanup completed:', deletionResults);

    // Step 4: Delete user from auth with admin client
    let authDeleteSuccess = false;
    try {
      console.log('🗑️ Admin deleting user from auth...');
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (authDeleteError) {
        console.error('❌ Admin auth deletion error:', authDeleteError);
      } else {
        console.log('✅ User deleted from auth successfully');
        authDeleteSuccess = true;
      }
    } catch (error) {
      console.error('❌ Admin auth deletion exception:', error);
    }

    // Step 5: Return success response
    console.log('🎉 Admin account deletion completed');
    
    return NextResponse.json({
      success: true,
      message: authDeleteSuccess 
        ? 'Account completely deleted successfully' 
        : 'Account data deleted successfully. Auth deletion may require manual cleanup.',
      details: {
        userId: user.id,
        subscriptionCancelled,
        deletionResults,
        authDeleteSuccess,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Error during admin account deletion:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during account deletion',
        details: error.message
      },
      { status: 500 }
    );
  }
}
