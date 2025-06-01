'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean YouTube icon with dynamic size and color
const YouTubeIcon = ({ color = 'white', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M10,15l5.19-3L10,9v6m11.56-7.79c-.3-.77-1.01-1.33-1.84-1.51C18.26,5.5,12,5.5,12,5.5s-6.26,0-7.72.21c-.83.18-1.54.74-1.84,1.51C2.16,8.06,2.03,12,2.03,12s.13,3.94.44,4.79c.3.77,1.01,1.33,1.84,1.51C5.74,18.5,12,18.5,12,18.5s6.26,0,7.72-.21c.83-.18,1.54-.74,1.84-1.51c.31-.85.44-4.79.44-4.79s-.13-3.94-.44-4.79z"/>
  </svg>
);

export default function YoutubeChannelSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const channelUrl = profile?.youtube_channel;

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
    try { new URL(url); return url.includes('youtube.com'); } catch (_) { return false; }
  };

  const hasValidUrl = isValidUrl(channelUrl);
  const fullUrl = hasValidUrl && !channelUrl.startsWith('http') ? `https://${channelUrl}` : channelUrl;

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
       title={hasValidUrl ? `Visit ${profile?.name || 'user'}'s YouTube Channel` : 'Add YouTube Channel URL'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidUrl ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidUrl) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <YouTubeIcon color={iconColor} size={iconSize} />
    </a>
  );
} 