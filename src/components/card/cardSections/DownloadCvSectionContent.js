'use client';

import React from 'react';

export default function DownloadCvSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  // This requires file handling/URL logic
  const cvUrl = profile?.cv_url; // Example: Check for a CV URL column

  if (cvUrl) {
    // Placeholder: Render a download link
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Download CV</h3>
        <a href={cvUrl} download>Download Now</a>
        {/* TODO: Add better styling/icon */}
      </div>
    );
  } else {
    // Placeholder indicating configuration is needed
    return (
      <div style={placeholderStyle}>
        <h3 style={{...sectionTitleStyle, marginBottom: '5px'}}>Download CV</h3>
        <p>CV file/link configuration needed.</p>
      </div>
    );
  }
} 