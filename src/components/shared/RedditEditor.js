'use client';
import React, { useState, useEffect } from 'react';
import { FaRedditAlien } from 'react-icons/fa';

export default function RedditEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (value) {
      // Extract username from Reddit URL
      const redditMatch = value.match(/reddit\.com\/user\/([^\/\?]+)/);
      if (redditMatch) {
        setUsername(redditMatch[1]);
      } else {
        // If it's just a username, use it directly
        setUsername(value.replace('https://reddit.com/user/', '').replace('https://www.reddit.com/user/', ''));
      }
    } else {
      setUsername('');
    }
  }, [value]);

  const handleSave = () => {
    if (username.trim()) {
      // Convert username to Reddit URL
      const redditUrl = `https://reddit.com/user/${username.trim()}`;
      onChange(redditUrl);
      onSave(redditUrl);
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
      {/* Reddit Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#FF4500'
          }}>
            <FaRedditAlien className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Reddit Profile</h3>
            <p className="text-gray-400 text-sm">Connect your Reddit account</p>
          </div>
        </div>
      </div>

      {/* Content with username input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">reddit.com/user/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full pl-32 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll automatically create your Reddit profile link</p>
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
              backgroundColor: '#FF4500',
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