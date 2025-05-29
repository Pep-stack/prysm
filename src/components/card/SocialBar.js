'use client';

import React from 'react';
import { sectionComponentMap } from './CardSectionRenderer';
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';

export default function SocialBar({ sections = [], profile, user }) {
  const { settings } = useDesignSettings();
  
  if (!sections || sections.length === 0) {
    return null;
  }

  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  return (
    <div className="w-full px-4 py-3 mb-4 rounded-lg">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sections.map((section) => {
          const SectionComponent = sectionComponentMap[section.type];
          
          if (!SectionComponent) {
            return null;
          }

          // Special styling for social bar - compact icons only
          const socialBarStyles = {
            sectionStyle: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              color: textColor,
              minWidth: '48px',
              minHeight: '48px',
              position: 'relative',
              overflow: 'hidden'
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
              className="hover:scale-110 transition-all duration-200 hover:shadow-lg"
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