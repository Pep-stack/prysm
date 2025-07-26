'use client';

import React, { useState } from 'react';
import { LuCalendar, LuPlus, LuTrash2, LuPencil, LuMapPin, LuClock } from 'react-icons/lu';

export default function EventSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    url: '',
    isOnline: false,
    isFree: true,
    price: '',
    featured: false
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      url: '',
      isOnline: false,
      isFree: true,
      price: '',
      featured: false
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.date) {
      const updatedEvents = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedEvents);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        url: '',
        isOnline: false,
        isFree: true,
        price: '',
        featured: false
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...value[index] });
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedEvents = [...value];
    updatedEvents[index] = updatedEntry;
    onChange(updatedEvents);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedEvents = value.filter((_, i) => i !== index);
    onChange(updatedEvents);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      url: '',
      isOnline: false,
      isFree: true,
      price: '',
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

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate >= now;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Events</h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <LuPlus size={16} />
          Add Event
        </button>
      </div>

      {value.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500">
          <LuCalendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No events yet. Add your first event to get started.</p>
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
                  {isUpcoming(item.date) && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <LuCalendar size={12} />
                    {formatDate(item.date)}
                  </span>
                  {item.time && (
                    <span className="flex items-center gap-1">
                      <LuClock size={12} />
                      {item.time}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <LuMapPin size={12} />
                      {item.isOnline ? 'Online' : item.location}
                    </span>
                  )}
                  {!item.isFree && item.price && (
                    <span className="text-emerald-600 font-medium">
                      ${item.price}
                    </span>
                  )}
                  {item.isFree && (
                    <span className="text-emerald-600 font-medium">
                      Free
                    </span>
                  )}
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 mt-2 inline-block"
                  >
                    View Event Details
                  </a>
                )}
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
              {editingIndex === 'new' ? 'Add New Event' : 'Edit Event'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
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
                  Time
                </label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={newEntry.isOnline}
                  onChange={(e) => setNewEntry({ ...newEntry, isOnline: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-700">
                  Online event
                </label>
              </div>

              {!newEntry.isOnline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEntry.location}
                    onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Event location"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={newEntry.isFree}
                  onChange={(e) => setNewEntry({ ...newEntry, isFree: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                  Free event
                </label>
              </div>

              {!newEntry.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={newEntry.price}
                    onChange={(e) => setNewEntry({ ...newEntry, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="$25"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event URL
                </label>
                <input
                  type="url"
                  value={newEntry.url}
                  onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/event"
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
                  placeholder="Brief description of the event"
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
                disabled={!newEntry.title || !newEntry.date}
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