'use client';

import React from 'react';

export default function AwardsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const awards = profile?.awards; // Check the correct column name

  if (awards) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Awards & Achievements</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{awards}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Awards & Achievements</p>
      </div>
    );
  }
} 