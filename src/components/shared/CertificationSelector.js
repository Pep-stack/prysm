'use client';

import React, { useState } from 'react';

export default function CertificationSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    organization: '',
    date: '',
    credentialId: '',
    url: '',
    description: ''
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      name: '',
      organization: '',
      date: '',
      credentialId: '',
      url: '',
      description: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.name && newEntry.organization) {
      const updatedCertifications = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedCertifications);
      setEditingIndex(null);
      setNewEntry({
        name: '',
        organization: '',
        date: '',
        credentialId: '',
        url: '',
        description: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedCertifications = [...value];
    updatedCertifications[index] = updatedEntry;
    onChange(updatedCertifications);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedCertifications = value.filter((_, i) => i !== index);
    onChange(updatedCertifications);
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
      {/* Certifications Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#f59e0b'
          }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Certifications</h3>
            <p className="text-gray-400 text-sm">Professional certifications and licenses</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Certification Entries */}
        {value.map((entry, index) => (
          <CertificationEntry
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
          <CertificationEntry
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
            + Add Certification
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
              backgroundColor: '#f59e0b',
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

function CertificationEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    name: '',
    organization: '',
    date: '',
    credentialId: '',
    url: '',
    description: '',
    ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);

  // Sync localEntry with entry prop
  React.useEffect(() => {
    const safeEntry = {
      name: '',
      organization: '',
      date: '',
      credentialId: '',
      url: '',
      description: '',
      ...entry // Override with actual entry data
    };
    setLocalEntry(safeEntry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (localEntry.name && localEntry.organization) {
      onSave(localEntry);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Certificate Name and Organization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Certificate Name *
            </label>
            <input
              type="text"
              value={localEntry.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="AWS Solutions Architect, PMP, etc."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Issuing Organization *
            </label>
            <input
              type="text"
              value={localEntry.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder="Amazon Web Services, PMI, etc."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Issue Date and Credential ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Issue Date
            </label>
            <input
              type="month"
              value={localEntry.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Credential ID
            </label>
            <input
              type="text"
              value={localEntry.credentialId || ''}
              onChange={(e) => handleInputChange('credentialId', e.target.value)}
              placeholder="Certificate/License number"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Credential URL */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Credential URL
          </label>
          <input
            type="url"
            value={localEntry.url || ''}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://example.com/verify/credential"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Skills gained, relevance to your field, etc."
            rows={3}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical min-h-20"
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
            disabled={!localEntry.name || !localEntry.organization}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!localEntry.name || !localEntry.organization) ? '#6B7280' : '#f59e0b',
              color: 'white'
            }}
          >
            {isNew ? 'Add Certification' : 'Save Changes'}
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
              {entry.name || 'Untitled Certification'}
            </h4>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-amber-400 font-medium">
              {entry.organization || 'Unknown Organization'}
            </span>
            {entry.date && (
              <span className="text-gray-400 text-sm">
                {new Date(entry.date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          {entry.credentialId && (
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Credential ID: </span>
              <span className="text-gray-300 text-sm font-mono">{entry.credentialId}</span>
            </div>
          )}

          {entry.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {entry.description}
            </p>
          )}

          {entry.url && (
            <div className="mb-3">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 text-sm hover:text-amber-300 underline"
              >
                View Credential
              </a>
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