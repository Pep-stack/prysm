'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjusted path

export default function ProfileHeaderUploader({ user, currentHeaderUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [headerFile, setHeaderFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setHeaderFile(e.target.files[0]);
      setError(null);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!headerFile || !user) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      // --- Optional: Delete existing header --- 
      // const currentFileName = currentHeaderUrl?.split('/').pop();
      // if (currentFileName) {
      //    await supabase.storage.from('headers').remove([currentFileName]);
      // }
      // --- End Optional Delete ---

      const fileExt = headerFile.name.split('.').pop();
      const fileName = `header-${user.id}-${Date.now()}.${fileExt}`; // Unique filename
      const filePath = `${fileName}`;

      // Upload the new file to the 'headers' bucket
      const { error: uploadError } = await supabase.storage
        .from('headers') 
        .upload(filePath, headerFile, { 
            cacheControl: '3600', 
            upsert: false 
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
          .from('headers')
          .getPublicUrl(filePath);
          
      if (!urlData || !urlData.publicUrl) {
         throw new Error("Could not get public URL for header.");
      }
      const newHeaderUrl = urlData.publicUrl;

      // Update the profile table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ header_url: newHeaderUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        // Cleanup storage if DB update fails
        try { await supabase.storage.from('headers').remove([filePath]); } catch (e) {}
        throw updateError;
      }

      // Call the success callback
      onUploadSuccess(newHeaderUrl);
      setMessage('Header updated successfully!');
      setHeaderFile(null); // Clear the selected file

    } catch (error) {
      console.error('Error uploading header:', error);
      setError(`Header upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Basic styling for the uploader section
  const previewStyle = {
     display: 'block',
     width: '100%', // Make preview wider for header
     height: '100px', // Adjust height as needed
     objectFit: 'cover',
     backgroundColor: '#e0e0e0', // Placeholder color
     marginBottom: '15px',
     border: '1px solid #ccc',
  };

  return (
    <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
      <h2 style={{ marginBottom: '15px' }}>Profile Header Image</h2>
      {/* Display current or placeholder header */} 
      <img 
        src={currentHeaderUrl || 'https://via.placeholder.com/600x100?text=Upload+Header'} 
        alt="Profile Header Preview" 
        style={previewStyle} 
      />
      <div>
        <input 
          type="file" 
          id="header" 
          name="header" 
          accept="image/png, image/jpeg, image/webp" // Allow relevant types
          onChange={handleFileChange} 
          disabled={uploading}
          style={{ display: 'block', margin: '10px 0' }} // Adjust styling
        />
        <button
          type="button" 
          onClick={handleUpload}
          disabled={!headerFile || uploading}
          style={{
              backgroundColor: '#4CAF50', // Green
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              marginTop: '5px',
              opacity: (!headerFile || uploading) ? 0.5 : 1,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload New Header'}
        </button>
         {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
} 