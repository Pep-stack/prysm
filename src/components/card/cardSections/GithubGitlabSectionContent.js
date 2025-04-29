'use client';

import React from 'react';

// Placeholder Icon (Replace with actual icons later)
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
);

export default function GithubGitlabSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const urlsString = profile?.github_gitlab;
  const urls = urlsString ? urlsString.split(',').map(url => url.trim()).filter(url => url) : [];

  const isValidUrl = (url) => {
    // Basic check, doesn't guarantee it's a valid git repo URL
    try { new URL(url); return true; } catch (_) { return false; }
  };

  const validUrls = urls.filter(isValidUrl);

  if (validUrls.length > 0) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>GitHub / GitLab</h3>
        <div>
          {validUrls.map((url, index) => (
            <a 
              key={index} 
              href={url.startsWith('http') ? url : `https://${url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', textDecoration: 'none', color: 'inherit' }}
            >
              <CodeIcon /> 
              <span>{url.replace(/^https?:\/\//, '')}</span> {/* Show URL without protocol */}
            </a>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add GitHub/GitLab URL(s)</p>
      </div>
    );
  }
} 