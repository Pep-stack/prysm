'use client';

import React from 'react';

export default function SkillsSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, tagStyle, placeholderStyle } = styles || {};

  if (profile?.skills) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Skills</h3>
        <div>
          {profile.skills.split(',').map((skill, index) => (
            <span key={index} style={tagStyle}>{skill.trim()}</span>
          ))}
        </div>
      </div>
    );
  } else {
    return <div style={placeholderStyle}><p>Click to add your Skills</p></div>;
  }
} 