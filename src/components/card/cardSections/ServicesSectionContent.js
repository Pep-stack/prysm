'use client';

import React from 'react';

export default function ServicesSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const services = profile?.services; // Check the correct column name

  if (services) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Services Offered</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{services}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Services Offered</p>
      </div>
    );
  }
} 