'use client';

import React, { useState, useEffect } from 'react';
import { FaBehance } from 'react-icons/fa';

export default function BehanceProfileEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? value : JSON.stringify(value);
        const extractedUsername = extractUsername(parsed);
        setUsername(extractedUsername);
      } catch (e) {
        const extractedUsername = extractUsername(value || '');
        setUsername(extractedUsername);
      }
    }
  }, [value]);

  const extractUsername = (url) => {
    if (!url) return '';
    // Handle behance.net/username format
    const match = url.match(/behance\.net\/([^\/\?]+)/);
    return match ? match[1] : '';
  };

  const constructBehanceUrl = (username) => {
    if (!username) return '';
    const cleanUsername = username.trim();
    return cleanUsername ? `https://www.behance.net/${cleanUsername}` : '';
  };

  const handleSave = () => {
    const cleanUsername = username.trim();
    const fullUrl = constructBehanceUrl(cleanUsername);
    
    console.log('💾 BEHANCE-PROFILE-EDITOR: Saving data:', {
      username: cleanUsername,
      fullUrl: fullUrl
    });
    
    onChange(fullUrl);
    onSave && onSave(fullUrl);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div
      className="w-full"
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Behance Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            background: 'linear-gradient(45deg, #1769FF 0%, #0056CC 100%)'
          }}>
            <FaBehance className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Behance Profile</h3>
            <p className="text-gray-400 text-sm">Add your Behance username</p>
          </div>
        </div>
      </div>

      {/* Content with username input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Behance Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          
          <p className="text-gray-400 text-xs mt-2">Enter your Behance username</p>
        </div>

        {/* Profile preview */}
        {username && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Profile Preview</h4>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
                  background: 'linear-gradient(45deg, #1769FF 0%, #0056CC 100%)'
                }}>
                  <FaBehance className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">@{username}</div>
                  <div className="text-gray-400 text-xs">Behance User</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              background: username.trim() 
                ? 'linear-gradient(45deg, #1769FF 0%, #0056CC 100%)'
                : '#333',
              color: '#ffffff'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 