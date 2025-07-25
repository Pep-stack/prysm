import React, { useState } from 'react';
import { LuUser, LuCalendar, LuBriefcase, LuUpload, LuX } from 'react-icons/lu';

export default function EditClientTestimonialModal({ isOpen, onClose, onSave, initialData }) {
  const [photo, setPhoto] = useState(initialData?.photo || null);
  const [name, setName] = useState(initialData?.name || '');
  const [profession, setProfession] = useState(initialData?.profession || '');
  const [quote, setQuote] = useState(initialData?.quote || '');
  const [date, setDate] = useState(initialData?.date || '');

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data with proper date handling
    const testimonialData = {
      photo,
      name: name.trim(),
      profession: profession.trim(),
      quote: quote.trim(),
      date: date && date.trim() !== '' ? date : null
    };
    
    console.log('📝 MODAL-SUBMIT: Sending testimonial data:', testimonialData);
    onSave(testimonialData);
  };

  const handleClose = () => {
    // Reset form
    setPhoto(initialData?.photo || null);
    setName(initialData?.name || '');
    setProfession(initialData?.profession || '');
    setQuote(initialData?.quote || '');
    setDate(initialData?.date || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialData?.name ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {initialData?.name ? 'Update client feedback' : 'Share client feedback'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Client Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                {photo ? (
                  <img
                    src={typeof photo === 'string' ? photo : (photo instanceof File ? URL.createObjectURL(photo) : photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {(!photo || typeof photo !== 'string') && (
                  <LuUser size={24} className="text-primary" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file-input file-input-bordered file-input-sm w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Add a professional photo
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Client Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter client name"
              required
            />
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="input input-bordered w-full"
              placeholder="e.g., CEO, Designer, Developer"
            />
          </div>

          {/* Quote */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Testimonial *
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="What did the client say about your work?"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn"
              style={{ 
                backgroundColor: 'transparent', 
                borderColor: '#e2e8f0', 
                color: '#64748b',
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              style={{ 
                backgroundColor: '#00C48C', 
                borderColor: '#00C48C', 
                color: 'white',
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)'
              }}
            >
              {initialData?.name ? 'Update' : 'Add'} Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 