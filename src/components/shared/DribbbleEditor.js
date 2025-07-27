'use client';
import React, { useState, useEffect } from 'react';
import { FaDribbble } from 'react-icons/fa';

export default function DribbbleEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (value) {
      // Extract username from Dribbble URL
      const dribbbleMatch = value.match(/dribbble\.com\/([^\/\?]+)/);
      if (dribbbleMatch) {
        setUsername(dribbbleMatch[1]);
      } else {
        // If it's just a username, use it directly
        setUsername(value.replace('https://dribbble.com/', '').replace('https://www.dribbble.com/', ''));
      }
    } else {
      setUsername('');
    }
  }, [value]);

  const handleSave = () => {
    if (username.trim()) {
      // Convert username to Dribbble URL
      const dribbbleUrl = `https://dribbble.com/${username.trim()}`;
      onChange(dribbbleUrl);
      onSave(dribbbleUrl);
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
      {/* Dribbble Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#EA4C89'
          }}>
            <FaDribbble className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Dribbble Profile</h3>
            <p className="text-gray-400 text-sm">Connect your Dribbble account</p>
          </div>
        </div>
      </div>

      {/* Content with username input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">dribbble.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full pl-28 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll automatically create your Dribbble profile link</p>
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
              backgroundColor: '#EA4C89',
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