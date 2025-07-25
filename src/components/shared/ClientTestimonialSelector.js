import React, { useState } from 'react';
import EditClientTestimonialModal from '../modal/EditClientTestimonialModal';
import { LuPlus, LuPencil, LuTrash2, LuHeart, LuUser, LuCalendar, LuBriefcase } from 'react-icons/lu';
import { useTestimonials } from '../../hooks/useTestimonials';

export default function ClientTestimonialSelector({ value = [], onChange, userId }) {
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
        newValue[editIndex] = testimonial;
        onChange(newValue);
      } else {
        // Add new
        console.log('➕ TESTIMONIAL-SAVE: Adding new testimonial');
        if (!userId) {
          throw new Error('No userId provided for adding testimonial');
        }
        const newTestimonial = await addTestimonial(testimonial);
        console.log('✅ TESTIMONIAL-SAVE: Successfully added testimonial:', newTestimonial);
        
        if (!newTestimonial) {
          throw new Error('Failed to add testimonial - no data returned');
        }
        
        // Update local state
        onChange([...displayTestimonials, newTestimonial]);
      }
      console.log('🎉 TESTIMONIAL-SAVE: Save completed successfully');
      setModalOpen(false);
      setEditIndex(null);
    } catch (error) {
      console.error('❌ TESTIMONIAL-SAVE: Error saving testimonial:');
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
      <div className="flex items-center justify-center py-8">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Client Testimonials</h3>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary shadow-sm"
          style={{ 
            backgroundColor: '#00C48C', 
            borderColor: '#00C48C', 
            borderRadius: '25px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LuPlus size={16} style={{ color: 'white' }} />
          </div>
          <span style={{ color: 'white' }}>New</span>
          <div style={{
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            paddingLeft: '8px',
            marginLeft: '4px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: 'white' }}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {displayTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LuHeart size={32} className="text-primary" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-6">No testimonials yet</h4>
            <button
              onClick={handleAdd}
              className="btn btn-primary gap-2 shadow-sm"
              style={{ 
                backgroundColor: '#00C48C', 
                borderColor: '#00C48C',
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LuPlus size={16} style={{ color: 'white' }} />
              </div>
              <span style={{ color: 'white' }}>Add Your First Testimonial</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-2 border-primary/20 overflow-hidden flex-shrink-0 shadow-sm">
                    {testimonial.photo_url || testimonial.photo ? (
                      <img
                        src={testimonial.photo_url || (typeof testimonial.photo === 'string' ? testimonial.photo : (testimonial.photo instanceof File ? URL.createObjectURL(testimonial.photo) : testimonial.photo))}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {(!testimonial.photo_url && !testimonial.photo) && (
                      <LuUser size={24} className="text-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      {testimonial.profession && (
                        <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <LuBriefcase size={12} />
                          {testimonial.profession}
                        </span>
                      )}
                    </div>
                    
                    {testimonial.quote && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-primary/20">
                        <p className="text-gray-700 italic leading-relaxed">
                          {testimonial.quote}
                        </p>
                      </div>
                    )}
                    
                    {testimonial.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <LuCalendar size={14} />
                        <span>{new Date(testimonial.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(index)}
                      className="btn btn-ghost btn-sm text-gray-600 hover:text-primary hover:bg-primary/10"
                      title="Edit testimonial"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="btn btn-ghost btn-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete testimonial"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <EditClientTestimonialModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        initialData={editIndex !== null ? displayTestimonials[editIndex] : {}}
      />
    </div>
  );
} 