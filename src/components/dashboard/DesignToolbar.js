import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { FaFont, FaTimes } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { useDesignSettings } from './DesignSettingsContext';

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

const TEXT_COLOR_OPTIONS = [
  { label: 'Black', value: '#000000', name: 'Black' },
  { label: 'Gray', value: '#6b7280', name: 'Gray' },
  { label: 'White', value: '#ffffff', name: 'White' }
];

const ICON_COLOR_OPTIONS = [
  { label: 'Auto', value: 'auto', name: 'Auto' },
  { label: 'Black', value: 'black', name: 'Black' },
  { label: 'White', value: 'white', name: 'White' },
  { label: 'Gray', value: '#6b7280', name: 'Gray' }
];

const SOCIAL_BAR_POSITION_OPTIONS = [
  { label: 'Top (Below Header)', value: 'top', name: 'Top' },
  { label: 'Bottom (Above Footer)', value: 'bottom', name: 'Bottom' }
];

const BACKGROUND_COLOR_OPTIONS = [
  // Clean solids (keep these)
  { label: 'Pure White', value: '#ffffff', name: 'Pure White' },
  { label: 'Light Gray', value: '#f8f9fa', name: 'Light Gray' },
  { label: 'Soft Cream', value: '#fafaf9', name: 'Soft Cream' },
  { label: 'Professional Dark', value: '#1f2937', name: 'Professional Dark' },
  
  // Modern neutrals (new)
  { label: 'Warm White', value: '#fdfdfd', name: 'Warm White' },
  { label: 'Cool Gray', value: '#f1f5f9', name: 'Cool Gray' },
  { label: 'Slate Blue', value: '#f8fafc', name: 'Slate Blue' },
  
  // Subtle professional gradients (refined existing)
  { label: 'Ocean Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: 'Ocean Gradient', isGradient: true },
  { label: 'Mint Gradient', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', name: 'Mint Gradient', isGradient: true },
  { label: 'Dark Ocean', value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', name: 'Dark Ocean', isGradient: true },
  { label: 'Dark Emerald', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', name: 'Dark Emerald', isGradient: true },
  { label: 'Dark Royal', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', name: 'Dark Royal', isGradient: true },
  
  // Modern 2024 gradients (new)
  { label: 'Soft Glassmorphism', value: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)', name: 'Soft Glassmorphism', isGradient: true },
  { label: 'Professional Blue', value: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)', name: 'Professional Blue', isGradient: true },
  { label: 'Warm Neutral', value: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #f8f9fa 100%)', name: 'Warm Neutral', isGradient: true },
  { label: 'Modern Mesh', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', name: 'Modern Mesh', isGradient: true },
  { label: 'Platinum Shine', value: 'linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)', name: 'Platinum Shine', isGradient: true },
  { label: 'Arctic Mist', value: 'linear-gradient(135deg, #f7f8f8 0%, #acbb78 100%)', name: 'Arctic Mist', isGradient: true },
  { label: 'Digital Dawn', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)', name: 'Digital Dawn', isGradient: true },
  { label: 'Clean Slate', value: 'linear-gradient(135deg, #485563 0%, #29323c 100%)', name: 'Clean Slate', isGradient: true },
  { label: 'Emerald Professional', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', name: 'Emerald Professional', isGradient: true },
  { label: 'Cosmic Latte', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff8c94 100%)', name: 'Cosmic Latte', isGradient: true }
];

export default function DesignToolbar({ initial, userId, onProfileUpdate }) {
  const { settings, setSettings, isLoading } = useDesignSettings();
  
  // Use context settings as source of truth, fallback to initial prop
  const [fontFamily, setFontFamily] = useState(settings.font_family || initial?.font_family || 'Inter, sans-serif');
  const [textColor, setTextColor] = useState(settings.text_color || initial?.text_color || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(settings.background_color || initial?.background_color || '#f8f9fa');
  const [iconColor, setIconColor] = useState(settings.icon_color || initial?.icon_color || 'auto');
  const [socialBarPosition, setSocialBarPosition] = useState(settings.social_bar_position || initial?.social_bar_position || 'top');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showTextColorDropdown, setShowTextColorDropdown] = useState(false);
  const [showBackgroundColorDropdown, setShowBackgroundColorDropdown] = useState(false);
  const [showIconColorDropdown, setShowIconColorDropdown] = useState(false);
  const [showSocialBarPositionDropdown, setShowSocialBarPositionDropdown] = useState(false);
  const fontDropdownRef = useRef(null);
  const textColorDropdownRef = useRef(null);
  const backgroundColorDropdownRef = useRef(null);
  const iconColorDropdownRef = useRef(null);
  const socialBarPositionDropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (showFontDropdown && fontDropdownRef.current && !fontDropdownRef.current.contains(e.target)) setShowFontDropdown(false);
      if (showTextColorDropdown && textColorDropdownRef.current && !textColorDropdownRef.current.contains(e.target)) setShowTextColorDropdown(false);
      if (showBackgroundColorDropdown && backgroundColorDropdownRef.current && !backgroundColorDropdownRef.current.contains(e.target)) setShowBackgroundColorDropdown(false);
      if (showIconColorDropdown && iconColorDropdownRef.current && !iconColorDropdownRef.current.contains(e.target)) setShowIconColorDropdown(false);
      if (showSocialBarPositionDropdown && socialBarPositionDropdownRef.current && !socialBarPositionDropdownRef.current.contains(e.target)) setShowSocialBarPositionDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showFontDropdown, showTextColorDropdown, showBackgroundColorDropdown, showIconColorDropdown, showSocialBarPositionDropdown]);

  // Alleen synchroniseren bij eerste load, niet bij elke change
  useEffect(() => {
    if (!isLoading && settings.font_family && !fontFamily) {
      setFontFamily(settings.font_family);
      setTextColor(settings.text_color || '#000000');
      setBackgroundColor(settings.background_color || '#f8f9fa');
      setIconColor(settings.icon_color || 'auto');
      setSocialBarPosition(settings.social_bar_position || 'top');
    }
  }, [settings, isLoading]);

  // Fallback naar initial prop als context nog niet geladen is
  useEffect(() => {
    if (!isLoading && !settings.font_family && initial?.font_family) {
      console.log('🔄 TOOLBAR: Using initial prop values as fallback');
      setFontFamily(initial.font_family);
      setTextColor(initial.text_color || '#000000');
      setBackgroundColor(initial.background_color || '#f8f9fa');
      setIconColor(initial.icon_color || 'auto');
      setSocialBarPosition(initial.social_bar_position || 'top');
    }
  }, [initial, settings, isLoading]);

  const handleSave = async () => {
    if (isLoading) {
      console.log('⚠️ SAVE: Context still loading, skipping save');
      return;
    }

    setSaving(true);
    setError(null);
    
    // Gebruik de huidige local state waarden (die zijn up-to-date)
    const payload = {
      font_family: fontFamily,
      text_color: textColor,
      background_color: backgroundColor,
      icon_color: iconColor,
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

  const handleTextColorSelect = (color) => {
    setTextColor(color);
    // NIET automatisch context updaten - alleen bij save
    setShowTextColorDropdown(false);
  };

  const handleBackgroundColorSelect = (color) => {
    setBackgroundColor(color);
    // NIET automatisch context updaten - alleen bij save
    setShowBackgroundColorDropdown(false);
  };

  const handleIconColorSelect = (color) => {
    setIconColor(color);
    // NIET automatisch context updaten - alleen bij save
    setShowIconColorDropdown(false);
  };

  const handleSocialBarPositionSelect = (position) => {
    setSocialBarPosition(position);
    // NIET automatisch context updaten - alleen bij save
    setShowSocialBarPositionDropdown(false);
  };

  return (
    <div className="relative w-full flex justify-end z-40">
      {/* Design Settings Button */}
      <button
        aria-label="Open Design Settings"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow hover:bg-neutral-50 transition text-sm font-semibold"
        onClick={() => setShowMenu(true)}
        type="button"
      >
        <MdSettings className="text-emerald-500" />
        <span>Design Settings</span>
      </button>
      {/* Overlay Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" aria-label="Close Design Settings Overlay" onClick={() => setShowMenu(false)} />
          <div
            ref={menuRef}
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 flex flex-col gap-6 min-w-[320px] max-w-[90vw]"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
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

            {/* Text Color */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Text Color</span>
              <div className="relative" ref={textColorDropdownRef}>
                <button
                  aria-label="Text Color"
                  className="w-9 h-9 rounded-full border border-gray-200 shadow-sm flex items-center justify-center relative hover:ring-2 hover:ring-emerald-200 transition"
                  style={{ backgroundColor: textColor }}
                  onClick={() => setShowTextColorDropdown(!showTextColorDropdown)}
                  type="button"
                />
                {showTextColorDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 flex gap-2 z-30 flex-col items-center min-w-[180px]">
                    <div className="flex gap-2 mb-2">
                      {TEXT_COLOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          className="w-6 h-6 rounded-full border border-gray-200 hover:ring-2 hover:ring-emerald-200 transition"
                          style={{ backgroundColor: opt.value, border: opt.value === '#ffffff' ? '2px solid #e5e7eb' : '1px solid #d1d5db' }}
                          onClick={() => handleTextColorSelect(opt.value)}
                          aria-label={opt.name}
                          title={opt.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Icon Color */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Icon Color</span>
              <div className="relative" ref={iconColorDropdownRef}>
                <button
                  aria-label="Icon Color"
                  className="w-9 h-9 rounded-full border border-gray-200 shadow-sm flex items-center justify-center relative hover:ring-2 hover:ring-emerald-200 transition"
                  style={{ backgroundColor: iconColor === 'auto' ? '#e5e7eb' : iconColor }}
                  onClick={() => setShowIconColorDropdown(!showIconColorDropdown)}
                  type="button"
                >
                  {iconColor === 'auto' && <span className="text-xs font-bold">A</span>}
                </button>
                {showIconColorDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 flex gap-2 z-30 flex-col items-center min-w-[180px]">
                    <div className="flex gap-2 mb-2">
                      {ICON_COLOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          className="w-6 h-6 rounded-full border border-gray-200 hover:ring-2 hover:ring-emerald-200 transition flex items-center justify-center"
                          style={{ 
                            backgroundColor: opt.value === 'auto' ? '#e5e7eb' : opt.value,
                            border: opt.value === 'white' ? '2px solid #e5e7eb' : '1px solid #d1d5db'
                          }}
                          onClick={() => handleIconColorSelect(opt.value)}
                          aria-label={opt.name}
                          title={opt.name}
                        >
                          {opt.value === 'auto' && <span className="text-xs font-bold">A</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Color */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Background</span>
              <div className="relative" ref={backgroundColorDropdownRef}>
                <button
                  aria-label="Background Color"
                  className="w-9 h-9 rounded-full border border-gray-200 shadow-sm relative hover:ring-2 hover:ring-emerald-200 transition overflow-hidden"
                  style={{ 
                    ...(backgroundColor?.includes('linear-gradient')
                      ? { backgroundImage: backgroundColor }
                      : { backgroundColor }
                    )
                  }}
                  onClick={() => setShowBackgroundColorDropdown(!showBackgroundColorDropdown)}
                  type="button"
                />
                {showBackgroundColorDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow p-3 z-30 flex-col items-center min-w-[240px]">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {BACKGROUND_COLOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:ring-2 hover:ring-emerald-200 transition relative overflow-hidden"
                          style={{ 
                            ...(opt.isGradient 
                              ? { backgroundImage: opt.value }
                              : { backgroundColor: opt.value }
                            ),
                            border: opt.value === '#ffffff' || opt.value === '#fafaf9' ? '2px solid #e5e7eb' : '1px solid #d1d5db'
                          }}
                          onClick={() => handleBackgroundColorSelect(opt.value)}
                          aria-label={opt.name}
                          title={opt.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
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
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border bg-emerald-500 text-white shadow-sm disabled:opacity-50 hover:ring-2 hover:ring-emerald-200 transition py-2 text-base font-semibold"
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