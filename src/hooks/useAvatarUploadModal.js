'use client';

import { useState, useCallback } from 'react';

// Note: The actual upload logic remains within AvatarUploadModal.js 
// because it needs direct access to the file input state (avatarFile).
// This hook primarily manages the open/close state and the success callback.

export function useAvatarUploadModal(onUploadSuccessCallback) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // This function will be passed to the AvatarUploadModal 
  // and called by it upon successful upload.
  const handleSuccess = useCallback((newAvatarUrl) => {
    if (onUploadSuccessCallback) {
      onUploadSuccessCallback(newAvatarUrl);
    }
    // Optionally: closeModal(); // Modal usually closes itself on success
  }, [onUploadSuccessCallback]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleSuccess, // Pass this as onUploadSuccess to the modal component
  };
} 