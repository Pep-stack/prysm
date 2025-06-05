'use client';

import React, { useState, useEffect } from 'react';
import { LuUpload, LuX, LuPlay, LuImage, LuLoader } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket } from '../../lib/supabase-storage-setup';

export default function ProjectSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image', // 'image' or 'video'
    demoUrl: '',
    codeUrl: '',
    technologies: [],
    startDate: '',
    endDate: '',
    status: 'completed',
    category: ''
  });

  // Add CSS animation globally once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes prysm-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .prysm-spin {
        animation: prysm-spin 1s linear infinite;
        transform-origin: center;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      title: '',
      description: '',
      mediaUrl: '',
      mediaType: 'image',
      demoUrl: '',
      codeUrl: '',
      technologies: [],
      startDate: '',
      endDate: '',
      status: 'completed',
      category: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.description) {
      const updatedProjects = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedProjects);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        description: '',
        mediaUrl: '',
        mediaType: 'image',
        demoUrl: '',
        codeUrl: '',
        technologies: [],
        startDate: '',
        endDate: '',
        status: 'completed',
        category: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedProjects = [...value];
    updatedProjects[index] = updatedEntry;
    onChange(updatedProjects);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedProjects = value.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Projects & Portfolio:
      </label>

      {/* Existing Project Entries */}
      {value.map((entry, index) => (
        <ProjectEntry
          key={entry.id || index}
          entry={entry}
          index={index}
          isEditing={editingIndex === index}
          onEdit={() => handleEdit(index)}
          onSave={(updatedEntry) => handleSaveEdit(index, updatedEntry)}
          onDelete={() => handleDelete(index)}
          onCancel={handleCancel}
        />
      ))}

      {/* Add New Entry */}
      {editingIndex === 'new' ? (
        <ProjectEntry
          entry={newEntry}
          isEditing={true}
          isNew={true}
          onSave={handleSaveNew}
          onCancel={handleCancel}
          onChange={setNewEntry}
        />
      ) : (
        <button
          onClick={handleAddNew}
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8f9fa',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            color: '#6c757d',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s ease',
            marginTop: value.length > 0 ? '12px' : '0'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e9ecef';
            e.target.style.borderColor = '#adb5bd';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.borderColor = '#dee2e6';
          }}
        >
          + Add Project
        </button>
      )}
    </div>
  );
}

function ProjectEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const [localEntry, setLocalEntry] = useState(entry);
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [forceRender, setForceRender] = useState(0); // Force re-render trigger

  // Sync localEntry with entry prop
  useEffect(() => {
    console.log('🔄 Entry prop changed, syncing localEntry:', { 
      newEntry: entry, 
      currentLocalEntry: localEntry 
    });
    setLocalEntry(entry);
  }, [entry]);

  // Debug effect to monitor localEntry changes
  useEffect(() => {
    console.log('🔄 LocalEntry state changed:', {
      localEntry: { ...localEntry },
      hasMediaUrl: !!localEntry.mediaUrl,
      mediaUrl: localEntry.mediaUrl
    });
  }, [localEntry]);

  const handleInputChange = (field, value) => {
    console.log('🔄 handleInputChange called:', { field, value, currentLocalEntry: { ...localEntry } });
    
    const updated = { ...localEntry, [field]: value };
    
    console.log('🔄 Updated entry:', { updated, field, value });
    
    setLocalEntry(updated);
    
    // Force re-render when mediaUrl changes
    if (field === 'mediaUrl') {
      setForceRender(prev => prev + 1);
      console.log('🔄 Forcing re-render for mediaUrl change');
    }
    
    if (onChange) {
      console.log('🔄 Calling parent onChange with:', updated);
      onChange(updated);
    }
    
    // Small delay to check if state was updated
    setTimeout(() => {
      console.log('🔄 State after update (delayed check):', { 
        field, 
        value, 
        currentLocalEntry: localEntry,
        expectedValue: value 
      });
    }, 100);
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !localEntry.technologies.includes(techInput.trim())) {
      const updated = { 
        ...localEntry, 
        technologies: [...localEntry.technologies, techInput.trim()] 
      };
      setLocalEntry(updated);
      if (onChange) onChange(updated);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    const updated = { 
      ...localEntry, 
      technologies: localEntry.technologies.filter(tech => tech !== techToRemove) 
    };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  // ✅ FIXED: Real file upload to Supabase Storage
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🔄 Starting file upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setIsUploading(true);
    setUploadError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload files');
      }

      console.log('👤 User authenticated:', user.id);

      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 50MB');
      }

      // Check file type
      const allowedTypes = ['image/', 'video/'];
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        throw new Error('Only image and video files are allowed');
      }

      // Try multiple bucket strategies
      let uploadResult = null;
      let finalBucketName = null;

      // Strategy 1: Try project-media bucket
      try {
        console.log('🗂️ Trying strategy 1: project-media bucket');
        const bucketName = 'project-media';
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        console.log('📂 Upload details:', { bucketName, fileName });

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!error && data) {
          uploadResult = { data, fileName };
          finalBucketName = bucketName;
          console.log('✅ Strategy 1 SUCCESS:', { data, fileName });
        } else {
          console.log('❌ Strategy 1 FAILED:', error);
        }
      } catch (err) {
        console.log('❌ Strategy 1 EXCEPTION:', err.message);
      }

      // Strategy 2: Try uploads bucket if project-media failed
      if (!uploadResult) {
        try {
          console.log('🗂️ Trying strategy 2: uploads bucket');
          const bucketName = 'uploads';
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('📂 Upload details:', { bucketName, fileName });

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!error && data) {
            uploadResult = { data, fileName };
            finalBucketName = bucketName;
            console.log('✅ Strategy 2 SUCCESS:', { data, fileName });
          } else {
            console.log('❌ Strategy 2 FAILED:', error);
          }
        } catch (err) {
          console.log('❌ Strategy 2 EXCEPTION:', err.message);
        }
      }

      // Strategy 3: Try any available bucket
      if (!uploadResult) {
        console.log('🗂️ Trying strategy 3: dynamic bucket detection');
        const bucketName = await getAvailableBucket();
        if (bucketName) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('📂 Upload details:', { bucketName, fileName });

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!error && data) {
            uploadResult = { data, fileName };
            finalBucketName = bucketName;
            console.log('✅ Strategy 3 SUCCESS:', { data, fileName });
          } else {
            console.log('❌ Strategy 3 FAILED:', error);
          }
        }
      }

      if (!uploadResult || !finalBucketName) {
        throw new Error('All upload strategies failed. Please check Supabase Storage configuration and RLS policies.');
      }

      console.log('📡 Getting public URL for:', { bucket: finalBucketName, fileName: uploadResult.fileName });

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(finalBucketName)
        .getPublicUrl(uploadResult.fileName);

      console.log('🔗 Public URL received:', publicUrl);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Update local entry with real URL
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      
      console.log('🔄 Updating local entry:', {
        mediaUrl: publicUrl,
        mediaType: mediaType,
        localEntryBefore: { ...localEntry }
      });

      handleInputChange('mediaUrl', publicUrl);
      handleInputChange('mediaType', mediaType);

      console.log('🔄 After handleInputChange, localEntry should be:', {
        ...localEntry,
        mediaUrl: publicUrl,
        mediaType: mediaType
      });

      console.log('✅ File uploaded successfully:', { 
        publicUrl, 
        bucketName: finalBucketName, 
        fileName: uploadResult.fileName,
        mediaType
      });

      // Force immediate UI update after successful upload
      setTimeout(() => {
        console.log('🔄 Force updating UI state after upload');
        setLocalEntry(prev => ({
          ...prev,
          mediaUrl: publicUrl,
          mediaType: mediaType
        }));
        setForceRender(prev => prev + 1);
      }, 100);

    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  const handleSave = () => {
    console.log('💾 handleSave called, checking localEntry:', {
      localEntry: { ...localEntry },
      hasTitle: !!localEntry.title,
      hasDescription: !!localEntry.description,
      hasMedia: !!localEntry.mediaUrl,
      mediaUrl: localEntry.mediaUrl,
      mediaType: localEntry.mediaType
    });
    
    if (localEntry.title && localEntry.description) {
      console.log('✅ Validation passed, calling onSave with:', localEntry);
      onSave(localEntry);
    } else {
      console.log('❌ Validation failed:', {
        missingTitle: !localEntry.title,
        missingDescription: !localEntry.description
      });
    }
  };

  if (isEditing) {
    return (
      <div style={{
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        marginBottom: '16px'
      }}>
        {/* Title and Description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Project Title *
            </label>
            <input
              type="text"
              value={localEntry.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="My Awesome Project"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Description *
            </label>
            <textarea
              value={localEntry.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your project..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
          </div>
        </div>

        {/* Media Upload */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Project Image/Video *
          </label>
          
          {/* Upload Error Message */}
          {uploadError && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '12px',
              marginBottom: '8px'
            }}>
              {uploadError}
            </div>
          )}
          
          {/* DEBUG: Always log current state */}
          {console.log('🖼️ Current render state:', {
            hasMediaUrl: !!localEntry.mediaUrl,
            mediaUrl: localEntry.mediaUrl,
            mediaType: localEntry.mediaType,
            forceRender: forceRender,
            isUploading: isUploading
          })}
          
          {(localEntry.mediaUrl && localEntry.mediaUrl.length > 0) ? (
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              {/* DEBUG: Log current media state */}
              {console.log('🖼️ Rendering media preview:', {
                mediaUrl: localEntry.mediaUrl,
                mediaType: localEntry.mediaType,
                isVideo: localEntry.mediaType === 'video'
              })}
              
              {localEntry.mediaType === 'video' ? (
                <video
                  src={localEntry.mediaUrl}
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                  controls
                  onLoadStart={() => console.log('🎬 Video load started')}
                  onLoad={() => console.log('✅ Video loaded successfully')}
                  onError={(e) => console.error('❌ Video load error:', e)}
                />
              ) : (
                <img
                  src={localEntry.mediaUrl}
                  alt="Project preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                  onLoad={() => console.log('✅ Image loaded successfully:', localEntry.mediaUrl)}
                  onError={(e) => console.error('❌ Image load error:', e, 'URL:', localEntry.mediaUrl)}
                />
              )}
              <button
                onClick={() => {
                  console.log('🗑️ Removing media:', localEntry.mediaUrl);
                  handleInputChange('mediaUrl', '');
                  handleInputChange('mediaType', 'image');
                  setUploadError(null);
                }}
                disabled={isUploading}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isUploading ? 0.5 : 1
                }}
              >
                <LuX size={12} />
              </button>
            </div>
          ) : (
            <div style={{
              border: `2px dashed ${isUploading ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: isUploading ? '#f0f9ff' : '#f9fafb',
              position: 'relative'
            }}>
              {isUploading ? (
                <>
                  <LuLoader 
                    size={24} 
                    style={{ 
                      color: '#3b82f6', 
                      marginBottom: '8px',
                      animation: 'prysm-spin 1s linear infinite',
                      transformOrigin: 'center',
                      display: 'inline-block'
                    }} 
                  />
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>
                    Uploading file...
                  </p>
                </>
              ) : (
                <>
                  <LuUpload size={24} style={{ color: '#6b7280', marginBottom: '8px' }} />
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>
                    Upload project image or video
                  </p>
                </>
              )}
              
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
                id={`media-upload-${index || 'new'}`}
              />
              <label
                htmlFor={`media-upload-${index || 'new'}`}
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  backgroundColor: isUploading ? '#94a3b8' : '#3b82f6',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '6px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.7 : 1,
                  pointerEvents: isUploading ? 'none' : 'auto'
                }}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
          )}
          
          {/* Alternative: URL Input */}
          <div style={{ marginTop: '8px' }}>
            <input
              type="url"
              value={localEntry.mediaUrl}
              onChange={(e) => {
                handleInputChange('mediaUrl', e.target.value);
                setUploadError(null);
              }}
              disabled={isUploading}
              placeholder="Or paste image/video URL here..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                opacity: isUploading ? 0.5 : 1,
                cursor: isUploading ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Demo URL
            </label>
            <input
              type="url"
              value={localEntry.demoUrl}
              onChange={(e) => handleInputChange('demoUrl', e.target.value)}
              placeholder="https://myproject.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Code URL
            </label>
            <input
              type="url"
              value={localEntry.codeUrl}
              onChange={(e) => handleInputChange('codeUrl', e.target.value)}
              placeholder="https://github.com/user/repo"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Technologies */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Technologies Used
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
              placeholder="React, Node.js, etc."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              type="button"
              onClick={handleAddTechnology}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {localEntry.technologies.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '6px'
                }}
              >
                {tech}
                <button
                  onClick={() => handleRemoveTechnology(tech)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3730a3',
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: '4px'
                  }}
                >
                  <LuX size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Dates and Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Start Date
            </label>
            <input
              type="month"
              value={localEntry.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              End Date
            </label>
            <input
              type="month"
              value={localEntry.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Status
            </label>
            <select
              value={localEntry.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Category (Optional)
          </label>
          <input
            type="text"
            value={localEntry.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Web App, Mobile App, Design, etc."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!localEntry.title || !localEntry.description}
            style={{
              padding: '8px 16px',
              backgroundColor: localEntry.title && localEntry.description ? '#059669' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: localEntry.title && localEntry.description ? 'pointer' : 'not-allowed'
            }}
          >
            {isNew ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      marginBottom: '12px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {entry.title}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
            {entry.description}
          </p>
          
          {/* Media Preview */}
          {entry.mediaUrl && (
            <div style={{ marginBottom: '8px' }}>
              {entry.mediaType === 'video' ? (
                <video
                  src={entry.mediaUrl}
                  style={{
                    width: '100%',
                    maxHeight: '120px',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                  muted
                />
              ) : (
                <img
                  src={entry.mediaUrl}
                  alt={entry.title}
                  style={{
                    width: '100%',
                    maxHeight: '120px',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                />
              )}
            </div>
          )}

          {/* Technologies */}
          {entry.technologies && entry.technologies.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {entry.technologies.slice(0, 5).map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {entry.technologies.length > 5 && (
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>
                    +{entry.technologies.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {entry.demoUrl && (
            <a
              href={entry.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 12px',
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '4px',
                fontSize: '12px',
                textDecoration: 'none',
                color: '#1d4ed8'
              }}
            >
              Demo
            </a>
          )}
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#dc2626'
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {(entry.startDate || entry.endDate) && (
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
          {entry.startDate && new Date(entry.startDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {entry.startDate && entry.endDate && ' - '}
          {entry.endDate && new Date(entry.endDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          padding: '2px 6px',
          backgroundColor: entry.status === 'completed' ? '#d1fae5' : 
                          entry.status === 'ongoing' ? '#dbeafe' : 
                          entry.status === 'paused' ? '#fef3c7' : '#f3f4f6',
          color: entry.status === 'completed' ? '#059669' : 
                 entry.status === 'ongoing' ? '#0284c7' : 
                 entry.status === 'paused' ? '#d97706' : '#6b7280',
          fontSize: '11px',
          fontWeight: '500',
          borderRadius: '4px'
        }}>
          {entry.status}
        </span>
        {entry.category && (
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {entry.category}
          </span>
        )}
      </div>
    </div>
  );
} 