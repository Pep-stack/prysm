import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Note: Do NOT initialize Stripe at the module level.
// Some dev servers evaluate this file before envs are loaded.
// We'll construct the client inside the handler after validating envs.

// Stripe Price IDs - Live Production IDs
const PRICE_IDS = {
  pro: 'price_1RyDGGAZALFNloTTFRvUIwK4', // Pro Plan - €7/month
  business: 'price_TEMP_BUSINESS', // Business Plan - Will be added later
};

export async function POST(request) {
  try {
    // Check if Stripe keys are configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      );
    }

    // Safe to initialize Stripe now - use latest API version
    const stripe = new Stripe(stripeSecretKey, { 
      apiVersion: '2025-07-30.basil'
    });

    const { plan } = await request.json();

    // Validate plan
    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: `Invalid plan selected: ${plan}` },
        { status: 400 }
      );
    }

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
    
    if (authError) {
      return NextResponse.json(
        { error: 'Authentication error: ' + authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile for customer info
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.name || user.user_metadata?.full_name,
        metadata: {
          user_id: user.id,
        },
      });
      
      customerId = customer.id;
      
      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session
    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        user_id: user.id,
        plan: plan,
      },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Return both session ID and URL for flexibility
    return NextResponse.json({ 
      sessionId: session.id,
      checkoutUrl: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}