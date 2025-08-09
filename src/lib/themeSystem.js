// ======================================================
// PRYSMA THEME SYSTEM
// Automatic color themes for perfect contrast on every background
// ======================================================

export const THEME_BACKGROUNDS = [
  // ===== LIGHT THEMES =====
  {
    id: 'pure_canvas',
    label: 'Pure Canvas',
    value: '#ffffff',
    name: 'Pure Canvas',
    category: 'light',
    preview: '#ffffff',
    theme: {
      text_color: '#1a1a1a',
      icon_color: '#1a1a1a',
      secondary_text: '#525252'
    }
  },
  {
    id: 'soft_pearl',
    label: 'Soft Pearl',
    value: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    name: 'Soft Pearl',
    category: 'light',
    isGradient: true,
    preview: '#f1f5f9',
    theme: {
      text_color: '#1e293b',
      icon_color: '#1e293b',
      secondary_text: '#475569'
    }
  },
  {
    id: 'warm_stone',
    label: 'Warm Stone',
    value: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%)',
    name: 'Warm Stone',
    category: 'light',
    isGradient: true,
    preview: '#f5f5f4',
    theme: {
      text_color: '#292524',
      icon_color: '#292524',
      secondary_text: '#57534e'
    }
  },


  // ===== COLOR THEMES =====
  {
    id: 'azure_professional',
    label: 'Azure Professional',
    value: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 25%, #b3e5fc 75%, #0277bd 100%)',
    name: 'Azure Professional',
    category: 'color',
    isGradient: true,
    preview: '#0277bd',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },
  {
    id: 'emerald_luxury',
    label: 'Emerald Luxury',
    value: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 25%, #dcfce7 75%, #16a34a 100%)',
    name: 'Emerald Luxury',
    category: 'color',
    isGradient: true,
    preview: '#16a34a',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },
  {
    id: 'royal_purple',
    label: 'Royal Purple',
    value: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 25%, #f3e8ff 75%, #7c3aed 100%)',
    name: 'Royal Purple',
    category: 'color',
    isGradient: true,
    preview: '#7c3aed',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },
  {
    id: 'sunset_coral',
    label: 'Sunset Coral',
    value: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 25%, #fed7aa 75%, #ea580c 100%)',
    name: 'Sunset Coral',
    category: 'color',
    isGradient: true,
    preview: '#ea580c',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },
  {
    id: 'rose_gold',
    label: 'Rose Gold',
    value: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 25%, #fce7f3 75%, #e11d48 100%)',
    name: 'Rose Gold',
    category: 'color',
    isGradient: true,
    preview: '#e11d48',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },
  {
    id: 'arctic_teal',
    label: 'Arctic Teal',
    value: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 25%, #ccfbf1 75%, #0d9488 100%)',
    name: 'Arctic Teal',
    category: 'color',
    isGradient: true,
    preview: '#0d9488',
    theme: {
      text_color: '#000000',
      icon_color: '#ffffff',
      secondary_text: '#333333'
    }
  },

  // ===== DARK THEMES =====
  {
    id: 'obsidian_premium',
    label: 'Obsidian Premium',
    value: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 75%, #404040 100%)',
    name: 'Obsidian Premium',
    category: 'dark',
    isGradient: true,
    preview: '#1a1a1a',
    theme: {
      text_color: '#ffffff',
      icon_color: '#e5e5e5',
      secondary_text: '#b8b8b8'
    }
  },
  {
    id: 'midnight_steel',
    label: 'Midnight Steel',
    value: 'linear-gradient(135deg, #0c0c0c 0%, #1e293b 25%, #334155 75%, #475569 100%)',
    name: 'Midnight Steel',
    category: 'dark',
    isGradient: true,
    preview: '#1e293b',
    theme: {
      text_color: '#f8fafc',
      icon_color: '#e2e8f0',
      secondary_text: '#cbd5e1'
    }
  },
  {
    id: 'carbon_luxury',
    label: 'Carbon Luxury',
    value: 'linear-gradient(135deg, #0a0a0a 0%, #1c1c1e 25%, #2c2c2e 75%, #3a3a3c 100%)',
    name: 'Carbon Luxury',
    category: 'dark',
    isGradient: true,
    preview: '#1c1c1e',
    theme: {
      text_color: '#ffffff',
      icon_color: '#f2f2f7',
      secondary_text: '#c7c7cc'
    }
  },
  {
    id: 'deep_space',
    label: 'Deep Space',
    value: 'linear-gradient(135deg, #000000 0%, #0f172a 25%, #1e293b 75%, #334155 100%)',
    name: 'Deep Space',
    category: 'dark',
    isGradient: true,
    preview: '#0f172a',
    theme: {
      text_color: '#f1f5f9',
      icon_color: '#e2e8f0',
      secondary_text: '#94a3b8'
    }
  },
  {
    id: 'noir_elegance',
    label: 'Noir Elegance',
    value: 'linear-gradient(135deg, #000000 0%, #111827 25%, #1f2937 75%, #374151 100%)',
    name: 'Noir Elegance',
    category: 'dark',
    isGradient: true,
    preview: '#111827',
    theme: {
      text_color: '#f9fafb',
      icon_color: '#e5e7eb',
      secondary_text: '#d1d5db'
    }
  },

  // ===== PATTERN THEMES =====
  {
    id: 'subtle_dots',
    label: 'Subtle Dots',
    value: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
    name: 'Subtle Dots',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#ffffff',
    backgroundSize: '20px 20px',
    preview: '#ffffff',
    theme: {
      text_color: '#171717',
      icon_color: '#171717',
      secondary_text: '#404040'
    }
  },
  {
    id: 'fine_grid',
    label: 'Fine Grid',
    value: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
    name: 'Fine Grid',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#ffffff',
    backgroundSize: '24px 24px',
    preview: '#ffffff',
    theme: {
      text_color: '#0f0f0f',
      icon_color: '#0f0f0f',
      secondary_text: '#3f3f3f'
    }
  },
  {
    id: 'soft_lines',
    label: 'Soft Lines',
    value: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
    name: 'Soft Lines',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#fafafa',
    preview: '#fafafa',
    theme: {
      text_color: '#181818',
      icon_color: '#181818',
      secondary_text: '#4a4a4a'
    }
  },
  {
    id: 'dark_dots',
    label: 'Dark Dots',
    value: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
    name: 'Dark Dots',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#1a1a1a',
    backgroundSize: '18px 18px',
    preview: '#1a1a1a',
    theme: {
      text_color: '#f8f8f8',
      icon_color: '#e5e5e5',
      secondary_text: '#b8b8b8'
    }
  },
  {
    id: 'dark_grid',
    label: 'Dark Grid',
    value: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
    name: 'Dark Grid',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#1c1c1c',
    backgroundSize: '22px 22px',
    preview: '#1c1c1c',
    theme: {
      text_color: '#f5f5f5',
      icon_color: '#e5e5e5',
      secondary_text: '#a8a8a8'
    }
  },
  {
    id: 'dark_lines',
    label: 'Dark Lines',
    value: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
    name: 'Dark Lines',
    category: 'pattern',
    isPattern: true,
    backgroundColor: '#252525',
    preview: '#252525',
    theme: {
      text_color: '#f0f0f0',
      icon_color: '#e0e0e0',
      secondary_text: '#b0b0b0'
    }
  }
];

