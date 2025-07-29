'use client';

import React, { useState, useEffect } from 'react';
import { FaInstagram } from 'react-icons/fa';

export default function InstagramProfileEditor({ value = '', onChange, onSave, onCancel }) {
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? value : JSON.stringify(value);
        setProfileUrl(parsed);
      } catch (e) {
        setProfileUrl(value || '');
      }
    }
  }, [value]);

  const extractUsername = (url) => {
    if (!url) return '';
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  };

  const handleSave = () => {
    const data = profileUrl.trim();
    console.log('💾 INSTAGRAM-PROFILE-EDITOR: Saving data:', {
      profileUrl: profileUrl,
      trimmedData: data,
      username: extractUsername(data)
    });
    onChange(data);
    onSave && onSave(data);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const username = extractUsername(profileUrl);

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
      {/* Instagram Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
          }}>
            <FaInstagram className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Instagram Profile</h3>
            <p className="text-gray-400 text-sm">Add your Instagram profile</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Instagram Profile URL</label>
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://www.instagram.com/username"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <p className="text-gray-400 text-xs mt-2">Add your Instagram profile URL to share your social media presence</p>
        </div>

        {/* Profile preview */}
        {username && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Profile Preview</h4>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
                }}>
                  <FaInstagram className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">@{username}</div>
                  <div className="text-gray-400 text-xs">Instagram User</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white font-medium mb-2 text-sm">💡 How does this work?</h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Add your Instagram profile URL</li>
            <li>• Visitors can navigate directly to your profile</li>
            <li>• Perfect for sharing your Instagram presence</li>
            <li>• Clear the URL field to remove your profile</li>
          </ul>
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
            disabled={!profileUrl.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: profileUrl.trim() 
                ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
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