'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../src/components/auth/SessionProvider';
import PrysmaCard from '../../src/components/card/PrysmaCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import EditableSectionList from '../../src/components/dashboard/EditableSectionList';
import AvailableSectionList from '../../src/components/dashboard/AvailableSectionList';
import SocialBarDropzone from '../../src/components/dashboard/SocialBarDropzone';
import EditSectionModal from '../../src/components/modal/EditSectionModal';
import AvatarUploadModal from '../../src/components/modal/AvatarUploadModal';

import { useEditSectionModal } from '../../src/hooks/useEditSectionModal';
import { useAvatarUploadModal } from '../../src/hooks/useAvatarUploadModal';
import { useUserProfile } from '../../src/hooks/useUserProfile';
import { useCardLayout } from '../../src/hooks/useCardLayout';

import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, getSectionOptionsByCardType, CARD_TYPES } from '../../src/lib/sectionOptions';
import { sectionComponentMap } from '../../src/components/card/CardSectionRenderer';
import { supabase } from '../../src/lib/supabase';
import DesignToolbar from '../../src/components/dashboard/DesignToolbar';
import { DesignSettingsProvider, useDesignSettings } from '../../src/components/dashboard/DesignSettingsContext';




export default function DashboardPageContent() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    saveCardLayout,
    updatingLayout,
    layoutError,
    languagesError,
    handleProfileUpdate,
  } = useUserProfile(user);

  // Allow dashboard to work even without profile - sections will be empty but buttons should work
  const workingProfile = useMemo(() => {
    return profile || {
      id: user?.id,
      card_type: 'pro',
      card_sections: []
    };
  }, [profile, user?.id]);

  // Use the consolidated card layout hook
  const cardType = workingProfile?.card_type || CARD_TYPES.PRO;
  const {
    cardSections,
    socialBarSections,
    setCardSections,
    setSocialBarSections,
    handleRemoveSection: originalHandleRemoveSection,
    handleDragEnd: originalHandleDragEnd,
    getAllSections,
    isAutoSaving: hookIsAutoSaving,
    setIsAutoSaving: setHookIsAutoSaving,
  } = useCardLayout(workingProfile, cardType);

  const [activeId, setActiveId] = useState(null);
  const hasInitialLoad = useRef(false);

  // Design state (now handled by DesignToolbar)
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  const handleAvatarUpdate = (newAvatarUrl) => {
    console.log('Avatar updated:', newAvatarUrl);
  };



  const {
    isModalOpen: isEditModalOpen,
    editingSection,
    inputValue: modalInputValue,
    isLoading: modalLoading,
    openModal: openEditModal,
    closeModal: closeEditModal,
    setInputValue: setModalInputValue,
    handleSave: originalHandleModalSave,
  } = useEditSectionModal(user, workingProfile, handleProfileUpdate);

  const {
    isModalOpen: isAvatarModalOpen,
    openModal: openAvatarModal,
    closeModal: closeAvatarModal,
    handleSuccess: handleAvatarUploadSuccess,
  } = useAvatarUploadModal(handleAvatarUpdate);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save function that runs after any change
  const autoSaveLayout = useCallback(async () => {
    console.log('🔥 AUTO-SAVE: Starting auto-save operation', { 
      hasUser: !!user, 
      userId: user?.id,
      isCurrentlySaving: hookIsAutoSaving,
      cardType
    });
    
    if (!user || hookIsAutoSaving) {
      console.log('🚫 AUTO-SAVE: Save operation blocked', {
        reason: !user ? 'no user' : 'already saving',
        hasUser: !!user,
        isCurrentlySaving: hookIsAutoSaving
      });
      return;
    }
    
    setHookIsAutoSaving(true);
    try {
      const allSections = getAllSections();
      console.log('🔥 AUTO-SAVE: Collecting sections for save', {
        totalSections: allSections.length,
        sectionsData: allSections,
        cardType,
        hasFAQ: allSections.some(s => s.type === 'faq')
      });
      
      await saveCardLayout(allSections, cardType);
      console.log('✅ AUTO-SAVE: Save operation completed successfully');
    } catch (error) {
      console.error('❌ AUTO-SAVE: Save operation failed', {
        error,
        message: error.message
      });
    } finally {
      // Small delay to show saving state and prevent profile sync conflicts
      setTimeout(() => {
        console.log('🏁 AUTO-SAVE: Clearing auto-save state');
        setHookIsAutoSaving(false);
      }, 1000);
    }
  }, [user, hookIsAutoSaving, getAllSections, saveCardLayout, cardType, setHookIsAutoSaving]);

  // Effect to track initial load completion
  useEffect(() => {
    if (profile !== null) { // null means still loading, undefined means no profile found
      hasInitialLoad.current = true;
      console.log('🎯 INITIAL-LOAD: Profile load completed, auto-save will now be enabled', {
        hasProfile: !!profile,
        profileId: profile?.id,
        cardSectionsCount: cardSections.length,
        socialBarSectionsCount: socialBarSections.length
      });
      
      // Fix any portfolio sections by converting them to projects
      if (profile?.card_sections) {
        const hasPortfolioSections = profile.card_sections.some(section => section.type === 'portfolio');
        if (hasPortfolioSections) {
          console.log('🔧 FIXING: Found portfolio sections, converting to projects');
          const fixedSections = profile.card_sections.map(section => 
            section.type === 'portfolio' ? { ...section, type: 'projects' } : section
          );
          
          // Update the profile with fixed sections
          const updatedProfile = { ...profile, card_sections: fixedSections };
          handleProfileUpdate(updatedProfile);
          
          console.log('✅ FIXED: Portfolio sections converted to projects');
        }
      }
    }
  }, [profile, cardSections, socialBarSections]);

  // Auto-save effect - triggers save when sections change
  useEffect(() => {
    // Don't auto-save if we haven't completed initial load or there's no user
    if (!user || !hasInitialLoad.current) {
      console.log('🚫 AUTO-SAVE-TRIGGER: Blocked', {
        hasUser: !!user,
        hasCompletedInitialLoad: hasInitialLoad.current,
        reason: !user ? 'no user' : 'initial load not completed'
      });
      return;
    }

    console.log('🔄 AUTO-SAVE-TRIGGER: Sections changed, scheduling auto-save', {
      cardSectionsCount: cardSections.length,
      socialBarSectionsCount: socialBarSections.length,
      totalSections: cardSections.length + socialBarSections.length,
      hasCompletedInitialLoad: hasInitialLoad.current
    });

    // Debounce the auto-save to prevent multiple rapid saves
    const timeoutId = setTimeout(() => {
      autoSaveLayout();
    }, 500); // Increased delay for better debouncing

    return () => clearTimeout(timeoutId);
  }, [cardSections, socialBarSections, user, autoSaveLayout]);

  // Wrapper functions - auto-save is now handled by useEffect
  const handleRemoveSection = useCallback(async (sectionId) => {
    console.log('🔥 REMOVE-SECTION: Starting remove section operation', {
      sectionId,
      currentCardSections: cardSections.length,
      currentSocialBarSections: socialBarSections.length
    });
    
    originalHandleRemoveSection(sectionId);
    console.log('✅ REMOVE-SECTION: Section removed, auto-save will trigger automatically');
  }, [originalHandleRemoveSection, cardSections.length, socialBarSections.length]);

  const handleDragEnd = useCallback(async (event) => {
    console.log('🎯 DRAG-END: Handling drag end:', event);
    originalHandleDragEnd(event);
    console.log('✅ DRAG-END: Drag completed, auto-save will trigger automatically');
  }, [originalHandleDragEnd]);

  const handleModalSave = useCallback(async (...args) => {
    console.log('💾 MODAL-SAVE: Saving with args:', args);
    await originalHandleModalSave(...args);
    console.log('✅ MODAL-SAVE: Modal saved, auto-save will trigger automatically');
    
    // Extra debug for FAQ section
    if (args[0] && args[0].type === 'faq') {
      console.log('🔍 FAQ-MODAL-SAVE: FAQ section saved, checking profile update...');
      // Wait a bit for the profile to update
      setTimeout(() => {
        console.log('🔍 FAQ-MODAL-SAVE: Profile after save:', {
          workingProfile,
          faqData: workingProfile?.faq,
          parsedFAQ: workingProfile?.faq ? JSON.parse(workingProfile.faq) : null
        });
      }, 1000);
    }
  }, [originalHandleModalSave, workingProfile]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  if (sessionLoading || profileLoading) {
    return <div>Loading Dashboard Content...</div>;
  }

  if (!profile) {
    console.log('🔥 DASHBOARD: No profile found - using temporary profile');
  }

  console.log('🔥 DASHBOARD: Component render state', { 
    sessionLoading, 
    profileLoading, 
    hasUser: !!user, 
    hasProfile: !!profile,
    hasWorkingProfile: !!workingProfile,
    profileId: workingProfile?.id,
    cardSectionsCount: cardSections.length,
    socialBarSectionsCount: socialBarSections.length,
    profileCardSections: profile?.card_sections
  });

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const handleAddSection = (sectionType) => {
    console.log('🔥 ADD-SECTION: Starting add section operation', {
      sectionType,
      currentCardType: workingProfile?.card_type || CARD_TYPES.PRO,
      workingProfileId: workingProfile?.id
    });
    
    // Get card type from profile, default to PRO
    const currentCardType = workingProfile?.card_type || CARD_TYPES.PRO;
    const defaultProps = getDefaultSectionProps(sectionType, currentCardType);
    
    // Get the section option to include editorComponent if available
    const sectionOptions = getSectionOptionsByCardType(currentCardType);
    const sectionOption = sectionOptions.find(option => option.type === sectionType);
    
    const newSection = {
      id: uuidv4(),
      type: sectionType,
      ...defaultProps,
      // Include editorComponent if it exists in the section option
      ...(sectionOption?.editorComponent && { editorComponent: sectionOption.editorComponent })
    };
    
    console.log('🔥 ADD-SECTION: Created new section object', {
      newSection,
      sectionId: newSection.id,
      editorComponent: newSection.editorComponent,
      sectionOption: sectionOption
    });
    
    // Check if it's a social media type and add to appropriate area
    const SOCIAL_MEDIA_TYPES = [
      'github', 'x', 'dribbble', 'youtube', 'tiktok', 'linkedin', 'instagram', 'facebook', 'snapchat', 'reddit', 'phone', 'whatsapp', 'email', 'behance'
    ];
    
    if (SOCIAL_MEDIA_TYPES.includes(sectionType)) {
      console.log('🔥 ADD-SECTION: Adding to social bar sections');
      setSocialBarSections((prev) => {
        const newSections = [...prev, { ...newSection, area: 'social_bar' }];
        console.log('🔥 ADD-SECTION: Social bar sections updated', {
          previousCount: prev.length,
          newCount: newSections.length,
          newSections
        });
        return newSections;
      });
      console.log('✅ ADD-SECTION: Social section added, auto-save will trigger automatically');
    } else {
      console.log('🔥 ADD-SECTION: Adding to card sections');
      setCardSections((prev) => {
        const newSections = [...prev, newSection];
              console.log('🔥 ADD-SECTION: Card sections updated', {
        previousCount: prev.length,
        newCount: newSections.length,
        newSections,
        hasFAQ: newSections.some(s => s.type === 'faq'),
        faqSections: newSections.filter(s => s.type === 'faq')
      });
        return newSections;
      });
      console.log('✅ ADD-SECTION: Card section added, auto-save will trigger automatically');
    }
  };

  const existingSectionTypes = [...cardSections, ...socialBarSections].map((s) => s.type);

  console.log('🟢 DASHBOARD: All functions defined:', {
    handleAddSection: typeof handleAddSection,
    handleRemoveSection: typeof handleRemoveSection,
    handleDragEnd: typeof handleDragEnd
  });

  // Callback om profiel te updaten na opslaan van design settings
  const handleProfileUpdateFromToolbar = (updatedProfile) => {
    if (updatedProfile) {
      handleProfileUpdate(updatedProfile);
    }
  };

  return (
    <DesignSettingsProvider initial={workingProfile}>
      <div className="flex flex-col lg:flex-row gap-6 px-6 max-w-screen-xl mx-auto">
        <aside className="w-full lg:w-[500px] flex-shrink-0 lg:border-r lg:border-gray-200 lg:pr-6">
          <div className="mb-6">
            <DesignToolbar initial={workingProfile} userId={user.id} onProfileUpdate={handleProfileUpdateFromToolbar} />
          </div>
          <AvailableSectionList
            onAddSection={handleAddSection}
            existingSectionTypes={existingSectionTypes}
            cardType={workingProfile?.card_type || CARD_TYPES.PRO}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SocialBarDropzone
              sections={socialBarSections}
              onRemoveSection={handleRemoveSection}
              onEditSection={openEditModal}
            />
            <EditableSectionList
              items={cardSections}
              onRemoveSection={handleRemoveSection}
              onEditSection={openEditModal}
            />
          </DndContext>

        </aside>
        <DashboardMainWithBg 
          profile={profile} 
          user={user} 
          cardSections={cardSections}
          socialBarSections={socialBarSections}
        />
        <EditSectionModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          section={editingSection}
          value={modalInputValue}
          onChange={setModalInputValue}
          onSave={handleModalSave}
          isLoading={modalLoading}
          user={user}
        />
        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onClose={closeAvatarModal}
          onUploadSuccess={handleAvatarUploadSuccess}
          user={user}
        />
      </div>
    </DesignSettingsProvider>
  );
}

