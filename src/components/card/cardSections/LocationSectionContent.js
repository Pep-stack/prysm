'use client';

import React from 'react';

export default function LocationSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};

  if (profile?.location) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Location</h3>
        <p style={{ margin: '5px 0' }}>{profile.location}</p>
      </div>
    );
  } else {
    return <div style={placeholderStyle}><p>Click to add your Location</p></div>;
  }
} 