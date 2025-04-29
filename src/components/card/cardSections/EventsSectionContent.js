'use client';

import React from 'react';

export default function EventsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const events = profile?.events; // Check the correct column name

  if (events) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Events</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{events}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Events</p>
      </div>
    );
  }
} 