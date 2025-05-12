import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../src/lib/supabase';
// Fallback LucideStar als SVG
const LucideStar = (props) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
import { FaRegStar } from 'react-icons/fa';
import { MdStarBorder } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import { FaFont } from 'react-icons/fa';
import { BsCircle, BsCapsule, BsSquare } from 'react-icons/bs';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'DM Sans', value: 'DM Sans, sans-serif' },
];
const ICON_PACKS = [
  { label: 'Lucide', value: 'lucide', icon: <LucideStar size={18} /> },
  { label: 'FontAwesome', value: 'fa', icon: <FaRegStar size={18} /> },
  { label: 'Material', value: 'material', icon: <MdStarBorder size={18} /> },
];
const BUTTON_SHAPES = [
  { label: 'Rounded', value: 'rounded-full', icon: <BsCircle size={18} /> },
  { label: 'Pill', value: 'rounded-xl', icon: <BsCapsule size={24} /> },
  { label: 'Square', value: 'rounded-md', icon: <BsSquare size={18} /> },
];

export default function DesignToolbar({
  initial,
  userId,
  onSave,
}) {
  // initial: { button_color, button_shape, font_family, icon_pack }
  const [buttonColor, setButtonColor] = useState(initial?.button_color || '#00C48C');
  const [buttonShape, setButtonShape] = useState(initial?.button_shape || 'rounded-full');
  const [fontFamily, setFontFamily] = useState(initial?.font_family || 'Inter, sans-serif');
  const [iconPack, setIconPack] = useState(initial?.icon_pack || 'lucide');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const fontDropdownRef = useRef(null);
  const iconDropdownRef = useRef(null);

  useEffect(() => {
    if (initial) {
      setButtonColor(initial.button_color || '#00C48C');
      setButtonShape(initial.button_shape || 'rounded-full');
      setFontFamily(initial.font_family || 'Inter, sans-serif');
      setIconPack(initial.icon_pack || 'lucide');
    }
  }, [initial]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target)) {
        setShowFontDropdown(false);
      }
      if (iconDropdownRef.current && !iconDropdownRef.current.contains(event.target)) {
        setShowIconDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    if (userId) {
      const { error } = await supabase.from('profiles').update({
        button_color: buttonColor,
        button_shape: buttonShape,
        font_family: fontFamily,
        icon_pack: iconPack,
      }).eq('id', userId);
      setSaving(false);
      setSaved(!error);
      if (onSave) onSave({ buttonColor, buttonShape, fontFamily, iconPack });
    } else {
      // fallback: localStorage
      localStorage.setItem('prysma_style', JSON.stringify({ buttonColor, buttonShape, fontFamily, iconPack }));
      setSaving(false);
      setSaved(true);
      if (onSave) onSave({ buttonColor, buttonShape, fontFamily, iconPack });
    }
  }

  return (
    <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center justify-between p-0 w-full">
      {/* 🎨 Button Color (icon-only) */}
      <button
        title="Button Color"
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 shadow-sm cursor-pointer"
        style={{ backgroundColor: buttonColor }}
        onClick={() => document.getElementById('color-picker-input').click()}
        type="button"
      >
        <input
          id="color-picker-input"
          type="color"
          value={buttonColor}
          onChange={e => setButtonColor(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
          tabIndex={-1}
        />
      </button>
      {/* 🔘 Button Shape (icon-only radio) */}
      <div className="flex items-center gap-1" title="Button Shape">
        {BUTTON_SHAPES.map(opt => (
          <label key={opt.value} className={`w-8 h-8 flex items-center justify-center border cursor-pointer ${buttonShape === opt.value ? 'bg-emerald-100 border-emerald-400' : 'bg-white border-gray-200'} transition rounded-full`}>
            <input
              type="radio"
              name="button-shape"
              value={opt.value}
              checked={buttonShape === opt.value}
              onChange={() => setButtonShape(opt.value)}
              className="hidden"
            />
            {opt.icon}
          </label>
        ))}
      </div>
      {/* 🅰️ Font Family (icon-only, dropdown) */}
      <div className="relative" ref={fontDropdownRef}>
        <button
          title="Font Family"
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm cursor-pointer"
          style={{ fontFamily }}
          onClick={() => setShowFontDropdown(v => !v)}
          type="button"
        >
          <FaFont size={16} />
        </button>
        {showFontDropdown && (
          <div className="absolute left-0 mt-2 z-30 bg-white border border-gray-200 rounded-md shadow p-1 min-w-[120px]">
            {FONT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`block w-full text-left px-2 py-1 text-xs hover:bg-emerald-50 rounded ${fontFamily === opt.value ? 'bg-emerald-100' : ''}`}
                style={{ fontFamily: opt.value }}
                onClick={() => { setFontFamily(opt.value); setShowFontDropdown(false); }}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* ⭐ Icon Style (icon-only, dropdown) */}
      <div className="relative" ref={iconDropdownRef}>
        <button
          title="Icon Style"
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm cursor-pointer"
          onClick={() => setShowIconDropdown(v => !v)}
          type="button"
        >
          {ICON_PACKS.find(opt => opt.value === iconPack)?.icon}
        </button>
        {showIconDropdown && (
          <div className="absolute left-0 mt-2 z-30 bg-white border border-gray-200 rounded-md shadow p-1 min-w-[120px]">
            {ICON_PACKS.map(opt => (
              <button
                key={opt.value}
                className={`block w-full text-left px-2 py-1 text-xs hover:bg-emerald-50 rounded flex items-center gap-2 ${iconPack === opt.value ? 'bg-emerald-100' : ''}`}
                onClick={() => { setIconPack(opt.value); setShowIconDropdown(false); }}
                type="button"
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* 💾 Save Button (icon-only) */}
      <button
        title="Save Appearance"
        onClick={handleSave}
        disabled={saving}
        className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition disabled:opacity-50 border border-gray-200 bg-emerald-500 text-white ml-auto"
        style={{ backgroundColor: buttonColor }}
        type="button"
      >
        <FaRegSave size={16} />
      </button>
      {saved && <span className="text-green-600 text-xs ml-1">Saved!</span>}
    </div>
  );
} 