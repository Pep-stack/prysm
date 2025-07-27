'use client';
import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';

export default function GitHubEditor({ value = '', onChange, onSave, onCancel }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (value) {
      // Extract username from GitHub URL
      const githubMatch = value.match(/github\.com\/([^\/\?]+)/);
      if (githubMatch) {
        setUsername(githubMatch[1]);
      } else {
        // If it's just a username, use it directly
        setUsername(value.replace('https://github.com/', '').replace('https://www.github.com/', ''));
      }
    } else {
      setUsername('');
    }
  }, [value]);

  const handleSave = () => {
    if (username.trim()) {
      // Convert username to GitHub URL
      const githubUrl = `https://github.com/${username.trim()}`;
      onChange(githubUrl);
      onSave(githubUrl);
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
      {/* GitHub Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <FaGithub className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">GitHub Profile</h3>
            <p className="text-gray-400 text-sm">Connect your GitHub account</p>
          </div>
        </div>
      </div>

      {/* Content with username input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">github.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full pl-24 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll automatically create your GitHub profile link</p>
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
              backgroundColor: '#ffffff',
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