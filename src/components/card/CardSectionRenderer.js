'use client';

import React, { useEffect, lazy, Suspense } from 'react';
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
import ClientTestimonialsSectionContent from './cardSections/ClientTestimonialsSectionContent';
import SkillsSectionContent from './cardSections/SkillsSectionContent';
import GallerySectionContent from './cardSections/GallerySectionContent';
import FeaturedVideoSectionContent from './cardSections/FeaturedVideoSectionContent';
import XHighlightsSectionContent from './cardSections/XHighlightsSectionContent';
import YouTubeHighlightsSectionContent from './cardSections/YouTubeHighlightsSectionContent';
import LinkedInHighlightsSectionContent from './cardSections/LinkedInHighlightsSectionContent';
import TikTokHighlightsSectionContent from './cardSections/TikTokHighlightsSectionContent';
import InstagramProfileSectionContent from './cardSections/InstagramHighlightsSectionContent';
import LinkedInProfileSectionContent from './cardSections/LinkedInProfileSectionContent';
import XProfileSectionContent from './cardSections/XProfileSectionContent';
import SnapchatProfileSectionContent from './cardSections/SnapchatProfileSectionContent';
import TikTokProfileSectionContent from './cardSections/TikTokProfileSectionContent';
import BehanceProfileSectionContent from './cardSections/BehanceProfileSectionContent';
import DribbbleProfileSectionContent from './cardSections/DribbbleProfileSectionContent';
import GitHubHighlightsSectionContent from './cardSections/GitHubHighlightsSectionContent';
import AppointmentsSectionContent from './cardSections/AppointmentsSectionContent';
import SubscribeSectionContent from './cardSections/SubscribeSectionContent';
import PublicationSectionContent from './cardSections/PublicationSectionContent';
import FAQSectionContent from './cardSections/FAQSectionContent';


// Lazy import for ServicesSectionContent to avoid circular dependency
const ServicesSectionContent = lazy(() => import('./cardSections/ServicesSectionContent'));

import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import { useContactTracking } from '../../hooks/useContactTracking';

// Voeg hier AL je sectie types toe

// Mapping van sectie type/id naar component (efficiënter dan switch)
const proSectionComponentMap = {
  'linkedin': SocialMediaSectionContent,
  'x': SocialMediaSectionContent,
  'instagram': SocialMediaSectionContent,
  'whatsapp': SocialMediaSectionContent,
  'github': SocialMediaSectionContent,
  'youtube': SocialMediaSectionContent,
  'tiktok': SocialMediaSectionContent,
  'facebook': SocialMediaSectionContent,
  'dribbble': SocialMediaSectionContent,
  'behance': SocialMediaSectionContent,
  'snapchat': SocialMediaSectionContent,
  'reddit': SocialMediaSectionContent,
  // Other sections
  'experience': ExperienceSectionContent,
  'education': EducationSectionContent,
  'certifications': CertificationsSectionContent,
  'projects': ProjectsSectionContent,
  'languages': LanguagesSectionContent,
  'testimonials': ClientTestimonialsSectionContent,
  'skills': SkillsSectionContent,
  'services': ServicesSectionContent,
  // New sections
  'gallery': GallerySectionContent,
  'featured_video': FeaturedVideoSectionContent,
  'publications': PublicationSectionContent,
  'x_highlights': XHighlightsSectionContent,
  'youtube_highlights': YouTubeHighlightsSectionContent,
  'linkedin_highlights': LinkedInHighlightsSectionContent,
  'tiktok_highlights': TikTokHighlightsSectionContent,
  'instagram_profile': InstagramProfileSectionContent,
  'linkedin_profile': LinkedInProfileSectionContent,
  'x_profile': XProfileSectionContent,
  'snapchat_profile': SnapchatProfileSectionContent,
  'tiktok_profile': TikTokProfileSectionContent,
  'behance_profile': BehanceProfileSectionContent,
  'dribbble_profile': DribbbleProfileSectionContent,
  'github_highlights': GitHubHighlightsSectionContent,
  'appointments': AppointmentsSectionContent,
  'subscribe': SubscribeSectionContent,
  'faq': FAQSectionContent,
};

