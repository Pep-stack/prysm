import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../src/lib/supabase';
import { FaRegStar, FaFont, FaRegSave, FaTimes, FaStar } from 'react-icons/fa';
import { MdStarBorder, MdSettings } from 'react-icons/md';
import { BsCircle, BsCapsule, BsSquare } from 'react-icons/bs';
import { useDesignSettings } from './DesignSettingsContext';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'DM Sans', value: 'DM Sans, sans-serif' },
];
const ICON_PACKS = [
  { label: 'Icon', value: 'lucide', icon: <FaStar size={18} /> },
  { label: 'Emoji', value: 'emoji', icon: <span style={{ fontSize: 20, lineHeight: 1 }}>⭐️</span> },
];
const BUTTON_SHAPES = [
  { label: 'Rounded', value: 'rounded-full', icon: <BsCircle size={20} /> },
  { label: 'Pill', value: 'rounded-xl', icon: <BsCapsule size={28} /> },
  { label: 'Square', value: 'rounded-md', icon: <BsSquare size={20} /> },
];
const COLOR_PALETTE = [
  '#00C48C', '#F87171', '#FBBF24', '#60A5FA', '#A78BFA', '#F472B6', '#374151', '#F3F4F6'
];

export default function DesignToolbar({ initial, userId, onProfileUpdate }) {
  const { settings, setSettings } = useDesignSettings();
  const [buttonColor, setButtonColor] = useState(initial?.button_color || '#00C48C');
  const [buttonShape, setButtonShape] = useState(initial?.button_shape || 'rounded-full');
  const [fontFamily, setFontFamily] = useState(initial?.font_family || 'Inter, sans-serif');
  const [iconPack, setIconPack] = useState(initial?.icon_pack || 'lucide');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const fontDropdownRef = useRef(null);
  const iconDropdownRef = useRef(null);
  const colorPaletteRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (showFontDropdown && fontDropdownRef.current && !fontDropdownRef.current.contains(e.target)) setShowFontDropdown(false);
      if (showIconDropdown && iconDropdownRef.current && !iconDropdownRef.current.contains(e.target)) setShowIconDropdown(false);
      if (showColorPalette && colorPaletteRef.current && !colorPaletteRef.current.contains(e.target) && e.target.id !== 'color-palette-btn') setShowColorPalette(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showFontDropdown, showIconDropdown, showColorPalette]);

  // Synchroniseer lokale state met initial prop als deze verandert
  useEffect(() => {
    setButtonColor(initial?.button_color || '#00C48C');
    setButtonShape(initial?.button_shape || 'rounded-full');
    setFontFamily(initial?.font_family || 'Inter, sans-serif');
    setIconPack(initial?.icon_pack || 'lucide');
  }, [initial]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    const payload = {
      button_color: buttonColor,
      button_shape: buttonShape,
      font_family: fontFamily,
      icon_pack: iconPack
    };

    console.log('Attempting to save settings:', {
      userId,
      payload,
      initial
    });

    try {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      // Eerst controleren of het profiel bestaat
      const { data: profile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError) {
        console.error('Error checking profile:', checkError);
        throw new Error('Profile not found');
      }

      // Dan updaten
      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      // Haal het profiel opnieuw op uit Supabase
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!fetchError && updatedProfile) {
        setSettings(updatedProfile); // update context
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile); // update parent state
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error in handleSave:', {
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

  const handleColorSelect = (color) => {
    setSettings(prev => ({ ...prev, buttonColor: color }));
    setButtonColor(color);
    setShowColorPalette(false);
  };

  const handleShapeSelect = (shape) => {
    setSettings(prev => ({ ...prev, buttonShape: shape }));
    setButtonShape(shape);
  };

  const handleFontSelect = (font) => {
    setSettings(prev => ({ ...prev, fontFamily: font }));
    setFontFamily(font);
    setShowFontDropdown(false);
  };

  const handleIconSelect = (iconPack) => {
    setSettings(prev => ({ ...prev, iconPack: iconPack }));
    setIconPack(iconPack);
    setShowIconDropdown(false);
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
          >
            <button
              aria-label="Close Design Settings"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowMenu(false)}
              type="button"
            >
              <FaTimes size={18} />
            </button>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Button Shape</span>
              <div className="flex gap-2">
                {BUTTON_SHAPES.map(({ value, icon }) => (
                  <label key={value} className={`w-9 h-9 flex items-center justify-center cursor-pointer border ${buttonShape === value ? 'bg-emerald-100 border-emerald-400' : 'bg-white border-gray-200'} rounded-full shadow-sm hover:ring-2 hover:ring-emerald-200 transition`}>
                    <input
                      type="radio"
                      name="shape"
                      value={value}
                      checked={buttonShape === value}
                      onChange={() => handleShapeSelect(value)}
                      className="hidden"
                      aria-label={value}
                    />
                    {icon}
                  </label>
                ))}
              </div>
            </div>
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
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Button Color</span>
              <div className="relative">
                <button
                  id="color-palette-btn"
                  aria-label="Button Color"
                  className="w-9 h-9 rounded-full border border-gray-200 shadow-sm flex items-center justify-center relative hover:ring-2 hover:ring-emerald-200 transition"
                  style={{ backgroundColor: buttonColor }}
                  onClick={() => setShowColorPalette(v => !v)}
                  type="button"
                />
                {showColorPalette && (
                  <div ref={colorPaletteRef} className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 flex gap-2 z-30 flex-col items-center min-w-[180px]">
                    <div className="flex gap-2 mb-2">
                      {COLOR_PALETTE.map(color => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded-full border border-gray-200 hover:ring-2 hover:ring-emerald-200 transition"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelect(color)}
                          aria-label={color}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={e => { setButtonColor(e.target.value); setShowColorPalette(false); }}
                      className="w-8 h-8 border-none bg-transparent cursor-pointer"
                      aria-label="Custom color"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 mb-1">Icon Style</span>
              <div className="relative" ref={iconDropdownRef}>
                <button
                  aria-label="Icon Style"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:ring-2 hover:ring-emerald-200 transition"
                  onClick={() => setShowIconDropdown(!showIconDropdown)}
                  type="button"
                >
                  {ICON_PACKS.find(opt => opt.value === iconPack)?.icon}
                </button>
                {showIconDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow p-1 min-w-[120px] z-30">
                    {ICON_PACKS.map(opt => (
                      <button
                        key={opt.value}
                        className={`flex gap-2 items-center w-full text-left px-2 py-1 text-xs hover:bg-emerald-50 rounded ${iconPack === opt.value ? 'bg-emerald-100' : ''}`}
                        onClick={() => handleIconSelect(opt.value)}
                        type="button"
                        aria-label={opt.label}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              aria-label="Save Appearance"
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border bg-emerald-500 text-white shadow-sm disabled:opacity-50 hover:ring-2 hover:ring-emerald-200 transition py-2 text-base font-semibold"
              style={{ backgroundColor: buttonColor }}
              type="button"
            >
              {saving ? 'Saving...' : 'Save'}
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
          </div>
        </>
      )}
    </div>
  );
}
