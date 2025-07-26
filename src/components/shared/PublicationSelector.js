'use client';

import React, { useState } from 'react';
import { LuFileText, LuPlus, LuTrash2, LuPencil, LuExternalLink } from 'react-icons/lu';

export default function PublicationSelector({ value = [], onChange }) {
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
    setEditingIndex('new');
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
      onChange(updatedPublications);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        description: '',
        url: '',
        date: '',
        platform: '',
        featured: false
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...value[index] });
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedPublications = [...value];
    updatedPublications[index] = updatedEntry;
    onChange(updatedPublications);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedPublications = value.filter((_, i) => i !== index);
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Publications & Blog Posts</h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <LuPlus size={16} />
          Add Publication
        </button>
      </div>

      {value.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500">
          <LuFileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No publications yet. Add your first article or blog post to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={item.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  {item.featured && (
                    <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {item.platform && (
                    <span className="capitalize">{item.platform}</span>
                  )}
                  {item.date && (
                    <span>{formatDate(item.date)}</span>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <LuExternalLink size={12} />
                      View Article
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <LuPencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  <LuTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingIndex === 'new' ? 'Add New Publication' : 'Edit Publication'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={newEntry.url}
                  onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <input
                  type="text"
                  value={newEntry.platform}
                  onChange={(e) => setNewEntry({ ...newEntry, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Medium, Substack, Personal Blog, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Brief description of the article"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newEntry.featured}
                  onChange={(e) => setNewEntry({ ...newEntry, featured: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Mark as featured
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 