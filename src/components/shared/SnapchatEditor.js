'use client';
import React, { useState, useEffect } from 'react';
import { FaSnapchatGhost } from 'react-icons/fa';

export default function SnapchatEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (value) {
      // Extract username from Snapchat URL or use directly
      const snapchatMatch = value.match(/snapchat\.com\/add\/([^\/\?]+)/);
      if (snapchatMatch) {
        setUsername(snapchatMatch[1]);
      } else {
        // If it's just a username, use it directly
        setUsername(value.replace('https://snapchat.com/add/', '').replace('https://www.snapchat.com/add/', ''));
      }
    } else {
      setUsername('');
    }
  }, [value]);

  const handleSave = () => {
    if (username.trim()) {
      // Convert username to Snapchat URL
      const snapchatUrl = `https://snapchat.com/add/${username.trim()}`;
      onChange(snapchatUrl);
      onSave(snapchatUrl);
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
      {/* Snapchat Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#FFFC00'
          }}>
            <FaSnapchatGhost className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Snapchat</h3>
            <p className="text-gray-400 text-sm">Add your Snapchat username</p>
          </div>
        </div>
      </div>

      {/* Content with username input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll create a Snapchat add link for easy connection</p>
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
              backgroundColor: '#FFFC00',
              color: '#000000'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 