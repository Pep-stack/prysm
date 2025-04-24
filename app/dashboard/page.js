'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSession } from '../../src/components/SessionProvider';
import PrysmaCard from '../../src/components/PrysmaCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import the moved components
import DraggableCardOptionsContainer from '../../src/components/DraggableCardOptionsContainer';
import EditSectionModal from '../../src/components/EditSectionModal';

export default function DashboardPage() {
  const { user, loading: sessionLoading, signOut } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [activeId, setActiveId] = useState(null);
  const [cardSections, setCardSections] = useState([]);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalInputValue, setModalInputValue] = useState('');
  // --- End Modal State ---

  // Sensors now include keyboard coordinates for sortable
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Check if the user is authenticated and fetch profile
    const fetchUserData = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) console.error('Error fetching profile:', error);
        else setProfile(data);
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Handler to remove a section from the card
  function handleRemoveSection(idToRemove) {
    console.log("Removing section:", idToRemove);
    setCardSections((prevSections) => 
      prevSections.filter((section) => section.id !== idToRemove)
    );
  }

  // dnd-kit handlers
  function handleDragStart(event) {
    setActiveId(event.active.id);
    console.log("Drag started:", event.active.id, event.active.data.current);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    
    // Reset activeId immediately
    setActiveId(null);
    
    if (!over) {
      console.log("Drag ended outside any droppable area.");
      return; // Dropped outside any container
    }
    
    console.log("Drag ended. Active:", active.id, "Over:", over.id, "Over data:", over.data.current);

    // Case 1: Dropping new section
    if (active.data.current?.type === 'card-option' && over.id === 'prysma-card-dropzone') {
      const droppedOption = active.data.current.option;
      const isAlreadyAdded = cardSections.some(section => section.id === droppedOption.id);
      if (!isAlreadyAdded) {
        const newSections = [...cardSections, droppedOption];
        setCardSections(newSections);
        // TODO: Save new layout to DB
        // saveLayoutToDb(newSections);
      } else {
        // Escape alert message
        alert(`${droppedOption.name} is already on your card.`);
      }
      return;
    }
    
    // Case 2: Sorting sections already within the card
    // Ensure both active and over items are within the sortable context (have the same parent or similar logic)
    // For simplicity, we check if active.id is one of the cardSections ids and over.id is the dropzone or another section id
    const isActiveSection = cardSections.some(section => section.id === active.id);
    const isOverCardArea = over.id === 'prysma-card-dropzone' || cardSections.some(section => section.id === over.id);
    
    if (isActiveSection && isOverCardArea && active.id !== over.id) {
        console.log(`Reordering section ${active.id} over ${over.id}`);
        setCardSections((sections) => {
          const oldIndex = sections.findIndex((item) => item.id === active.id);
          // Find index of the item we are dropping over. If dropping on the container, find the last index? 
          // It's often simpler if the droppable area itself isn't sortable, only the items within.
          // Let's refine: Check if 'over' is a sortable item itself.
          const overIsSection = cardSections.some(section => section.id === over.id);
          if (oldIndex !== -1 && overIsSection) { 
            const newIndex = sections.findIndex((item) => item.id === over.id);
            if (newIndex !== -1) {
               const newSections = arrayMove(sections, oldIndex, newIndex);
               return newSections;
            }
          }
          // If dropping onto the main dropzone container instead of another item, 
          // perhaps don't reorder or append to end (depending on desired UX)
          // For now, we only reorder when dropping over another existing section.
          return sections; // Return original array if drop wasn't valid for reordering
        });
    }
  }

  // --- Modal Handlers ---
  const openEditModal = (section) => {
    if (!profile) return; // Need profile data
    console.log("Opening modal for:", section);
    setEditingSection(section);
    // Initialize input value with current profile data for that section
    setModalInputValue(profile[section.id] || ''); 
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setModalInputValue(''); // Clear input value on close
  };

  const handleModalSave = async () => {
    if (!editingSection || !user) return;
    
    const sectionId = editingSection.id;
    const newValue = modalInputValue;
    
    console.log(`Saving ${sectionId}: ${newValue}`);
    
    // --- Update Supabase --- (Actual DB update)
    try {
       setLoading(true); // Indicate loading state
       const { data, error } = await supabase
        .from('profiles')
        .update({ 
          [sectionId]: newValue, // Dynamic key update
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select() // Select the updated profile data
        .single(); 

      if (error) {
        console.error('Error updating profile section:', error);
        alert(`Error saving ${editingSection.name}: ${error.message}`);
      } else {
        console.log('Update successful, new profile data:', data);
        // --- Update local profile state --- 
        setProfile(data); 
        closeEditModal();
        // Optional: Add success message/toast
      }
    } catch (err) {
       console.error('Unexpected error saving section:', err);
       alert('An unexpected error occurred while saving.');
    } finally {
       setLoading(false);
    }
    // --- End Update Supabase ---
  };
  // --- End Modal Handlers ---

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div 
        style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }} 
        onClick={() => console.log('Dashboard Page main div clicked!')}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1>Dashboard</h1>
          <button 
            onClick={(e) => { e.stopPropagation(); handleSignOut(); }}
            style={{ 
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ flex: 1 }}>
            <h2>Your Prysma Profile Card</h2>
            <p style={{ marginBottom: '20px' }}>
              Drag sections from the right onto the card below. Drag sections within the card to reorder. Click 'X' to remove a section. Click a section to edit.
            </p>
            
            <PrysmaCard 
              profile={profile} 
              user={user} 
              cardSections={cardSections} 
              onRemoveSection={handleRemoveSection}
              onEditSection={openEditModal}
            />
          </div>

          <div style={{ flex: 1, border: '1px dashed #ccc', padding: '20px', borderRadius: '8px' }}>
            <h2>Build Your Card</h2>
            <p>Available Sections:</p>
            <DraggableCardOptionsContainer />
          </div>
        </div>
      </div>
      
      <EditSectionModal 
        isOpen={isModalOpen}
        onClose={closeEditModal}
        section={editingSection}
        value={modalInputValue}
        onChange={setModalInputValue}
        onSave={handleModalSave}
      />
    </DndContext>
  );
} 