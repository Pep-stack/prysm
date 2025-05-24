'use client';

import React from 'react';

// Simple inline SVG for X (formerly Twitter) logo
const XIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const XIconCompact = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="#000000" 
    style={{ width: '20px', height: '20px' }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function XSectionContent({ profile, styles, isCompact = false }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const xProfileUrl = profile?.x_profile; // Use the correct column name

  // Basic validation
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (_) {
      return false;  
    }
  };

  if (isValidUrl(xProfileUrl)) {
    if (isCompact) {
      // Compact mode - just the icon as a link
      return (
        <a 
           href={xProfileUrl} 
           target="_blank" 
           rel="noopener noreferrer" 
           style={sectionStyle}
           title={`Visit ${profile.name || 'user'}'s X Profile`}
        >
          <XIconCompact />
        </a>
      );
    }

    // Regular mode - full section
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>X (Twitter)</h3>
        <a 
           href={xProfileUrl} 
           target="_blank" 
           rel="noopener noreferrer" 
           style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: '#000000' }} // Black color for X
           title={`Visit ${profile.name || 'user'}'s X Profile`}
        >
          <XIcon />
          <span>View Profile</span> 
        </a>
      </div>
    );
  } else {
    if (isCompact) {
      return null; // Don't show placeholder in compact mode
    }
    
    return <div style={placeholderStyle}><p>Click to add your X profile URL</p></div>;
  }
} 