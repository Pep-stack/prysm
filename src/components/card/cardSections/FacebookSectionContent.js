'use client';

import React from 'react';

// Placeholder Icon (Replace with actual Facebook icon later)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
    <path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10 10-4.49 10-10-4.5-10-10-10zm4.5 10h-3v7h-4v-7h-2v-4h2V8.12c0-1.68 1.19-3.12 2.81-3.12h2.19v4h-1.94c-.31 0-.56.25-.56.56V12h2.5l-.5 4z"/>
  </svg>
);

export default function FacebookSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const facebookUrl = profile?.facebook;

  const isValidUrl = (url) => {
    try { new URL(url); return url && url.includes('facebook.com'); } catch (_) { return false; }
  };

  if (isValidUrl(facebookUrl)) {
    const fullUrl = facebookUrl.startsWith('http') ? facebookUrl : `https://${facebookUrl}`;
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Facebook Profile</h3>
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <FacebookIcon />
          <span>View Profile</span>
        </a>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Facebook Profile URL</p>
      </div>
    );
  }
} 