function DashboardMainWithBg({ profile, user, cardSections, socialBarSections }) {
  const { settings } = useDesignSettings();
  
  // Import theme system for background rendering
  const { THEME_BACKGROUNDS } = require('../../src/lib/themeSystem');
  
  const backgroundOption = THEME_BACKGROUNDS.find(opt => opt.value === settings.background_color);
  
  // Determine style based on background type
  const getBackgroundStyle = () => {
    if (backgroundOption?.isPattern) {
      return {
        backgroundColor: backgroundOption.backgroundColor,
        backgroundImage: settings.background_color,
        backgroundSize: backgroundOption.backgroundSize || 'auto'
      };
    } else if (settings.background_color?.includes('linear-gradient') || 
               settings.background_color?.includes('radial-gradient') || 
               settings.background_color?.includes('repeating-linear-gradient')) {
      return {
        backgroundImage: settings.background_color || 'linear-gradient(135deg, #f8f9fa 0%, #f8f9fa 100%)'
      };
    } else {
      return {
        backgroundColor: settings.background_color || '#f8f9fa'
      };
    }
  };
  
  return (
    <main 
      className="flex-1 flex flex-col justify-start items-center pt-6 pb-6" 
      style={{ 
        ...getBackgroundStyle(),
        minHeight: '100vh', 
        borderRadius: '15px' 
      }}
    >
      <div className="w-full max-w-3xl px-0 py-0 flex-grow">
        <PrysmaCard
          profile={profile}
          user={user}
          cardSections={cardSections}
          socialBarSections={socialBarSections}
        />
      </div>
    </main>
  );
}
