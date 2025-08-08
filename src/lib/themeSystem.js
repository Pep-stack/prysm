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
  {
    id: 'subtle_dots',
    label: 'Subtle Dots',
    value: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
    name: 'Subtle Dots',
    category: 'light',
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
    category: 'light',
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
    category: 'light',
    isPattern: true,
    backgroundColor: '#fafafa',
    preview: '#fafafa',
    theme: {
      text_color: '#181818',
      icon_color: '#181818',
      secondary_text: '#4a4a4a'
    }
  },

  // ===== COLOR THEMES =====
  {
    id: 'steel_blue',
    label: 'Steel Blue',
    value: 'linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
    name: 'Steel Blue',
    category: 'color',
    isGradient: true,
    preview: '#64748b',
    theme: {
      text_color: '#f8fafc',
      icon_color: '#334155',
      secondary_text: '#cbd5e1'
    }
  },
  {
    id: 'sage_green',
    label: 'Sage Green',
    value: 'linear-gradient(135deg, #6b7280 0%, #84cc16 20%, #a3a3a3 100%)',
    name: 'Sage Green',
    category: 'color',
    isGradient: true,
    preview: '#84cc16',
    theme: {
      text_color: '#f9fafb',
      icon_color: '#374151',
      secondary_text: '#d1d5db'
    }
  },
  {
    id: 'wine_elegant',
    label: 'Wine Elegant',
    value: 'linear-gradient(135deg, #7c2d12 0%, #991b1b 30%, #b45309 100%)',
    name: 'Wine Elegant',
    category: 'color',
    isGradient: true,
    preview: '#991b1b',
    theme: {
      text_color: '#fef2f2',
      icon_color: '#7c2d12',
      secondary_text: '#fca5a5'
    }
  },
  {
    id: 'navy_professional',
    label: 'Navy Professional',
    value: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #4338ca 100%)',
    name: 'Navy Professional',
    category: 'color',
    isGradient: true,
    preview: '#3730a3',
    theme: {
      text_color: '#f0f9ff',
      icon_color: '#1e3a8a',
      secondary_text: '#93c5fd'
    }
  },

  // ===== DARK THEMES =====
  {
    id: 'midnight_black',
    label: 'Midnight Black',
    value: '#0a0a0a',
    name: 'Midnight Black',
    category: 'dark',
    preview: '#0a0a0a',
    theme: {
      text_color: '#f5f5f5',
      icon_color: '#404040',
      secondary_text: '#a3a3a3'
    }
  },
  {
    id: 'deep_charcoal',
    label: 'Deep Charcoal',
    value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)',
    name: 'Deep Charcoal',
    category: 'dark',
    isGradient: true,
    preview: '#27272a',
    theme: {
      text_color: '#fafafa',
      icon_color: '#3f3f46',
      secondary_text: '#a1a1aa'
    }
  },
  {
    id: 'dark_mesh',
    label: 'Dark Mesh',
    value: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
    name: 'Dark Mesh',
    category: 'dark',
    isPattern: true,
    backgroundColor: '#1a1a1a',
    backgroundSize: '18px 18px',
    preview: '#1a1a1a',
    theme: {
      text_color: '#f8f8f8',
      icon_color: '#404040',
      secondary_text: '#b8b8b8'
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
  return theme.category === 'dark';
}

// Helper function to get theme preview color for UI
export function getThemePreview(backgroundValue) {
  const theme = getThemeByBackground(backgroundValue);
  return theme.preview;
}

// Export for backward compatibility (will be removed after migration)
export const BACKGROUND_COLOR_OPTIONS = THEME_BACKGROUNDS; 