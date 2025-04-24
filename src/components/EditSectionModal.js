'use client';

import React from 'react';

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
    minWidth: '400px',
    maxWidth: '600px',
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

  return (
    <div style={modalOverlayStyle} onClick={onClose}> 
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> 
        <h2>Edit {section.name}</h2>
        
        {section.inputType === 'textarea' ? (
          <textarea
            style={textareaStyle}
            value={value}
            // Note: Removed direct console.log during cleanup
            onChange={(e) => { if (onChange) onChange(e.target.value); }}
            placeholder={`Enter your ${section.id}...`}
            rows={5}
          />
        ) : (
          <input
            type={section.inputType || 'text'}
            style={inputStyle}
            value={value}
            // Note: Removed direct console.log during cleanup
            onChange={(e) => { if (onChange) onChange(e.target.value); }}
            placeholder={section.placeholder || `Enter your ${section.id}...`}
          />
        )}

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={{ padding: '8px 15px' }}>Cancel</button>
          <button onClick={onSave} style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>Save</button>
        </div>
      </div>
    </div>
  );
}; 