'use client';

import React, { useState, useEffect } from 'react';
import LanguageSelector from '../../shared/LanguageSelector';

// Mapping from common language codes to emoji flags
// This should match the mapping in LanguageSelector.js
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
  }, [isEditing]); // Removed initialLanguageCodes dependency to prevent reset on profile update while editing

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
          onChange={setCurrentSelection} // Update local state
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Save Languages
          </button>
        </div>
      </div>
    );
  }

  // Render display UI (flags and/or language codes)
  if (initialLanguageCodes.length > 0) {
    return (
      <div style={sectionStyle} title="Click to edit languages">
        <h3 style={sectionTitleStyle}>Languages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          {initialLanguageCodes.map((code) => {
            const flagEmoji = langToCountry[code];
            
            // Always show something for each language code
            return (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {flagEmoji ? (
                  <span 
                    title={`${code} - Language flag`}
                    style={{ 
                      fontSize: '32px', 
                      lineHeight: '1',
                      cursor: 'default'
                    }} 
                  >
                    {flagEmoji}
                  </span>
                ) : (
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      backgroundColor: '#f0f0f0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontWeight: '500'
                    }}
                    title={`Language: ${code}`}
                  >
                    {code.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    // Show placeholder if no languages selected
    return (
      <div style={placeholderStyle} title="Click to edit languages">
         <p>Click to select Languages</p> 
      </div>
    );
  }
} 