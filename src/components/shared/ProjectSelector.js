'use client';

import React, { useState, useEffect } from 'react';
import { LuUpload, LuX, LuPlay, LuImage, LuLoader, LuFolderOpen } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket } from '../../lib/supabase-storage-setup';

export default function ProjectSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
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
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            + Add Project
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

function ProjectEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
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
      mediaUrl: '',
      mediaType: 'image',
      demoUrl: '',
      codeUrl: '',
      technologies: [],
      startDate: '',
      endDate: '',
      status: 'completed',
      category: '',
      ...entry // Override with actual entry data
    };
    setLocalEntry(safeEntry);
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
    }
    
    if (onChange) {
      onChange(updated);
    }
  };

  const handleAddTechnology = () => {
    const currentTechnologies = localEntry.technologies || [];
    if (techInput.trim() && !currentTechnologies.includes(techInput.trim())) {
      const updated = {
        ...localEntry,
        technologies: [...currentTechnologies, techInput.trim()]
      };
      setLocalEntry(updated);
      setTechInput('');
      if (onChange) onChange(updated);
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    const currentTechnologies = localEntry.technologies || [];
    const updated = {
      ...localEntry,
      technologies: currentTechnologies.filter(tech => tech !== techToRemove)
    };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setUploadError('Please select an image or video file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const bucket = getAvailableBucket();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload file. Please try again.');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('✅ Upload successful:', { publicUrl, filePath });

      const updated = {
        ...localEntry,
        mediaUrl: publicUrl,
        mediaType: isVideo ? 'video' : 'image'
      };

      setLocalEntry(updated);
      if (onChange) onChange(updated);
      setForceRender(prev => prev + 1);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Edit mode
  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Title and Description */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Project Title *
            </label>
            <input
              type="text"
              value={localEntry.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="My Awesome Project"
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
              placeholder="Brief description of your project..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-20"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Project Image/Video *
          </label>
          
          {/* Upload Error Message */}
          {uploadError && (
            <div className="p-3 mb-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
              {uploadError}
            </div>
          )}
          
          {(localEntry.mediaUrl && localEntry.mediaUrl.length > 0) ? (
            <div className="relative mb-3">
              {localEntry.mediaType === 'video' ? (
                <video
                  src={localEntry.mediaUrl}
                  className="w-full max-h-48 object-cover rounded-lg border border-gray-700"
                  controls
                />
              ) : (
                <img
                  src={localEntry.mediaUrl}
                  alt="Project preview"
                  className="w-full max-h-48 object-cover rounded-lg border border-gray-700"
                />
              )}
              <button
                onClick={() => {
                  handleInputChange('mediaUrl', '');
                  handleInputChange('mediaType', 'image');
                  setUploadError(null);
                }}
                disabled={isUploading}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-70 text-white border-none cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuX size={12} />
              </button>
            </div>
          ) : (
            <div className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${isUploading ? 'border-blue-500' : 'border-gray-600'}`}>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                disabled={isUploading}
                className="hidden"
                id={`media-upload-${index}`}
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
                    <span className="text-gray-400 text-sm">Click to upload image or video</span>
                    <span className="text-gray-500 text-xs mt-1">Max 5MB</span>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Demo URL</label>
            <input
              type="url"
              value={localEntry.demoUrl}
              onChange={(e) => handleInputChange('demoUrl', e.target.value)}
              placeholder="https://demo.example.com"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Code URL</label>
            <input
              type="url"
              value={localEntry.codeUrl}
              onChange={(e) => handleInputChange('codeUrl', e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
              placeholder="Add technology..."
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddTechnology}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {localEntry.technologies && localEntry.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localEntry.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => handleRemoveTechnology(tech)}
                    className="text-gray-400 hover:text-white"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dates and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Start Date</label>
            <input
              type="month"
              value={localEntry.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm">End Date</label>
            <input
              type="month"
              value={localEntry.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Status</label>
            <select
              value={localEntry.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="paused">Paused</option>
              <option value="planned">Planned</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Category</label>
          <input
            type="text"
            value={localEntry.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="e.g., Web Development, Mobile App, Design"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
          {entry.mediaUrl && (
            <div className="mb-3">
              {entry.mediaType === 'video' ? (
                <video
                  src={entry.mediaUrl}
                  className="w-full max-h-32 object-cover rounded-lg"
                  muted
                />
              ) : (
                <img
                  src={entry.mediaUrl}
                  alt={entry.title}
                  className="w-full max-h-32 object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {/* Technologies */}
          {entry.technologies && entry.technologies.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {entry.technologies.slice(0, 5).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {entry.technologies && entry.technologies.length > 5 && (
                  <span className="text-gray-500 text-xs">
                    +{entry.technologies.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {entry.demoUrl && (
            <a
              href={entry.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Demo
            </a>
          )}
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

      {(entry.startDate || entry.endDate) && (
        <p className="text-gray-500 text-xs mb-2">
          {entry.startDate && new Date(entry.startDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {entry.startDate && entry.endDate && ' - '}
          {entry.endDate && new Date(entry.endDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      )}

      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          entry.status === 'completed' ? 'bg-green-900 text-green-300' : 
          entry.status === 'ongoing' ? 'bg-blue-900 text-blue-300' : 
          entry.status === 'paused' ? 'bg-yellow-900 text-yellow-300' : 
          'bg-gray-700 text-gray-300'
        }`}>
          {entry.status}
        </span>
        {entry.category && (
          <span className="text-gray-500 text-xs">
            {entry.category}
          </span>
        )}
      </div>
    </div>
  );
} 