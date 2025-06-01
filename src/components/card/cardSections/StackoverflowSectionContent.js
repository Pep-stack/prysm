'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean StackOverflow icon with dynamic size and color
const StackOverflowIcon = ({ color = '#F48024', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 384 512" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2-70.7l-28.4 37.6L19.9 193.2l28.4-37.6zM32 416h320v32H32zm20-128h280v32H52zm16-128h248v32H68z"/>
  </svg>
);

export default function StackoverflowSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const stackoverflowUrl = profile?.stackoverflow;

  // Get icon settings from design settings
  const iconSize = settings?.icon_size || '24px';
  const iconColorSetting = settings?.icon_color || 'auto';
  
  // Determine icon color based on settings
  const getIconColor = () => {
    if (iconColorSetting === 'auto') {
      // For StackOverflow, use brand color if auto
      return '#F48024';
    }
    
    // Use the specific color setting
    return iconColorSetting;
  };

  const iconColor = getIconColor();

  const isValidUrl = (url) => {
    if (!url) return false;
    try { new URL(url); return url.includes('stackoverflow.com'); } catch (_) { return false; }
  };

  const hasValidUrl = isValidUrl(stackoverflowUrl);
  const fullUrl = hasValidUrl && !stackoverflowUrl.startsWith('http') ? `https://${stackoverflowUrl}` : stackoverflowUrl;

  // Always show the icon, whether there's a URL or not
  return (
    <a 
       href={hasValidUrl ? fullUrl : '#'} 
       target="_blank" 
       rel="noopener noreferrer" 
       style={{ 
         display: 'inline-block', 
         textDecoration: 'none',
         transition: 'opacity 0.2s ease',
         opacity: hasValidUrl ? '1' : '0.4',
         cursor: hasValidUrl ? 'pointer' : 'default'
       }}
       title={hasValidUrl ? `Visit ${profile?.name || 'user'}'s Stack Overflow Profile` : 'Add Stack Overflow Profile URL'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidUrl ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidUrl) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <StackOverflowIcon color={iconColor} size={iconSize} />
    </a>
  );
} 