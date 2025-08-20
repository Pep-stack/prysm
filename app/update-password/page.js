'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import { validatePassword, validatePasswordConfirm, getValidationBorderColor, getValidationFocusColor } from '../../src/lib/validation';
import PasswordStrengthIndicator from '../../src/components/auth/PasswordStrengthIndicator';
import { getAuthErrorMessage } from '../../src/lib/authErrors';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const router = useRouter();

  // Validation states
  const [validations, setValidations] = useState({
    password: { isValid: true, message: '', strength: 0 },
    confirmPassword: { isValid: true, message: '' }
  });

  // Real-time validation handlers
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const validation = validatePassword(value);
    setValidations(prev => ({ ...prev, password: validation }));
    
    // Also revalidate confirm password if it exists
    if (confirmPassword) {
      const confirmValidation = validatePasswordConfirm(value, confirmPassword);
      setValidations(prev => ({ ...prev, confirmPassword: confirmValidation }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const validation = validatePasswordConfirm(password, value);
    setValidations(prev => ({ ...prev, confirmPassword: validation }));
  };

  // Check if we have a session with a user that's in recovery mode
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session or the user didn't come here from a recovery flow, redirect them
      if (!session) {
        setError('No active session. Please request a new password reset link.');
        return;
      }
      
      setSessionValid(true);
    };

    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordConfirm(password, confirmPassword);
    
    setValidations({
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation
    });
    
    // Check if all validations pass
    if (!passwordValidation.isValid || !confirmPasswordValidation.isValid) {
      setError("Please fix the errors above before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(getAuthErrorMessage(error));
      } else {
        setMessage('Password updated successfully! Redirecting to login...');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login?success=' + encodeURIComponent('Password updated successfully! You can now log in with your new password.'));
        }, 2000);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionValid && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg">
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
          <h2 className="text-center text-3xl font-bold text-black">
            Update Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
          <div className="space-y-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 sm:text-sm transition-colors ${getValidationBorderColor(validations.password.isValid, password)} ${getValidationFocusColor(validations.password.isValid, password)}`}
                placeholder="New password"
                value={password}
                onChange={handlePasswordChange}
              />
              {password && !validations.password.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.password.message}</p>
              )}
              <PasswordStrengthIndicator password={password} validation={validations.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 sm:text-sm transition-colors ${getValidationBorderColor(validations.confirmPassword.isValid, confirmPassword)} ${getValidationFocusColor(validations.confirmPassword.isValid, confirmPassword)}`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPassword && !validations.confirmPassword.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.confirmPassword.message}</p>
              )}
              {confirmPassword && validations.confirmPassword.isValid && password && (
                <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800 text-center">
                {message}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !sessionValid}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Need a new reset link?{' '}
          <Link href="/reset-password" className="font-medium text-[#00C896] hover:text-[#00a078]">
            Request new link
          </Link>
        </p>
      </div>
    </div>
  );
} 