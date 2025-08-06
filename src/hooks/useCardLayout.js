'use client'; // Hooks might be used in client components

import { useState, useCallback, useEffect, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, SECTION_OPTIONS, CARD_TYPES, getSectionsKey } from '../lib/sectionOptions';
import { supabase } from '../lib/supabase';

// Define which section types are considered social media
const SOCIAL_MEDIA_TYPES = [
  'github', 'x', 'dribbble', 'youtube', 'tiktok', 'linkedin', 'instagram', 'facebook', 'snapchat', 'reddit', 'phone', 'whatsapp', 'email', 'behance'
];

// Helper function to enhance sections with properties from SECTION_OPTIONS
const enhanceSectionWithDefaults = (section) => {
  const sectionOption = SECTION_OPTIONS.find(option => option.type === section.type);
  return {
    ...section,
    ...(sectionOption?.editorComponent && { editorComponent: sectionOption.editorComponent })
  };
};

// Helper function to create proper default sections based on card type
const createDefaultSections = (cardType = CARD_TYPES.PRO) => {
  if (cardType === CARD_TYPES.PRO) {
    return [
      {
        id: uuidv4(),
        type: 'projects',
        ...getDefaultSectionProps('projects', cardType),
        editorComponent: 'ProjectSelector'
      },
      {
        id: uuidv4(),
        type: 'services',
        ...getDefaultSectionProps('services', cardType)
      },
      {
        id: uuidv4(),
        type: 'skills',
        ...getDefaultSectionProps('skills', cardType)
      }
    ];
  }
  
  // Fallback to original defaults
  return [
    {
      id: uuidv4(),
      type: 'bio',
      ...getDefaultSectionProps('bio')
    },

    {
      id: uuidv4(),
      type: 'languages',
      ...getDefaultSectionProps('languages'),
      editorComponent: 'LanguageSelector'
    },
    {
      id: uuidv4(),
      type: 'education',
      ...getDefaultSectionProps('education'),
      editorComponent: 'EducationSelector'
    }
  ];
};

