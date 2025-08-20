'use client';

import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { validateEmail, validatePassword, validatePasswordConfirm, validateName, getValidationBorderColor, getValidationFocusColor } from '../../src/lib/validation';
import PasswordStrengthIndicator from '../../src/components/auth/PasswordStrengthIndicator';
import { getAuthErrorMessage } from '../../src/lib/authErrors';
import SocialLoginButtons from '../../src/components/auth/SocialLoginButtons';
import SubscriptionSelector from '../../src/components/auth/SubscriptionSelector';
import { LuCheck } from 'react-icons/lu';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

async function getUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_slug', slug)
      .single();
    if (!data || error) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('pro'); // Default to pro plan
  const [currentStep, setCurrentStep] = useState(1); // 1 = form, 2 = plan selection
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation states
  const [validations, setValidations] = useState({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '', strength: 0 },
    confirmPassword: { isValid: true, message: '' },
    firstName: { isValid: true, message: '' },
    lastName: { isValid: true, message: '' }
  });

  // Real-time validation handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const validation = validateEmail(value);
    setValidations(prev => ({ ...prev, email: validation }));
  };

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

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    const validation = validateName(value, 'First name');
    setValidations(prev => ({ ...prev, firstName: validation }));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    const validation = validateName(value, 'Last name');
    setValidations(prev => ({ ...prev, lastName: validation }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before proceeding to plan selection
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordConfirm(password, confirmPassword);
    const firstNameValidation = validateName(firstName, 'First name');
    const lastNameValidation = validateName(lastName, 'Last name');
    
    setValidations({
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
      firstName: firstNameValidation,
      lastName: lastNameValidation
    });
    
    // Check if all validations pass
    if (!emailValidation.isValid || !passwordValidation.isValid || !confirmPasswordValidation.isValid || 
        !firstNameValidation.isValid || !lastNameValidation.isValid) {
      setError("Please fix the errors above before submitting.");
      return;
    }
    
    // Clear error and proceed to plan selection
    setError(null);
    setCurrentStep(2);
  };

  const handleSignupComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create account with email confirmation and user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            selected_plan: selectedPlan,
            full_name: `${firstName} ${lastName}`
          }
        }
      });
      if (error) {
        setError(getAuthErrorMessage(error));
        console.error("Signup error details:", error);
        setLoading(false);
        return;
      }

      // Check if user was actually created
      if (!data.user) {
        setError("This email address is already registered. Please try logging in instead.");
        setLoading(false);
        return;
      }

      // Check if this is likely a duplicate signup attempt
      // Supabase creates a new user record even for existing emails, but with empty identities
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("This email address is already registered. Please try logging in instead.");
        setLoading(false);
        return;
      }

      // 2. Redirect to email verification page
      if (data.user && !data.session) {
        // Email confirmation required - redirect to verification page
        router.push('/verify-email');
      } else if (data.user && data.session) {
        // Auto-confirmed (shouldn't happen with email confirmation enabled)
        // But handle gracefully by redirecting to dashboard
        router.push('/dashboard');
      } else {
        setError("Account creation failed. Please try again.");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
      console.error("Signup catch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBackToForm = () => {
    setCurrentStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-full">
        <div className={`w-full bg-white rounded-2xl shadow-xl transition-all duration-500 ${
          currentStep === 1 
            ? 'max-w-md p-8 sm:p-10' 
            : 'max-w-5xl p-8 sm:p-10'
        }`}>
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

        {/* Modern Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                currentStep >= 1 
                  ? 'bg-[#00C896] text-white shadow-lg scale-110' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <LuCheck className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                currentStep >= 1 ? 'text-[#00C896]' : 'text-gray-500'
              }`}>
                Account Details
              </span>
            </div>

            {/* Connection Line */}
            <div className={`w-12 sm:w-20 h-1 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'bg-[#00C896]' : 'bg-gray-200'
            }`}></div>

            {/* Step 2 */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                currentStep >= 2 
                  ? 'bg-[#00C896] text-white shadow-lg scale-110' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                currentStep >= 2 ? 'text-[#00C896]' : 'text-gray-500'
              }`}>
                Choose Plan
              </span>
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          // Step 1: Account Information
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                Create your account
              </h2>
              <p className="text-gray-600 text-lg">
                Join Prysma to create your professional profile
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
              <SocialLoginButtons 
                onError={setError} 
                onLoading={setLoading}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="space-y-5">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${getValidationBorderColor(validations.firstName.isValid, firstName)} ${getValidationFocusColor(validations.firstName.isValid, firstName)}`}
                    placeholder="First name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                  {firstName && !validations.firstName.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${getValidationBorderColor(validations.lastName.isValid, lastName)} ${getValidationFocusColor(validations.lastName.isValid, lastName)}`}
                    placeholder="Last name"
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                  {lastName && !validations.lastName.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${getValidationBorderColor(validations.email.isValid, email)} ${getValidationFocusColor(validations.email.isValid, email)}`}
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {email && !validations.email.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${getValidationBorderColor(validations.password.isValid, password)} ${getValidationFocusColor(validations.password.isValid, password)}`}
                    placeholder="Password"
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
                    className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${getValidationBorderColor(validations.confirmPassword.isValid, confirmPassword)} ${getValidationFocusColor(validations.confirmPassword.isValid, confirmPassword)}`}
                    placeholder="Confirm password"
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

              <div>
                {/* Continue Button - Exact same as login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Validating...
                    </div>
                  ) : (
                    'Continue to Plan Selection →'
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[#00C896] hover:text-[#00a078] transition-colors">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          // Step 2: Plan Selection
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 text-lg">
                Welcome <span className="font-semibold text-[#00C896]">{firstName}</span>! 
                Select the plan that fits your needs.
              </p>
            </div>

            <SubscriptionSelector 
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
              className="mb-8"
            />

            {/* Action Buttons - Refined Design */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              {/* Back Button - White with Green Border */}
              <button
                type="button"
                onClick={goBackToForm}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-[#00C896] text-[#00C896] rounded-lg hover:bg-[#00C896] hover:text-[#00C896] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
              >
                ← Back
              </button>
              {/* Create Account Button - Compact Prysma Green */}
              <button
                type="button"
                onClick={handleSignupComplete}
                disabled={loading || !selectedPlan}
                className="flex-1 px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00C896] hover:bg-[#00a078] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C896] disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Account →'
                )}
              </button>
            </div>
          </>
        )}



        {/* Error Display */}
        {error && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800 font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 