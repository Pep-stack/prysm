// Remove 'use client' directive to make it a Server Component

import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'; // Use server client
import { cookies } from 'next/headers';
import PrysmaCard from '../../../src/components/card/PrysmaCard'; // Adjust path if needed
import DesignSettingsClientProvider from '../../../components/dashboard/DesignSettingsClientProvider';
import PublicProfilePageContent from './PublicProfilePageContent';

// Function to fetch profile data on the server
async function getProfileData(userId) {
  const cookieStore = cookies();
  // Note: For public pages, we might not need authenticated client, 
  // but using it ensures RLS policies are respected if they rely on auth state.
  // If the profiles table is readable by 'anon', a direct non-auth client could also work.
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_id:id') // Select all, explicitly alias user id if needed later
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: Row not found, not necessarily an error here
    console.error('Error fetching public profile:', error);
    throw new Error('Could not load profile.'); // Throw error to be caught by page
  }
  
  // If data is null (row not found), return null
  return data; 
}

// This page will receive params, including the id from the URL
export default async function PublicProfilePage({ params }) {
  const userId = params.id;
  let profile = null;
  let error = null;

  try {
    profile = await getProfileData(userId);
  } catch (err) {
    error = err.message || 'Failed to load profile.';
    console.error(err);
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-10 text-center text-gray-600">Profile not found.</div>;
  }

  // Ensure card_sections is an array
  const cardSections = Array.isArray(profile.card_sections) ? profile.card_sections : [];

  return (
    <DesignSettingsClientProvider initial={profile}>
      <PublicProfilePageContent profile={profile} cardSections={cardSections} />
    </DesignSettingsClientProvider>
  );
} 