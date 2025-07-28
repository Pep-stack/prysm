'use client';
import React, { useState, useEffect } from 'react';
import { FaTiktok } from 'react-icons/fa';

export default function TikTokHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
  const [highlights, setHighlights] = useState([]);
  const [newUrl, setNewUrl] = useState('');


  useEffect(() => {
    if (value) {
      try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value);
        setHighlights(parsed);
      } catch (e) {
        // If it's a single URL string, convert to array
        if (typeof value === 'string' && value.trim()) {
          setHighlights([{ url: value.trim(), title: 'TikTok Video', description: 'Check out this TikTok video!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

  const extractTikTokInfo = (url) => {
    // Extract username and video ID from TikTok URL
    const tiktokMatch = url.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
    const vmMatch = url.match(/vm\.tiktok\.com\/([^&\s]+)/);
    
    if (tiktokMatch) {
      return {
        username: tiktokMatch[1],
        videoId: tiktokMatch[2]
      };
    } else if (vmMatch) {
      return {
        videoId: vmMatch[1]
      };
    }
    return null;
  };

  const generateDefaultTitle = (url) => {
    const tiktokInfo = extractTikTokInfo(url);
    if (tiktokInfo) {
      if (tiktokInfo.username) {
        return `@${tiktokInfo.username}'s TikTok`;
      }
      return `TikTok Video (${tiktokInfo.videoId})`;
    }
    return 'TikTok Video';
  };

  const handleAddHighlight = () => {
    if (newUrl.trim()) {
      const tiktokInfo = extractTikTokInfo(newUrl.trim());
      const newHighlight = {
        id: Date.now(),
        url: newUrl.trim(),
        title: generateDefaultTitle(newUrl.trim()),
        description: 'Check out this TikTok video!'
      };
      setHighlights([...highlights, newHighlight]);
      setNewUrl('');

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
      {/* TikTok Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <FaTiktok className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">TikTok Highlights</h3>
            <p className="text-gray-400 text-sm">Add your best TikTok videos</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">TikTok Video URL</label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <button
            onClick={handleAddHighlight}
            disabled={!newUrl.trim()}
            className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#fe2c55',
              color: '#ffffff'
            }}
          >
            Add TikTok Video
          </button>
          
          <p className="text-gray-400 text-xs mt-2">Paste TikTok video URLs to showcase your best content</p>
        </div>

        {/* Current highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Added Highlights</h4>
            <div className="space-y-2">
              {highlights.map((highlight) => {
                const tiktokInfo = extractTikTokInfo(highlight.url);
                return (
                  <div 
                    key={highlight.id}
                    className="p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FaTiktok className="text-pink-500 text-sm" />
                        <div className="text-white text-sm">
                          {tiktokInfo?.username ? `@${tiktokInfo.username}` : 'TikTok Video'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveHighlight(highlight.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

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
              backgroundColor: '#fe2c55',
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