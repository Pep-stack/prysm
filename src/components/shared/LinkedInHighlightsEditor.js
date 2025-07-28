'use client';

import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

export default function LinkedInHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
  const [highlights, setHighlights] = useState([]);
  const [newUrl, setNewUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Parse existing highlights on mount
  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (Array.isArray(parsed)) {
          setHighlights(parsed);
        }
      } catch (error) {
        console.error('Error parsing LinkedIn highlights:', error);
        setHighlights([]);
      }
    }
  }, [value]);

  // Extract post ID from LinkedIn URL
  const extractPostId = (url) => {
    const activityMatch = url.match(/activity_(\d+)/);
    const updateMatch = url.match(/update\/([^&\s]+)/);
    
    if (activityMatch) {
      return activityMatch[1];
    } else if (updateMatch) {
      return updateMatch[1];
    }
    return null;
  };

  // Generate default title from URL
  const generateDefaultTitle = (url) => {
    const postId = extractPostId(url);
    if (postId) {
      return `LinkedIn Post (${postId})`;
    }
    return 'LinkedIn Post';
  };

  // Validate LinkedIn URL
  const isValidLinkedInUrl = (url) => {
    const linkedinUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed\/update|pulse)\/[^&\s]+/;
    return linkedinUrlPattern.test(url);
  };

  const handleAddHighlight = () => {
    if (!newUrl.trim()) return;

    if (!isValidLinkedInUrl(newUrl)) {
      alert('Please enter a valid LinkedIn post URL');
      return;
    }

    const newHighlight = {
      id: Date.now(),
      url: newUrl.trim(),
      title: generateDefaultTitle(newUrl.trim()),
      description: 'Check out this LinkedIn post!'
    };

    const updatedHighlights = [...highlights, newHighlight];
    setHighlights(updatedHighlights);
    onChange(JSON.stringify(updatedHighlights));

    // Reset form
    setNewUrl('');

  };

  const handleRemoveHighlight = (id) => {
    const updatedHighlights = highlights.filter(h => h.id !== id);
    setHighlights(updatedHighlights);
    onChange(JSON.stringify(updatedHighlights));
  };

  const handleSave = () => {
    onSave(JSON.stringify(highlights));
  };

  const handleCancel = () => {
    onCancel();
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
      {/* LinkedIn Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#0077B5'
          }}>
            <FaLinkedin className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">LinkedIn Highlights</h3>
            <p className="text-gray-400 text-sm">Add your best LinkedIn posts</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Add new highlight form */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            LinkedIn Post URL
          </label>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/username_activity_1234567890"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <button
            onClick={handleAddHighlight}
            disabled={!newUrl.trim() || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#0077B5',
              color: 'white'
            }}
          >
            <FaPlus className="text-sm" />
            Add Post
          </button>
        </div>

        {/* Existing highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3">Your LinkedIn Highlights</h4>
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FaLinkedin className="text-blue-500 flex-shrink-0" />
                        <span className="text-white font-medium text-sm truncate">
                          {highlight.title}
                        </span>
                      </div>

                      <div className="text-gray-500 text-xs truncate">
                        {highlight.url}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={highlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Open in LinkedIn"
                      >
                        <FaExternalLinkAlt />
                      </a>
                      <button
                        onClick={() => handleRemoveHighlight(highlight.id)}
                        className="text-red-400 hover:text-red-300 text-sm p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Remove post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
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
              backgroundColor: '#0077B5',
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