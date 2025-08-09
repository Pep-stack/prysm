'use client';

import React, { useState, useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa6';

export default function SpotifyEditor({ value = '', onChange, onSave, onCancel }) {
  const [url, setUrl] = useState(value);

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const handleSave = () => {
    onChange(url);
    onSave && onSave(url);
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
      {/* Spotify Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            background: '#1DB954'
          }}>
            <FaSpotify className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Spotify</h3>
            <p className="text-gray-400 text-sm">Add your Spotify link</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Spotify URL</label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://open.spotify.com/..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              style={{ backgroundColor: '#2a2a2a' }}
            />
          </div>
          
          <p className="text-gray-400 text-xs mt-2">Enter your Spotify profile, playlist, or track URL</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!url.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: url.trim() 
                ? '#1DB954'
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
