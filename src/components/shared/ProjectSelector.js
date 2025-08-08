'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LuUpload, LuX, LuPlay, LuImage, LuLoader, LuFolderOpen } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket, diagnoseStorageSetup, findWorkingBucket } from '../../lib/supabase-storage-setup';

// Global debug function for console
if (typeof window !== 'undefined') {
  window.debugPortfolioStorage = async () => {
    console.log('🔍 Diagnosing portfolio storage setup...');
    const results = await diagnoseStorageSetup();
    
    console.log('📊 Diagnosis Results:');
    results.forEach(result => {
      const emoji = result.type === 'success' ? '✅' : 
                   result.type === 'warning' ? '⚠️' : 
                   result.type === 'error' ? '❌' : 'ℹ️';
      console.log(`${emoji} ${result.message}`);
      if (result.action) {
        console.log(`   🔧 Action: ${result.action}`);
      }
    });
    
    if (results.some(r => r.type === 'error')) {
      console.log('\n📚 For detailed fix instructions, see: docs/STORAGE_SETUP.md');
      console.log('🚨 Quick fix: Run the SQL from the documentation in Supabase Dashboard → SQL Editor');
    }
    
    return results;
  };
}

export default function ProjectSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    mediaItems: [], // Array of {url, type} objects for multiple media
    portfolioTitle: '', // Custom title for the portfolio section
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
        mediaItems: [],
        portfolioTitle: '',
        category: ''
      });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.description) {
      const updatedProjects = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedProjects);
      setEditingIndex(null); // This will make Add Project button visible again
      setNewEntry({
        title: '',
        description: '',
        mediaItems: [],
        portfolioTitle: '',
        category: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    console.log('💾 Saving edited entry:', {
      index,
      updatedEntry: { ...updatedEntry },
      hasMediaItems: !!(updatedEntry.mediaItems && updatedEntry.mediaItems.length > 0),
      mediaItemsCount: updatedEntry.mediaItems?.length || 0,
      mediaItems: updatedEntry.mediaItems
    });
    
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
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleSave = () => {
    // If we're editing something, save it first
    if (editingIndex === 'new') {
      handleSaveNew();
    } else if (editingIndex !== null) {
      // For existing entries, just close editing mode
      setEditingIndex(null);
    }
    
    // Now save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
  };

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Portfolio Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#3b82f6'
          }}>
            <LuFolderOpen className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Portfolio</h3>
            <p className="text-gray-400 text-sm">Manage your projects and work</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
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
            value={value}
          />
        ))}

        {/* Add New Entry */}
        {editingIndex === 'new' && (
          <ProjectEntry
            entry={newEntry}
            isEditing={true}
            isNew={true}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            onChange={setNewEntry}
            value={value}
          />
        )}

        {/* Add Project Button - Always visible when not adding new */}
        {editingIndex !== 'new' && (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-blue-600 rounded-lg text-blue-400 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-20 transition-all font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <LuFolderOpen className="text-lg" />
            Add Project
          </button>
        )}

        {/* Save/Cancel Buttons - Always visible at bottom */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange, value }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    title: '',
    description: '',
    mediaItems: [], // Array of {url, type} objects
    portfolioTitle: '',
    category: '',
    ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);
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
    // Ensure the entry has all required fields
    const safeEntry = {
      title: '',
      description: '',
      mediaItems: [], // Array of {url, type} objects
      portfolioTitle: '',
      category: '',
      ...entry // Override with actual entry data
    };
    
    // Convert old mediaUrl/mediaType to new mediaItems format if needed
    if (safeEntry.mediaUrl && (!safeEntry.mediaItems || safeEntry.mediaItems.length === 0)) {
      console.log('🔄 Converting old media format to new format:', {
        oldMediaUrl: safeEntry.mediaUrl,
        oldMediaType: safeEntry.mediaType,
        hasMediaItems: !!safeEntry.mediaItems,
        mediaItemsLength: safeEntry.mediaItems?.length || 0
      });
      
      safeEntry.mediaItems = [{
        url: safeEntry.mediaUrl,
        type: safeEntry.mediaType || 'image'
      }];
      
      // Clear old format to prevent confusion
      delete safeEntry.mediaUrl;
      delete safeEntry.mediaType;
      
      console.log('✅ Converted to new format and cleared old fields:', {
        newMediaItems: safeEntry.mediaItems,
        hasOldUrl: !!safeEntry.mediaUrl,
        hasOldType: !!safeEntry.mediaType
      });
    }
    
    setLocalEntry(safeEntry);
  }, [entry]);

  // Debug effect to monitor localEntry changes
  useEffect(() => {
    console.log('🔄 LocalEntry state changed:', {
      localEntry: { ...localEntry },
      hasMediaItems: !!(localEntry.mediaItems && localEntry.mediaItems.length > 0),
      mediaItemsCount: localEntry.mediaItems?.length || 0
    });
  }, [localEntry.mediaItems?.length]);

  const handleInputChange = (field, value) => {
    console.log('🔄 handleInputChange called:', { field, value, currentLocalEntry: { ...localEntry } });
    
    const updated = { ...localEntry, [field]: value };
    
    console.log('🔄 Updated entry:', { updated, field, value });
    
    setLocalEntry(updated);
    
    // Force re-render when mediaUrl changes
    if (field === 'mediaUrl') {
      setForceRender(prev => prev + 1);
    }
    
    if (onChange) {
      onChange(updated);
    }
  };



  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      let bucket = await getAvailableBucket();
      
      // If first bucket fails, try to find a working bucket
      if (!bucket) {
        console.log('🔄 No default bucket found, searching for working bucket...');
        bucket = await findWorkingBucket();
        
        if (!bucket) {
          setUploadError('No working storage bucket found. Please check your Supabase storage setup.');
          return;
        }
      }

      const newMediaItems = [];
      
      for (const file of files) {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          setUploadError(`File "${file.name}" is not a valid image or video file.`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`File "${file.name}" is too large. Max size is 5MB.`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        console.log('🔄 Attempting upload:', { bucket, filePath, fileSize: file.size });

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) {
          console.error('Upload error details:', error);
          
          if (error.message?.includes('row-level security policy')) {
            setUploadError(
              'Upload permissions issue. Please check that storage policies are configured correctly in Supabase. ' +
              'See docs/STORAGE_SETUP.md for instructions.'
            );
          } else if (error.message?.includes('must be owner of table')) {
            setUploadError(
              'Permission denied: You need admin rights to configure storage. ' +
              'Try the Dashboard UI method in docs/STORAGE_SETUP.md or contact your project admin.'
            );
          } else if (error.message?.includes('not found')) {
            setUploadError('Storage bucket not found. Please contact support.');
          } else {
            setUploadError(`Upload failed: ${error.message || 'Unknown error'}`);
          }
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        console.log('✅ Upload successful:', { publicUrl, filePath });

        newMediaItems.push({
          url: publicUrl,
          type: isVideo ? 'video' : 'image'
        });
      }

      if (newMediaItems.length > 0) {
        const currentMediaItems = localEntry.mediaItems || [];
        const updated = {
          ...localEntry,
          mediaItems: [...currentMediaItems, ...newMediaItems]
        };

        setLocalEntry(updated);
        if (onChange) onChange(updated);
        setForceRender(prev => prev + 1);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Upload failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Edit mode
  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Portfolio Title - Only show for first entry */}
        {(isNew || (value && value.length === 0)) && (
          <div className="mb-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
            <label className="block text-blue-300 font-semibold mb-2 text-sm">
              🎨 Portfolio Section Title
            </label>
            <input
              type="text"
              value={localEntry.portfolioTitle}
              onChange={(e) => handleInputChange('portfolioTitle', e.target.value)}
              placeholder="My Work, Projects, Portfolio, Creative Work..."
              className="w-full px-3 py-2 bg-gray-900 border border-blue-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-blue-200 text-xs mt-2">💡 This will be the main heading for your entire portfolio section (applies to all items)</p>
          </div>
        )}

        {/* Title and Description */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Item Title *
            </label>
            <input
              type="text"
              value={localEntry.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="My Work, Creative Project, Business Venture..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Description *
            </label>
            <textarea
              value={localEntry.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your work or project..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-20"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Images & Videos (Multiple)
          </label>
          
          {/* Upload Error Message */}
          {uploadError && (
            <div className="p-3 mb-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
              {uploadError}
            </div>
          )}
          
          {/* Display existing media items */}
          {((localEntry.mediaItems && localEntry.mediaItems.length > 0) || localEntry.mediaUrl) && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Handle new mediaItems format */}
              {localEntry.mediaItems && localEntry.mediaItems.length > 0 ? (
                localEntry.mediaItems.map((media, mediaIndex) => (
                  <div key={mediaIndex} className="relative">
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        controls
                      />
                    ) : (
                                          <Image
                      src={media.url}
                      alt={`Media ${mediaIndex + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    )}
                    <button
                      onClick={() => {
                        const newMediaItems = localEntry.mediaItems.filter((_, i) => i !== mediaIndex);
                        handleInputChange('mediaItems', newMediaItems);
                      }}
                      disabled={isUploading}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-70 text-white border-none cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LuX size={12} />
                    </button>
                  </div>
                ))
              ) : localEntry.mediaUrl ? (
                /* Handle old mediaUrl format for backward compatibility */
                <div className="relative">
                  {localEntry.mediaType === 'video' ? (
                    <video
                      src={localEntry.mediaUrl}
                      className="w-full h-32 object-cover rounded-lg border border-gray-700"
                      controls
                    />
                  ) : (
                    <Image
                      src={localEntry.mediaUrl}
                      alt="Media"
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => {
                      // Convert to new format and remove the old media
                      handleInputChange('mediaItems', []);
                      handleInputChange('mediaUrl', '');
                      handleInputChange('mediaType', 'image');
                    }}
                    disabled={isUploading}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-70 text-white border-none cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuX size={12} />
                  </button>
                </div>
              ) : null}
            </div>
          )}
          
          {/* Upload area */}
          <div className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${isUploading ? 'border-blue-500' : 'border-gray-600'}`}>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              disabled={isUploading}
              className="hidden"
              id={`media-upload-${index}`}
              multiple
            />
            <label
              htmlFor={`media-upload-${index}`}
              className="cursor-pointer block"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <LuLoader className="prysm-spin text-blue-500 text-2xl mb-2" />
                  <span className="text-gray-400 text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <LuUpload className="text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-400 text-sm">Click to upload images or videos</span>
                  <span className="text-gray-500 text-xs mt-1">Max 5MB each • Multiple files allowed</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Category</label>
          <input
            type="text"
            value={localEntry.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="e.g., Photography, Design, Business, Art..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Save/Cancel Buttons for individual entry */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('🚀 Save button clicked - sending data:', {
                localEntry: { ...localEntry },
                hasMediaItems: !!(localEntry.mediaItems && localEntry.mediaItems.length > 0),
                mediaItemsCount: localEntry.mediaItems?.length || 0
              });
              onSave(localEntry);
            }}
            disabled={!localEntry.title || !localEntry.description}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!localEntry.title || !localEntry.description) ? '#374151' : '#3b82f6',
              color: 'white'
            }}
          >
            {isNew ? 'Add Project' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg mb-1">
            {entry.title}
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            {entry.description}
          </p>
          
          {/* Media Preview */}
          {((entry.mediaItems && entry.mediaItems.length > 0) || entry.mediaUrl) && (
            <div className="mb-3">
              {entry.mediaItems.length === 1 ? (
                /* Single media item - full width */
                <div>
                  {entry.mediaItems[0].type === 'video' ? (
                    <video
                      src={entry.mediaItems[0].url}
                      className="w-full max-h-32 object-cover rounded-lg"
                      muted
                    />
                  ) : (
                    <Image
                      src={entry.mediaItems[0].url}
                      alt={entry.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>
              ) : (
                /* Multiple media items - grid layout */
                <div className={`grid gap-2 ${entry.mediaItems.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {entry.mediaItems.slice(0, 3).map((media, mediaIndex) => (
                    <div key={mediaIndex}>
                      {media.type === 'video' ? (
                        <video
                          src={media.url}
                          className="w-full h-20 object-cover rounded-lg"
                          muted
                        />
                      ) : (
                        <Image
                          src={media.url}
                          alt={`${entry.title} ${mediaIndex + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                  {entry.mediaItems.length > 3 && (
                    <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">+{entry.mediaItems.length - 3} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Backward compatibility: Show old single media if mediaUrl exists but no mediaItems */}
          {entry.mediaUrl && (!entry.mediaItems || entry.mediaItems.length === 0) && (
            <div className="mb-3">
              {entry.mediaType === 'video' ? (
                <video
                  src={entry.mediaUrl}
                  className="w-full max-h-32 object-cover rounded-lg"
                  muted
                />
              ) : (
                <Image
                  src={entry.mediaUrl}
                  alt={entry.title}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {/* Category */}
          {entry.category && (
            <div className="mb-3">
              <span className="px-3 py-1 bg-blue-900 text-blue-300 text-xs rounded-full font-medium">
                {entry.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-900 text-red-300 text-xs rounded hover:bg-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>


    </div>
  );
} 