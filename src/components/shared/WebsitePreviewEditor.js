'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LuGlobe, LuUpload, LuX, LuLoader, LuExternalLink, LuPlus, LuPencil, LuTrash2, LuSave } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket, diagnoseStorageSetup, findWorkingBucket } from '../../lib/supabase-storage-setup';

// Global debug function for console
if (typeof window !== 'undefined') {
  window.debugWebsitePreviewStorage = async () => {
    console.log('🔍 Diagnosing website preview storage setup...');
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

export default function WebsitePreviewEditor({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    subtitle: '',
    button_text: 'Visit Website',
    website_url: '',
    logo_url: ''
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
      subtitle: '',
      button_text: 'Visit Website',
      website_url: '',
      logo_url: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.website_url) {
      const updatedWebsitePreviews = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedWebsitePreviews);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        subtitle: '',
        button_text: 'Visit Website',
        website_url: '',
        logo_url: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    console.log('💾 Saving edited website preview entry:', {
      index,
      updatedEntry: { ...updatedEntry }
    });
    
    const updatedWebsitePreviews = [...value];
    updatedWebsitePreviews[index] = updatedEntry;
    onChange(updatedWebsitePreviews);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedWebsitePreviews = value.filter((_, i) => i !== index);
    onChange(updatedWebsitePreviews);
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
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#3b82f6'
          }}>
            <LuGlobe className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Website Preview</h3>
            <p className="text-gray-400 text-sm">Showcase your website with preview cards</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Website Preview Entries */}
        {value.map((entry, index) => (
          <WebsitePreviewEntry
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
          <WebsitePreviewEntry
            entry={newEntry}
            isEditing={true}
            isNew={true}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            onChange={setNewEntry}
            value={value}
          />
        )}

        {/* Add Website Preview Button - Always visible when not adding new */}
        {editingIndex !== 'new' && (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-blue-600 rounded-lg text-blue-400 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-20 transition-all font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <LuGlobe className="text-lg" />
            Add Website Preview
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

function WebsitePreviewEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange, value }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    title: '',
    subtitle: '',
    button_text: 'Visit Website',
    website_url: '',
    logo_url: '',
    ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Sync localEntry with entry prop
  useEffect(() => {
    console.log('🔄 Entry prop changed, syncing localEntry:', { 
      newEntry: entry, 
      currentLocalEntry: localEntry 
    });
    
    const safeEntry = {
      title: '',
      subtitle: '',
      button_text: 'Visit Website',
      website_url: '',
      logo_url: '',
      ...entry // Override with actual entry data
    };
    
    setLocalEntry(safeEntry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    console.log('🔄 handleInputChange called:', { field, value, currentLocalEntry: { ...localEntry } });
    
    const updated = { ...localEntry, [field]: value };
    
    console.log('🔄 Updated entry:', { updated, field, value });
    
    setLocalEntry(updated);
    
    if (onChange) {
      onChange(updated);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not a valid image file.`);
        return;
      }

      // Validate file size (2MB limit for logos)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Max size is 2MB for logos.`);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `website-logos/${fileName}`;

      console.log('🔄 Attempting logo upload:', { bucket, filePath, fileSize: file.size });

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
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('✅ Logo upload successful:', { publicUrl, filePath });

      handleInputChange('logo_url', publicUrl);

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
        {/* Title and Subtitle */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Website Title *
            </label>
            <input
              type="text"
              value={localEntry.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="My Portfolio, Company Website, Personal Blog..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Subtitle/Description
            </label>
            <textarea
              value={localEntry.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Brief description of your website..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-16"
            />
          </div>
        </div>

        {/* Website URL */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Website URL *
          </label>
          <input
            type="url"
            value={localEntry.website_url}
            onChange={(e) => handleInputChange('website_url', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Button Text */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Button Text
          </label>
          <input
            type="text"
            value={localEntry.button_text}
            onChange={(e) => handleInputChange('button_text', e.target.value)}
            placeholder="Visit Website, View Portfolio, Learn More..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Logo Upload */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Logo/Icon (Optional)
          </label>
          
          {/* Upload Error Message */}
          {uploadError && (
            <div className="p-3 mb-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
              {uploadError}
            </div>
          )}
          
          {/* Display existing logo */}
          {localEntry.logo_url && (
            <div className="mb-3 relative w-20 h-20">
              <Image
                src={localEntry.logo_url}
                alt="Website logo"
                fill
                className="object-cover rounded-lg border border-gray-700"
              />
              <button
                onClick={() => handleInputChange('logo_url', '')}
                disabled={isUploading}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white border-none cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuX size={12} />
              </button>
            </div>
          )}
          
          {/* Upload area */}
          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isUploading ? 'border-blue-500' : 'border-gray-600'}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="hidden"
              id={`logo-upload-${index || 'new'}`}
            />
            <label
              htmlFor={`logo-upload-${index || 'new'}`}
              className="cursor-pointer block"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <LuLoader className="prysm-spin text-blue-500 text-xl mb-2" />
                  <span className="text-gray-400 text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <LuUpload className="text-gray-400 text-xl mb-2" />
                  <span className="text-gray-400 text-sm">Click to upload logo</span>
                  <span className="text-gray-500 text-xs mt-1">Max 2MB • PNG, JPG, SVG</span>
                </div>
              )}
            </label>
          </div>
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
                localEntry: { ...localEntry }
              });
              onSave(localEntry);
            }}
            disabled={!localEntry.title || !localEntry.website_url}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!localEntry.title || !localEntry.website_url) ? '#374151' : '#3b82f6',
              color: 'white'
            }}
          >
            {isNew ? 'Add Website' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 flex items-center gap-3">
          {/* Logo preview */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {entry.logo_url ? (
              <Image
                src={entry.logo_url}
                alt={entry.title}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <LuGlobe style={{ color: '#9CA3AF', fontSize: '16px' }} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-lg mb-1">
              {entry.title}
            </h4>
            {entry.subtitle && (
              <p className="text-gray-400 text-sm mb-2">
                {entry.subtitle}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xs font-medium">
                {entry.button_text || 'Visit Website'}
              </span>
              <LuExternalLink className="text-blue-400" size={12} />
            </div>
          </div>
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
      
      {entry.website_url && (
        <div className="text-xs text-gray-500 truncate">
          {entry.website_url}
        </div>
      )}
    </div>
  );
}
