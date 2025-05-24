'use client';

import React, { useEffect } from 'react';
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
// import SortableSection from './SortableSection';

// Import alle sectie content componenten
import BioSectionContent from './cardSections/BioSectionContent';
import SkillsSectionContent from './cardSections/SkillsSectionContent';
import ContactSectionContent from './cardSections/ContactSectionContent';
import LocationSectionContent from './cardSections/LocationSectionContent';
import WebsiteSectionContent from './cardSections/WebsiteSectionContent';
import LinkedInSectionContent from './cardSections/LinkedInSectionContent';
import XSectionContent from './cardSections/XSectionContent';
import InstagramSectionContent from './cardSections/InstagramSectionContent';
import ExperienceSectionContent from './cardSections/ExperienceSectionContent';
import EducationSectionContent from './cardSections/EducationSectionContent';
import CertificationsSectionContent from './cardSections/CertificationsSectionContent';
import ProjectsSectionContent from './cardSections/ProjectsSectionContent';
import PublicationsSectionContent from './cardSections/PublicationsSectionContent';
import EventsSectionContent from './cardSections/EventsSectionContent';
import AwardsSectionContent from './cardSections/AwardsSectionContent';
import LanguagesSectionContent from './cardSections/LanguagesSectionContent';
import TestimonialsSectionContent from './cardSections/TestimonialsSectionContent';
import ServicesSectionContent from './cardSections/ServicesSectionContent';
import CalendarSchedulingSectionContent from './cardSections/CalendarSchedulingSectionContent';
import ContactButtonsSectionContent from './cardSections/ContactButtonsSectionContent';
import ContactFormSectionContent from './cardSections/ContactFormSectionContent';
import NewsletterSignupSectionContent from './cardSections/NewsletterSignupSectionContent';
import GithubGitlabSectionContent from './cardSections/GithubGitlabSectionContent';
import DribbbleBehanceSectionContent from './cardSections/DribbbleBehanceSectionContent';
import YoutubeChannelSectionContent from './cardSections/YoutubeChannelSectionContent';
import TiktokSectionContent from './cardSections/TiktokSectionContent';
import FacebookSectionContent from './cardSections/FacebookSectionContent';
import StackoverflowSectionContent from './cardSections/StackoverflowSectionContent';
import GoogleMapsSectionContent from './cardSections/GoogleMapsSectionContent';
import TimezoneHoursSectionContent from './cardSections/TimezoneHoursSectionContent';
import DownloadCvSectionContent from './cardSections/DownloadCvSectionContent';
import StatisticsProofSectionContent from './cardSections/StatisticsProofSectionContent';
import BlogArticlesSectionContent from './cardSections/BlogArticlesSectionContent';
import VideoBannerSectionContent from './cardSections/VideoBannerSectionContent';
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';
// Voeg hier AL je sectie types toe

// Mapping van sectie type/id naar component (efficiënter dan switch)
export const sectionComponentMap = {
  'bio': BioSectionContent,
  'skills': SkillsSectionContent,
  'contact': ContactSectionContent,
  'location': LocationSectionContent,
  'website': WebsiteSectionContent,
  'linkedin': LinkedInSectionContent,
  'x_profile': XSectionContent,
  'instagram': InstagramSectionContent,
  'experience': ExperienceSectionContent,
  'education': EducationSectionContent,
  'certifications': CertificationsSectionContent,
  'projects': ProjectsSectionContent,
  'publications': PublicationsSectionContent,
  'events': EventsSectionContent,
  'awards': AwardsSectionContent,
  'languages': LanguagesSectionContent,
  'testimonials': TestimonialsSectionContent,
  'services': ServicesSectionContent,
  'calendar_scheduling': CalendarSchedulingSectionContent,
  'contact_buttons': ContactButtonsSectionContent,
  'contact_form': ContactFormSectionContent,
  'newsletter_signup': NewsletterSignupSectionContent,
  'github_gitlab': GithubGitlabSectionContent,
  'dribbble_behance': DribbbleBehanceSectionContent,
  'youtube_channel': YoutubeChannelSectionContent,
  'tiktok': TiktokSectionContent,
  'facebook': FacebookSectionContent,
  'stackoverflow': StackoverflowSectionContent,
  'google_maps': GoogleMapsSectionContent,
  'timezone_hours': TimezoneHoursSectionContent,
  'download_cv': DownloadCvSectionContent,
  'statistics_proof': StatisticsProofSectionContent,
  'blog_articles': BlogArticlesSectionContent,
  'video_banner': VideoBannerSectionContent,
  // Voeg hier AL je sectie types toe
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

  const sectionProps = { 
    profile, 
    user, 
    styles: { sectionStyle, sectionTitleStyle, placeholderStyle, tagStyle }, 
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