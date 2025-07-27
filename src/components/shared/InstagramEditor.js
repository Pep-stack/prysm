'use client';

import React, { useState, useEffect } from 'react';
import { FaInstagram } from 'react-icons/fa';

export default function InstagramEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  // Extract username from URL or use direct value
  useEffect(() => {
    if (value) {
      // If it's a URL, extract username
      if (value.includes('instagram.com')) {
        const urlParts = value.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        // Remove any query parameters
        const cleanUsername = lastPart.split('?')[0];
        setUsername(cleanUsername);
      } else {
        // If it's already just a username
        setUsername(value);
      }
    }
  }, [value]);

  const handleSave = () => {
    if (username.trim()) {
      // Convert username to Instagram URL
      const instagramUrl = `https://www.instagram.com/${username.trim()}`;
      // Pass the URL directly to the parent save handler (overrideValue)
      onChange(instagramUrl);
      onSave(instagramUrl);
      // Close the modal after successful save
      if (onCancel) onCancel();
    }
  };

  const handleCancel = () => {
    // Reset local state but leave stored value untouched
    setUsername('');
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
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#E1306C'
          }}>
            <FaInstagram className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Instagram Profile</h3>
            <p className="text-gray-400 text-sm">Connect your Instagram account</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">
            We&apos;ll automatically create your Instagram profile link
          </p>
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
            disabled={!username.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#E1306C',
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