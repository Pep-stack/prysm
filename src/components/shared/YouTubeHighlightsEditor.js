'use client';
import React, { useState, useEffect } from 'react';
import { FaYoutube } from 'react-icons/fa';

export default function YouTubeHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
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
          setHighlights([{ url: value.trim(), title: 'YouTube Video', description: 'Check out this YouTube video!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

  const extractYouTubeInfo = (url) => {
    // Extract video ID from various YouTube URL formats
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    const shortMatch = url.match(/youtu\.be\/([^&\s]+)/);
    const embedMatch = url.match(/youtube\.com\/embed\/([^&\s]+)/);
    
    if (watchMatch) {
      return { videoId: watchMatch[1] };
    } else if (shortMatch) {
      return { videoId: shortMatch[1] };
    } else if (embedMatch) {
      return { videoId: embedMatch[1] };
    }
    return null;
  };

  const generateDefaultTitle = (url) => {
    const ytInfo = extractYouTubeInfo(url);
    if (ytInfo) {
      return `YouTube Video (${ytInfo.videoId})`;
    }
    return 'YouTube Video';
  };

  const handleAddHighlight = () => {
    if (newUrl.trim()) {
      const ytInfo = extractYouTubeInfo(newUrl.trim());
      const newHighlight = {
        id: Date.now(),
        url: newUrl.trim(),
        title: generateDefaultTitle(newUrl.trim()),
        description: 'Check out this YouTube video!'
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
      {/* YouTube Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#FF0000'
          }}>
            <FaYoutube className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">YouTube Highlights</h3>
            <p className="text-gray-400 text-sm">Add your best YouTube videos</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">YouTube Video URL</label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <button
            onClick={handleAddHighlight}
            disabled={!newUrl.trim()}
            className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#FF0000',
              color: '#ffffff'
            }}
          >
            Add YouTube Video
          </button>
          
          <p className="text-gray-400 text-xs mt-2">Paste YouTube video URLs to showcase your best content</p>
        </div>

        {/* Current highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Added Highlights</h4>
            <div className="space-y-2">
              {highlights.map((highlight) => {
                const ytInfo = extractYouTubeInfo(highlight.url);
                return (
                  <div 
                    key={highlight.id}
                    className="p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FaYoutube className="text-red-500 text-sm" />
                        <div className="text-white text-sm">
                          {ytInfo ? `Video ID: ${ytInfo.videoId}` : 'YouTube Video'}
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
              backgroundColor: '#FF0000',
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