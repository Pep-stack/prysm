'use client';

import React from 'react';

// Simple inline SVG for LinkedIn icon
const LinkedInIcon = () => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill="currentColor" 
     style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.33-.024-3.048-1.857-3.048-1.857 0-2.143 1.45-2.143 2.95v5.702h-3v-11h2.871v1.316h.04c.4-.756 1.371-1.55 2.831-1.55 3.029 0 3.587 1.993 3.587 4.584v6.65z"/>
  </svg>
);

export default function LinkedInSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const linkedInUrl = profile?.linkedin;

  // Basic validation: check if it looks like a URL (optional but good practice)
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (_) {
      return false;  
    }
  };

  if (isValidUrl(linkedInUrl)) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>LinkedIn</h3>
        <a 
           href={linkedInUrl} 
           target="_blank" 
           rel="noopener noreferrer" 
           style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: '#0077B5' }}
           title={`Visit ${profile.name || 'user'}'s LinkedIn Profile`}
        >
          <LinkedInIcon />
          {/* Optional: Display the URL or a generic text */} 
          <span>View Profile</span> 
        </a>
      </div>
    );
  } else {
    // Render placeholder if no valid URL
    return <div style={placeholderStyle}><p>Click to add your LinkedIn Profile URL</p></div>;
  }
} 