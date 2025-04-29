'use client';

import React from 'react';

export default function CalendarSchedulingSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  // This section likely requires configuration (e.g., Calendly link)
  const calendarUrl = profile?.calendar_scheduling_url; // Example: assume a specific column exists or use config

  if (calendarUrl) {
    // Placeholder: Could embed or link to the calendar
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Calendar / Scheduling</h3>
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Book a Meeting</a>
        {/* TODO: Implement embed or better integration */}
      </div>
    );
  } else {
    // Placeholder indicating configuration is needed
    return (
      <div style={placeholderStyle}>
        <h3 style={{...sectionTitleStyle, marginBottom: '5px'}}>Calendar / Scheduling</h3>
        <p>Integration/Configuration required.</p>
      </div>
    );
  }
} 