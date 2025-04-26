'use client';

import React from 'react';

export default function BioSectionContent({ profile, styles }) {
  const { sectionStyle, placeholderStyle } = styles || {};

  if (profile?.bio) {
    return <div style={sectionStyle}><p style={{ lineHeight: '1.5' }}>{profile.bio}</p></div>;
  } else {
    return <div style={placeholderStyle}><p>Click to add your Bio</p></div>;
  }
} 