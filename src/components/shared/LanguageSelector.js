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

export default function LanguageSelector({ value = [], onChange }) {
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

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'normal' }}>
        Select Languages (showing {languageOptions.length} languages with flags):
      </label>
      <Select
        isMulti
        options={languageOptions}
        value={selectedOptions}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        placeholder="Search and select languages..."
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '40px', 
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0e0e0', 
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: '#333',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: '#555',
            ':hover': {
              backgroundColor: '#c0c0c0',
              color: 'white',
            },
          }),
          option: (provided) => ({
            ...provided,
            padding: '8px 12px',
          }),
        }}
      />
    </div>
  );
} 