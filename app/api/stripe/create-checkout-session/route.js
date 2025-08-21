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

// Log price IDs for debugging
console.log('💰 Available Price IDs:', PRICE_IDS);

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
    console.log('Received plan:', plan);

    // Validate plan
    if (!plan || !PRICE_IDS[plan]) {
      console.error('Invalid plan:', plan, 'Available plans:', Object.keys(PRICE_IDS));
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
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error: ' + authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.error('No user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.email);

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

    // Create checkout session with explicit configuration
    console.log('🔧 Creating checkout session with config:', {
      customer: customerId,
      plan: plan,
      priceId: PRICE_IDS[plan],
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`
    });

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
      // Temporarily remove trial to test basic checkout
      // subscription_data: {
      //   trial_period_days: 14, // 14-day free trial
      //   metadata: {
      //     user_id: user.id,
      //     plan: plan,
      //   },
      // },
    };

    // Try without ui_mode first (might not be supported in this API version)
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('✅ Created checkout session:', {
      id: session.id,
      url: session.url,
      mode: session.mode,
      ui_mode: session.ui_mode
    });

    // Return both session ID and URL for flexibility
    return NextResponse.json({ 
      sessionId: session.id,
      checkoutUrl: session.url 
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('❌ Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      stack: error.stack
    });
    
    // Return more specific error info
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message,
        type: error.type,
        code: error.code
      },
      { status: 500 }
    );
  }
}