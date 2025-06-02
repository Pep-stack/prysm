'use client';

import React from 'react';
import LanguageSelector from '../shared/LanguageSelector';
import EducationSelector from '../shared/EducationSelector';

export default function EditSectionModal({ isOpen, onClose, section, value, onChange, onSave }) {
  // Note: Removed the console.log from here during cleanup
  if (!isOpen || !section) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: section?.editorComponent === 'EducationSelector' ? '800px' : '400px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };
  
  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  };

  const renderInput = () => {
    // Check if a custom editor component is specified
    if (section.editorComponent === 'LanguageSelector') {
      // Ensure 'value' passed to LanguageSelector is an array of selected language codes
      const selectedLanguageCodes = Array.isArray(value) ? value : (value ? value.split(',').map(c => c.trim()) : []);
      return (
        <LanguageSelector 
          value={selectedLanguageCodes} // Pass current codes
          onChange={onChange} // onChange should expect an array of codes
        />
      );
    }

    if (section.editorComponent === 'EducationSelector') {
      // Ensure 'value' passed to EducationSelector is an array of education objects
      const selectedEducationEntries = Array.isArray(value) ? value : [];
      return (
        <EducationSelector 
          value={selectedEducationEntries} // Pass current education entries
          onChange={onChange} // onChange should expect an array of education objects
        />
      );
    }

    // Default rendering based on inputType
    if (section.inputType === 'textarea') {
      return (
        <textarea
          style={textareaStyle}
          value={value || ''} // Ensure value is not null/undefined for textarea
          onChange={(e) => { if (onChange) onChange(e.target.value); }}
          placeholder={`Enter your ${section.id}...`}
          rows={5}
        />
      );
    } else {
      return (
        <input
          type={section.inputType || 'text'}
          style={inputStyle}
          value={value || ''} // Ensure value is not null/undefined for input
          onChange={(e) => { if (onChange) onChange(e.target.value); }}
          placeholder={section.placeholder || `Enter your ${section.id}...`}
        />
      );
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}> 
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> 
        <h2>Edit {section.name}</h2>
        
        {renderInput()} {/* Render the correct input or custom component */}

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={{ padding: '8px 15px' }}>Cancel</button>
          <button onClick={onSave} style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>Save</button>
        </div>
      </div>
    </div>
  );
}; 