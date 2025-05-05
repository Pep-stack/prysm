'use client';

import React from 'react';
// VERWIJDER: import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// VERWIJDER: import SortableCardSection from './SortableCardSection';

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
// Voeg hier AL je sectie types toe

// Mapping van sectie type/id naar component (efficiënter dan switch)
const sectionComponentMap = {
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
  cardSections = [],
  profile,
  user,
  // VERWIJDER: isPublicView = false, // Altijd publiek nu
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
  tagStyle
}) {

  const renderSingleSection = (section) => {
    const SectionContentComponent = sectionComponentMap[section.id] || sectionComponentMap[section.type];
    if (!SectionContentComponent) return null;

    const sectionProps = { profile, user, styles: { sectionStyle, sectionTitleStyle, placeholderStyle, tagStyle } };

    // Logica voor editing props (bv. Languages) - Blijft, maar wordt alleen getoond als state actief is
    // const editingProps = section.id === 'languages' ? { ... } : {};
    // const finalContentComponent = React.cloneElement(<SectionContentComponent {...sectionProps} />, editingProps);

    // Voor een pure preview, geen editing props nodig:
    const finalContentComponent = <SectionContentComponent {...sectionProps} />;

    // Render altijd de statische div
    return (
      <div key={section.id} className="w-full"> {/* Basis layout, geen flex nodig hier misschien? */}
        {finalContentComponent}
      </div>
    );
  };

  return (
    <div className={containerClassName} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}> {/* Aangepast naar flex-col */}
      {/* VERWIJDER: Conditionele check en SortableContext */}
      {cardSections.map(renderSingleSection)}
    </div>
  );
} 