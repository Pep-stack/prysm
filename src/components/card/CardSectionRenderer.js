'use client';

import React, { useEffect } from 'react';
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
// import SortableSection from './SortableSection';

// Import consolidated section content components
import SocialMediaSectionContent from './cardSections/SocialMediaSectionContent';
import ExperienceSectionContent from './cardSections/ExperienceSectionContent';
import EducationSectionContent from './cardSections/EducationSectionContent';
import CertificationsSectionContent from './cardSections/CertificationsSectionContent';
import ProjectsSectionContent from './cardSections/ProjectsSectionContent';
import LanguagesSectionContent from './cardSections/LanguagesSectionContent';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
// Voeg hier AL je sectie types toe

// Mapping van sectie type/id naar component (efficiënter dan switch)
export const sectionComponentMap = {
  // Social media types use consolidated component
  'linkedin': SocialMediaSectionContent,
  'x_profile': SocialMediaSectionContent,
  'instagram': SocialMediaSectionContent,
  'email': SocialMediaSectionContent,
  'whatsapp': SocialMediaSectionContent,
  'github_gitlab': SocialMediaSectionContent,
  'youtube_channel': SocialMediaSectionContent,
  'tiktok': SocialMediaSectionContent,
  'facebook': SocialMediaSectionContent,
  // Other sections
  'experience': ExperienceSectionContent,
  'education': EducationSectionContent,
  'certifications': CertificationsSectionContent,
  'projects': ProjectsSectionContent,
  'languages': LanguagesSectionContent,
};

// Component rendert nu altijd de publieke/statische view
export default function CardSectionRenderer({
  section, // Changed from cardSections array to single section
  profile,
  user,
  isPublicView = false,
  // VERWIJDER: onRemoveSection,
  // VERWIJDER: onEditSection,
  // Behoud props voor specifieke secties indien nodig
  // editingLanguageSectionId,
  // onSaveLanguages,
  // setEditingLanguageSectionId,
  // Styles
  containerClassName = '', // Behoud voor styling
  sectionStyle,
  sectionTitleStyle,
  placeholderStyle,
  tagStyle,
  onSaveLanguages,
  onReorder
}) {
  const { settings } = useDesignSettings();

  if (!section) return null;
  
  const Component = sectionComponentMap[section.type];
  if (!Component) return null;

  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  // Create default styles with text color applied
  const defaultSectionStyle = {
    color: textColor,
    fontFamily: settings.font_family || 'Inter, sans-serif',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    marginBottom: '16px',
    ...sectionStyle
  };

  const defaultSectionTitleStyle = {
    color: textColor,
    fontSize: (section.type === 'languages' || section.type === 'education' || section.type === 'experience' || section.type === 'certifications' || section.type === 'projects') ? '22px' : '18px',
    fontWeight: '600',
    marginBottom: (section.type === 'languages' || section.type === 'education' || section.type === 'experience' || section.type === 'certifications' || section.type === 'projects') ? '16px' : '8px',
    ...sectionTitleStyle
  };

  const defaultPlaceholderStyle = {
    color: textColor,
    opacity: 0.6,
    fontStyle: 'italic',
    ...placeholderStyle
  };

  const sectionProps = { 
    section, // Add the section prop
    profile, 
    user, 
    isPublicView, // Add isPublicView prop
    styles: { 
      sectionStyle: defaultSectionStyle, 
      sectionTitleStyle: defaultSectionTitleStyle, 
      placeholderStyle: defaultPlaceholderStyle, 
      tagStyle 
    }, 
    designSettings: settings 
  };



  // Voor een pure preview, geen editing props nodig:
  const finalContentComponent = <Component {...sectionProps} />;

  // Render altijd de statische div
  return (
    <div className="w-full">
      {finalContentComponent}
    </div>
  );
} 