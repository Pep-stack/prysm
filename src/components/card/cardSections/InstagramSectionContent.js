'use client';

import React from 'react';

// Simple inline SVG for Instagram logo
const InstagramIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }}
  >
     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function InstagramSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const instagramUrl = profile?.instagram; // Use the correct column name

  // Basic validation
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      // Instagram links might not always start with http/https if user just enters www.instagram.com/...
      // A more robust check might be needed, but this is a basic start.
      return url.includes('instagram.com'); 
    } catch (_) {
      return false;  
    }
  };

  if (isValidUrl(instagramUrl)) {
    // Ensure the URL starts with https:// for the link to work correctly
    const fullUrl = instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`;
    
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Instagram</h3>
        <a 
           href={fullUrl} 
           target="_blank" 
           rel="noopener noreferrer" 
           // Basic gradient color similar to Instagram logo
           style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: '#E1306C' // Fallback color
              // background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', // Complex gradient is hard inline
              // WebkitBackgroundClip: 'text', // Might not work inline
              // WebkitTextFillColor: 'transparent' // Might not work inline
           }}
           title={`Visit ${profile.name || 'user'}'s Instagram Profile`}
        >
          <InstagramIcon />
          <span>View Profile</span> 
        </a>
      </div>
    );
  } else {
    return <div style={placeholderStyle}><p>Click to add your Instagram profile URL</p></div>;
  }
} 