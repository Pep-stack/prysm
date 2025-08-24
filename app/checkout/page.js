'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../../src/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Lazy, safe Stripe initializer to avoid pk.match errors when env is missing
let stripePromise;
const getStripe = () => {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!pk) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
  }
  if (!stripePromise) {
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
};

// Loading component for Suspense fallback
function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00C896] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading checkout...</h2>
      </div>
    </div>
  );
}

// Main checkout component that uses useSearchParams
function CheckoutContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // If no plan specified, redirect to dashboard
      if (!plan || (plan !== 'pro' && plan !== 'business')) {
        router.push('/dashboard');
        return;
      }

      // Don't auto-initiate checkout, let user click button
      // handleCheckout(plan);
    };

    checkUser();
  }, [plan, router]);

  const handleCheckout = async (selectedPlan) => {
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Try direct URL redirect first (bypasses SDK issues)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback to SDK redirect
      const stripe = await getStripe();
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      // More specific error messages
      if (err.message.includes('STRIPE_PUBLISHABLE_KEY')) {
        setError('Stripe configuration missing. Please contact support.');
      } else if (err.message.includes('Authentication required')) {
        setError('Please log in to continue.');
        router.push('/login');
      } else if (err.message.includes('Invalid plan')) {
        setError('Selected plan is not available. Please try again.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const planDetails = {
    pro: {
      name: 'Pro',
      price: '€7',
      period: 'per month',
      features: [
        'Everything in Free',
        'Multiple cards',
        'Custom branding & domain',
        'Advanced analytics',
        'Priority support',
        'Extra links & integrations'
      ]
    },
    business: {
      name: 'Business',
      price: '€25',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team accounts',
        'Advanced integrations',
        'Custom analytics',
        'Priority support',
        'Dedicated account manager'
      ]
    }
  };

  const currentPlan = planDetails[plan];

  if (!user || !currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00C896] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Prysma Home"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Subscription
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;re about to subscribe to the <span className="font-semibold text-[#00C896]">{currentPlan.name} Plan</span>
          </p>
        </div>

        {/* Plan Details - Using exact Pro card UI */}
        <div className="relative border-2 border-[#00C896] bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 shadow-2xl scale-105">
          {/* Popular Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white border-2 border-[#00C896] text-[#00C896] text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>
          </div>

          {/* Selection Indicator */}
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-[#00C896] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Plan Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 mb-3">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{currentPlan.name}</h3>
            
            <div className="mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{currentPlan.price}</span>
              <span className="text-gray-500 text-sm ml-1">/{currentPlan.period}</span>
            </div>
            
            <p className="text-gray-600 text-xs sm:text-sm">Most popular choice</p>
          </div>

          {/* Features List */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>

          {/* Selection State */}
          <div className="text-center py-3 px-4 rounded-xl font-medium text-sm bg-[#00C896] text-white shadow-md">
            ✓ Selected
          </div>
        </div>

        {/* Trial Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">14-Day Free Trial</p>
              <p className="text-blue-700">
                Start your free trial today. You won&apos;t be charged until your trial period ends. 
                Cancel anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C896] mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Redirecting to secure payment...</p>
          </div>
        )}

        {/* Action Buttons */}
        {!loading && (
          <div className="space-y-4">
            <button
              onClick={() => handleCheckout(plan)}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Start Free Trial
            </button>


            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium text-sm"
            >
              Continue with Free Plan
            </button>
          </div>
        )}

        {/* Security Note */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>🔒 Secure payment powered by Stripe</p>
          <p className="mt-1">Your payment information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
