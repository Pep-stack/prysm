'use client';

import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';

export default function ProfileHeaderUploader({ user, currentHeaderUrl, onUploadSuccess }) {
  const [headerFile, setHeaderFile] = useState(null);
  const [message, setMessage] = useState(null);
  const { isUploading, error, uploadFile, reset } = useFileUpload();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setHeaderFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!headerFile || !user) return;
    setMessage(null);
    try {
      const fileExt = headerFile.name.split('.').pop();
      const fileName = `header-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      // Upload file to Supabase Storage (headers bucket)
      await uploadFile(headerFile, filePath);
      // Get the public URL
      const { data: urlData } = await import('../../lib/supabase').then(m => m.supabase.storage.from('headers').getPublicUrl(filePath));
      if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL for header.');
      const newHeaderUrl = urlData.publicUrl;
      // Update the profile table
      const { error: updateError } = await import('../../lib/supabase').then(m => m.supabase.from('profiles').update({ header_url: newHeaderUrl, updated_at: new Date().toISOString() }).eq('id', user.id));
      if (updateError) {
        await import('../../lib/supabase').then(m => m.supabase.storage.from('headers').remove([filePath]));
        throw updateError;
      }
      onUploadSuccess(newHeaderUrl);
      setMessage('Header updated successfully!');
      setHeaderFile(null);
    } catch (err) {
      setMessage(null);
      // error wordt automatisch door de hook gezet
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
          disabled={isUploading}
          style={{ display: 'block', margin: '10px 0' }} // Adjust styling
        />
        <button
          type="button" 
          onClick={handleUpload}
          disabled={!headerFile || isUploading}
          style={{
              backgroundColor: '#4CAF50', // Green
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              marginTop: '5px',
              opacity: (!headerFile || isUploading) ? 0.5 : 1,
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload New Header'}
        </button>
         {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
} 