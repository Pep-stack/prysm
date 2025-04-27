'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Adjusted path

export default function ProfileAvatarUploader({ user, currentAvatarUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Local message state for this component

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setError(null); // Clear previous errors on new file selection
      setMessage(null);
    }
  };

  // Function to handle the upload process
  const handleUpload = async () => {
    if (!avatarFile || !user) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      // --- Optional: Delete existing avatar --- 
      // This requires careful handling, ensure the URL is correct
      // const currentFileName = currentAvatarUrl?.split('/').pop();
      // if (currentFileName) {
      //   try {
      //      await supabase.storage.from('avatars').remove([currentFileName]);
      //   } catch (removeError) {
      //       console.warn("Could not remove old avatar, proceeding with upload:", removeError);
      //   }
      // }
      // --- End Optional Delete ---

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`; // Unique filename
      const filePath = `${fileName}`;

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { 
            cacheControl: '3600', 
            upsert: false // Important if not deleting old file first
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
      if (!urlData || !urlData.publicUrl) {
         throw new Error("Could not get public URL for avatar.");
      }
      const newAvatarUrl = urlData.publicUrl;

      // Update the profile table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        // If DB update fails, try to remove the uploaded file
        try {
           await supabase.storage.from('avatars').remove([filePath]);
        } catch (cleanupError) {
           console.error("Failed to clean up orphaned avatar file:", cleanupError);
        }
        throw updateError;
      }

      // Call the success callback passed from the parent
      onUploadSuccess(newAvatarUrl);
      setMessage('Avatar updated successfully!');
      setAvatarFile(null); // Clear the selected file input

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(`Avatar upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '15px' }}>Profile Picture</h2>
      <img 
        src={currentAvatarUrl || 'https://via.placeholder.com/150'} // Use passed prop
        alt="Profile Avatar" 
        style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          objectFit: 'cover', 
          marginBottom: '15px',
          border: '2px solid #eee', 
          display: 'inline-block'
        }} 
      />
      <div>
        <input 
          type="file" 
          id="avatar" 
          name="avatar" 
          accept="image/png, image/jpeg" 
          onChange={handleFileChange} 
          disabled={uploading}
          // Basic styling, consider making it look nicer (e.g., custom button)
          style={{ display: 'block', margin: '10px auto' }}
        />
        <button
          type="button" // Important: prevent form submission if inside a form
          onClick={handleUpload}
          disabled={!avatarFile || uploading}
          style={{
              backgroundColor: '#4CAF50', // Green
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              marginTop: '5px',
              opacity: (!avatarFile || uploading) ? 0.5 : 1,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload New Avatar'}
        </button>
         {/* Display local messages/errors for the uploader */} 
         {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
         {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      </div>
    </div>
  );
} 