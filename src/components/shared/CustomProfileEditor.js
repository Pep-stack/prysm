'use client';

import React, { useState, useEffect } from 'react';
import { LuUser, LuPlus, LuPencil, LuTrash2, LuSave, LuX, LuGlobe } from 'react-icons/lu';

export default function CustomProfileEditor({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    platform_name: '',
    profile_url: '',
    username: '',
    icon_color: '#6B7280'
  });

  // Predefined color options for platforms
  const colorOptions = [
    { name: 'Default', color: '#6B7280' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Yellow', color: '#EAB308' },
    { name: 'Green', color: '#22C55E' },
    { name: 'Teal', color: '#14B8A6' },
    { name: 'Indigo', color: '#6366F1' }
  ];

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      platform_name: '',
      profile_url: '',
      username: '',
      icon_color: '#6B7280'
    });
  };

  const handleSaveNew = () => {
    if (newEntry.platform_name && newEntry.profile_url) {
      const updatedProfiles = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedProfiles);
      setEditingIndex(null);
      setNewEntry({
        platform_name: '',
        profile_url: '',
        username: '',
        icon_color: '#6B7280'
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    console.log('💾 Saving edited custom profile entry:', {
      index,
      updatedEntry: { ...updatedEntry }
    });
    
    const updatedProfiles = [...value];
    updatedProfiles[index] = updatedEntry;
    onChange(updatedProfiles);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedProfiles = value.filter((_, i) => i !== index);
    onChange(updatedProfiles);
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
            <LuUser className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Custom Profile</h3>
            <p className="text-gray-400 text-sm">Add profiles from any platform</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Custom Profile Entries */}
        {value.map((entry, index) => (
          <CustomProfileEntry
            key={entry.id || index}
            entry={entry}
            index={index}
            isEditing={editingIndex === index}
            onEdit={() => handleEdit(index)}
            onSave={(updatedEntry) => handleSaveEdit(index, updatedEntry)}
            onDelete={() => handleDelete(index)}
            onCancel={handleCancel}
            value={value}
            colorOptions={colorOptions}
          />
        ))}

        {/* Add New Entry */}
        {editingIndex === 'new' && (
          <CustomProfileEntry
            entry={newEntry}
            isEditing={true}
            isNew={true}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            onChange={setNewEntry}
            value={value}
            colorOptions={colorOptions}
          />
        )}

        {/* Add Profile Button - Always visible when not adding new */}
        {editingIndex !== 'new' && (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-blue-600 rounded-lg text-blue-400 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-20 transition-all font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <LuUser className="text-lg" />
            Add Custom Profile
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

function CustomProfileEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange, value, colorOptions }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    platform_name: '',
    profile_url: '',
    username: '',
    icon_color: '#6B7280',
    ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);

  // Sync localEntry with entry prop
  useEffect(() => {
    console.log('🔄 Entry prop changed, syncing localEntry:', { 
      newEntry: entry, 
      currentLocalEntry: localEntry 
    });
    
    const safeEntry = {
      platform_name: '',
      profile_url: '',
      username: '',
      icon_color: '#6B7280',
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

  // Edit mode
  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Platform Name */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Platform Name *
          </label>
          <input
            type="text"
            value={localEntry.platform_name}
            onChange={(e) => handleInputChange('platform_name', e.target.value)}
            placeholder="Discord, Steam, Twitch, etc..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Profile URL */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Profile URL *
          </label>
          <input
            type="url"
            value={localEntry.profile_url}
            onChange={(e) => handleInputChange('profile_url', e.target.value)}
            placeholder="https://discord.gg/username or https://steamcommunity.com/id/username"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Username (Optional)
          </label>
          <input
            type="text"
            value={localEntry.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Your username on this platform"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Icon Color */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Icon Color</label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => handleInputChange('icon_color', colorOption.color)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  localEntry.icon_color === colorOption.color 
                    ? 'border-white' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              >
                <div className="w-4 h-4 rounded-full bg-white bg-opacity-30"></div>
              </button>
            ))}
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
            disabled={!localEntry.platform_name || !localEntry.profile_url}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!localEntry.platform_name || !localEntry.profile_url) ? '#374151' : '#3b82f6',
              color: 'white'
            }}
          >
            {isNew ? 'Add Profile' : 'Save Changes'}
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
          {/* Icon preview */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: `${entry.icon_color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            <LuGlobe style={{ color: entry.icon_color, fontSize: '16px' }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-lg mb-1">
              {entry.platform_name}
            </h4>
            {entry.username && (
              <p className="text-gray-400 text-sm mb-2">
                @{entry.username}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xs font-medium">
                Visit Profile
              </span>
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
      
      {entry.profile_url && (
        <div className="text-xs text-gray-500 truncate">
          {entry.profile_url}
        </div>
      )}
    </div>
  );
}
