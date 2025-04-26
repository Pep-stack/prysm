'use client';

import React from 'react';

export default function WebsiteSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};

  if (profile?.website) {
    return (
       <div style={sectionStyle}>
         <h3 style={sectionTitleStyle}>Website</h3>
         <p style={{ margin: '5px 0' }}>
           <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>
             {profile.website}
           </a>
         </p>
       </div>
    );
  } else {
    return <div style={placeholderStyle}><p>Click to add your Website</p></div>;
  }
} 