'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path

export function useUserProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: Error state for fetching
  const [updatingLayout, setUpdatingLayout] = useState(false); // ADDED: State for layout saving
  const [layoutError, setLayoutError] = useState(null); // ADDED: State for layout saving error
  const [updatingLanguages, setUpdatingLanguages] = useState(false); // ADDED: State for languages saving
  const [languagesError, setLanguagesError] = useState(null); // ADDED: State for languages saving error

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
    setProfile(updatedProfileData);
    // ALSO update card_sections in local state if it was part of the update?
    // Or assume edit modal only updates simple fields, not the layout itself.
  }, []);

  // Callback for successful avatar upload
  const handleAvatarUpdate = useCallback((newAvatarUrl) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
  }, []);

  // ADDED: Function to save only the card sections layout
  const saveCardLayout = useCallback(async (newLayout) => {
    if (!user) return;

    setUpdatingLayout(true);
    setLayoutError(null);

    try {
      // Sla de volledige sectie-objecten op
      const validLayout = Array.isArray(newLayout) ? newLayout : [];

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
            card_sections: validLayout,
            updated_at: new Date().toISOString() 
         })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      // Update local profile state immediately after successful save
      setProfile(prev => prev ? { ...prev, card_sections: validLayout } : null);
      // Optionally set a success message here if needed

    } catch (err) {
      console.error('Error updating card layout:', err);
      setLayoutError(`Failed to save card layout: ${err.message}`);
    } finally {
      setUpdatingLayout(false);
    }
  }, [user]);

  // ADDED: Function to save only languages
  const saveLanguages = useCallback(async (languageCodes) => {
    if (!user || !Array.isArray(languageCodes)) return;

    setUpdatingLanguages(true);
    setLanguagesError(null);
    const languagesString = languageCodes.join(','); // Convert array to string for DB

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
            languages: languagesString,
            updated_at: new Date().toISOString() 
         })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      // Update local profile state immediately
      setProfile(prev => prev ? { ...prev, languages: languagesString } : null); // Store as string locally too? Or keep as array? Let's keep string for consistency with DB fetch for now.
      // If we want LanguageSectionContent to always work with array, maybe fetch logic should parse?

    } catch (err) {
      console.error('Error updating languages:', err);
      setLanguagesError(`Failed to save languages: ${err.message}`);
      // Revert local state? Depends on desired UX
    } finally {
      setUpdatingLanguages(false);
    }
  }, [user]);

  return {
    profile,      
    loading,      
    error,        
    updatingLayout, // ADDED
    layoutError,   // ADDED
    updatingLanguages, // ADDED
    languagesError,    // ADDED
    handleProfileUpdate, 
    handleAvatarUpdate, 
    saveCardLayout, // ADDED
    saveLanguages,     // ADDED
  };
} 