'use client';

import React from 'react';
import { sectionComponentMap } from './CardSectionRenderer';
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';

export default function SocialBar({ sections = [], profile, user }) {
  const { settings } = useDesignSettings();
  
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-3 mb-4 rounded-lg">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {sections.map((section) => {
          const SectionComponent = sectionComponentMap[section.type];
          
          if (!SectionComponent) {
            console.warn(`No component found for section type: ${section.type}`);
            return null;
          }

          // Simple styling for social bar - let components handle their own styling
          const socialBarStyles = {
            sectionStyle: {
              // Minimal container styling
            },
            sectionTitleStyle: {
              display: 'none' // Hide titles in social bar
            },
            placeholderStyle: {
              display: 'none' // Hide placeholders in social bar
            }
          };

          return (
            <div 
              key={section.id} 
              className="hover:scale-110 transition-all duration-200"
              style={{ 
                fontFamily: settings.fontFamily || 'Inter, sans-serif'
              }}
            >
              <SectionComponent
                section={section}
                profile={profile}
                user={user}
                styles={socialBarStyles}
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