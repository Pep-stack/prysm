'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AvatarUploadModal({ isOpen, onClose, onUploadSuccess, user }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Reset state when modal opens/closes or file changes
  useEffect(() => {
    if (!isOpen) {
      setAvatarFile(null);
      setUploading(false);
      setError(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(avatarFile);
    } else {
      setPreviewUrl(null);
    }
    // Cleanup function to revoke object URL if needed
    return () => {
       if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
       } 
    };
  }, [avatarFile]); // Dependency should be avatarFile

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setError(null); // Clear previous errors
    }
  };

  const handleUpload = async () => {
    if (!avatarFile || !user) return;

    setUploading(true);
    setError(null);

    try {
      // --- Check for existing avatar and delete (optional but recommended) --- 
      // You might need to fetch the current avatar_url first if not easily available
      // const { data: profileData } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
      // const currentPath = profileData?.avatar_url?.split('/').pop(); 
      // if (currentPath) { ... supabase.storage.from('avatars').remove([currentPath]) ... } 
      // --- End optional delete --- 

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { 
            cacheControl: '3600', // Optional: cache control
            upsert: false // Set to true if you want to overwrite files with the same name (use with caution without deleting old files)
        });

      if (uploadError) {
        // Handle potential duplicate file name error if upsert is false
        // or other storage errors
        throw uploadError;
      }

      // Get public URL of the uploaded file
      const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
      if (!urlData || !urlData.publicUrl) {
         throw new Error("Could not get public URL for avatar.");
      }
      const newAvatarUrl = urlData.publicUrl;

      // Update profile table with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        // If DB update fails, potentially remove the just uploaded file
        await supabase.storage.from('avatars').remove([filePath]);
        throw updateError;
      }

      // Notify parent component of success
      onUploadSuccess(newAvatarUrl);
      onClose(); // Close modal on success

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(`Avatar upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  // Basic Modal Styling (consider using a dedicated modal library or CSS classes)
  const modalStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's above other content
  };

  const contentStyle = {
    background: 'white', 
    padding: '30px', 
    borderRadius: '8px', 
    maxWidth: '400px', 
    width: '90%',
    textAlign: 'center',
  };

  const previewStyle = {
    width: '100px', 
    height: '100px', 
    borderRadius: '50%', 
    objectFit: 'cover',
    marginBottom: '15px',
    border: '1px solid #eee',
    display: 'block',
    margin: '0 auto 15px auto', // Center the preview
    backgroundColor: '#f0f0f0', // Placeholder background
  };

  return (
    <div style={modalStyle} onClick={onClose}> {/* Close on overlay click */} 
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside content */} 
        <h2>Upload New Avatar</h2>
        
        {previewUrl && (
          <img src={previewUrl} alt="Avatar Preview" style={previewStyle} />
        )}
        {!previewUrl && (
           <div style={previewStyle}></div> // Placeholder div
        )}

        <input 
          type="file" 
          id="avatar-upload" 
          accept="image/png, image/jpeg" 
          onChange={handleFileChange} 
          disabled={uploading}
          style={{ display: 'block', margin: '15px auto' }}
        />
        
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleUpload}
            disabled={!avatarFile || uploading}
            style={{
                backgroundColor: '#4CAF50', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                marginRight: '10px',
                opacity: (!avatarFile || uploading) ? 0.5 : 1,
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
             style={{
                backgroundColor: '#f44336', // Red
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                opacity: uploading ? 0.5 : 1,
             }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 