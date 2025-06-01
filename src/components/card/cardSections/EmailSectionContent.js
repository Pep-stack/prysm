'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean Email icon with dynamic size and color
const EmailIcon = ({ color = 'white', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

export default function EmailSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const emailAddress = profile?.email;

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

  // Basic validation: check if it looks like an email
  const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasValidEmail = isValidEmail(emailAddress);

  // Always show the icon, whether there's an email or not
  return (
    <a 
       href={hasValidEmail ? `mailto:${emailAddress}` : '#'} 
       style={{ 
         display: 'inline-block', 
         textDecoration: 'none',
         transition: 'opacity 0.2s ease',
         opacity: hasValidEmail ? '1' : '0.4',
         cursor: hasValidEmail ? 'pointer' : 'default'
       }}
       title={hasValidEmail ? `Send email to ${emailAddress}` : 'Add email address'}
       onMouseEnter={(e) => e.target.style.opacity = '0.7'}
       onMouseLeave={(e) => e.target.style.opacity = hasValidEmail ? '1' : '0.4'}
       onClick={(e) => {
         if (!hasValidEmail) {
           e.preventDefault();
           // Could trigger edit mode or show a modal here
         }
       }}
    >
      <EmailIcon color={iconColor} size={iconSize} />
    </a>
  );
} 