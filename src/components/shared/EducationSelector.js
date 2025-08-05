'use client';

import React, { useState } from 'react';

export default function EducationSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Extract carousel preference from the first entry or default to false
  const carouselPreference = value.length > 0 && value[0].useCarousel !== undefined ? value[0].useCarousel : false;

  const handleCarouselToggle = (useCarousel) => {
    // Update all entries to include the carousel preference
    const updatedEducation = value.map(entry => ({
      ...entry,
      useCarousel
    }));
    onChange(updatedEducation);
  };

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      useCarousel: carouselPreference // Inherit current preference
    });
  };

  const handleSaveNew = () => {
    if (newEntry.institution && newEntry.degree) {
      const updatedEducation = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedEducation);
      setEditingIndex(null);
      setNewEntry({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        useCarousel: carouselPreference
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedEducation = [...value];
    updatedEducation[index] = updatedEntry;
    onChange(updatedEducation);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedEducation = value.filter((_, i) => i !== index);
    onChange(updatedEducation);
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
      {/* Education Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#10b981'
          }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Education</h3>
            <p className="text-gray-400 text-sm">Your academic background and qualifications</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Display Preference Setting - only show if multiple entries exist */}
        {value.length > 1 && (
          <div className="p-4 mb-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <label className="block text-white font-medium mb-3 text-sm">
              Display Style:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="displayStyle"
                  checked={!carouselPreference}
                  onChange={() => handleCarouselToggle(false)}
                  className="w-4 h-4 text-green-600 bg-gray-900 border-gray-700 focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300">List View (all entries visible)</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="displayStyle"
                  checked={carouselPreference}
                  onChange={() => handleCarouselToggle(true)}
                  className="w-4 h-4 text-green-600 bg-gray-900 border-gray-700 focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300">Carousel View (swipe through entries)</span>
              </label>
            </div>
          </div>
        )}

        {/* Existing Education Entries */}
        {value.map((entry, index) => (
          <EducationEntry
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
          <EducationEntry
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
            + Add Education
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
              backgroundColor: '#10b981',
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

function EducationEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    institution: '',
    degree: '',
    field: '',
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
      institution: '',
      degree: '',
      field: '',
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
    if (localEntry.institution && localEntry.degree) {
      onSave(localEntry);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Institution and Degree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Institution *
            </label>
            <input
              type="text"
              value={localEntry.institution || ''}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              placeholder="University, College, School name"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Degree *
            </label>
            <input
              type="text"
              value={localEntry.degree || ''}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              placeholder="Bachelor's, Master's, PhD, etc."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Field of Study */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Field of Study
          </label>
          <input
            type="text"
            value={localEntry.field || ''}
            onChange={(e) => handleInputChange('field', e.target.value)}
            placeholder="Computer Science, Business, Engineering, etc."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Start Date and End Date/Current */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Start Date
            </label>
            <input
              type="month"
              value={localEntry.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              End Date
            </label>
            <div className="space-y-2">
              <input
                type="month"
                value={localEntry.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={localEntry.current}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localEntry.current || false}
                  onChange={(e) => handleInputChange('current', e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-gray-900 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300 text-sm">Currently studying here</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Relevant coursework, achievements, GPA, honors, etc."
            rows={3}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical min-h-20"
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
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-white font-semibold text-lg">
              {entry.degree || 'Unknown Degree'}
            </h4>
            {entry.current && (
              <span className="px-2 py-1 bg-green-900 text-green-300 text-xs font-medium rounded">
                Current
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-green-400 font-medium">
              {entry.institution || 'Unknown Institution'}
            </span>
            {entry.field && (
              <span className="text-gray-400 text-sm">
                {entry.field}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
            {entry.startDate && (
              <span>
                {new Date(entry.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </span>
            )}
            <span>-</span>
            {entry.current ? (
              <span className="text-green-400">Present</span>
            ) : entry.endDate ? (
              <span>
                {new Date(entry.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </span>
            ) : (
              <span>Not specified</span>
            )}
          </div>

          {entry.description && (
            <p className="text-gray-300 text-sm leading-relaxed">
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