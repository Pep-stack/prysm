'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
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

export default function DashboardPage() {
  const { user, loading: sessionLoading, signOut } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Separate loading state for profile data
  const router = useRouter();
  const [activeId, setActiveId] = useState(null); // Drag state remains here for now

  // --- Use the custom hook for card layout management ---
  const { cardSections, handleRemoveSection, handleDragEnd: handleLayoutDragEnd } = useCardLayout(/* pass initial layout from profile here later */);
  // -----------------------------------------------------

  // --- Modal State (remains here for now, could be moved to useEditModal later) ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null); 
  const [modalInputValue, setModalInputValue] = useState('');
  const [modalLoading, setModalLoading] = useState(false); // Separate loading for modal save
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // State for avatar modal
  // --- End Modal State ---

  // Sensors (no change)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch User Data (Adjust to load initial layout later)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // TODO: Select and load card_layout from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*') 
          .eq('id', user.id)
          .single();
        if (error) {
           console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
          // TODO: Pass initial layout to useCardLayout hook
          // Example: If layout stored in data.card_layout
          // const initialLayout = data.card_layout || []; 
          // const { cardSections, ... } = useCardLayout(initialLayout); // Need to call hook conditionally or manage state update
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]); // Re-fetch if user changes

  // Redirect if not logged in (no change)
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  // handleSignOut (no change)
  const handleSignOut = async () => {
    // ... sign out logic ...
     try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Main loading state (no change)
  if (sessionLoading || loading) {
    return <div className="p-10">Loading...</div>;
  }

  // Modal Handlers (Keep here for now, update to use separate loading state)
  const openEditModal = (section) => {
    if (!profile) return;
    setEditingSection(section);
    setModalInputValue(profile[section.id] || ''); 
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSection(null);
    setModalInputValue(''); 
  };

  const handleModalSave = async () => {
    if (!editingSection || !user) return;
    const sectionId = editingSection.id;
    const newValue = modalInputValue;
    
    setModalLoading(true); // Use modal loading state
    try {
       const { data, error } = await supabase
        .from('profiles')
        .update({ [sectionId]: newValue, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single(); 

      if (error) {
        console.error('Error updating profile section:', error);
        alert(`Error saving ${editingSection.name}: ${error.message}`);
      } else {
        setProfile(data); // Update local profile state
        closeEditModal();
      }
    } catch (err) {
       console.error('Unexpected error saving section:', err);
       alert('An unexpected error occurred while saving.');
    } finally {
       setModalLoading(false);
    }
  };

  // Avatar Modal Handlers
  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const handleAvatarUploadSuccess = (newAvatarUrl) => {
    // Update the profile state locally so the PrysmaCard re-renders
    setProfile(prevProfile => ({
      ...prevProfile,
      avatar_url: newAvatarUrl
    }));
    // Optionally show a success message
  };

  // dnd-kit handlers (handleDragStart remains, handleDragEnd uses the hook's version)
  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  // handleDragEnd is now provided by the useCardLayout hook as handleLayoutDragEnd
  // const handleDragEnd = (event) => { ... MOVED TO HOOK ... };

  // handleRemoveSection is now provided by the useCardLayout hook
  // function handleRemoveSection(idToRemove) { ... MOVED TO HOOK ... };

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
              cardSections={cardSections} // Use state from the hook
              onRemoveSection={handleRemoveSection} // Use handler from the hook
              onEditSection={openEditModal}
              onAvatarClick={openAvatarModal}
            />
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