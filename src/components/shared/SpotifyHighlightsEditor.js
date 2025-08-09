'use client';
import React, { useState, useEffect } from 'react';
import { FaSpotify, FaCopy, FaCode } from 'react-icons/fa6';

export default function SpotifyHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
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
          setHighlights([{ embedCode: '', url: value.trim(), title: 'Spotify Content', description: 'Check out this music!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

  const extractSpotifyInfoFromEmbed = (embedCode) => {
    // Extract Spotify embed info from iframe src
    const srcMatch = embedCode.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      const match = src.match(/spotify\.com\/embed\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        return { 
          contentType: match[1], 
          spotifyId: match[2],
          embedUrl: src,
          url: `https://open.spotify.com/${match[1]}/${match[2]}`
        };
      }
    }
    return null;
  };

  const extractSpotifyInfoFromUrl = (url) => {
    // Extract Spotify ID and type from various Spotify URL formats
    const match = url.match(/spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return { 
        contentType: match[1], 
        spotifyId: match[2],
        url: url,
        embedUrl: `https://open.spotify.com/embed/${match[1]}/${match[2]}`
      };
    }
    return null;
  };

  const generateDefaultTitle = (info) => {
    if (info) {
      const typeMap = {
        track: 'Track',
        playlist: 'Playlist',
        album: 'Album',
        artist: 'Artist'
      };
      return `Spotify ${typeMap[info.contentType] || 'Content'}`;
    }
    return 'Spotify Content';
  };

  const handleAddHighlight = () => {
    if (!newEmbedCode.trim()) return;

    let spotifyInfo = null;
    let embedCode = '';
    let url = '';

    if (inputMode === 'embed') {
      // Handle embed code
      embedCode = newEmbedCode.trim();
      spotifyInfo = extractSpotifyInfoFromEmbed(embedCode);
      url = spotifyInfo?.url || '';
    } else {
      // Handle URL
      url = newEmbedCode.trim();
      spotifyInfo = extractSpotifyInfoFromUrl(url);
      if (spotifyInfo) {
        // Generate embed code from URL
        const height = spotifyInfo.contentType === 'track' ? '152' : '380';
        embedCode = `<iframe style="border-radius:12px" src="${spotifyInfo.embedUrl}" width="100%" height="${height}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
      }
    }

    if (spotifyInfo) {
      const newHighlight = {
        id: Date.now(),
        embedCode: embedCode,
        url: url,
        title: generateDefaultTitle(spotifyInfo),
        description: 'Check out this music!',
        contentType: spotifyInfo.contentType,
        spotifyId: spotifyInfo.spotifyId
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
            <h3 className="text-white font-semibold text-lg">Spotify Highlights</h3>
            <p className="text-gray-400 text-sm">Share your favorite music</p>
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
                  ? 'bg-green-500 text-white' 
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
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaSpotify className="inline mr-2" />
              Spotify URL
            </button>
          </div>
        </div>

        {/* Add new highlight */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            {inputMode === 'embed' ? 'Spotify Embed Code' : 'Spotify URL'}
          </label>
          <div className="flex gap-2">
            {inputMode === 'embed' ? (
              <textarea
                value={newEmbedCode}
                onChange={(e) => setNewEmbedCode(e.target.value)}
                placeholder='<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/..." width="100%" height="152" frameBorder="0"></iframe>'
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                style={{ backgroundColor: '#2a2a2a' }}
                rows={4}
              />
            ) : (
              <input
                type="url"
                value={newEmbedCode}
                onChange={(e) => setNewEmbedCode(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                background: newEmbedCode.trim() ? '#1DB954' : '#333',
                color: '#ffffff'
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            <p className="text-gray-400 text-xs">
              {inputMode === 'embed' 
                ? 'Paste the embed code from Spotify\'s &quot;Share&quot; → &quot;Embed track/playlist&quot;'
                : 'Add tracks, playlists, albums, or artists from Spotify'
              }
            </p>
            {inputMode === 'embed' && (
              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                <p className="text-green-400 text-xs font-medium mb-1">💡 Hoe krijg je de embed code:</p>
                <p className="text-gray-300 text-xs">
                  1. Open Spotify → Zoek je track/playlist<br/>
                  2. Klik op &quot;...&quot; → &quot;Delen&quot; → &quot;Nummer embedden&quot;<br/>
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
                      <FaSpotify className="text-green-400 text-sm flex-shrink-0" />
                      <div className="text-white text-sm font-medium truncate">
                        {highlight.title}
                      </div>
                      {highlight.embedCode && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
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
              background: '#1DB954',
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
