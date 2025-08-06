import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { FaFont, FaTimes, FaPalette } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { useDesignSettings } from './DesignSettingsContext';
import { THEME_BACKGROUNDS, getThemePreview, isDarkTheme } from '../../lib/themeSystem';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'DM Sans', value: 'DM Sans, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Outfit', value: 'Outfit, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Source Sans 3', value: 'Source Sans 3, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
];

const SOCIAL_BAR_POSITION_OPTIONS = [
  { label: 'Top (Below Header)', value: 'top', name: 'Top' },
  { label: 'Bottom (Above Footer)', value: 'bottom', name: 'Bottom' }
];

export default function DesignToolbar({ initial, userId, onProfileUpdate }) {
  const { settings, setSettings, isLoading, updateThemeColors } = useDesignSettings();
  
  // Simplified state - only font and social bar position are manual
  const [fontFamily, setFontFamily] = useState(settings.font_family || initial?.font_family || 'Inter, sans-serif');
  const [socialBarPosition, setSocialBarPosition] = useState(settings.social_bar_position || initial?.social_bar_position || 'top');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showSocialBarPositionDropdown, setShowSocialBarPositionDropdown] = useState(false);
  const fontDropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);
  const socialBarPositionDropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (showFontDropdown && fontDropdownRef.current && !fontDropdownRef.current.contains(e.target)) setShowFontDropdown(false);
      if (showThemeDropdown && themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) setShowThemeDropdown(false);
      if (showSocialBarPositionDropdown && socialBarPositionDropdownRef.current && !socialBarPositionDropdownRef.current.contains(e.target)) setShowSocialBarPositionDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showFontDropdown, showThemeDropdown, showSocialBarPositionDropdown]);

  // Sync only font and social bar position from context
  useEffect(() => {
    if (!isLoading && settings.font_family && !fontFamily) {
      setFontFamily(settings.font_family);
      setSocialBarPosition(settings.social_bar_position || 'top');
    }
  }, [settings, isLoading]);

  // Fallback to initial prop if context not loaded yet
  useEffect(() => {
    if (!isLoading && !settings.font_family && initial?.font_family) {
      console.log('🔄 TOOLBAR: Using initial prop values as fallback');
      setFontFamily(initial.font_family);
      setSocialBarPosition(initial.social_bar_position || 'top');
    }
  }, [initial, settings, isLoading]);

  // Handle theme selection
  const handleThemeSelect = (theme) => {
    updateThemeColors(theme.value);
    setShowThemeDropdown(false);
  };

  const handleSave = async () => {
    if (isLoading) {
      console.log('⚠️ SAVE: Context still loading, skipping save');
      return;
    }

    setSaving(true);
    setError(null);
    
    // Use current settings from context (colors are automatic) plus local state
    const payload = {
      font_family: fontFamily,
      text_color: settings.text_color, // Automatic from theme
      background_color: settings.background_color, // Set via theme selection
      icon_color: settings.icon_color, // Automatic from theme
      social_bar_position: socialBarPosition
    };

    console.log('🔥 SAVE: Attempting to save settings:', {
      userId,
      payload,
      currentSettings: settings,
      isLoading,
      fontFamily,
      settingsFontFamily: settings.font_family
    });

    try {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      // Direct updaten zonder eerst te checken (efficiënter)
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select('*')
        .single();

      if (updateError) {
        console.error('❌ SAVE: Error updating profile:', updateError);
        throw updateError;
      }

      if (updatedProfile) {
        console.log('✅ SAVE: Successfully updated profile:', updatedProfile);
        
        // Update context met nieuwe data
        setSettings(updatedProfile);
        
        // Update parent state
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        throw new Error('No profile data returned after update');
      }
    } catch (error) {
      console.error('❌ SAVE: Error in handleSave:', {
        name: error.name,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setError(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
      setShowMenu(false);
    }
  };

  const handleFontSelect = (font) => {
    console.log('🔥 FONT-SELECT: Selected font:', font);
    setFontFamily(font);
    // NIET automatisch context updaten - alleen bij save
    setShowFontDropdown(false);
  };



  const handleSocialBarPositionSelect = (position) => {
    setSocialBarPosition(position);
    // NIET automatisch context updaten - alleen bij save
    setShowSocialBarPositionDropdown(false);
  };

  // Get current theme for preview
  const currentTheme = THEME_BACKGROUNDS.find(theme => theme.value === settings.background_color) || THEME_BACKGROUNDS[0];
  
  return (
    <div className="relative w-full flex justify-start z-40">
      {/* Design Settings Button with theme preview */}
      <button
        aria-label="Open Design Settings"
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 shadow hover:bg-neutral-50 transition text-sm font-semibold"
        onClick={() => setShowMenu(true)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <FaPalette className="text-emerald-500" size={16} />
          <div 
            className="w-5 h-5 rounded-full border-2 border-gray-200"
            style={{ background: currentTheme.preview }}
          />
        </div>
        <span>Theme & Design</span>
      </button>
      {/* Overlay Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" aria-label="Close Design Settings Overlay" onClick={() => setShowMenu(false)} />
          <div
            ref={menuRef}
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 w-[95vw] max-w-md sm:max-w-lg"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
          >
            <button
              aria-label="Close Design Settings"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowMenu(false)}
              type="button"
            >
              <FaTimes size={18} />
            </button>
            
            {/* Font Family */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Font Family</span>
              <div className="relative" ref={fontDropdownRef}>
                <button
                  aria-label="Font Family"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:ring-2 hover:ring-emerald-200 transition"
                  style={{ fontFamily }}
                  onClick={() => setShowFontDropdown(!showFontDropdown)}
                  type="button"
                >
                  <FaFont size={18} />
                </button>
                {showFontDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow p-1 min-w-[120px] z-30">
                    {FONT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`block w-full text-left px-2 py-1 text-xs hover:bg-emerald-50 rounded ${fontFamily === opt.value ? 'bg-emerald-100' : ''}`}
                        style={{ fontFamily: opt.value }}
                        onClick={() => handleFontSelect(opt.value)}
                        type="button"
                        aria-label={opt.label}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FaPalette className="text-emerald-500" size={16} />
                <span className="text-sm font-semibold text-gray-700">Choose Theme</span>
              </div>
              
              {/* Light Themes */}
              <div>
                <span className="text-xs font-medium text-gray-500 mb-2 block">Light Themes</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {THEME_BACKGROUNDS.filter(theme => theme.category === 'light').map(theme => (
                    <button
                      key={theme.id}
                      className={`relative group flex flex-col items-center p-3 rounded-xl border transition-all hover:shadow-md ${
                        currentTheme.id === theme.id 
                          ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleThemeSelect(theme)}
                      type="button"
                      aria-label={`Select ${theme.label} theme`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 mb-2 overflow-hidden"
                        style={{ 
                          ...(theme.isPattern
                            ? { 
                                backgroundColor: theme.backgroundColor,
                                backgroundImage: theme.value,
                                backgroundSize: theme.backgroundSize || 'auto'
                              }
                            : theme.isGradient 
                            ? { backgroundImage: theme.value }
                            : { backgroundColor: theme.value }
                          )
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{theme.label}</span>
                      {currentTheme.id === theme.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <span className="text-xs font-medium text-gray-500 mb-2 block">Color Themes</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {THEME_BACKGROUNDS.filter(theme => theme.category === 'color').map(theme => (
                    <button
                      key={theme.id}
                      className={`relative group flex flex-col items-center p-3 rounded-xl border transition-all hover:shadow-md ${
                        currentTheme.id === theme.id 
                          ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleThemeSelect(theme)}
                      type="button"
                      aria-label={`Select ${theme.label} theme`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 mb-2 overflow-hidden"
                        style={{ 
                          ...(theme.isPattern
                            ? { 
                                backgroundColor: theme.backgroundColor,
                                backgroundImage: theme.value,
                                backgroundSize: theme.backgroundSize || 'auto'
                              }
                            : theme.isGradient 
                            ? { backgroundImage: theme.value }
                            : { backgroundColor: theme.value }
                          )
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{theme.label}</span>
                      {currentTheme.id === theme.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Themes */}
              <div>
                <span className="text-xs font-medium text-gray-500 mb-2 block">Dark Themes</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {THEME_BACKGROUNDS.filter(theme => theme.category === 'dark').map(theme => (
                    <button
                      key={theme.id}
                      className={`relative group flex flex-col items-center p-3 rounded-xl border transition-all hover:shadow-md ${
                        currentTheme.id === theme.id 
                          ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleThemeSelect(theme)}
                      type="button"
                      aria-label={`Select ${theme.label} theme`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 mb-2 overflow-hidden"
                        style={{ 
                          ...(theme.isPattern
                            ? { 
                                backgroundColor: theme.backgroundColor,
                                backgroundImage: theme.value,
                                backgroundSize: theme.backgroundSize || 'auto'
                              }
                            : theme.isGradient 
                            ? { backgroundImage: theme.value }
                            : { backgroundColor: theme.value }
                          )
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{theme.label}</span>
                      {currentTheme.id === theme.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>


            </div>

            {/* Social Bar Position */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Social Bar Position</span>
              <div className="relative" ref={socialBarPositionDropdownRef}>
                <button
                  aria-label="Social Bar Position"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:ring-2 hover:ring-emerald-200 transition"
                  onClick={() => setShowSocialBarPositionDropdown(!showSocialBarPositionDropdown)}
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                {showSocialBarPositionDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow p-1 min-w-[180px] z-30">
                    {SOCIAL_BAR_POSITION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`block w-full text-left px-2 py-1 text-xs hover:bg-emerald-50 rounded ${socialBarPosition === opt.value ? 'bg-emerald-100' : ''}`}
                        onClick={() => handleSocialBarPositionSelect(opt.value)}
                        type="button"
                        aria-label={opt.label}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              aria-label="Save Appearance"
              onClick={handleSave}
              disabled={saving || isLoading}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border bg-emerald-500 text-white shadow-sm disabled:opacity-50 hover:ring-2 hover:ring-emerald-200 transition py-2 sm:py-3 text-sm sm:text-base font-semibold"
              type="button"
            >
              {isLoading ? 'Loading...' : saving ? 'Saving...' : 'Save'}
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}
            {saved && (
              <p className="text-green-500 text-sm text-center mt-2">
                Settings saved successfully!
              </p>
            )}
            {isLoading && (
              <p className="text-blue-500 text-sm text-center mt-2">
                Loading settings...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
} 