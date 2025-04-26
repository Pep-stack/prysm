'use client'; // Hooks might be used in client components

import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

// Initial state can be loaded from props/API later
const INITIAL_SECTIONS = [];

export function useCardLayout(initialSections = INITIAL_SECTIONS) {
  const [cardSections, setCardSections] = useState(initialSections);

  // Handler to remove a section from the card
  const handleRemoveSection = useCallback((idToRemove) => {
    setCardSections((prevSections) => {
      const newSections = prevSections.filter((section) => section.id !== idToRemove);
      // TODO: Save updated layout (new array without removed section) to DB
      // saveLayoutToDb(newSectionsArray);
      return newSections;
    });
  }, []); // Dependency array is empty as it only uses setCardSections

  // Handler for drag end - manages adding new sections and sorting existing ones
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      return; // Dropped outside any container
    }
    
    // Determine if we are dropping onto the main card dropzone
    const droppingOnCard = over.id === 'prysma-card-dropzone';

    // Case 1: Dropping a new section from the right column onto the card
    const isActiveOption = active.data.current?.type === 'card-option';

    if (isActiveOption && droppingOnCard) {
      const droppedOption = active.data.current.option;

      setCardSections((prevSections) => {
        const isAlreadyAdded = prevSections.some(section => section.id === droppedOption.id);

        if (!isAlreadyAdded) {
          const newSections = [...prevSections, droppedOption];
          // TODO: Save new layout to DB
          // saveLayoutToDb(newSections);
          return newSections;
        } else {
          return prevSections; // Return previous state if already added
        }
      });
      return; // Handled adding new section
    }
    
    // Case 2: Sorting sections already within the card
    setCardSections((prevSections) => {
        const isActiveSection = prevSections.some(section => section.id === active.id);
        // Check if dropping over the card zone OR another section within the card
        const isOverCardArea = over.id === 'prysma-card-dropzone' || prevSections.some(section => section.id === over.id);
        
        if (isActiveSection && isOverCardArea && active.id !== over.id) {
            const oldIndex = prevSections.findIndex((item) => item.id === active.id);
            // Ensure we are dropping over another *section*, not just the container background
            const overIsSection = prevSections.some(section => section.id === over.id);

            if (oldIndex !== -1 && overIsSection) { 
                const newIndex = prevSections.findIndex((item) => item.id === over.id);
                if (newIndex !== -1) {
                   const newSections = arrayMove(prevSections, oldIndex, newIndex);
                   // TODO: Save new layout to DB
                   // saveLayoutToDb(newSections);
                   return newSections;
                }
            }
        }
        return prevSections; 
    });

  }, []); // Dependency array is empty as logic depends only on state setters or doesn't change

  // Return the state and the handlers
  return {
    cardSections,
    handleRemoveSection,
    handleDragEnd,
    // We could also return setCardSections if needed directly, but handlers are cleaner
  };
} 