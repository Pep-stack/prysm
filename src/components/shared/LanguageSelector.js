'use client';

import React from 'react';
import Select from 'react-select';
import ISO6391 from 'iso-639-1';

// Generate language options for react-select
const languageOptions = ISO6391.getAllCodes().map(code => ({
  value: code, // e.g., 'en'
  label: ISO6391.getName(code) // e.g., 'English'
})).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by language name

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

  return (
    <div style={{ marginBottom: '20px' }}> {/* Add spacing consistent with other modal inputs */}
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'normal' }}>Select Languages:</label>
      <Select
        isMulti
        options={languageOptions}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Search and select languages..."
        styles={{
          control: (provided) => ({ // Basic styling, customize as needed
            ...provided,
            minHeight: '40px', 
          }),
          multiValue: (provided) => ({ // Style for selected items
            ...provided,
            backgroundColor: '#e0e0e0', 
          }),
          multiValueLabel: (provided) => ({ // Style for text within selected items
            ...provided,
            color: '#333',
          }),
          multiValueRemove: (provided) => ({ // Style for the 'x' button on selected items
            ...provided,
            color: '#555',
            ':hover': {
              backgroundColor: '#c0c0c0',
              color: 'white',
            },
          }),
        }}
      />
    </div>
  );
} 