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
    // Use section.type instead of section.id for database column lookup
    setInputValue(initialProfileData[section.type] || ''); 
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
    
    // Use section.type as the database column name instead of section.id
    const sectionType = editingSection.type;
    
    // Process value BEFORE sending to Supabase
    let valueToSave = inputValue;
    if (sectionType === 'languages' && Array.isArray(inputValue)) {
      valueToSave = inputValue.join(','); // Join array into comma-separated string
    }
    
    setIsLoading(true); 
    setError(null);
    try {
       const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ [sectionType]: valueToSave, updated_at: new Date().toISOString() }) // Use sectionType as column name
        .eq('id', user.id)
        .select() // Select the updated row
        .single(); 

      if (updateError) {
        throw updateError;
      }
      
      // Call the callback passed from the parent to update its profile state
      if (onProfileUpdate) {
         // IMPORTANT: Pass back the *original* input value if it was an array,
         // so the parent state (and LanguageSelector) gets the correct format.
         // The 'data' returned from Supabase will have the string version.
         const updatedProfileData = { ...data };
         if (sectionType === 'languages') {
            updatedProfileData[sectionType] = inputValue; // Restore the array format for local state
         }
         onProfileUpdate(updatedProfileData); 
      }
      closeModal(); // Close modal on success

    } catch (err) {
        // Log het hele error object en response indien aanwezig
        console.error('Error updating profile section:', err, err?.response?.data, err?.message);

        // Zoek een bruikbare error message
        let errorMsg = 'Unknown error';
        if (err?.response?.data?.message) {
            errorMsg = err.response.data.message;
        } else if (err?.response?.data?.error) {
            errorMsg = err.response.data.error;
        } else if (err?.message) {
            errorMsg = err.message;
        } else if (typeof err === 'string') {
            errorMsg = err;
        } else if (err?.toString) {
            errorMsg = err.toString();
        }

        setError(`Error saving ${editingSection.name}: ${errorMsg}`);
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