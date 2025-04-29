'use client';

import React from 'react';

// Placeholder Icon (Replace with actual Stack Overflow icon later)
const StackOverflowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#F48024" style={{ width: '20px', height: '24px', marginRight: '8px' }}>
    <path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2-70.7l-28.4 37.6L19.9 193.2l28.4-37.6zM32 416h320v32H32zm20-128h280v32H52zm16-128h248v32H68z"/>
  </svg>
);

export default function StackoverflowSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const stackoverflowUrl = profile?.stackoverflow;

  const isValidUrl = (url) => {
    try { new URL(url); return url && url.includes('stackoverflow.com'); } catch (_) { return false; }
  };

  if (isValidUrl(stackoverflowUrl)) {
    const fullUrl = stackoverflowUrl.startsWith('http') ? stackoverflowUrl : `https://${stackoverflowUrl}`;
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Stack Overflow Profile</h3>
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <StackOverflowIcon />
          <span>View Profile</span>
        </a>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Stack Overflow Profile URL</p>
      </div>
    );
  }
} 