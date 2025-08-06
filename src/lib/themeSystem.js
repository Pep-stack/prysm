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
      icon_color: '#2d2d2d',
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
      icon_color: '#334155',
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
      icon_color: '#44403c',
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
      icon_color: '#262626',
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
      icon_color: '#1f1f1f',
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
      icon_color: '#2a2a2a',
      secondary_text: '#4a4a4a'
    }
  },
  {
    id: 'paper_texture',
    label: 'Paper Texture',
    value: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0), radial-gradient(circle at 12px 12px, rgba(0,0,0,0.015) 1px, transparent 0)',
    name: 'Paper Texture',
    category: 'light',
    isPattern: true,
    backgroundColor: '#fefefe',
    backgroundSize: '16px 16px, 24px 24px',
    preview: '#fefefe',
    theme: {
      text_color: '#141414',
      icon_color: '#252525',
      secondary_text: '#454545'
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
      icon_color: '#e5e5e5',
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
      icon_color: '#e4e4e7',
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
      icon_color: '#e8e8e8',
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