'use client';

import React from 'react';
import LanguageSelector from '../shared/LanguageSelector';
import EducationSelector from '../shared/EducationSelector';
import ExperienceSelector from '../shared/ExperienceSelector';
import CertificationSelector from '../shared/CertificationSelector';
import ProjectSelector from '../shared/ProjectSelector';
import ClientTestimonialSelector from '../shared/ClientTestimonialSelector';
import SkillsSelector from '../shared/SkillsSelector';

export default function EditSectionModal({ isOpen, onClose, section, value, onChange, onSave, user }) {
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
    maxWidth: (section?.editorComponent === 'EducationSelector' || section?.editorComponent === 'ExperienceSelector' || section?.editorComponent === 'CertificationSelector' || section?.editorComponent === 'ProjectSelector' || section?.editorComponent === 'SkillsSelector') ? '800px' : '400px',
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
    console.log('🔍 EDIT-MODAL: Rendering input for section:', {
      sectionType: section.type,
      sectionName: section.name,
      editorComponent: section.editorComponent,
      value: value,
      valueType: typeof value,
      isArray: Array.isArray(value)
    });
    
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

    if (section.editorComponent === 'ExperienceSelector') {
      // Ensure 'value' passed to ExperienceSelector is an array of experience objects
      const selectedExperienceEntries = Array.isArray(value) ? value : [];
      return (
        <ExperienceSelector 
          value={selectedExperienceEntries} // Pass current experience entries
          onChange={onChange} // onChange should expect an array of experience objects
        />
      );
    }

    if (section.editorComponent === 'CertificationSelector') {
      // Ensure 'value' passed to CertificationSelector is an array of certification objects
      const selectedCertificationEntries = Array.isArray(value) ? value : [];
      return (
        <CertificationSelector 
          value={selectedCertificationEntries} // Pass current certification entries
          onChange={onChange} // onChange should expect an array of certification objects
        />
      );
    }

    if (section.editorComponent === 'ProjectSelector') {
      // Ensure 'value' passed to ProjectSelector is an array of project objects
      const selectedProjectEntries = Array.isArray(value) ? value : [];
      return (
        <ProjectSelector 
          value={selectedProjectEntries} // Pass current project entries
          onChange={onChange} // onChange should expect an array of project objects
        />
      );
    }

    if (section.editorComponent === 'ClientTestimonialSelector') {
      // Ensure 'value' passed to ClientTestimonialSelector is an array of testimonial objects
      const selectedTestimonialEntries = Array.isArray(value) ? value : [];
      
      // Get userId with fallback mechanism
      const userId = user?.id;
      
      console.log('🔍 EDIT-MODAL: ClientTestimonialSelector props', {
        user,
        userId,
        value: selectedTestimonialEntries,
        hasOnChange: !!onChange,
        sectionTitle: section?.title
      });
      
      if (!userId) {
        console.error('❌ EDIT-MODAL: No userId available for ClientTestimonialSelector');
        return (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <p>Error: User not authenticated. Please refresh the page and try again.</p>
          </div>
        );
      }
      
      return (
        <ClientTestimonialSelector 
          value={selectedTestimonialEntries} // Pass current testimonial entries
          onChange={onChange} // onChange should expect an array of testimonial objects
          userId={userId} // Pass user ID for Supabase integration
        />
      );
    }

    if (section.editorComponent === 'SkillsSelector') {
      console.log('🎯 SKILLS-SELECTOR: Rendering SkillsSelector component');
      // Ensure 'value' passed to SkillsSelector is an array of skill objects
      const selectedSkillEntries = Array.isArray(value) ? value : [];
      return (
        <SkillsSelector 
          value={selectedSkillEntries} // Pass current skill entries
          onChange={onChange} // onChange should expect an array of skill objects
        />
      );
    }

    // Default rendering based on inputType
    console.log('⚠️ EDIT-MODAL: No custom editor component found, using default input');
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
          <button 
            onClick={onClose} 
            style={{ 
              padding: '8px 16px',
              backgroundColor: 'transparent',
              borderColor: '#e2e8f0',
              color: '#64748b',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #e2e8f0'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#00C48C', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}; 