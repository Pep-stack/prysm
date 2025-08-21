'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00C896] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your payment...</h2>
          <p className="text-gray-600">Please wait while we set up your account.</p>
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

        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Prysma Pro! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You now have access to all Pro features!
          </p>
        </div>

        {/* Features Unlocked */}
        <div className="bg-gradient-to-r from-[#00C896] to-[#00A078] bg-opacity-5 border border-[#00C896] border-opacity-20 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            🚀 Features Unlocked
          </h3>
          <div className="space-y-3">
            {[
              'Multiple professional cards',
              'Custom branding & domain',
              'Advanced analytics dashboard',
              'Priority customer support',
              'Extra links & integrations'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-[#00C896] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
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
                Your trial period has started. You won&apos;t be charged until your trial ends. 
                Cancel anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Session Info (for debugging) */}
        {sessionId && (
          <div className="text-center text-xs text-gray-400 mb-6">
            Session ID: {sessionId.substring(0, 20)}...
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-4">
          <button
            onClick={handleContinueToDashboard}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Continue to Dashboard
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>
            Questions about your subscription?{' '}
            <a href="mailto:support@prysma.com" className="text-[#00C896] hover:text-[#00a078] font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
