'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, getSectionOptionsByCardType, CARD_TYPES } from '../lib/sectionOptions';

// Define which section types are social media
const SOCIAL_MEDIA_TYPES = [
  'github', 'x', 'dribbble', 'youtube', 'tiktok', 'linkedin', 'instagram', 'facebook', 
  'snapchat', 'reddit', 'phone', 'whatsapp', 'email', 'behance'
];

export function useSimpleCardSections(user, cardType = CARD_TYPES.PRO) {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load sections from database (ONLY on initial load)
  const loadSectionsFromDatabase = useCallback(async () => {
    if (!user?.id || isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('card_sections')
        .eq('id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      const loadedSections = Array.isArray(data?.card_sections) ? data.card_sections : [];
      setSections(loadedSections);
      setIsInitialized(true);
      
    } catch (err) {
      console.error('Failed to load sections:', err);
      setError(`Failed to load sections: ${err.message}`);
      setSections([]); // Fallback to empty array
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isInitialized]);

  // Save sections to database (simple, direct save)
  const saveToDatabase = useCallback(async (newSections) => {
    if (!user?.id) {
      return false;
    }
    
    try {
      // Clean sections before saving (remove invalid ones)
      const cleanSections = newSections.filter(section => {
        if (!section || typeof section !== 'object') return false;
        if (!section.id || !section.type) return false;
        return true;
      });
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          card_sections: cleanSections,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      return true;
      
    } catch (err) {
      console.error('Failed to save sections:', err);
      setError(`Failed to save sections: ${err.message}`);
      return false;
    }
  }, [user?.id]);

  // Add a new section (optimistic update)
  const addSection = useCallback((sectionType) => {
    // Create new section
    const defaultProps = getDefaultSectionProps(sectionType, cardType);
    const sectionOptions = getSectionOptionsByCardType(cardType);
    const sectionOption = sectionOptions.find(option => option.type === sectionType);
    
    const newSection = {
      id: uuidv4(),
      type: sectionType,
      ...defaultProps,
      ...(sectionOption?.editorComponent && { editorComponent: sectionOption.editorComponent }),
      // Add area for social media types
      ...(SOCIAL_MEDIA_TYPES.includes(sectionType) && { area: 'social_bar' })
    };
    
    // Optimistic update: update UI immediately
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    
    // Save to database in background
    saveToDatabase(updatedSections);
  }, [sections, cardType, saveToDatabase]);

  // Remove a section (optimistic update)
  const removeSection = useCallback((sectionId) => {
    // Optimistic update: update UI immediately
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    
    // Save to database in background
    saveToDatabase(updatedSections);
  }, [sections, saveToDatabase]);

  // Reorder sections (for drag & drop)
  const reorderSections = useCallback((startIndex, endIndex) => {
    const updatedSections = [...sections];
    const [removed] = updatedSections.splice(startIndex, 1);
    updatedSections.splice(endIndex, 0, removed);
    
    // Optimistic update
    setSections(updatedSections);
    
    // Save to database in background
    saveToDatabase(updatedSections);
  }, [sections, saveToDatabase]);

  // Helper functions to split sections
  const getCardSections = useCallback(() => {
    return sections.filter(section => !section.area || section.area !== 'social_bar');
  }, [sections]);

  const getSocialBarSections = useCallback(() => {
    return sections.filter(section => section.area === 'social_bar');
  }, [sections]);

  // Load initial data
  useEffect(() => {
    loadSectionsFromDatabase();
  }, [loadSectionsFromDatabase]);

  return {
    // Core data
    sections,
    cardSections: getCardSections(),
    socialBarSections: getSocialBarSections(),
    
    // Actions
    addSection,
    removeSection,
    reorderSections,
    
    // Status
    isLoading,
    error,
    isInitialized,
    
    // Utilities
    refreshFromDatabase: loadSectionsFromDatabase,
    totalSections: sections.length
  };
} 