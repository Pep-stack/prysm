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
import { supabase } from '../../src/lib/supabase';
import DesignToolbar from '../../components/dashboard/DesignToolbar';
import { DesignSettingsProvider, useDesignSettings } from '../../components/dashboard/DesignSettingsContext';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'DM Sans', value: 'DM Sans, sans-serif' },
];
const ICON_PACKS = [
  { label: 'Lucide', value: 'lucide' },
  { label: 'FontAwesome', value: 'fa' },
  { label: 'Material', value: 'material' },
];
const BUTTON_SHAPES = [
  { label: 'Rounded', value: 'rounded-full' },
  { label: 'Pill', value: 'rounded-xl' },
  { label: 'Square', value: 'rounded-md' },
];

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

  // Design settings state
  const [buttonColor, setButtonColor] = useState(profile?.button_color || '#00C48C');
  const [buttonShape, setButtonShape] = useState(profile?.button_shape || 'rounded-full');
  const [fontFamily, setFontFamily] = useState(profile?.font_family || 'Inter, sans-serif');
  const [iconPack, setIconPack] = useState(profile?.icon_pack || 'lucide');
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // Sync settings with profile
  useEffect(() => {
    if (profile) {
      setButtonColor(profile.button_color || '#00C48C');
      setButtonShape(profile.button_shape || 'rounded-full');
      setFontFamily(profile.font_family || 'Inter, sans-serif');
      setIconPack(profile.icon_pack || 'lucide');
    }
  }, [profile]);

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

  async function handleSaveAppearance() {
    setSavingAppearance(true);
    setAppearanceSaved(false);
    const { error } = await supabase.from('profiles').update({
      button_color: buttonColor,
      button_shape: buttonShape,
      font_family: fontFamily,
      icon_pack: iconPack,
    }).eq('id', user.id);
    setSavingAppearance(false);
    setAppearanceSaved(!error);
  }

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
        <DashboardMainWithBg profile={profile} user={user} cardSections={cardSections} />
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

function DashboardMainWithBg({ profile, user, cardSections }) {
  const { settings } = useDesignSettings();
  return (
    <main className="flex-1 flex justify-center items-start" style={{ backgroundColor: settings.background_color || '#f8f9fa', minHeight: '100vh', borderRadius: '15px' }}>
      <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[360px]">
        <PrysmaCard
          profile={profile}
          user={user}
          cardSections={cardSections}
        />
      </div>
    </main>
  );
}
