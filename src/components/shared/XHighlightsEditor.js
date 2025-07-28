'use client';
import React, { useState, useEffect } from 'react';
import { FaXTwitter } from 'react-icons/fa6';

export default function XHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
  const [highlights, setHighlights] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value);
        setHighlights(parsed);
      } catch (e) {
        // If it's a single URL string, convert to array
        if (typeof value === 'string' && value.trim()) {
          setHighlights([{ url: value.trim(), title: 'X Post', description: 'Check out this X post!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

  const extractXInfo = (url) => {
    // Extract username and post ID from X URL
    const xMatch = url.match(/x\.com\/([^\/]+)\/status\/(\d+)/);
    if (xMatch) {
      return {
        username: xMatch[1],
        postId: xMatch[2]
      };
    }
    return null;
  };

  const generateDefaultTitle = (url) => {
    const xInfo = extractXInfo(url);
    if (xInfo) {
      return `@${xInfo.username}'s post`;
    }
    return 'X Post';
  };

  const handleAddHighlight = () => {
    if (newUrl.trim()) {
      const xInfo = extractXInfo(newUrl.trim());
      const newHighlight = {
        id: Date.now(),
        url: newUrl.trim(),
        title: generateDefaultTitle(newUrl.trim()),
        description: newDescription.trim() || 'Check out this X post!'
      };
      setHighlights([...highlights, newHighlight]);
      setNewUrl('');
      setNewDescription('');
    }
  };

  const handleRemoveHighlight = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const handleSave = () => {
    // Always save, even if highlights array is empty
    onChange(highlights);
    onSave(highlights);
    if (onCancel) onCancel();
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
      {/* X Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <FaXTwitter className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">X Highlights</h3>
            <p className="text-gray-400 text-sm">Add your best X posts</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">X Post URL</label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://x.com/username/status/123456789"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <label className="block text-white font-medium mb-2 text-sm">Description (optional)</label>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a custom description for this post..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a', resize: 'vertical' }}
          />
          
          <button
            onClick={handleAddHighlight}
            disabled={!newUrl.trim()}
            className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            Add X Post
          </button>
          
          <p className="text-gray-400 text-xs mt-2">Paste X post URLs to showcase your best content</p>
        </div>

        {/* Current highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Added Highlights</h4>
            <div className="space-y-2">
              {highlights.map((highlight) => {
                const xInfo = extractXInfo(highlight.url);
                return (
                  <div 
                    key={highlight.id}
                    className="p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FaXTwitter className="text-white text-sm" />
                        <div className="text-white text-sm">
                          {xInfo ? `@${xInfo.username}` : 'X Post'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveHighlight(highlight.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    {highlight.description && (
                      <div className="text-gray-400 text-xs mb-1">
                        &quot;{highlight.description}&quot;
                      </div>
                    )}
                    <div className="text-gray-500 text-xs truncate">
                      {highlight.url}
                    </div>
                  </div>
                );
              })}
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
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
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