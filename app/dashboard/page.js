'use client';

import React, { useEffect, useState } from 'react';
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
import { useCardLayoutWithSocialBar } from '../../src/hooks/useCardLayoutWithSocialBar';

import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, SECTION_OPTIONS } from '../../src/lib/sectionOptions';
import { sectionComponentMap } from '../../src/components/card/CardSectionRenderer';
import { supabase } from '../../src/lib/supabase';
import DesignToolbar from '../../components/dashboard/DesignToolbar';
import { DesignSettingsProvider, useDesignSettings } from '../../components/dashboard/DesignSettingsContext';




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

  // Use the new social bar hook
  const {
    cardSections,
    socialBarSections,
    setCardSections,
    setSocialBarSections,
    handleRemoveSection,
    handleDragEnd,
    getAllSections,
  } = useCardLayoutWithSocialBar(profile);

  const [activeId, setActiveId] = useState(null);
  const [hasInitializedSections, setHasInitializedSections] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
    handleSave: handleModalSave,
  } = useEditSectionModal(user, profile, handleProfileUpdate);

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

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);



  if (sessionLoading || profileLoading) {
    return <div>Loading Dashboard Content...</div>;
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const handleSaveLayoutClick = async () => {
    setSaveMessage('');
    const allSections = getAllSections();
    console.log('Saving layout with social bar:', allSections);
    await saveCardLayout(allSections);
    if (layoutError) {
      setSaveMessage('Error saving layout.');
    } else {
      setSaveMessage('Layout saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleAddSection = (sectionType) => {
    const defaultProps = getDefaultSectionProps(sectionType);
    // Get the section option to include editorComponent if available
    const sectionOption = SECTION_OPTIONS.find(option => option.type === sectionType);
    
    const newSection = {
      id: uuidv4(),
      type: sectionType,
      ...defaultProps,
      // Include editorComponent if it exists in the section option
      ...(sectionOption?.editorComponent && { editorComponent: sectionOption.editorComponent })
    };
    
    // Check if it's a social media type and add to appropriate area
    const SOCIAL_MEDIA_TYPES = [
      'linkedin', 'x_profile', 'instagram', 'github_gitlab', 'dribbble_behance',
      'youtube_channel', 'tiktok', 'facebook', 'stackoverflow', 'contact_buttons',
      'email', 'whatsapp'
    ];
    
    if (SOCIAL_MEDIA_TYPES.includes(sectionType)) {
      setSocialBarSections((prev) => [...prev, { ...newSection, area: 'social_bar' }]);
    } else {
      setCardSections((prev) => [...prev, newSection]);
    }
  };

  const existingSectionTypes = [...cardSections, ...socialBarSections].map((s) => s.type);

  // Callback om profiel te updaten na opslaan van design settings
  const handleProfileUpdateFromToolbar = (updatedProfile) => {
    if (updatedProfile) {
      handleProfileUpdate(updatedProfile);
    }
  };

  return (
    <DesignSettingsProvider initial={profile}>
      <div className="relative w-full flex justify-end z-40">
        <DesignToolbar initial={profile} userId={user.id} onProfileUpdate={handleProfileUpdateFromToolbar} />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 px-6 max-w-screen-xl mx-auto">
        <aside className="w-full lg:w-[500px] flex-shrink-0 lg:border-r lg:border-gray-200 lg:pr-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Edit Sections</h2>
          </div>
          <AvailableSectionList
            onAddSection={handleAddSection}
            existingSectionTypes={existingSectionTypes}
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
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveLayoutClick}
              disabled={updatingLayout}
              className="bg-emerald-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50"
              style={{ backgroundColor: '#00C48C' }}
            >
              {updatingLayout ? 'Saving...' : 'Save Layout'}
            </button>
            {saveMessage && (
              <p className={`mt-2 text-sm ${layoutError ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
            {(layoutError || languagesError) && !saveMessage && (
              <p className="mt-2 text-sm text-red-600">
                Error: {layoutError || languagesError || 'Could not save changes.'}
              </p>
            )}
          </div>
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
  return (
    <main 
      className="flex-1 flex justify-center items-start" 
      style={{ 
        ...(settings.background_color?.includes('linear-gradient')
          ? { backgroundImage: settings.background_color || 'linear-gradient(135deg, #f8f9fa 0%, #f8f9fa 100%)' }
          : { backgroundColor: settings.background_color || '#f8f9fa' }
        ),
        minHeight: '100vh', 
        borderRadius: '15px' 
      }}
    >
      <div className="w-full max-w-3xl px-4 py-6">
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
