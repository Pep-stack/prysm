import React, { useState } from 'react';
import EditClientTestimonialModal from '../modal/EditClientTestimonialModal';
import { LuPlus, LuPencil, LuTrash2, LuHeart, LuUser, LuCalendar, LuBriefcase } from 'react-icons/lu';
import { useTestimonials } from '../../hooks/useTestimonials';

export default function ClientTestimonialSelector({ value = [], onChange, userId, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  // Use testimonials hook for Supabase integration
  const { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials(userId);

  const handleAdd = () => {
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleDelete = async (index) => {
    const testimonial = displayTestimonials[index];
    if (testimonial.id) {
      await deleteTestimonial(testimonial.id);
    }
    // Also update local state for immediate UI feedback
    const newValue = displayTestimonials.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleSave = async (testimonial) => {
    console.log('🎯 TESTIMONIAL-SAVE: Starting save process', {
      testimonial,
      editIndex,
      userId,
      displayTestimonialsLength: displayTestimonials.length
    });

    try {
      if (editIndex !== null) {
        // Edit existing
        console.log('✏️ TESTIMONIAL-SAVE: Editing existing testimonial');
        const existingTestimonial = displayTestimonials[editIndex];
        if (existingTestimonial.id) {
          console.log('📝 TESTIMONIAL-SAVE: Updating testimonial with ID:', existingTestimonial.id);
          await updateTestimonial(existingTestimonial.id, testimonial);
        }
        // Update local state
        const newValue = [...displayTestimonials];
        newValue[editIndex] = { ...existingTestimonial, ...testimonial };
        onChange(newValue);
      } else {
        // Add new
        console.log('➕ TESTIMONIAL-SAVE: Adding new testimonial');
        const newTestimonial = await addTestimonial(testimonial);
        
        if (newTestimonial) {
          console.log('✅ TESTIMONIAL-SAVE: New testimonial added with ID:', newTestimonial.id);
          onChange([...displayTestimonials, newTestimonial]);
        } else {
          console.log('⚠️ TESTIMONIAL-SAVE: New testimonial added but no ID returned, using local data');
          onChange([...displayTestimonials, { ...testimonial, id: Date.now() }]);
        }
      }

      setModalOpen(false);
      setEditIndex(null);
      console.log('✅ TESTIMONIAL-SAVE: Save operation completed successfully');
    } catch (error) {
      console.error('❌ TESTIMONIAL-SAVE: Error during save operation');
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error?.message || 'No message');
      console.error('❌ Error stack:', error?.stack || 'No stack');
      console.error('❌ Error name:', error?.name || 'No name');
      console.error('❌ Testimonial data:', testimonial);
      console.error('❌ UserId:', userId);
      console.error('❌ Is editing:', editIndex !== null);
      
      // Try to stringify the error
      try {
        console.error('❌ Error JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      } catch (jsonErr) {
        console.error('❌ Could not stringify error:', jsonErr);
      }
      
      // Show error to user
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      alert(`Error saving testimonial: ${errorMessage}`);
      
      // Don't close modal on error so user can retry
      // setModalOpen(false);
      // setEditIndex(null);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleMainSave = () => {
    // Save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
  };

  // Use testimonials from Supabase if available, otherwise fall back to value prop
  // Also sync Supabase data with local state when it changes
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
        {/* Testimonials List */}
        {displayTestimonials.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-16 h-16 bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuHeart size={24} className="text-pink-300" />
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">No testimonials yet</h4>
            <p className="text-gray-400 text-sm mb-4">Add your first client testimonial to get started</p>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Add First Testimonial
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id || index}
                testimonial={testimonial}
                index={index}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
              />
            ))}
            
            <button
              onClick={handleAdd}
              className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              + Add Testimonial
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

      {/* Modal */}
      <EditClientTestimonialModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        testimonial={editIndex !== null ? displayTestimonials[editIndex] : null}
        isEditing={editIndex !== null}
      />
    </div>
  );
} 

// TestimonialCard component for display mode
function TestimonialCard({ testimonial, index, onEdit, onDelete }) {
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-pink-900 flex items-center justify-center flex-shrink-0">
            {testimonial.photo_url || testimonial.photo ? (
              <img
                src={testimonial.photo_url || (typeof testimonial.photo === 'string' ? testimonial.photo : (testimonial.photo instanceof File ? URL.createObjectURL(testimonial.photo) : testimonial.photo))}
                alt={testimonial.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {(!testimonial.photo_url && !testimonial.photo) && (
              <LuUser size={20} className="text-pink-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-white font-semibold text-lg">
                {testimonial.name}
              </h4>
              {testimonial.profession && (
                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded flex items-center gap-1">
                  <LuBriefcase size={12} />
                  {testimonial.profession}
                </span>
              )}
            </div>
            
            {testimonial.quote && (
              <div className="bg-gray-800 rounded-lg p-3 mb-3 border-l-4 border-pink-500">
                <p className="text-gray-300 italic leading-relaxed text-sm">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
            )}
            
            {testimonial.date && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LuCalendar size={14} />
                <span>{new Date(testimonial.date).toLocaleDateString('en-US', { 
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