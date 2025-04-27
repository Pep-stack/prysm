'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path

export function useUserProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: Error state for fetching

  // Fetch profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
         setLoading(false); 
         setProfile(null); // Ensure profile is null if no user
         return;
      }
      
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*') 
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
           // Handle profile not existing or other errors
           console.error('Error fetching profile in hook:', fetchError);
           if (fetchError.code !== 'PGRST116') { // Don't set error if profile just doesn't exist
              setError('Could not fetch profile data.');
           }
           setProfile(null); // Set profile to null on error or if not found
        } else {
          setProfile(data); // Set profile data if found
        }
      } catch (err) {
        console.error('Unexpected error fetching profile in hook:', err);
        setError('An unexpected error occurred.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // Re-fetch if user changes

  // Callback for successful edit modal save
  const handleProfileUpdate = useCallback((updatedProfileData) => {
    setProfile(updatedProfileData); // Directly set the updated data
  }, []);

  // Callback for successful avatar upload
  const handleAvatarUpdate = useCallback((newAvatarUrl) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
  }, []);

  return {
    profile,      // The fetched profile data (or null)
    loading,      // Loading state specific to fetching the profile
    error,        // Error state specific to fetching the profile
    handleProfileUpdate, // Function to update profile after edit modal save
    handleAvatarUpdate,  // Function to update avatar URL after avatar modal save
  };
} 