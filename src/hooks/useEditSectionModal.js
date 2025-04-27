'use client';

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path

export function useEditSectionModal(user, initialProfileData, onProfileUpdate) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null); 
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Optional: Local error state for the modal save operation

  const openModal = useCallback((section) => {
    if (!initialProfileData) return; // Need initial data to populate
    setEditingSection(section);
    setInputValue(initialProfileData[section.id] || ''); 
    setIsModalOpen(true);
    setError(null); // Clear previous errors
  }, [initialProfileData]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSection(null);
    setInputValue(''); 
    setError(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingSection || !user) return;
    
    const sectionId = editingSection.id;
    const newValue = inputValue;
    
    setIsLoading(true); 
    setError(null);
    try {
       const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ [sectionId]: newValue, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select() // Select the updated row
        .single(); 

      if (updateError) {
        throw updateError;
      }
      
      // Call the callback passed from the parent to update its profile state
      if (onProfileUpdate) {
         onProfileUpdate(data); // Pass the newly updated profile data
      }
      closeModal(); // Close modal on success

    } catch (err) {
       console.error('Error updating profile section:', err);
       setError(`Error saving ${editingSection.name}: ${err.message}`);
       // alert might be better handled in the component using the error state
    } finally {
       setIsLoading(false);
    }
  }, [editingSection, user, inputValue, closeModal, onProfileUpdate]);

  return {
    isModalOpen,
    editingSection,
    inputValue,
    isLoading,
    error, // Return error state
    openModal,
    closeModal,
    setInputValue, // Allow direct input changes
    handleSave,
  };
} 