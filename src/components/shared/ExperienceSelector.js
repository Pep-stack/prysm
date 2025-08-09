'use client';

import React, { useState } from 'react';

export default function ExperienceSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    company: '',
    title: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      company: '',
      title: '',
      location: '',
      type: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.company && newEntry.title) {
      const updatedExperience = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedExperience);
      setEditingIndex(null);
      setNewEntry({
        company: '',
        title: '',
        location: '',
        type: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedExperience = [...value];
    updatedExperience[index] = updatedEntry;
    onChange(updatedExperience);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedExperience = value.filter((_, i) => i !== index);
    onChange(updatedExperience);
  };

  const handleCancel = () => {
    setEditingIndex(null);
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
      {/* Work Experience Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#3b82f6'
          }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Work Experience</h3>
            <p className="text-gray-400 text-sm">Showcase your professional journey</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Experience Entries */}
        {value.map((entry, index) => (
          <ExperienceEntry
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
          <ExperienceEntry
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
            + Add Experience
          </button>
        )}

        {/* Save/Cancel Buttons - Always visible at bottom */}
        {modalOnSave && (
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
        )}
      </div>
    </div>
  );
}

function ExperienceEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    company: '',
    title: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
            current: false,
        description: '',
        ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);

  // Sync localEntry with entry prop
  React.useEffect(() => {
    const safeEntry = {
      company: '',
      title: '',
      location: '',
      type: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      ...entry // Override with actual entry data
    };
    setLocalEntry(safeEntry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    if (field === 'current' && value) {
      updated.endDate = '';
    }
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (localEntry.company && localEntry.title) {
      onSave(localEntry);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Company and Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Company *
            </label>
            <input
              type="text"
              value={localEntry.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Company name"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Job Title *
            </label>
            <input
              type="text"
              value={localEntry.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Software Engineer, Manager, etc."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Location and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Location
            </label>
            <input
              type="text"
              value={localEntry.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country or Remote"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Employment Type
            </label>
            <select
              value={localEntry.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
        </div>

        {/* Start Date and End Date/Current */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={localEntry.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  colorScheme: 'dark',
                  WebkitColorScheme: 'dark',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              End Date
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="date"
                  value={localEntry.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={localEntry.current}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    colorScheme: 'dark',
                    WebkitColorScheme: 'dark',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localEntry.current || false}
                  onChange={(e) => handleInputChange('current', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-300 text-sm select-none">Currently working here</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Description
          </label>
          <textarea
            value={localEntry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-24"
          />
        </div>

        {/* Save/Cancel Buttons for individual entry */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!localEntry.company || !localEntry.title}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!localEntry.company || !localEntry.title) ? '#6B7280' : '#3b82f6',
              color: 'white'
            }}
          >
            {isNew ? 'Add Experience' : 'Save Changes'}
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
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-white font-semibold text-lg">
              {entry.title || 'Untitled Position'}
            </h4>
            {entry.type && (
              <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs font-medium rounded">
                {entry.type}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-blue-400 font-medium">
              {entry.company || 'Unknown Company'}
            </span>
            {entry.location && (
              <span className="text-gray-400 text-sm">
                {entry.location}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
            {entry.startDate && (
              <span>
                {(() => {
                  // Handle both old format (YYYY-MM) and new format (YYYY-MM-DD)
                  const date = entry.startDate.includes('-') && entry.startDate.split('-').length === 3 
                    ? new Date(entry.startDate) 
                    : new Date(entry.startDate + '-01');
                  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                })()}
              </span>
            )}
            <span>-</span>
            {entry.current ? (
              <span className="text-green-400">Present</span>
            ) : entry.endDate ? (
              <span>
                {(() => {
                  // Handle both old format (YYYY-MM) and new format (YYYY-MM-DD)
                  const date = entry.endDate.includes('-') && entry.endDate.split('-').length === 3 
                    ? new Date(entry.endDate) 
                    : new Date(entry.endDate + '-01');
                  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                })()}
              </span>
            ) : (
              <span>Not specified</span>
            )}
          </div>

          {entry.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {entry.description}
            </p>
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