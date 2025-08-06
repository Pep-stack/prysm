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
import { useSimpleCardSections } from '../../src/hooks/useSimpleCardSections';

import { CARD_TYPES } from '../../src/lib/sectionOptions';
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

  // Use the new simple card sections system
  const cardType = workingProfile?.card_type || CARD_TYPES.PRO;
  const {
    cardSections,
    socialBarSections,
    addSection,
    removeSection,
    reorderSections,
    isLoading,
    error
  } = useSimpleCardSections(user, cardType);

  const [activeId, setActiveId] = useState(null);

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

  // Portfolio section fix - only needed for data migration
  useEffect(() => {
    if (profile?.card_sections) {
      const hasPortfolioSections = profile.card_sections.some(section => section.type === 'portfolio');
      if (hasPortfolioSections) {
        const fixedSections = profile.card_sections.map(section => 
          section.type === 'portfolio' ? { ...section, type: 'projects' } : section
        );
        const updatedProfile = { ...profile, card_sections: fixedSections };
        handleProfileUpdate(updatedProfile);
      }
    }
  }, [profile]);

  const handleRemoveSection = useCallback(async (sectionId) => {
    removeSection(sectionId);
  }, [removeSection]);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    
    if (!active || !over || active.id === over.id) {
      return;
    }

    // Find the indices of the dragged and target sections
    const allSections = [...cardSections, ...socialBarSections];
    const activeIndex = allSections.findIndex(section => section.id === active.id);
    const overIndex = allSections.findIndex(section => section.id === over.id);
    
    if (activeIndex !== -1 && overIndex !== -1) {
      reorderSections(activeIndex, overIndex);
    }
  }, [cardSections, socialBarSections, reorderSections]);

  const handleModalSave = useCallback(async (...args) => {
    await originalHandleModalSave(...args);
  }, [originalHandleModalSave]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  if (sessionLoading || profileLoading) {
    return <div>Loading Dashboard Content...</div>;
  }

  // Simple validation
  if (!profile) {
    // Using temporary profile for new users
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const handleAddSection = (sectionType) => {
    addSection(sectionType);
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
