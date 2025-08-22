import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Do not initialize Stripe or read secrets at module scope to avoid build-time crashes

export async function POST(request) {
  // Guard and initialize Stripe inside handler
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !endpointSecret) {
    return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
  }
  const stripe = new Stripe(stripeSecretKey, { 
    apiVersion: '2025-07-30.basil'
  });
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Create Supabase client for server-side operations
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get() { return undefined; }, // No cookies in webhook context
        set() {},
        remove() {},
      },
    }
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        
        if (userId && plan) {
          await supabase
            .from('profiles')
            .update({
              subscription_plan: plan,
              subscription_status: session.mode === 'subscription' ? 'trialing' : 'active',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              subscription_start_date: new Date().toISOString(),
              trial_end_date: session.mode === 'subscription' ? 
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          
          console.log(`Updated subscription for user ${userId} to ${plan}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Payment succeeded:', invoice.id);
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata?.user_id;
          
          if (userId) {
            await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);
            
            console.log(`Activated subscription for user ${userId}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed:', invoice.id);
        
        if (invoice.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const userId = subscription.metadata?.user_id;
            
            if (userId) {
              const { error } = await supabase
                .from('profiles')
                .update({
                  subscription_status: 'past_due',
                  updated_at: new Date().toISOString(),
                })
                .eq('stripe_subscription_id', subscription.id);
              
              if (error) {
                console.error('Error updating subscription status for payment failure:', error);
              } else {
                console.log(`Marked subscription as past due for user ${userId}`);
              }
            }
          } catch (error) {
            console.error('Error processing payment failure webhook:', error);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_status: subscription.status,
                subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);
            
            if (error) {
              console.error('Error updating subscription:', error);
            } else {
              console.log(`Updated subscription status to ${subscription.status} for user ${userId}`);
            }
          } catch (error) {
            console.error('Error processing subscription update webhook:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_plan: 'free',
                subscription_status: 'cancelled',
                subscription_end_date: new Date().toISOString(),
                stripe_subscription_id: null,
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);
            
            if (error) {
              console.error('Error cancelling subscription:', error);
            } else {
              console.log(`Cancelled subscription for user ${userId}, reverted to free plan`);
            }
          } catch (error) {
            console.error('Error processing subscription deletion webhook:', error);
          }
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        console.log('Trial will end:', subscription.id);
        
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          try {
            // Get current subscription metadata
            const { data: profile } = await supabase
              .from('profiles')
              .select('subscription_metadata')
              .eq('stripe_subscription_id', subscription.id)
              .single();

            const currentMetadata = profile?.subscription_metadata || {};
            
            // Update trial end notification flag
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_metadata: {
                  ...currentMetadata,
                  trial_ending_notification_sent: true,
                  trial_will_end_at: new Date(subscription.trial_end * 1000).toISOString()
                },
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);
            
            if (error) {
              console.error('Error updating trial end notification:', error);
            } else {
              console.log(`Trial ending notification set for user ${userId}`);
            }
          } catch (error) {
            console.error('Error processing trial will end webhook:', error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
