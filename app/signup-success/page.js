'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../src/lib/supabase';

export default function SignupSuccessPage() {
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    setResending(true);
    setResendMessage('');
    
    try {
      // Note: This would need the user's email, which we don't have here
      // In a real implementation, you might pass it via URL params or store it temporarily
      setResendMessage('Please go back to the signup page to request a new verification email.');
    } catch (error) {
      setResendMessage('Unable to resend email. Please try signing up again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center">
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

        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-bold text-black">
            Signup Successful!
          </h2>
          <p className="mt-4 text-center text-gray-600">
            We&apos;ve sent a verification link to your email address. Please check your inbox (and spam folder!) and click the link to activate your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong>
              <br />
              1. Check your email for the verification link
              <br />
              2. Click the link to verify your account
              <br />
              3. Return here to log in
            </p>
          </div>

          {resendMessage && (
            <div className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                {resendMessage}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {resending ? 'Processing...' : 'Didn\'t receive email?'}
          </button>
          
          <Link href="/login">
            <button className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] transition duration-150 ease-in-out">
              Continue to Login
            </button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500">
          Having trouble? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
} 