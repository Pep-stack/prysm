'use client';

import React from 'react';

export default function TimezoneHoursSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const timezoneHours = profile?.timezone_hours; // Check the correct column name

  if (timezoneHours) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Timezone & Opening Hours</h3>
        {/* Simple display, assuming text format. Improve formatting as needed. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{timezoneHours}</p>
      </div>
    );
  } else {
    return (
      <div style={placeholderStyle}>
         <p>Click to add Timezone & Opening Hours</p>
      </div>
    );
  }
} 