export function useCardLayout(profile, cardType) {
  const [cardSections, setCardSections] = useState([]);
  const [socialBarSections, setSocialBarSections] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const lastSyncedRef = useRef({ profileId: null, updatedAt: null });

  useEffect(() => {
    const syncProfile = async () => {
      const profileId = profile?.id;
      const updatedAt = profile?.updated_at;
      
      // Check for real profile changes and empty local state
      const hasProfileIdChanged = profileId !== lastSyncedRef.current.profileId;
      const isInitialLoad = lastSyncedRef.current.profileId === null && profileId;
      const hasEmptyLocalState = cardSections.length === 0 && socialBarSections.length === 0;
      // Removed problematic condition that caused sections to reappear when empty
      const shouldSync = isInitialLoad || hasProfileIdChanged;

      console.log('🔥 PROFILE-SYNC: useEffect triggered', { 
        hasProfile: !!profile, 
        cardType, 
        isAutoSaving,
        profileId,
        updatedAt,
        hasProfileIdChanged,
        isInitialLoad,
        hasEmptyLocalState,
        shouldSync,
        lastSynced: lastSyncedRef.current
      });
      
      // Only sync from profile if:
      // 1. We have a profile and cardType
      // 2. We're not auto-saving
      // 3. It's the initial load OR profile ID changed OR local state is empty
      if (profile && cardType && !isAutoSaving && shouldSync) {
        const key = getSectionsKey(cardType);
        let allSections = Array.isArray(profile[key]) ? profile[key] : [];
        
        // Fix any portfolio sections by converting them to projects
        const hasPortfolioSections = allSections.some(section => section.type === 'portfolio');
        if (hasPortfolioSections) {
          console.log('🔧 FIXING: Found portfolio sections in database, converting to projects');
          allSections = allSections.map(section => 
            section.type === 'portfolio' ? { ...section, type: 'projects' } : section
          );
          console.log('✅ FIXED: Portfolio sections converted to projects');
          
          // Update the database with the fixed sections
          if (profile?.id) {
            console.log('💾 UPDATING: Saving fixed sections to database');
            const { error } = await supabase
              .from('profiles')
              .update({ 
                [key]: allSections,
                updated_at: new Date().toISOString() 
              })
              .eq('id', profile.id);
            
            if (error) {
              console.error('❌ DATABASE-UPDATE: Failed to update fixed sections', error);
            } else {
              console.log('✅ DATABASE-UPDATE: Fixed sections saved to database');
            }
          }
        }
        
        console.log('🔥 PROFILE-SYNC: Loading sections from database', {
          databaseColumn: key,
          rawSectionsFromDB: profile[key],
          parsedSections: allSections,
          sectionsCount: allSections.length,
          syncReason: isInitialLoad ? 'initial load' : hasProfileIdChanged ? 'profile ID changed' : 'empty local state'
        });
        
        // Extra debug for FAQ sections
        const faqSections = allSections.filter(section => section.type === 'faq');
        console.log('🔍 PROFILE-SYNC: FAQ sections found:', {
          faqSectionsCount: faqSections.length,
          faqSections: faqSections,
          allSectionsCount: allSections.length,
          allSections: allSections.map(s => ({ id: s.id, type: s.type }))
        });
        
        const newCardSections = allSections.filter(s => !s.area || s.area !== 'social_bar');
        const newSocialBarSections = allSections.filter(s => s.area === 'social_bar');
        
        console.log('🔥 PROFILE-SYNC: Splitting sections into categories', {
          cardSections: newCardSections,
          socialBarSections: newSocialBarSections,
          cardSectionsCount: newCardSections.length,
          socialBarSectionsCount: newSocialBarSections.length
        });
        
        setCardSections(newCardSections);
        setSocialBarSections(newSocialBarSections);
        lastSyncedRef.current = { profileId, updatedAt };
        
        console.log('✅ PROFILE-SYNC: Sections loaded and state updated');
      } else {
        console.log('🚫 PROFILE-SYNC: Sync blocked', {
          hasProfile: !!profile,
          hasCardType: !!cardType,
          isAutoSaving,
          hasProfileIdChanged,
          isInitialLoad,
          hasEmptyLocalState,
          shouldSync,
          reason: !profile ? 'no profile' : !cardType ? 'no cardType' : isAutoSaving ? 'auto-saving' : !shouldSync ? 'no sync conditions met' : 'unknown'
        });
      }
    };
    
    syncProfile();
  }, [profile?.id, profile?.updated_at, cardType, isAutoSaving]);

  // Handler to remove a section from either area
  const handleRemoveSection = useCallback((idToRemove) => {
    console.log(`🗑️ ORIGINAL-REMOVE: Attempting to remove section with ID: ${idToRemove}`);
    
    // Try removing from regular sections first
    setCardSections((prevSections) => {
      console.log('🗑️ ORIGINAL-REMOVE: Current card sections:', prevSections);
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      if (newSections.length !== prevSections.length) {
        console.log('🗑️ ORIGINAL-REMOVE: Removed from card sections, new sections:', newSections);
        return newSections;
      }
      console.log('🗑️ ORIGINAL-REMOVE: Section not found in card sections');
      return prevSections;
    });

    // Try removing from social bar sections
    setSocialBarSections((prevSections) => {
      console.log('🗑️ ORIGINAL-REMOVE: Current social bar sections:', prevSections);
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      if (newSections.length !== prevSections.length) {
        console.log('🗑️ ORIGINAL-REMOVE: Removed from social bar sections, new sections:', newSections);
        return newSections;
      }
      console.log('🗑️ ORIGINAL-REMOVE: Section not found in social bar sections');
      return prevSections;
    });
  }, []);

  // Enhanced drag end handler with social bar support
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const droppingOnCard = over.id === 'prysma-card-dropzone';
    const droppingOnSocialBar = over.id === 'social-bar-dropzone';
    const isActiveOption = active.data.current?.type === 'card-option';

    // Case 1: Dropping a new section from the available sections
    if (isActiveOption && (droppingOnCard || droppingOnSocialBar)) {
      const droppedOption = active.data.current.option;
      const isSocialType = SOCIAL_MEDIA_TYPES.includes(droppedOption.type);
      
      // If dropping on social bar, only allow social types
      if (droppingOnSocialBar && !isSocialType) {
        console.log('Non-social section dropped on social bar, ignoring');
        return;
      }

      // If dropping a social type on main card, redirect to social bar
      if (droppingOnCard && isSocialType) {
        setSocialBarSections((prevSections) => {
          const isAlreadyAdded = prevSections.some(section => section.id === droppedOption.id);
          if (!isAlreadyAdded) {
            const newSection = { 
              ...droppedOption, 
              id: droppedOption.id,
              area: 'social_bar'
            };
            return [...prevSections, newSection];
          }
          return prevSections;
        });
        return;
      }

      // Normal drop on main card for non-social types
      if (droppingOnCard && !isSocialType) {
        setCardSections((prevSections) => {
          const isAlreadyAdded = prevSections.some(section => section.id === droppedOption.id);
          if (!isAlreadyAdded) {
            return [...prevSections, { id: droppedOption.id }];
          }
          return prevSections;
        });
        return;
      }

      // Drop on social bar for social types
      if (droppingOnSocialBar && isSocialType) {
        setSocialBarSections((prevSections) => {
          const isAlreadyAdded = prevSections.some(section => section.id === droppedOption.id);
          if (!isAlreadyAdded) {
            const newSection = { 
              ...droppedOption, 
              id: droppedOption.id,
              area: 'social_bar'
            };
            return [...prevSections, newSection];
          }
          return prevSections;
        });
        return;
      }
    }
    
    // Case 2: Sorting sections within the same area
    if (active.id !== over.id) {
      // Check if we're sorting in social bar
      const isActiveSocial = socialBarSections.some(section => section.id === active.id);
      const isOverSocial = socialBarSections.some(section => section.id === over.id);
      
      if (isActiveSocial && isOverSocial) {
        setSocialBarSections((prevSections) => {
          const oldIndex = prevSections.findIndex((item) => item.id === active.id);
          const newIndex = prevSections.findIndex((item) => item.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(prevSections, oldIndex, newIndex);
          }
          return prevSections;
        });
      } else {
        // Sorting in main card area
        setCardSections((prevSections) => {
          const oldIndex = prevSections.findIndex((item) => item.id === active.id);
          const newIndex = prevSections.findIndex((item) => item.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(prevSections, oldIndex, newIndex);
          }
          return prevSections;
        });
      }
    }
  }, [socialBarSections]);

  // Helper function to get all sections for saving
  const getAllSections = useCallback(() => {
    return [...cardSections, ...socialBarSections];
  }, [cardSections, socialBarSections]);

  return {
    cardSections,
    socialBarSections,
    setCardSections,
    setSocialBarSections,
    handleRemoveSection,
    handleDragEnd,
    getAllSections,
    isAutoSaving,
    setIsAutoSaving,
  };
} 