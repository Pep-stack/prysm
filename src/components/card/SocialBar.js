'use client';

import React from 'react';
import { sectionComponentMap } from './CardSectionRenderer';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import { useContactTracking } from '../../hooks/useContactTracking';

export default function SocialBar({ sections = [], profile, user, position = 'top' }) {
  const { settings } = useDesignSettings();
  const { trackSocialClick } = useContactTracking(profile?.id);
  
  // Only render simple social button types in the social bar
  const allowedButtonTypes = new Set([
    'whatsapp', 'linkedin', 'instagram', 'github', 'youtube', 'tiktok',
    'facebook', 'dribbble', 'behance', 'snapchat', 'reddit', 'x', 'phone'
  ]);
  
  if (!sections || sections.length === 0) {
    return null;
  }

  // Different styling based on position
  const containerClasses = position === 'bottom' 
    ? "w-full px-4 py-6 mt-0 rounded-lg" 
    : "w-full px-4 py-6 mb-0 rounded-lg";

  const handleSocialClick = (platform) => {
    if (trackSocialClick) {
      trackSocialClick(platform, 'social_bar');
    }
  };

  return (
    <div className={containerClasses}>
      
      <div
        className="flex flex-wrap items-center justify-center"
        style={{
          gap: '32px', // desktop spacing
          rowGap: '24px',
        }}
      >
        {sections
          .filter((section) => allowedButtonTypes.has(section.type))
          .map((section) => {
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

          // Determine platform based on section type
          const getPlatform = (sectionType) => {
            switch (sectionType) {
              case 'whatsapp': return 'whatsapp';
              case 'linkedin': return 'linkedin';
              case 'instagram': return 'instagram';
              case 'github': return 'github';
              case 'youtube': return 'youtube';
              case 'tiktok': return 'tiktok';
              case 'facebook': return 'facebook';
              case 'dribbble': return 'dribbble';
              case 'behance': return 'behance';
              case 'snapchat': return 'snapchat';
              case 'reddit': return 'reddit';
              case 'x': return 'x';
              default: return null;
            }
          };

          const platform = getPlatform(section.type);

          return (
            <div
              key={section.id}
              className="hover:scale-110 transition-all duration-200"
              style={{ fontFamily: settings.font_family || 'Inter, sans-serif' }}
              onClick={() => platform && handleSocialClick(platform)}
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