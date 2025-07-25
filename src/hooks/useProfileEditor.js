'use client'; // Hooks can be used in client components

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path

// Initial profile structure
const initialProfileState = {
  name: '',
  headline: '',
  bio: '',
  skills: '',
  location: '',
  website: '',
  avatar_url: '',
  header_url: '',
  display_type: 'avatar',
  avatar_size: 'medium',
  avatar_shape: 'circle',
  avatar_position: 'left',
  card_type: 'pro',
};

export function useProfileEditor(user) {
  const [profile, setProfile] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
         setLoading(false);
         setProfile(initialProfileState); // Reset to initial state if no user
         return;
      }
      
      setLoading(true);
      setError(null);
      setMessage(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*') // Select all columns, including header_url
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // Profile doesn't exist yet
            console.log('No profile found for user, using defaults.');
            setProfile(initialProfileState); // Reset to initial state
          } else {
            console.error('Error fetching profile:', fetchError);
            setError('Could not fetch profile data.');
            setProfile(initialProfileState); // Ensure reset on other errors too
          }
        } else if (data) {
          // Initialize state with fetched data or defaults
          setProfile({
            ...initialProfileState,
            ...data,
            card_profiles: data.card_profiles || {},
            card_images: data.card_images || {},
          });
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
        setError('An unexpected error occurred while fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Dependency on user

  // Handle input changes for any profile field
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    // Clear messages/errors when user starts typing
    setMessage(null);
    setError(null);
  }, []);

  // Handle saving profile details (excluding avatar)
  const saveProfileDetails = useCallback(async () => {
    if (!user) return;

    setUpdating(true);
    setError(null);
    setMessage(null);

    try {
      // Sla de hele card_profiles en card_images JSON op
      const profileUpdates = {
        card_profiles: profile.card_profiles,
        card_images: profile.card_images,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setMessage('Profile details updated successfully!');
    } catch (err) {
      console.error('Error updating profile details:', err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }, [user, profile]); // Dependency on user and profile state

  // Handle successful avatar upload (updates local state)
  const handleAvatarUploadSuccess = useCallback((newAvatarUrl) => {
    setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
    setMessage('Avatar updated successfully!'); // Set message specific to avatar
    setError(null); // Clear previous errors
  }, []);

  // Handle successful header upload (updates local state) - NEW
  const handleHeaderUploadSuccess = useCallback((newHeaderUrl) => {
    setProfile(prev => ({ ...prev, header_url: newHeaderUrl }));
    setMessage('Header updated successfully!'); 
    setError(null); 
  }, []);

  // Update profile state directly (for card type changes)
  const updateProfileField = useCallback((field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  // Return values needed by the component
  return {
    profile,
    loading,
    updating,
    error,
    message,
    handleChange,
    saveProfileDetails,
    handleAvatarUploadSuccess,
    handleHeaderUploadSuccess, // Return the new handler
    updateProfileField, // Return the new update function
  };
} 