'use client';

import React from 'react';
import { LuMapPin } from 'react-icons/lu'; // Voorbeeld icoon

export default function LocationSectionContent({ profile, styles }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};

  const location = profile?.location;

  if (!location) {
    return null;
  }

  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Location</h3>
      <div className="flex items-center gap-2 text-sm text-gray-700"> {/* Voorbeeld styling met Tailwind */}
        <LuMapPin className="text-gray-500 flex-shrink-0" />
        <span>{location}</span>
      </div>
    </div>
  );
} 