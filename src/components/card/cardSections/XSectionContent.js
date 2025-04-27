'use client';

import React from 'react';

// Simple inline SVG for X logo (adjust path data if needed)
const XIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

export default function XSectionContent({ profile, styles }) {
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
    return <div style={placeholderStyle}><p>Click to add your X profile URL</p></div>;
  }
} 