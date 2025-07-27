'use client';
import React, { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function EmailEditor({ value = '', onChange, onSave, onCancel }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (value) {
      // Extract email from mailto: URL or use directly
      if (value.startsWith('mailto:')) {
        setEmail(value.replace('mailto:', ''));
      } else {
        setEmail(value);
      }
    } else {
      setEmail('');
    }
  }, [value]);

  const handleSave = () => {
    if (email.trim()) {
      // Convert email to mailto: URL
      const emailUrl = `mailto:${email.trim()}`;
      onChange(emailUrl);
      onSave(emailUrl);
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
      {/* Email Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#4285F4'
          }}>
            <FaEnvelope className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Email Address</h3>
            <p className="text-gray-400 text-sm">Add your email address</p>
          </div>
        </div>
      </div>

      {/* Content with email input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll create a mailto: link for easy contact</p>
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
            disabled={!email.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#4285F4',
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