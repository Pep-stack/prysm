'use client'; // Hooks might be used in client components

import { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

// Default initial state if profile is null or has no sections
const DEFAULT_SECTIONS = [{ id: 'bio' }, { id: 'contact' }]; 

export function useCardLayout(profile) { // Accept profile object
  // Initialize state based on profile?.card_sections or default
  const [cardSections, setCardSections] = useState(() => {
    const initial = profile?.card_sections;
    // Ensure it's a valid array, otherwise use default
    return Array.isArray(initial) && initial.length > 0 ? initial : DEFAULT_SECTIONS;
  });

  // Effect to update local state if profile data changes externally
  useEffect(() => {
    const sectionsFromProfile = profile?.card_sections;
    if (Array.isArray(sectionsFromProfile)) {
        // Vereenvoudigde check: update alleen als de string-representatie anders is
        // Je kunt dit verfijnen indien nodig
        const currentIds = cardSections.map(s => s.id).join(',');
        const profileIds = sectionsFromProfile.map(s => s.id).join(',');
        if (profileIds !== currentIds) {
             console.log('Syncing local state FROM profile sections'); // Log voor debuggen
             setCardSections(sectionsFromProfile.length > 0 ? sectionsFromProfile : DEFAULT_SECTIONS);
        }
    } else {
        // Als profile geen sections heeft, zet default (tenzij al default)
        const defaultIds = DEFAULT_SECTIONS.map(s => s.id).join(',');
        const currentIds = cardSections.map(s => s.id).join(',');
        if (currentIds !== defaultIds) {
            console.log('Syncing local state TO default sections (profile empty)'); // Log voor debuggen
            setCardSections(DEFAULT_SECTIONS);
        }
    }
  }, [profile?.card_sections]); // <-- ALLEEN AFHANKELIJK VAN PROFILE DATA

  // Handler to remove a section from the card (only updates local state)
  const handleRemoveSection = useCallback((idToRemove) => {
    console.log(`Attempting to remove section with ID: ${idToRemove}`);
    setCardSections((prevSections) => {
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      console.log('New sections after filter:', newSections);
      return newSections;
    });
  }, []);

  // Handler for drag end (only updates local state)
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const droppingOnCard = over.id === 'prysma-card-dropzone';
    const isActiveOption = active.data.current?.type === 'card-option';

    // Case 1: Dropping a new section from the right column onto the card
    if (isActiveOption && droppingOnCard) {
      const droppedOption = active.data.current.option;
      setCardSections((prevSections) => {
        const isAlreadyAdded = prevSections.some(section => section.id === droppedOption.id);
        if (!isAlreadyAdded) {
          // Add only the ID (or necessary data) to the layout state
          const newSections = [...prevSections, { id: droppedOption.id }]; 
          // NO DB save here
          return newSections;
        } else {
          return prevSections;
        }
      });
      return;
    }
    
    // Case 2: Sorting sections already within the card
    setCardSections((prevSections) => {
        const isActiveSection = prevSections.some(section => section.id === active.id);
        const isOverCardArea = over.id === 'prysma-card-dropzone' || prevSections.some(section => section.id === over.id);
        
        if (isActiveSection && isOverCardArea && active.id !== over.id) {
            const oldIndex = prevSections.findIndex((item) => item.id === active.id);
            const overIsSection = prevSections.some(section => section.id === over.id);

            if (oldIndex !== -1 && overIsSection) { 
                const newIndex = prevSections.findIndex((item) => item.id === over.id);
                if (newIndex !== -1) {
                   const newSections = arrayMove(prevSections, oldIndex, newIndex);
                   // NO DB save here
                   return newSections;
                }
            }
        }
        return prevSections; 
    });

  }, []);

  // Return the state and the handlers
  return {
    cardSections, // The current layout state
    setCardSections,
    handleRemoveSection,
    handleDragEnd,
  };
} 