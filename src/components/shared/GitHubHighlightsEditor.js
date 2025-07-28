'use client';
import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';

export default function GitHubHighlightsEditor({ value = '', onChange, onSave, onCancel }) {
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
          setHighlights([{ url: value.trim(), title: 'GitHub Content', description: 'Check out this GitHub content!' }]);
        } else {
          setHighlights([]);
        }
      }
    } else {
      setHighlights([]);
    }
  }, [value]);

           const extractGitHubInfo = (url) => {
           // Extract info from various GitHub URL formats
           const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
           const gistMatch = url.match(/gist\.github\.com\/([^\/]+)\/([^\/\?#]+)/);
           const issueMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
           const prMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
           const userMatch = url.match(/github\.com\/([^\/\?#]+)$/);
           
           if (repoMatch) {
             return {
               type: 'repository',
               owner: repoMatch[1],
               repo: repoMatch[2]
             };
           } else if (gistMatch) {
             return {
               type: 'gist',
               owner: gistMatch[1],
               gistId: gistMatch[2]
             };
           } else if (issueMatch) {
             return {
               type: 'issue',
               owner: issueMatch[1],
               repo: issueMatch[2],
               number: issueMatch[3]
             };
           } else if (prMatch) {
             return {
               type: 'pull_request',
               owner: prMatch[1],
               repo: prMatch[2],
               number: prMatch[3]
             };
           } else if (userMatch) {
             return {
               type: 'user',
               username: userMatch[1]
             };
           }
           return null;
         };

           const generateDefaultTitle = (url) => {
           const githubInfo = extractGitHubInfo(url);
           if (githubInfo) {
             switch (githubInfo.type) {
               case 'repository':
                 return `${githubInfo.owner}/${githubInfo.repo}`;
               case 'gist':
                 return `@${githubInfo.owner}'s Gist`;
               case 'issue':
                 return `Issue #${githubInfo.number} in ${githubInfo.owner}/${githubInfo.repo}`;
               case 'pull_request':
                 return `PR #${githubInfo.number} in ${githubInfo.owner}/${githubInfo.repo}`;
               case 'user':
                 return `@${githubInfo.username}`;
               default:
                 return 'GitHub Content';
             }
           }
           return 'GitHub Content';
         };

  const handleAddHighlight = () => {
    if (newUrl.trim()) {
      const githubInfo = extractGitHubInfo(newUrl.trim());
      const newHighlight = {
        id: Date.now(),
        url: newUrl.trim(),
        title: generateDefaultTitle(newUrl.trim()),
        description: 'Check out this GitHub content!'
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
      {/* GitHub Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <FaGithub className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">GitHub Highlights</h3>
            <p className="text-gray-400 text-sm">Add your best GitHub content</p>
          </div>
        </div>
      </div>

      {/* Content with URL input */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">GitHub URL</label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          
          <button
            onClick={handleAddHighlight}
            disabled={!newUrl.trim()}
            className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#238636',
              color: '#ffffff'
            }}
          >
            Add GitHub Content
          </button>
          
                           <p className="text-gray-400 text-xs mt-2">Paste GitHub URLs to showcase your best repositories, gists, issues, pull requests, and user profiles</p>
        </div>

        {/* Current highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Added Highlights</h4>
            <div className="space-y-2">
              {highlights.map((highlight) => {
                const githubInfo = extractGitHubInfo(highlight.url);
                return (
                  <div 
                    key={highlight.id}
                    className="p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FaGithub className="text-green-500 text-sm" />
                        <div className="text-white text-sm">
                          {githubInfo ? (
                                                             githubInfo.type === 'repository' ? `${githubInfo.owner}/${githubInfo.repo}` :
                                 githubInfo.type === 'gist' ? `@${githubInfo.owner}'s Gist` :
                                 githubInfo.type === 'issue' ? `Issue #${githubInfo.number}` :
                                 githubInfo.type === 'pull_request' ? `PR #${githubInfo.number}` :
                                 githubInfo.type === 'user' ? `@${githubInfo.username}` :
                                 'GitHub Content'
                          ) : 'GitHub Content'}
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
              backgroundColor: '#238636',
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