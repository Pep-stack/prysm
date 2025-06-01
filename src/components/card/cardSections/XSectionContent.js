'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean X icon with dynamic size and color
const XIcon = ({ color = 'black', size = '24px' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={color} 
    style={{ width: size, height: size }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function XSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const xProfileUrl = profile?.x_profile;

  // Get icon settings from design settings
  const iconSize = settings?.icon_size || '24px';
  const iconColorSetting = settings?.icon_color || 'auto';
  
  // Determine icon color based on settings
  const getIconColor = () => {
    if (iconColorSetting === 'auto') {
      // Auto mode: detect if background is light or dark
      const backgroundColor = settings?.background_color || '#f8f9fa';
      
      // Check if it's a gradient
      if (backgroundColor.includes('linear-gradient')) {
        // For gradients, check if they contain dark colors
        const isDarkGradient = backgroundColor.includes('#2c3e50') || 
                              backgroundColor.includes('#1f2937') || 
                              backgroundColor.includes('#2d1b69') ||
                              backgroundColor.includes('#134e5e') ||
                              backgroundColor.includes('#485563') ||
                              backgroundColor.includes('#1e3c72');
        return isDarkGradient ? 'white' : 'black';
      }
      
      // For solid colors, check if it's dark
      if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);  
        const b = parseInt(hex.slice(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128 ? 'white' : 'black';
      }
      
      // Default to black for light backgrounds
      return 'black';
    }
    
    // Use the specific color setting
    return iconColorSetting;
  };

  const iconColor = getIconColor();

  // Basic validation: check if it looks like a URL
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (_) {
      return false;  
    }
  };

  const hasValidUrl = isValidUrl(xProfileUrl);

  // Always show the icon, whether there's a URL or not
  return (
    <a 
       href={hasValidUrl ? xProfileUrl : '#'} 
       target="_blank" 
       rel="noopener noreferrer" 
       style={{ 
         display: 'inline-block', 
         textDecoration: 'none',
         transition: 'opacity 0.2s ease',
         opacity: hasValidUrl ? '1' : '0.4',
         cursor: hasValidUrl ? 'pointer' : 'default'
       }}
       title={hasValidUrl ? `Visit ${profile?.name || 'user'}'s X Profile` : 'Add X Profile URL'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidUrl ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidUrl) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <XIcon color={iconColor} size={iconSize} />
    </a>
  );
} 