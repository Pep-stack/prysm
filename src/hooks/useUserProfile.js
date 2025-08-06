'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path
import { getSectionsKey } from '../lib/sectionOptions';

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
         console.log('🔥 FETCH-PROFILE: No user found, clearing profile state');
         setLoading(false); 
         setProfile(null); // Ensure profile is null if no user
         return;
      }
      
      console.log('🔥 FETCH-PROFILE: Starting profile fetch for user:', user.id);
      setLoading(true);
      setError(null); // Clear previous errors
      
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*') 
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
           console.log('❌ FETCH-PROFILE: Database fetch error', {
             error: fetchError,
             code: fetchError.code,
             message: fetchError.message
           });
           if (fetchError.code !== 'PGRST116') { // Don't set error if profile just doesn't exist
              setError('Could not fetch profile data.');
           }
           setProfile(null); // Set profile to null on error or if not found
        } else {
          console.log('✅ FETCH-PROFILE: Profile fetched successfully', {
            profileId: data.id,
            cardType: data.card_type,
            cardSections: data.card_sections,
            cardSectionsLength: Array.isArray(data.card_sections) ? data.card_sections.length : 0,
            instagramProfile: data.instagram_profile,
            hasInstagramProfile: !!data.instagram_profile
          });
          setProfile(data); // Set profile data if found
        }
      } catch (err) {
        console.error('❌ FETCH-PROFILE: Unexpected error fetching profile', {
          error: err,
          message: err.message
        });
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
  const saveCardLayout = useCallback(async (newLayout, cardType) => {
    console.log('🔥 SAVE-LAYOUT: Starting save operation', { 
      userId: user?.id,
      hasUser: !!user, 
      layoutLength: newLayout?.length, 
      cardType,
      sectionsToSave: newLayout
    });
    
    if (!user) {
      console.log('❌ SAVE-LAYOUT: No user found, aborting save');
      return;
    }

    setUpdatingLayout(true);
    setLayoutError(null);

    try {
      // Sla de volledige sectie-objecten op in de juiste kolom
      const validLayout = Array.isArray(newLayout) ? newLayout : [];
      const key = getSectionsKey(cardType);
      
      // Validate layout before saving
      if (!Array.isArray(validLayout)) {
        throw new Error('Layout must be an array');
      }
      
      // Filter out any invalid sections
      const cleanLayout = validLayout.filter(section => {
        if (!section || typeof section !== 'object') {
          console.warn('⚠️ SAVE-LAYOUT: Invalid section found, filtering out:', section);
          return false;
        }
        if (!section.id || !section.type) {
          console.warn('⚠️ SAVE-LAYOUT: Section missing required fields, filtering out:', section);
          return false;
        }
        return true;
      });
      
      console.log('🔥 SAVE-LAYOUT: Layout validation complete', {
        originalLength: validLayout.length,
        cleanLength: cleanLayout.length,
        filteredCount: validLayout.length - cleanLayout.length
      });
      
      // Extra debug for FAQ sections
      const faqSections = cleanLayout.filter(section => section.type === 'faq');
      console.log('🔍 SAVE-LAYOUT: FAQ sections found:', {
        faqSectionsCount: faqSections.length,
        faqSections: faqSections
      });
      
      // Safely serialize the layout to prevent circular references
      let serializedLayout;
      try {
        serializedLayout = JSON.parse(JSON.stringify(cleanLayout));
      } catch (serializeError) {
        console.error('❌ SAVE-LAYOUT: Failed to serialize layout', serializeError);
        throw new Error(`Failed to serialize layout: ${serializeError.message}`);
      }
      
      console.log('🔥 SAVE-LAYOUT: Database operation details', {
        databaseColumn: key,
        dataToSave: 'Layout data (serialized)',
        userId: user.id,
        updateObject: { [key]: serializedLayout, updated_at: new Date().toISOString() }
      });

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ 
            [key]: serializedLayout,
            updated_at: new Date().toISOString() 
         })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.log('❌ SAVE-LAYOUT: Database update failed', {
          error: updateError,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw updateError;
      }
      
      console.log('✅ SAVE-LAYOUT: Database update successful', {
        returnedData: data,
        savedToColumn: key
      });
      
      // Update local profile state immediately after successful save
      setProfile(prev => {
        const newUpdatedAt = new Date().toISOString();
        const updated = prev ? { ...prev, [key]: serializedLayout, updated_at: newUpdatedAt } : null;
        console.log('🔄 SAVE-LAYOUT: Local profile state updated', {
          previousProfileKey: prev ? prev[key]?.length : 'null',
          newProfileKey: updated ? updated[key]?.length : 'null',
          previousUpdatedAt: prev?.updated_at,
          newUpdatedAt: newUpdatedAt,
          sectionsCount: serializedLayout.length,
          timestamp: new Date().toISOString()
        });
        return updated;
      });

    } catch (err) {
      console.error('❌ SAVE-LAYOUT: Save operation failed', {
        error: err,
        message: err.message,
        details: err.details || 'No additional details',
        hint: err.hint,
        code: err.code,
        layoutLength: newLayout?.length,
        cardType,
        key,
        serializedLayout: typeof serializedLayout
      });
      setLayoutError(`Failed to save card layout: ${err.message}`);
    } finally {
      console.log('🏁 SAVE-LAYOUT: Save operation completed, setting updatingLayout to false');
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