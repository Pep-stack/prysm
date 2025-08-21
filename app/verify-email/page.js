'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Get user email from localStorage or URL params if available
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setEmail(user.email);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email address not found. Please try signing up again.');
      return;
    }

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError('Failed to resend email. Please try again.');
        console.error('Resend error:', error);
      } else {
        setMessage('Verification email sent! Check your inbox.');
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Resend catch error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    router.push('/signup');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

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
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-xl bg-[#00C896] bg-opacity-10 border border-[#00C896] border-opacity-20 mb-4">
            <svg className="h-6 w-6 text-[#00C896]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a verification link to{' '}
            <span className="font-semibold text-[#00C896]">
              {email || 'your email address'}
            </span>
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>You&apos;ll be redirected to your dashboard</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-800 font-medium">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={resendLoading || resendCooldown > 0}
            className="w-full flex justify-center items-center py-3 px-4 border border-[#00C896] text-[#00C896] bg-white rounded-lg hover:bg-[#00C896] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
          >
            {resendLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resend verification email
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Other Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBackToSignup}
              className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium text-sm"
            >
              Back to signup
            </button>
            <button
              onClick={handleGoToLogin}
              className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium text-sm"
            >
              Sign in instead
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Didn&apos;t receive the email? Check your spam folder or try resending.</p>
          <p className="mt-1">
            Need help?{' '}
            <a href="mailto:support@prysma.com" className="text-[#00C896] hover:text-[#00a078] font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
