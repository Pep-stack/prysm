'use client';

import React from 'react';

export default function GoogleMapsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  // This requires configuration (e.g., embed code or location details)
  const mapConfig = profile?.google_maps_config; // Example: Check for specific config data

  if (mapConfig) {
    // Placeholder: Render Google Maps embed based on config
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Location Map</h3>
        {/* TODO: Implement Google Maps embed logic */}
        <p>Google Maps embed will go here...</p>
      </div>
    );
  } else {
    // Placeholder indicating configuration is needed
    return (
      <div style={placeholderStyle}>
        <h3 style={{...sectionTitleStyle, marginBottom: '5px'}}>Google Maps Location</h3>
        <p>Configuration required (e.g., location or embed code).</p>
      </div>
    );
  }
} 