// Helper function to get theme by background value
export function getThemeByBackground(backgroundValue) {
  const theme = THEME_BACKGROUNDS.find(bg => bg.value === backgroundValue);
  return theme || THEME_BACKGROUNDS[0]; // fallback to Pure Canvas
}

// Helper function to get automatic colors for a background
export function getAutomaticColors(backgroundValue) {
  const theme = getThemeByBackground(backgroundValue);
  return theme.theme;
}

// Helper function to check if background is dark theme
export function isDarkTheme(backgroundValue) {
  const theme = getThemeByBackground(backgroundValue);
  return theme.category === 'dark' || 
         (theme.category === 'pattern' && 
          (theme.id === 'dark_dots' || theme.id === 'dark_grid' || theme.id === 'dark_lines'));
}

// Helper function to check if theme needs dark icon backgrounds
export function needsDarkIconBackground(backgroundValue) {
  // Check if this is a colored gradient theme (white to color)
  const isColoredTheme = backgroundValue && (
    backgroundValue.includes('linear-gradient') && 
    backgroundValue.includes('#ffffff')
  );
  
  // Check if this is a dark theme (including dark patterns)
  const isDarkThemeOrPattern = isDarkTheme(backgroundValue);
  
  return isColoredTheme || isDarkThemeOrPattern;
}

// Helper function to get theme preview color for UI
export function getThemePreview(backgroundValue) {
  const theme = getThemeByBackground(backgroundValue);
  return theme.preview;
}

// Export for backward compatibility (will be removed after migration)
export const BACKGROUND_COLOR_OPTIONS = THEME_BACKGROUNDS; 