'use client';

import React, { useState, useEffect } from 'react';
import LanguageSelector from '../../shared/LanguageSelector';
import { LuLanguages } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

// Mapping from common language codes to emoji flags
const langToCountry = {
  en: '🇬🇧', // English -> Great Britain flag
  nl: '🇳🇱', // Dutch -> Netherlands flag
  de: '🇩🇪', // German -> Germany flag
  fr: '🇫🇷', // French -> France flag
  es: '🇪🇸', // Spanish -> Spain flag
  it: '🇮🇹', // Italian -> Italy flag
  pt: '🇵🇹', // Portuguese -> Portugal flag
  ja: '🇯🇵', // Japanese -> Japan flag
  zh: '🇨🇳', // Chinese -> China flag
  ru: '🇷🇺', // Russian -> Russia flag
  ar: '🇸🇦', // Arabic -> Saudi Arabia flag
  hi: '🇮🇳', // Hindi -> India flag
  ko: '🇰🇷', // Korean -> South Korea flag
  tr: '🇹🇷', // Turkish -> Turkey flag
  sv: '🇸🇪', // Swedish -> Sweden flag
  no: '🇳🇴', // Norwegian -> Norway flag
  da: '🇩🇰', // Danish -> Denmark flag
  fi: '🇫🇮', // Finnish -> Finland flag
  pl: '🇵🇱', // Polish -> Poland flag
  cs: '🇨🇿', // Czech -> Czech Republic flag
  sk: '🇸🇰', // Slovak -> Slovakia flag
  hu: '🇭🇺', // Hungarian -> Hungary flag
  ro: '🇷🇴', // Romanian -> Romania flag
  bg: '🇧🇬', // Bulgarian -> Bulgaria flag
  hr: '🇭🇷', // Croatian -> Croatia flag
  sl: '🇸🇮', // Slovenian -> Slovenia flag
  et: '🇪🇪', // Estonian -> Estonia flag
  lv: '🇱🇻', // Latvian -> Latvia flag
  lt: '🇱🇹', // Lithuanian -> Lithuania flag
  el: '🇬🇷', // Greek -> Greece flag
  he: '🇮🇱', // Hebrew -> Israel flag
  th: '🇹🇭', // Thai -> Thailand flag
  vi: '🇻🇳', // Vietnamese -> Vietnam flag
  id: '🇮🇩', // Indonesian -> Indonesia flag
  ms: '🇲🇾', // Malay -> Malaysia flag
  tl: '🇵🇭', // Filipino -> Philippines flag
  uk: '🇺🇦', // Ukrainian -> Ukraine flag
  be: '🇧🇾', // Belarusian -> Belarus flag
  ka: '🇬🇪', // Georgian -> Georgia flag
  am: '🇪🇹', // Amharic -> Ethiopia flag
  sw: '🇰🇪', // Swahili -> Kenya flag
  af: '🇿🇦', // Afrikaans -> South Africa flag
  ca: '🇪🇸', // Catalan -> Spain flag (region)
  eu: '🇪🇸', // Basque -> Spain flag (region)
  gl: '🇪🇸', // Galician -> Spain flag (region)
  cy: '🇬🇧', // Welsh -> Great Britain flag
  ga: '🇮🇪', // Irish -> Ireland flag
  mt: '🇲🇹', // Maltese -> Malta flag
  is: '🇮🇸', // Icelandic -> Iceland flag
  fo: '🇫🇴', // Faroese -> Faroe Islands flag
  sq: '🇦🇱', // Albanian -> Albania flag
  mk: '🇲🇰', // Macedonian -> North Macedonia flag
  sr: '🇷🇸', // Serbian -> Serbia flag
  bs: '🇧🇦', // Bosnian -> Bosnia and Herzegovina flag
  me: '🇲🇪', // Montenegrin -> Montenegro flag
  kk: '🇰🇿', // Kazakh -> Kazakhstan flag
  ky: '🇰🇬', // Kyrgyz -> Kyrgyzstan flag
  uz: '🇺🇿', // Uzbek -> Uzbekistan flag
  mn: '🇲🇳', // Mongolian -> Mongolia flag
  ne: '🇳🇵', // Nepali -> Nepal flag
  si: '🇱🇰', // Sinhala -> Sri Lanka flag
  ta: '🇱🇰', // Tamil -> Sri Lanka flag (could also be IN)
  te: '🇮🇳', // Telugu -> India flag
  kn: '🇮🇳', // Kannada -> India flag
  ml: '🇮🇳', // Malayalam -> India flag
  gu: '🇮🇳', // Gujarati -> India flag
  pa: '🇮🇳', // Punjabi -> India flag
  or: '🇮🇳', // Odia -> India flag
  as: '🇮🇳', // Assamese -> India flag
  bn: '🇧🇩', // Bengali -> Bangladesh flag
  ur: '🇵🇰', // Urdu -> Pakistan flag
  fa: '🇮🇷', // Persian -> Iran flag
  ps: '🇦🇫', // Pashto -> Afghanistan flag
  my: '🇲🇲', // Burmese -> Myanmar flag
  km: '🇰🇭', // Khmer -> Cambodia flag
  lo: '🇱🇦', // Lao -> Laos flag
  bo: '🇨🇳', // Tibetan -> China flag (Tibet region)
  dz: '🇧🇹', // Dzongkha -> Bhutan flag
};

export default function LanguagesSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  // State to hold the selected languages during editing
  const [currentSelection, setCurrentSelection] = useState([]);

  // Parse initial language codes from profile
  const parseLanguageCodes = (languagesData) => {
    // Handle different data types safely
    if (Array.isArray(languagesData)) {
      return languagesData.filter(lang => lang && typeof lang === 'string');
    }
    
    if (typeof languagesData === 'string' && languagesData.trim()) {
      return languagesData.split(',').map(lang => lang.trim()).filter(lang => lang);
    }
    
    // Handle null, undefined, or other types
    return [];
  };

  const initialLanguageCodes = parseLanguageCodes(profile?.languages);
  
  // Initialize local state when editing starts
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialLanguageCodes);
    }
  }, [isEditing]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection); // Pass the array of codes
    }
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Languages</h3>
        <LanguageSelector 
          value={currentSelection}
          onChange={setCurrentSelection}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Save Languages
          </button>
        </div>
      </div>
    );
  }

  // If no languages, don't show section
  if (initialLanguageCodes.length === 0) {
    return null;
  }

  // Show languages with clean, compact design
  return (
    <div 
      style={{
        ...sectionStyle,
        padding: '16px',
        margin: '0 0 42px 0',
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: '12px',
        boxShadow: 'none',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        width: '100%',
        fontFamily: settings.font_family || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Clean section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
                      backgroundColor: settings.icon_color || '#6B7280',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LuLanguages style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Languages
        </h2>
      </div>

      {/* Compact content */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {initialLanguageCodes.map((langCode, index) => {
          const flag = langToCountry[langCode] || '🌐';
          const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: `${textColor}15`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: textColor,
                opacity: 0.9
              }}
            >
              <span style={{ fontSize: '14px' }}>{flag}</span>
              <span>{langName || langCode}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 