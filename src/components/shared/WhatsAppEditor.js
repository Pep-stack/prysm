'use client';
import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppEditor({ value = '', onChange, onSave, onCancel }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value) {
      // Extract phone number from WhatsApp URL or tel: URL
      if (value.startsWith('https://wa.me/')) {
        setPhoneNumber(value.replace('https://wa.me/', ''));
      } else if (value.startsWith('tel:')) {
        setPhoneNumber(value.replace('tel:', ''));
      } else {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  const handleSave = () => {
    if (phoneNumber.trim()) {
      // Convert phone number to WhatsApp chat URL
      const whatsappUrl = `https://wa.me/${phoneNumber.trim().replace(/\D/g, '')}`;
      onChange(whatsappUrl);
      onSave(whatsappUrl);
      if (onCancel) onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
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
      {/* WhatsApp Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#25D366'
          }}>
            <FaWhatsapp className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">WhatsApp</h3>
            <p className="text-gray-400 text-sm">Add your WhatsApp number</p>
          </div>
        </div>
      </div>

      {/* Content with phone number input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We&apos;ll create a WhatsApp chat link for easy messaging</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!phoneNumber.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#25D366',
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