'use client';

import React, { useState } from 'react';
import { LuFileText, LuPlus, LuTrash2, LuPencil, LuExternalLink } from 'react-icons/lu';

export default function PublicationSelector({ value = [], onChange, onSave, onCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    url: '',
    date: '',
    platform: '', // medium, substack, personal blog, etc.
    featured: false
  });

  const handleAddNew = () => {
    // Reset form for new entry - no need to set editingIndex since form is inline
    setNewEntry({
      title: '',
      description: '',
      url: '',
      date: '',
      platform: '',
      featured: false
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.url) {
      const updatedPublications = [...value, { ...newEntry, id: Date.now() }];
      console.log('📝 Adding new publication:', {
        newEntry,
        updatedPublications,
        currentValue: value
      });
      
      // Reset the form
      setNewEntry({
        title: '',
        description: '',
        url: '',
        date: '',
        platform: '',
        featured: false
      });
      
      // Return the updated publications array
      return updatedPublications;
    } else {
      console.warn('⚠️ Cannot save publication: missing title or URL');
      return value; // Return current value if validation fails
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...value[index] });
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedPublications = [...value];
    updatedPublications[index] = updatedEntry;
    console.log('📝 Updating publication:', {
      index,
      updatedEntry,
      updatedPublications,
      currentValue: value
    });
    onChange(updatedPublications);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedPublications = value.filter((_, i) => i !== index);
    console.log('🗑️ Deleting publication:', {
      index,
      updatedPublications,
      currentValue: value
    });
    onChange(updatedPublications);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      title: '',
      description: '',
      url: '',
      date: '',
      platform: '',
      featured: false
    });
    
    // If onCancel is provided, call it to close the modal
    if (onCancel) {
      console.log('🚪 Calling onCancel to close modal');
      onCancel();
    }
  };

  const handleSaveAndClose = () => {
    console.log('💾 Saving publications data:', {
      newEntry,
      hasNewEntry: !!(newEntry.title && newEntry.url),
      currentValue: value,
      hasOnSave: !!onSave
    });
    
    let publicationsToSave = value;
    
    // Add new publication if form is filled
    if (newEntry.title && newEntry.url) {
      publicationsToSave = handleSaveNew();
    }
    
    // Save the publications data
    console.log('💾 Saving publications:', publicationsToSave);
    onChange(publicationsToSave);
    
    // If onSave is provided, call it to close the modal
    if (onSave) {
      console.log('🚪 Calling onSave to close modal');
      onSave(publicationsToSave);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      {/* Publications Header with icon and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600">
            <LuFileText className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Publications & Blog Posts</h3>
            <p className="text-gray-400 text-sm">Manage your articles and blog posts</p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 pt-4">
        {/* Add Publication Section */}
        <div className="mb-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Title *</label>
              <input
                type="text" 
                value={newEntry.title} 
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="Article title" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">URL *</label>
              <input
                type="url" 
                value={newEntry.url} 
                onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                placeholder="https://example.com/article" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">Platform</label>
              <input
                type="text" 
                value={newEntry.platform} 
                onChange={(e) => setNewEntry({ ...newEntry, platform: e.target.value })}
                placeholder="Medium, Substack, Personal Blog, etc." 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">Publication Date</label>
              <input
                type="date" 
                value={newEntry.date} 
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">Description</label>
              <textarea
                value={newEntry.description} 
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                rows={4}
                placeholder="Brief description of the article"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox" 
                id="featured" 
                checked={newEntry.featured} 
                onChange={(e) => setNewEntry({ ...newEntry, featured: e.target.checked })}
                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded"
                style={{ backgroundColor: '#1a1a1a' }}
              />
              <label htmlFor="featured" className="ml-3 block text-sm text-gray-300">
                Mark as featured
              </label>
            </div>
          </div>
        </div>

        {/* Current Publications */}
        {value.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">
              Added Publications ({value.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {value.map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                        <LuFileText className="text-white text-sm" />
                      </div>
                      <div className="text-white text-sm truncate">
                        {item.title}
                      </div>
                      {item.featured && (
                        <span className="px-2 py-1 text-xs bg-amber-900 text-amber-200 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-1"
                      >
                        <LuPencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                      >
                        <LuTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {item.url}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {value.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuFileText className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm">No publications yet. Add your first article or blog post to get started.</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {onCancel ? 'Cancel' : 'Clear Form'}
          </button>
          <button
            onClick={handleSaveAndClose}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            {onSave ? 'Save & Close' : 'Add Publication'}
          </button>
        </div>
      </div>

      {editingIndex !== null && editingIndex !== 'new' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={handleCancel}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Publications Header with icon and text */}
            <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600">
                  <LuFileText className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {editingIndex === 'new' ? 'Add New Publication' : 'Edit Publication'}
                  </h3>
                  <p className="text-gray-400 text-sm">Add your article or blog post</p>
                </div>
              </div>
            </div>

            {/* Content with form fields */}
            <div className="p-6 pt-4">
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Title *</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="Article title"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">URL *</label>
                  <input
                    type="url"
                    value={newEntry.url}
                    onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Platform</label>
                  <input
                    type="text"
                    value={newEntry.platform}
                    onChange={(e) => setNewEntry({ ...newEntry, platform: e.target.value })}
                    placeholder="Medium, Substack, Personal Blog, etc."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Publication Date</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Description</label>
                  <textarea
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                    rows={4}
                    placeholder="Brief description of the article"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newEntry.featured}
                    onChange={(e) => setNewEntry({ ...newEntry, featured: e.target.checked })}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded"
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                  <label htmlFor="featured" className="ml-3 block text-sm text-gray-300">
                    Mark as featured
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingIndex === 'new') {
                      handleSaveNew();
                    } else {
                      handleSaveEdit(editingIndex, newEntry);
                    }
                  }}
                  disabled={!newEntry.title || !newEntry.url}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: (newEntry.title && newEntry.url)
                      ? 'linear-gradient(45deg, #059669 0%, #10b981 50%, #34d399 100%)'
                      : '#333',
                    color: '#ffffff'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 