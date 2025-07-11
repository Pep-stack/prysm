'use client'; // Hooks might be used in client components

import { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, SECTION_OPTIONS, CARD_TYPES } from '../lib/sectionOptions';

// Define which section types are considered social media
const SOCIAL_MEDIA_TYPES = [
  'linkedin', 'x_profile', 'instagram', 'github_gitlab', 'dribbble_behance',
  'youtube_channel', 'tiktok', 'facebook', 'stackoverflow', 'contact_buttons',
  'email', 'whatsapp'
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
        type: 'portfolio',
        ...getDefaultSectionProps('portfolio', cardType),
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
  } else if (cardType === CARD_TYPES.CAREER) {
    return [
      {
        id: uuidv4(),
        type: 'experience',
        ...getDefaultSectionProps('experience', cardType),
        editorComponent: 'ExperienceSelector'
      },
      {
        id: uuidv4(),
        type: 'education',
        ...getDefaultSectionProps('education', cardType),
        editorComponent: 'EducationSelector'
      },
      {
        id: uuidv4(),
        type: 'skills',
        ...getDefaultSectionProps('skills', cardType)
      }
    ];
  } else if (cardType === CARD_TYPES.BUSINESS) {
    return [
      {
        id: uuidv4(),
        type: 'company_info',
        ...getDefaultSectionProps('company_info', cardType)
      },
      {
        id: uuidv4(),
        type: 'contact',
        ...getDefaultSectionProps('contact', cardType)
      },
      {
        id: uuidv4(),
        type: 'services_products',
        ...getDefaultSectionProps('services_products', cardType)
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
      type: 'contact',
      ...getDefaultSectionProps('contact')
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

export function useCardLayout(profile) {
  // Initialize state based on profile sections, separating social and regular sections
  const [cardSections, setCardSections] = useState(() => {
    const initial = profile?.card_sections;
    if (Array.isArray(initial) && initial.length > 0) {
      return initial
        .filter(section => !SOCIAL_MEDIA_TYPES.includes(section.type) && section.area !== 'social_bar')
        .map(enhanceSectionWithDefaults);
    }
    // Only create default sections if we have no profile data yet
    if (!profile) {
      return createDefaultSections(profile?.card_type || CARD_TYPES.PRO);
    }
    return [];
  });

  const [socialBarSections, setSocialBarSections] = useState(() => {
    const initial = profile?.card_sections;
    if (Array.isArray(initial) && initial.length > 0) {
      return initial
        .filter(section => SOCIAL_MEDIA_TYPES.includes(section.type) || section.area === 'social_bar')
        .map(enhanceSectionWithDefaults);
    }
    return [];
  });

  // Effect to update local state if profile data changes externally
  useEffect(() => {
    const sectionsFromProfile = profile?.card_sections;
    if (Array.isArray(sectionsFromProfile)) {
      const regularSections = sectionsFromProfile.filter(section => 
        !SOCIAL_MEDIA_TYPES.includes(section.type) && section.area !== 'social_bar'
      );
      const socialSections = sectionsFromProfile.filter(section => 
        SOCIAL_MEDIA_TYPES.includes(section.type) || section.area === 'social_bar'
      );

      // Update regular sections
      const currentRegularIds = cardSections.map(s => s.id).join(',');
      const profileRegularIds = regularSections.map(s => s.id).join(',');
      if (profileRegularIds !== currentRegularIds) {
        setCardSections(regularSections.map(enhanceSectionWithDefaults));
      }

      // Update social bar sections
      const currentSocialIds = socialBarSections.map(s => s.id).join(',');
      const profileSocialIds = socialSections.map(s => s.id).join(',');
      if (profileSocialIds !== currentSocialIds) {
        setSocialBarSections(socialSections.map(enhanceSectionWithDefaults));
      }
    }
  }, [profile?.card_sections]);

  // Handler to remove a section from either area
  const handleRemoveSection = useCallback((idToRemove) => {
    console.log(`Attempting to remove section with ID: ${idToRemove}`);
    
    // Try removing from regular sections first
    setCardSections((prevSections) => {
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      if (newSections.length !== prevSections.length) {
        console.log('Removed from regular sections:', newSections);
        return newSections;
      }
      return prevSections;
    });

    // Try removing from social bar sections
    setSocialBarSections((prevSections) => {
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      if (newSections.length !== prevSections.length) {
        console.log('Removed from social bar sections:', newSections);
        return newSections;
      }
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
  };
} 