'use client';

import React from 'react';
import Select from 'react-select';
import ISO6391 from 'iso-639-1';

// Mapping from language codes to emoji flags
// Only include languages that have a corresponding flag
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

// Generate language options only for languages that have flags
const languageOptions = Object.keys(langToCountry)
  .map(code => {
    const flagEmoji = langToCountry[code];
    
    // Only include if flag exists and language name is available
    if (flagEmoji && ISO6391.getName(code)) {
      return {
        value: code,
        label: ISO6391.getName(code),
        flagEmoji: flagEmoji
      };
    }
    return null;
  })
  .filter(option => option !== null)
  .sort((a, b) => a.label.localeCompare(b.label));

export default function LanguageSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  // Ensure 'value' is always an array of language codes
  const currentLanguageCodes = Array.isArray(value) ? value : [];

  // Map the codes back to the option objects needed by react-select
  const selectedOptions = currentLanguageCodes
    .map(code => languageOptions.find(option => option.value === code))
    .filter(option => option); // Filter out any undefined results if a code is invalid

  // Handle change from react-select
  const handleChange = (selected) => {
    // Extract just the language codes ('value') from the selected options
    const selectedCodes = selected ? selected.map(option => option.value) : [];
    if (onChange) {
      onChange(selectedCodes); // Pass the array of codes to the parent's onChange
    }
  };

  const handleCancel = () => {
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleSave = () => {
    // Save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
  };

  // Custom option component to show flag + name
  const formatOptionLabel = ({ value, label, flagEmoji }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {flagEmoji && (
          <span style={{ fontSize: '20px', lineHeight: '1' }}>
            {flagEmoji}
          </span>
        )}
        <span>{label}</span>
      </div>
    );
  };

  const darkSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      backgroundColor: '#111827',
      borderColor: state.isFocused ? '#6366f1' : '#374151',
      borderWidth: '1px',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#6366f1'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#111827',
      border: '1px solid #374151',
      borderRadius: '8px',
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#1f2937' : 'transparent',
      color: '#ffffff',
      padding: '12px',
      '&:hover': {
        backgroundColor: '#1f2937'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#374151',
      borderRadius: '6px'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '14px'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#9ca3af',
      '&:hover': {
        backgroundColor: '#ef4444',
        color: '#ffffff'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6b7280'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff'
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#374151'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#9ca3af',
      '&:hover': {
        color: '#ffffff'
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#9ca3af',
      '&:hover': {
        color: '#ffffff'
      }
    })
  };

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Languages Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#6366f1'
          }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Languages</h3>
            <p className="text-gray-400 text-sm">Select languages you speak</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <div className="mb-6">
          <label className="block text-white font-medium mb-3 text-sm">
            Select Languages ({languageOptions.length} available with flags)
          </label>
          <Select
            isMulti
            options={languageOptions}
            value={selectedOptions}
            onChange={handleChange}
            formatOptionLabel={formatOptionLabel}
            placeholder="Search and select languages..."
            styles={darkSelectStyles}
            menuPlacement="auto"
            menuPosition="fixed"
          />
        </div>

        {/* Selected Languages Display */}
        {selectedOptions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">Selected Languages ({selectedOptions.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white text-sm rounded-lg"
                >
                  {option.flagEmoji && (
                    <span className="text-lg">{option.flagEmoji}</span>
                  )}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save/Cancel Buttons - Always visible at bottom */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#6366f1',
              color: 'white'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 