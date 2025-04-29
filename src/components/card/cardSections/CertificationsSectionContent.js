'use client';

import React from 'react';

export default function CertificationsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const certifications = profile?.certifications; // Check the correct column name

  if (certifications) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Certifications & Licenses</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{certifications}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Certifications & Licenses</p>
      </div>
    );
  }
} 