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
import EditSectionModal from '../../src/components/modal/EditSectionModal';
import AvatarUploadModal from '../../src/components/modal/AvatarUploadModal';

import { useEditSectionModal } from '../../src/hooks/useEditSectionModal';
import { useAvatarUploadModal } from '../../src/hooks/useAvatarUploadModal';
import { useUserProfile } from '../../src/hooks/useUserProfile';

import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps } from '../../src/lib/sectionOptions';
import { sectionComponentMap } from '../../src/components/card/CardSectionRenderer';

export default function DashboardPageContent() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [activeId, setActiveId] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  const {
    profile,
    loading: profileLoading,
    handleProfileUpdate,
    handleAvatarUpdate,
    saveCardLayout,
    updatingLayout,
    layoutError,
    saveLanguages,
    updatingLanguages,
    languagesError,
  } = useUserProfile(user);

  const [cardSections, setCardSections] = useState([]);
  const [hasInitializedSections, setHasInitializedSections] = useState(false);

  useEffect(() => {
    if (profile && !profileLoading && !hasInitializedSections) {
      setCardSections(profile.card_sections || []);
      setHasInitializedSections(true);
    }
  }, [profile, profileLoading, hasInitializedSections]);

  const handleRemoveSection = (id) => {
    setCardSections((prev) => prev.filter((section) => section.id !== id));
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = cardSections.findIndex((item) => item.id === active.id);
      const newIndex = cardSections.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = Array.from(cardSections);
        const [movedItem] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, movedItem);

        setCardSections(newSections);
      }
    }
  };

  const handleSaveLayoutClick = async () => {
    setSaveMessage('');
    console.log('Opslaan in Supabase:', { id: user.id, card_sections: cardSections });
    await saveCardLayout(cardSections);
    if (layoutError) {
      setSaveMessage('Error saving layout.');
    } else {
      setSaveMessage('Layout saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleAddSection = (sectionType) => {
    const defaultProps = getDefaultSectionProps(sectionType);
    const newSection = {
      id: uuidv4(),
      type: sectionType,
      ...defaultProps,
    };
    setCardSections((prev) => [...prev, newSection]);
  };

  const existingSectionTypes = cardSections.map((s) => s.type);

  return (
    <div className="w-full max-w-lg mx-auto px-0 sm:px-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
          {/* Linkerkolom */}
          <div className="flex-1 w-full sm:max-w-[380px] sm:mx-auto sm:px-0 lg:border-r lg:border-gray-200 lg:pr-6 lg:mr-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">Edit Sections</h2>
            </div>
            <AvailableSectionList
              onAddSection={handleAddSection}
              existingSectionTypes={existingSectionTypes}
            />
            <EditableSectionList
              items={cardSections}
              onRemoveSection={handleRemoveSection}
              onEditSection={openEditModal}
            />
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
          </div>

          {/* Rechterkolom */}
          <div className="w-full max-w-[380px] mx-auto sm:w-[380px] sm:mx-auto sm:px-0">
            <PrysmaCard
              profile={profile}
              user={user}
              cardSections={cardSections}
            />
          </div>
        </div>

        {/* Modals */}
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
      </DndContext>
    </div>
  );
}
