'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean TikTok icon with dynamic size and color
const TikTokIcon = ({ color = 'white', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export default function TiktokSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const tiktokUrl = profile?.tiktok;

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
    try { new URL(url); return url.includes('tiktok.com'); } catch (_) { return false; }
  };

  const hasValidUrl = isValidUrl(tiktokUrl);
  const fullUrl = hasValidUrl && !tiktokUrl.startsWith('http') ? `https://${tiktokUrl}` : tiktokUrl;

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
       title={hasValidUrl ? `Visit ${profile?.name || 'user'}'s TikTok Profile` : 'Add TikTok Profile URL'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidUrl ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidUrl) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <TikTokIcon color={iconColor} size={iconSize} />
    </a>
  );
} 