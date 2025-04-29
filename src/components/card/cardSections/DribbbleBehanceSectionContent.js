'use client';

import React from 'react';

// Placeholder Icon (Replace with actual icons later)
const DesignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z"/> {/* Example icon */}
  </svg>
);

export default function DribbbleBehanceSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const urlsString = profile?.dribbble_behance;
  const urls = urlsString ? urlsString.split(',').map(url => url.trim()).filter(url => url) : [];

  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch (_) { return false; }
  };

  const validUrls = urls.filter(isValidUrl);

  if (validUrls.length > 0) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Dribbble / Behance</h3>
        <div>
          {validUrls.map((url, index) => (
            <a 
              key={index} 
              href={url.startsWith('http') ? url : `https://${url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', textDecoration: 'none', color: 'inherit' }}
            >
              <DesignIcon /> 
              <span>{url.replace(/^https?:\/\//, '')}</span>
            </a>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Dribbble/Behance URL(s)</p>
      </div>
    );
  }
} 