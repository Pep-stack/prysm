'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

  const removeHeader = async () => {
    if (!currentHeaderUrl || !user) return;
    
    try {
      // Update the profile table to remove header_url
      const { error: updateError } = await import('../../lib/supabase').then(m => m.supabase.from('profiles').update({ header_url: null, updated_at: new Date().toISOString() }).eq('id', user.id));
      if (updateError) throw updateError;
      
      onUploadSuccess(null);
      setMessage('Header removed successfully!');
    } catch (err) {
      setMessage('Error removing header');
    }
  };

  return (
    <div style={{ 
      marginBottom: '30px', 
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827'
      }}>
        Header Image
      </h3>
      
      {/* Header Preview */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '120px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        border: '2px dashed #d1d5db',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {currentHeaderUrl ? (
          <>
            <Image 
              src={currentHeaderUrl} 
              alt="Profile Header" 
              fill
              style={{
                objectFit: 'cover'
              }}
            />
            <button
              onClick={removeHeader}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
            >
              ×
            </button>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
            No header image
          </div>
        )}
      </div>

      {/* File Input */}
      <div style={{ marginBottom: '16px' }}>
        <input 
          type="file" 
          id="header" 
          name="header" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange} 
          disabled={isUploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="header"
          style={{
            display: 'inline-block',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
            opacity: isUploading ? 0.5 : 1
          }}
        >
          {headerFile ? headerFile.name : 'Choose file'}
        </label>
      </div>

      {/* Upload Button */}
      {headerFile && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.6 : 1,
            transition: 'all 0.2s ease',
            marginBottom: '12px'
          }}
          onMouseOver={(e) => !isUploading && (e.target.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => !isUploading && (e.target.style.backgroundColor = '#3b82f6')}
        >
          {isUploading ? 'Uploading...' : 'Upload Header'}
        </button>
      )}

      {/* Messages */}
      {message && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '6px',
          fontSize: '14px',
          marginTop: '8px'
        }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          fontSize: '14px',
          marginTop: '8px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
} 