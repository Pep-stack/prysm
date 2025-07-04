'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean Facebook icon with dynamic size and color
const FacebookIcon = ({ color = 'white', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10 10-4.49 10-10-4.5-10-10-10zm4.5 10h-3v7h-4v-7h-2v-4h2V8.12c0-1.68 1.19-3.12 2.81-3.12h2.19v4h-1.94c-.31 0-.56.25-.56.56V12h2.5l-.5 4z"/>
  </svg>
);

export default function FacebookSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const facebookUrl = profile?.facebook;

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

  const isValidUrl = (url) => {
    if (!url) return false;
    try { 
      new URL(url); 
      return url.includes('facebook.com') || url.includes('fb.com'); 
    } catch (_) { 
      return false; 
    }
  };

  const hasValidUrl = isValidUrl(facebookUrl);
  const fullUrl = hasValidUrl && !facebookUrl.startsWith('http') ? `https://${facebookUrl}` : facebookUrl;

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
       title={hasValidUrl ? `Visit ${profile?.name || 'user'}'s Facebook Profile` : 'Add Facebook Profile URL'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidUrl ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidUrl) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <FacebookIcon color={iconColor} size={iconSize} />
    </a>
  );
} 