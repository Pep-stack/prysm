'use client';

import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        if (error.message.includes("User already registered")) {
          setError("This email is already registered. Try logging in.");
        } else if (error.message.includes("Password should be at least 6 characters")) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(error.message);
        }
        console.error("Signup error details:", error);
        setLoading(false);
        return;
      }
      // 2. Genereer slug en update profiel
      if (data.user) {
        const baseSlug = slugify(`${firstName}-${lastName}`);
        const uniqueSlug = await getUniqueSlug(baseSlug);
        await supabase
          .from('profiles')
          .update({
            name: `${firstName} ${lastName}`,
            custom_slug: uniqueSlug,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);
      }
      if (data.user && data.session === null) {
        router.push('/signup-success');
      } else {
        setError("Signup attempt finished with unclear result.");
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Signup catch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <div className="flex justify-center mb-4">
          <Image src="/images/logo.png" alt="Prysma Logo" width={110} height={36} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Create your account</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#00C896] text-white rounded-md hover:bg-[#00A078] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00C896] hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
} 