'use client';

import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';

export default function ProfileAvatarUploader({ user, currentAvatarUrl, onUploadSuccess }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState(null);
  const { isUploading, error, uploadFile, reset } = useFileUpload();

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setMessage(null);
    }
  };

  // Function to handle the upload process
  const handleUpload = async () => {
    if (!avatarFile || !user) return;
    setMessage(null);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      // Upload file to Supabase Storage
      await uploadFile(avatarFile, filePath);
      // Get the public URL
      const { data: urlData } = await import('../../lib/supabase').then(m => m.supabase.storage.from('avatars').getPublicUrl(filePath));
      if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL for avatar.');
      const newAvatarUrl = urlData.publicUrl;
      // Update the profile table
      const { error: updateError } = await import('../../lib/supabase').then(m => m.supabase.from('profiles').update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id));
      if (updateError) {
        // If DB update fails, try to remove the uploaded file
        await import('../../lib/supabase').then(m => m.supabase.storage.from('avatars').remove([filePath]));
        throw updateError;
      }
      onUploadSuccess(newAvatarUrl);
      setMessage('Avatar updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      setMessage(null);
      // error wordt automatisch door de hook gezet
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
          disabled={isUploading}
          // Basic styling, consider making it look nicer (e.g., custom button)
          style={{ display: 'block', margin: '10px auto' }}
        />
        <button
          type="button" // Important: prevent form submission if inside a form
          onClick={handleUpload}
          disabled={!avatarFile || isUploading}
          style={{
              backgroundColor: '#4CAF50', // Green
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              marginTop: '5px',
              opacity: (!avatarFile || isUploading) ? 0.5 : 1,
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload New Avatar'}
        </button>
         {/* Display local messages/errors for the uploader */} 
         {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
         {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      </div>
    </div>
  );
} 