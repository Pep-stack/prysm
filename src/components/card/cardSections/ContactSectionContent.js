'use client';

import React from 'react';

export default function ContactSectionContent({ user, styles }) {
  const { sectionStyle, sectionTitleStyle } = styles || {};

  // This section doesn't have a placeholder, it always shows the email
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Contact</h3>
      <div><p style={{ margin: '5px 0' }}><strong>Email:</strong> {user?.email || 'No email provided'}</p></div>
    </div>
  );
} 