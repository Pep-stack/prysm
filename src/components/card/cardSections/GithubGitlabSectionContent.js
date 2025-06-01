'use client';

import React from 'react';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

// Simple clean code icon with dynamic size and color
const CodeIcon = ({ color = 'white', size = '24px' }) => (
  <svg 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill={color} 
     style={{ width: size, height: size }}
  >
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
);

export default function GithubGitlabSectionContent({ profile, styles, isCompact = false }) {
  const { settings } = useDesignSettings();
  const { sectionStyle, placeholderStyle } = styles || {};
  const urlsString = profile?.github_gitlab;
  const urls = urlsString ? urlsString.split(',').map(url => url.trim()).filter(url => url) : [];

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
    // Basic check, doesn't guarantee it's a valid git repo URL
    try { new URL(url); return true; } catch (_) { return false; }
  };

  const validUrls = urls.filter(isValidUrl);
  const hasValidUrls = validUrls.length > 0;

  // Always show at least one icon, whether there are URLs or not
  if (hasValidUrls) {
    // If multiple URLs, show multiple icons
    return (
      <div style={{ display: 'inline-flex', gap: '8px' }}>
        {validUrls.map((url, index) => (
          <a 
            key={index}
            href={url.startsWith('http') ? url : `https://${url}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', 
              textDecoration: 'none',
              transition: 'opacity 0.2s ease'
            }}
            title={`Visit ${url.replace(/^https?:\/\//, '')}`}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <CodeIcon color={iconColor} size={iconSize} />
          </a>
        ))}
      </div>
    );
  } else {
    // Show a single icon with placeholder behavior
    return (
      <a 
        href="#"
        style={{ 
          display: 'inline-block', 
          textDecoration: 'none',
          transition: 'opacity 0.2s ease',
          opacity: '0.4',
          cursor: 'default'
        }}
        title="Add GitHub/GitLab URL(s)"
        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
        onMouseLeave={(e) => e.target.style.opacity = '0.4'}
        onClick={(e) => {
          e.preventDefault();
          // Could trigger edit mode or show a modal here
        }}
      >
        <CodeIcon color={iconColor} size={iconSize} />
      </a>
    );
  }
} 