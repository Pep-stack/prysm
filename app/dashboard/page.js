'use client';

import React, { useEffect, useState, useCallback } from 'react';
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

// Import page components
import DraggableCardOptionsContainer from '../../src/components/card/DraggableCardOptionsContainer';
import EditSectionModal from '../../src/components/modal/EditSectionModal';
import AvatarUploadModal from '../../src/components/modal/AvatarUploadModal';

// Import the custom hook
import { useCardLayout } from '../../src/hooks/useCardLayout';
import { useEditSectionModal } from '../../src/hooks/useEditSectionModal';
import { useAvatarUploadModal } from '../../src/hooks/useAvatarUploadModal';
import { useUserProfile } from '../../src/hooks/useUserProfile';

export default function DashboardPage() {
  const { user, loading: sessionLoading, signOut } = useSession();
  const router = useRouter();
  const [activeId, setActiveId] = useState(null);
  const [saveMessage, setSaveMessage] = useState(''); // State for save button message

  // --- Use custom hooks for managing state and logic --- 
  const { 
     profile, 
     loading: profileLoading, 
     handleProfileUpdate, 
     handleAvatarUpdate,
     saveCardLayout,      // Get the save function
     updatingLayout,    // Get loading state for layout save
     layoutError,        // Get error state for layout save
     saveLanguages,     // Get the languages save function
     updatingLanguages, // Get languages saving state
     languagesError     // Get languages error state
  } = useUserProfile(user);
  
  const { 
     cardSections,       // Get current layout state
     handleRemoveSection, 
     handleDragEnd: handleLayoutDragEnd 
  } = useCardLayout(profile); // Pass profile to initialize/update layout
  
  const { 
     isModalOpen: isEditModalOpen, 
     editingSection, 
     inputValue: modalInputValue, 
     isLoading: modalLoading, 
     openModal: openEditModal, 
     closeModal: closeEditModal, 
     setInputValue: setModalInputValue, 
     handleSave: handleModalSave 
  } = useEditSectionModal(user, profile, handleProfileUpdate);
  
  const { 
     isModalOpen: isAvatarModalOpen, 
     openModal: openAvatarModal, 
     closeModal: closeAvatarModal, 
     handleSuccess: handleAvatarUploadSuccess 
  } = useAvatarUploadModal(handleAvatarUpdate);

  // Sensors (no change)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Redirect if not logged in (no change)
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  // handleSignOut (no change)
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Main loading state (no change)
  if (sessionLoading || profileLoading) {
    return <div className="p-10">Loading...</div>;
  }

  // dnd-kit handlers (handleDragStart remains, handleDragEnd uses the hook's version)
  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  // ADDED: Handler for the Save Layout button click
  const handleSaveLayout = async () => {
    setSaveMessage(''); // Clear previous message
    await saveCardLayout(cardSections); // Call the save function from the hook
    // Check for errors (layoutError state from useUserProfile)
    if (layoutError) {
      setSaveMessage('Error saving layout.'); // Show error message
    } else {
      setSaveMessage('Layout saved successfully!'); // Show success message
      // Optionally clear the message after a few seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleLayoutDragEnd} // Use the handler from the hook
    >
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */} 
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={handleSignOut} 
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Sign Out
          </button>
        </div>

        {/* Two-column layout */} 
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */} 
          <div className="lg:flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Prysma Profile Card</h2>
            <p className="text-sm text-gray-600 mb-4">
              Drag sections from the right onto the card below. Drag sections within the card to reorder. Click &apos;X&apos; to remove a section. Click a section to edit.
            </p>
            <PrysmaCard 
              profile={profile} 
              user={user} 
              cardSections={cardSections} 
              onRemoveSection={handleRemoveSection} 
              onEditSection={openEditModal}
              onAvatarClick={openAvatarModal}
              onSaveLayoutClick={handleSaveLayout} 
              isSavingLayout={updatingLayout}    
              onSaveLanguages={saveLanguages}
            />
            {/* ADDED: Display save message/error below the card */}
            {saveMessage && (
              <p className={`mt-4 text-sm ${layoutError ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
             {(layoutError || languagesError) && !saveMessage && (
               <p className="mt-4 text-sm text-red-600">
                 Error: {layoutError || languagesError || 'Could not save changes.'}
               </p>
             )}
          </div>

          {/* Right Column */} 
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Build Your Card</h2>
              <p className="text-sm text-gray-600 mb-4">Available Sections:</p>
              <DraggableCardOptionsContainer cardSections={cardSections} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Render the Modals */}
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
        user={user} // Pass user object needed for upload path/logic
      />
    </DndContext>
  );
} 