export const sectionComponentMap = {
  'linkedin': SocialMediaSectionContent,
  'x': SocialMediaSectionContent,
  'instagram': SocialMediaSectionContent,
  'whatsapp': SocialMediaSectionContent,
  'github': SocialMediaSectionContent,
  'youtube': SocialMediaSectionContent,
  'tiktok': SocialMediaSectionContent,
  'facebook': SocialMediaSectionContent,
  'dribbble': SocialMediaSectionContent,
  'behance': SocialMediaSectionContent,
  'snapchat': SocialMediaSectionContent,
  'reddit': SocialMediaSectionContent,
  'phone': SocialMediaSectionContent,
  // Other sections
  'experience': ExperienceSectionContent,
  'education': EducationSectionContent,
  'certifications': CertificationsSectionContent,
  'projects': ProjectsSectionContent,
  'languages': LanguagesSectionContent,
  'testimonials': ClientTestimonialsSectionContent,
  'skills': SkillsSectionContent,
  'services': ServicesSectionContent,
  // New sections
  'gallery': GallerySectionContent,
  'publications': PublicationSectionContent,
  'x_highlights': XHighlightsSectionContent,
  'youtube_highlights': YouTubeHighlightsSectionContent,
  'linkedin_highlights': LinkedInHighlightsSectionContent,
  'tiktok_highlights': TikTokHighlightsSectionContent,
  'instagram_profile': InstagramProfileSectionContent,
  'linkedin_profile': LinkedInProfileSectionContent,
  'x_profile': XProfileSectionContent,
  'snapchat_profile': SnapchatProfileSectionContent,
  'tiktok_profile': TikTokProfileSectionContent,
  'behance_profile': BehanceProfileSectionContent,
  'dribbble_profile': DribbbleProfileSectionContent,
  'github_highlights': GitHubHighlightsSectionContent,
  'appointments': AppointmentsSectionContent,
  'subscribe': SubscribeSectionContent,
  'faq': FAQSectionContent,
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
  const { trackSocialClick } = useContactTracking(profile?.id);

  if (!section) return null;
  
  // Kies mapping op basis van card_type
  const cardType = profile?.card_type || 'pro';
  const mapToUse = cardType === 'pro' ? proSectionComponentMap : sectionComponentMap;
  
  // Add error handling for component mapping
  const Component = mapToUse[section.type];
  console.log('🔍 CARD-RENDERER: Rendering section:', {
    sectionType: section.type,
    hasComponent: !!Component,
    availableTypes: Object.keys(mapToUse),
    cardType: cardType
  });
  if (!Component) {
    console.warn(`No component found for section type: ${section.type}`);
    return null;
  }





  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  // Create default styles with text color applied
  const defaultSectionStyle = {
    color: textColor,
    fontFamily: settings.font_family || 'Inter, sans-serif',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    marginBottom: '16px',
    ...sectionStyle
  };

  const defaultSectionTitleStyle = {
    color: textColor,
    fontSize: (section.type === 'languages' || section.type === 'education' || section.type === 'experience' || section.type === 'certifications' || section.type === 'projects' || section.type === 'services') ? '22px' : '18px',
    fontWeight: '600',
    marginBottom: (section.type === 'languages' || section.type === 'education' || section.type === 'experience' || section.type === 'certifications' || section.type === 'projects' || section.type === 'services') ? '16px' : '8px',
    ...sectionTitleStyle
  };

  const defaultPlaceholderStyle = {
    color: textColor,
    opacity: 0.6,
    fontStyle: 'italic',
    ...placeholderStyle
  };

  // Determine platform based on section type
  const getPlatform = (sectionType) => {
    switch (sectionType) {
      case 'whatsapp': return 'whatsapp';
      case 'linkedin': return 'linkedin';
      case 'instagram': return 'instagram';
      case 'github': return 'github';
      case 'youtube': return 'youtube';
      case 'tiktok': return 'tiktok';
      case 'facebook': return 'facebook';
      case 'dribbble': return 'dribbble';
      case 'behance': return 'behance';
      case 'snapchat': return 'snapchat';
      case 'reddit': return 'reddit';
      case 'x': return 'x';
      default: return null;
    }
  };

  const platform = getPlatform(section.type);

  const handleSocialClick = () => {
    if (platform && trackSocialClick) {
      trackSocialClick(platform, 'main_section');
    }
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
    designSettings: settings,
    onSocialClick: handleSocialClick // Add social tracking callback
  };

  // Voor een pure preview, geen editing props nodig:
  const finalContentComponent = (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...sectionProps} />
    </Suspense>
  );

  // Render altijd de statische div
  return (
    <div className="w-full">
      {finalContentComponent}
    </div>
  );
} 