import React, { useState } from 'react';
import { LuPlus, LuPencil, LuTrash2, LuHeart, LuUser, LuCalendar, LuBriefcase, LuUpload, LuX } from 'react-icons/lu';
import { useTestimonials } from '../../hooks/useTestimonials';

export default function ClientTestimonialSelector({ value = [], onChange, userId, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    profession: '',
    quote: '',
    date: '',
    photo: null
  });
  
  // Use testimonials hook for Supabase integration
  const { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials(userId);

  const handleAddNew = () => {
    if (value.length >= 5) {
      alert('Maximum 5 testimonials allowed');
      return;
    }
    setEditingIndex('new');
    setNewEntry({
      name: '',
      profession: '',
      quote: '',
      date: '',
      photo: null
    });
  };

  const handleSaveNew = async () => {
    if (newEntry.name.trim() && newEntry.quote.trim()) {
      try {
        const testimonialData = {
          name: newEntry.name.trim(),
          profession: newEntry.profession.trim(),
          quote: newEntry.quote.trim(),
          date: newEntry.date && newEntry.date.trim() !== '' ? newEntry.date : null,
          photo: newEntry.photo
        };

        console.log('➕ TESTIMONIAL-SAVE: Adding new testimonial');
        const newTestimonial = await addTestimonial(testimonialData);
        
        if (newTestimonial) {
          console.log('✅ TESTIMONIAL-SAVE: New testimonial added with ID:', newTestimonial.id);
          const updatedTestimonials = [...displayTestimonials, newTestimonial];
          onChange(updatedTestimonials);
        } else {
          console.log('⚠️ TESTIMONIAL-SAVE: New testimonial added but no ID returned, using local data');
          const updatedTestimonials = [...displayTestimonials, { ...testimonialData, id: Date.now() }];
          onChange(updatedTestimonials);
        }

        setEditingIndex(null);
        setNewEntry({
          name: '',
          profession: '',
          quote: '',
          date: '',
          photo: null
        });
      } catch (error) {
        console.error('❌ TESTIMONIAL-SAVE: Error during save operation', error);
        const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
        alert(`Error saving testimonial: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const testimonial = displayTestimonials[index];
    setNewEntry({
      name: testimonial.name || '',
      profession: testimonial.profession || '',
      quote: testimonial.quote || '',
      date: testimonial.date || '',
      photo: testimonial.photo || testimonial.photo_url || null
    });
  };

  const handleSaveEdit = async (index) => {
    if (newEntry.name.trim() && newEntry.quote.trim()) {
      try {
        const testimonialData = {
          name: newEntry.name.trim(),
          profession: newEntry.profession.trim(),
          quote: newEntry.quote.trim(),
          date: newEntry.date && newEntry.date.trim() !== '' ? newEntry.date : null,
          photo: newEntry.photo
        };

        console.log('✏️ TESTIMONIAL-SAVE: Editing existing testimonial');
        const existingTestimonial = displayTestimonials[index];
        if (existingTestimonial.id) {
          console.log('📝 TESTIMONIAL-SAVE: Updating testimonial with ID:', existingTestimonial.id);
          await updateTestimonial(existingTestimonial.id, testimonialData);
        }

        // Update local state
        const updatedTestimonials = [...displayTestimonials];
        updatedTestimonials[index] = { ...existingTestimonial, ...testimonialData };
        onChange(updatedTestimonials);

        setEditingIndex(null);
        setNewEntry({
          name: '',
          profession: '',
          quote: '',
          date: '',
          photo: null
        });
      } catch (error) {
        console.error('❌ TESTIMONIAL-SAVE: Error during edit operation', error);
        const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
        alert(`Error updating testimonial: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (index) => {
    const testimonial = displayTestimonials[index];
    try {
      if (testimonial.id) {
        await deleteTestimonial(testimonial.id);
      }
      // Also update local state for immediate UI feedback
      const newValue = displayTestimonials.filter((_, i) => i !== index);
      onChange(newValue);
    } catch (error) {
      console.error('❌ TESTIMONIAL-DELETE: Error during delete operation', error);
      alert('Error deleting testimonial');
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      name: '',
      profession: '',
      quote: '',
      date: '',
      photo: null
    });
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleMainSave = () => {
    // If we're editing something, save it first
    if (editingIndex === 'new') {
      handleSaveNew();
    } else if (editingIndex !== null) {
      handleSaveEdit(editingIndex);
    }
    
    // Now save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
  };

  // Use testimonials from Supabase if available, otherwise fall back to value prop
  const displayTestimonials = testimonials.length > 0 ? testimonials : value;
  
  // Sync Supabase data with local state when testimonials are loaded
  React.useEffect(() => {
    if (testimonials.length > 0 && value.length === 0) {
      onChange(testimonials);
    }
  }, [testimonials, value.length, onChange]);

  if (loading) {
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
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading testimonials...</div>
        </div>
      </div>
    );
  }

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
      {/* Client Testimonials Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ec4899'
          }}>
            <LuHeart className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Client Testimonials</h3>
            <p className="text-gray-400 text-sm">Showcase client feedback and reviews</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Testimonials */}
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialEntry
            key={testimonial.id || index}
            entry={testimonial}
            index={index}
            isEditing={editingIndex === index}
            isNew={false}
            onEdit={() => handleEdit(index)}
            onSave={() => handleSaveEdit(index)}
            onDelete={() => handleDelete(index)}
            onCancel={handleCancel}
            onChange={setNewEntry}
            newEntry={newEntry}
          />
        ))}

        {/* Add New Entry */}
        {editingIndex === 'new' ? (
          <TestimonialEntry
            entry={newEntry}
            index="new"
            isEditing={true}
            isNew={true}
            onEdit={() => {}}
            onSave={handleSaveNew}
            onDelete={handleCancel}
            onCancel={handleCancel}
            onChange={setNewEntry}
            newEntry={newEntry}
          />
        ) : (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            + Add Testimonial
          </button>
        )}

        {/* Empty state when no testimonials */}
        {displayTestimonials.length === 0 && editingIndex !== 'new' && (
          <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-16 h-16 bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuHeart size={24} className="text-pink-300" />
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">No testimonials yet</h4>
            <p className="text-gray-400 text-sm mb-4">Add your first client testimonial to get started</p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Add First Testimonial
            </button>
          </div>
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
            onClick={handleMainSave}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#ec4899',
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

// TestimonialEntry component for both display and edit modes
function TestimonialEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange, newEntry }) {
  const handleInputChange = (field, value) => {
    onChange({ ...newEntry, [field]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange('photo', e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (newEntry.name.trim() && newEntry.quote.trim()) {
      onSave();
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        <div className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Client Photo (Optional)</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-pink-900 flex items-center justify-center overflow-hidden">
                {newEntry.photo ? (
                  <img
                    src={typeof newEntry.photo === 'string' ? newEntry.photo : (newEntry.photo instanceof File ? URL.createObjectURL(newEntry.photo) : newEntry.photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {(!newEntry.photo) && (
                  <LuUser size={24} className="text-pink-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
                />
                <p className="text-xs text-gray-400 mt-1">Optional: Add a professional photo</p>
              </div>
            </div>
          </div>

          {/* Name and Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Client Name *</label>
              <input
                type="text"
                value={newEntry.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Profession (Optional)</label>
              <input
                type="text"
                value={newEntry.profession || ''}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                placeholder="e.g., CEO at Tech Corp"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quote */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Testimonial Quote *</label>
            <textarea
              value={newEntry.quote || ''}
              onChange={(e) => handleInputChange('quote', e.target.value)}
              placeholder="Share the client's feedback and experience..."
              rows={4}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Date (Optional)</label>
            <input
              type="date"
              value={newEntry.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save/Cancel Buttons for individual entry */}
        <div className="flex gap-3 pt-4 border-t border-gray-700 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!newEntry.name || !newEntry.quote}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (!newEntry.name || !newEntry.quote) ? '#6B7280' : '#ec4899',
              color: 'white'
            }}
          >
            {isNew ? 'Add Testimonial' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-pink-900 flex items-center justify-center flex-shrink-0">
            {entry.photo_url || entry.photo ? (
              <img
                src={entry.photo_url || (typeof entry.photo === 'string' ? entry.photo : (entry.photo instanceof File ? URL.createObjectURL(entry.photo) : entry.photo))}
                alt={entry.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {(!entry.photo_url && !entry.photo) && (
              <LuUser size={20} className="text-pink-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-white font-semibold text-lg">
                {entry.name}
              </h4>
              {entry.profession && (
                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded flex items-center gap-1">
                  <LuBriefcase size={12} />
                  {entry.profession}
                </span>
              )}
            </div>
            
            {entry.quote && (
              <div className="bg-gray-800 rounded-lg p-3 mb-3 border-l-4 border-pink-500">
                <p className="text-gray-300 italic leading-relaxed text-sm">
                  &ldquo;{entry.quote}&rdquo;
                </p>
              </div>
            )}
            
            {entry.date && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LuCalendar size={14} />
                <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
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