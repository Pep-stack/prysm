'use client';

import React from 'react';

// Placeholder Icon (Replace with actual YouTube icon later)
const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
    <path d="M10,15l5.19-3L10,9v6m11.56-7.79c-.3-.77-1.01-1.33-1.84-1.51C18.26,5.5,12,5.5,12,5.5s-6.26,0-7.72.21c-.83.18-1.54.74-1.84,1.51C2.16,8.06,2.03,12,2.03,12s.13,3.94.44,4.79c.3.77,1.01,1.33,1.84,1.51C5.74,18.5,12,18.5,12,18.5s6.26,0,7.72-.21c.83-.18,1.54-.74,1.84-1.51c.31-.85.44-4.79.44-4.79s-.13-3.94-.44-4.79z"/>
  </svg>
);

export default function YoutubeChannelSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const channelUrl = profile?.youtube_channel;

  const isValidUrl = (url) => {
    try { new URL(url); return url && url.includes('youtube.com'); } catch (_) { return false; }
  };

  if (isValidUrl(channelUrl)) {
    const fullUrl = channelUrl.startsWith('http') ? channelUrl : `https://${channelUrl}`;
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>YouTube Channel</h3>
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <YouTubeIcon />
          <span>Visit Channel</span>
        </a>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add YouTube Channel URL</p>
      </div>
    );
  }
} 