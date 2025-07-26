'use client';

import React, { useState } from 'react';
import { LuImage, LuPlus, LuTrash2, LuPencil } from 'react-icons/lu';

export default function GallerySelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      title: '',
      description: '',
      imageUrl: '',
      link: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.imageUrl) {
      const updatedGallery = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedGallery);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        description: '',
        imageUrl: '',
        link: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...value[index] });
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedGallery = [...value];
    updatedGallery[index] = updatedEntry;
    onChange(updatedGallery);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedGallery = value.filter((_, i) => i !== index);
    onChange(updatedGallery);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      title: '',
      description: '',
      imageUrl: '',
      link: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gallery Images</h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <LuPlus size={16} />
          Add Image
        </button>
      </div>

      {value.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500">
          <LuImage size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No gallery images yet. Add your first image to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((item, index) => (
          <div key={item.id || index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {item.imageUrl && (
              <div className="aspect-square bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View Link
                </a>
              )}
              <div className="flex gap-2 mt-3">
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
              {editingIndex === 'new' ? 'Add New Image' : 'Edit Image'}
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
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={newEntry.imageUrl}
                  onChange={(e) => setNewEntry({ ...newEntry, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
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
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="url"
                  value={newEntry.link}
                  onChange={(e) => setNewEntry({ ...newEntry, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com"
                />
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
                disabled={!newEntry.title || !newEntry.imageUrl}
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