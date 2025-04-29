'use client';

import React from 'react';

export default function PublicationsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const publications = profile?.publications; // Check the correct column name

  if (publications) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Publications / Media</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{publications}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Publications / Media</p>
      </div>
    );
  }
} 