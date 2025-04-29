'use client';

import React, { useState, useEffect } from 'react';
import Flags from 'country-flag-icons/react/3x2'
import LanguageSelector from '../../shared/LanguageSelector';

// Basic mapping from common language codes to country codes for flags
// This is not exhaustive and can be expanded or made more sophisticated
const langToCountry = {
  en: 'GB', // English -> Great Britain flag
  nl: 'NL', // Dutch -> Netherlands flag
  de: 'DE', // German -> Germany flag
  fr: 'FR', // French -> France flag
  es: 'ES', // Spanish -> Spain flag
  it: 'IT', // Italian -> Italy flag
  pt: 'PT', // Portuguese -> Portugal flag
  ja: 'JP', // Japanese -> Japan flag
  zh: 'CN', // Chinese -> China flag
  ru: 'RU', // Russian -> Russia flag
  ar: 'SA', // Arabic -> Saudi Arabia flag (common representation)
  hi: 'IN', // Hindi -> India flag
  // Add more mappings as needed
};

export default function LanguagesSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
  // State to hold the selected languages during editing
  const [currentSelection, setCurrentSelection] = useState([]);

  // Parse initial language codes from profile
  const parseLanguageCodes = (languagesData) => {
    if (Array.isArray(languagesData)) return languagesData;
    if (typeof languagesData === 'string') {
      return languagesData.split(',').map(lang => lang.trim()).filter(lang => lang);
    }
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
          <button onClick={onCancel} style={{ padding: '5px 10px' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '5px 10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>Save Languages</button>
        </div>
      </div>
    );
  }

  // Render display UI (flags)
  if (initialLanguageCodes.length > 0) {
    return (
      <div style={sectionStyle} title="Click to edit languages">
        <h3 style={sectionTitleStyle}>Languages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {initialLanguageCodes.map((code) => {
            const countryCode = langToCountry[code];
            const FlagComponent = countryCode ? Flags[countryCode] : null;
            return FlagComponent ? (
              <FlagComponent 
                key={code} 
                title={code} 
                style={{ width: '32px', height: 'auto' }} 
              />
            ) : null;
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