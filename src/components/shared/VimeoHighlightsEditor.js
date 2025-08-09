'use client';
import React, { useState, useEffect } from 'react';
import { FaVimeo, FaCopy, FaCode } from 'react-icons/fa6';

export default function VimeoHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
  const [highlights, setHighlights] = useState([]);
  const [newEmbedCode, setNewEmbedCode] = useState('');
  const [inputMode, setInputMode] = useState('embed'); // 'embed' or 'url'

  useEffect(() => {
    if (value) {
      try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value);
        setHighlights(parsed);
      } catch (e) {
        // If it's a single URL string, convert to array
        if (typeof value === 'string' && value.trim()) {
          setHighlights([{ embedCode: '', url: value.trim(), title: 'Vimeo Video', description: 'Check out this video!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

  const extractVimeoInfoFromEmbed = (embedCode) => {
    // Extract Vimeo embed info from iframe src
    const srcMatch = embedCode.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      const match = src.match(/player\.vimeo\.com\/video\/(\d+)/);
      if (match) {
        return { 
          videoId: match[1],
          embedUrl: src,
          url: `https://vimeo.com/${match[1]}`
        };
      }
    }
    return null;
  };

  const extractVimeoInfoFromUrl = (url) => {
    // Extract Vimeo ID from various Vimeo URL formats
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      return { 
        videoId: match[1],
        url: url,
        embedUrl: `https://player.vimeo.com/video/${match[1]}`
      };
    }
    return null;
  };

  const generateDefaultTitle = (info) => {
    if (info) {
      return `Vimeo Video`;
    }
    return 'Vimeo Video';
  };

  const handleAddHighlight = () => {
    if (!newEmbedCode.trim()) return;

    let vimeoInfo = null;
    let embedCode = '';
    let url = '';

    if (inputMode === 'embed') {
      // Handle embed code
      embedCode = newEmbedCode.trim();
      vimeoInfo = extractVimeoInfoFromEmbed(embedCode);
      url = vimeoInfo?.url || '';
    } else {
      // Handle URL
      url = newEmbedCode.trim();
      vimeoInfo = extractVimeoInfoFromUrl(url);
      if (vimeoInfo) {
        // Generate embed code from URL
        embedCode = `<iframe src="${vimeoInfo.embedUrl}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    if (vimeoInfo) {
      const newHighlight = {
        id: Date.now(),
        embedCode: embedCode,
        url: url,
        title: generateDefaultTitle(vimeoInfo),
        description: 'Check out this video!',
        videoId: vimeoInfo.videoId
      };
      setHighlights([...highlights, newHighlight]);
      setNewEmbedCode('');
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
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Vimeo Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            background: '#1ab7ea'
          }}>
            <FaVimeo className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Vimeo Highlights</h3>
            <p className="text-gray-400 text-sm">Share your favorite videos</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Input mode toggle */}
        <div className="mb-4">
          <div className="flex gap-2 p-1 bg-gray-800 rounded-lg w-fit">
            <button
              onClick={() => setInputMode('embed')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'embed' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaCode className="inline mr-2" />
              Embed Code
            </button>
            <button
              onClick={() => setInputMode('url')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'url' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaVimeo className="inline mr-2" />
              Vimeo URL
            </button>
          </div>
        </div>

        {/* Add new highlight */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            {inputMode === 'embed' ? 'Vimeo Embed Code' : 'Vimeo URL'}
          </label>
          <div className="flex gap-2">
            {inputMode === 'embed' ? (
              <textarea
                value={newEmbedCode}
                onChange={(e) => setNewEmbedCode(e.target.value)}
                placeholder='<iframe src="https://player.vimeo.com/video/123456789" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                style={{ backgroundColor: '#2a2a2a' }}
                rows={4}
              />
            ) : (
              <input
                type="url"
                value={newEmbedCode}
                onChange={(e) => setNewEmbedCode(e.target.value)}
                placeholder="https://vimeo.com/123456789"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                style={{ backgroundColor: '#2a2a2a' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddHighlight();
                  }
                }}
              />
            )}
            <button
              onClick={handleAddHighlight}
              disabled={!newEmbedCode.trim()}
              className="px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed self-start"
              style={{
                background: newEmbedCode.trim() ? '#1ab7ea' : '#333',
                color: '#ffffff'
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            <p className="text-gray-400 text-xs">
              {inputMode === 'embed' 
                ? 'Paste the embed code from Vimeo\'s &quot;Share&quot; → &quot;Embed&quot; option'
                : 'Add videos from Vimeo'
              }
            </p>
            {inputMode === 'embed' && (
              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                <p className="text-blue-400 text-xs font-medium mb-1">💡 Hoe krijg je de embed code:</p>
                <p className="text-gray-300 text-xs">
                  1. Open Vimeo → Zoek je video<br/>
                  2. Klik op &quot;Share&quot; → &quot;Embed&quot;<br/>
                  3. Kopieer de code en plak hier
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Current Highlights</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {highlights.map((highlight) => (
                <div key={highlight.id} className="flex items-start justify-between p-3 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FaVimeo className="text-blue-400 text-sm flex-shrink-0" />
                      <div className="text-white text-sm font-medium truncate">
                        {highlight.title}
                      </div>
                      {highlight.embedCode && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          <FaCode className="inline mr-1" />
                          Embed
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs truncate mb-1">
                      {highlight.url}
                    </div>
                    {highlight.embedCode && (
                      <div className="text-gray-500 text-xs font-mono truncate">
                        {highlight.embedCode.substring(0, 60)}...
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveHighlight(highlight.id)}
                    className="ml-3 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              background: '#1ab7ea',
              color: '#ffffff'
            }}
          >
            Save Highlights
          </button>
        </div>
      </div>
    </div>
  );
}
