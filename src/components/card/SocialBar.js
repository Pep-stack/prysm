'use client';

import React from 'react';
import { sectionComponentMap } from './CardSectionRenderer';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';

export default function SocialBar({ sections = [], profile, user, position = 'top' }) {
  const { settings } = useDesignSettings();
  
  if (!sections || sections.length === 0) {
    return null;
  }

  // Different styling based on position
  const containerClasses = position === 'bottom' 
    ? "w-full px-4 py-6 mt-0 rounded-lg" 
    : "w-full px-4 py-6 mb-0 rounded-lg";

  return (
    <div className={containerClasses}>
      
      <div
        className="flex flex-wrap items-center justify-center"
        style={{
          gap: '32px', // desktop spacing
          rowGap: '24px',
        }}
      >
        {sections.map((section) => {
          const SectionComponent = sectionComponentMap[section.type];
          if (!SectionComponent) {
            console.warn(`No component found for section type: ${section.type}`);
            return null;
          }

          // Responsive icon size
          const iconSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 32 : 40;
          const sectionStyles = {
            sectionStyle: {},
            sectionTitleStyle: { display: 'none' },
            placeholderStyle: { display: 'none' },
            iconSize,
          };

          return (
            <div
              key={section.id}
              className="hover:scale-110 transition-all duration-200"
              style={{ fontFamily: settings.font_family || 'Inter, sans-serif' }}
            >
              <SectionComponent
                section={section}
                profile={profile}
                user={user}
                isPublicView={true}
                styles={sectionStyles}
                designSettings={settings}
                isCompact={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
} 