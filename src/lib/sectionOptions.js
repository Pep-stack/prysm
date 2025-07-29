// Simplified icon imports - only import what we actually use
import {
  LuGithub, LuLinkedin, LuTwitter,
  LuLanguages, LuYoutube, LuUser, LuMail, LuPhone,
  LuStar, LuShare2, LuPlay, LuWrench, LuPackage,
  LuBriefcase, LuBookOpen, LuAward, LuMusic, LuCode,
  LuFolderOpen, LuBuilding2, LuCalendar, LuMapPin,
  LuClock, LuDollarSign, LuUsers, LuHeart, LuThumbsUp,
  LuImage, LuVideo, LuFileText, LuCircleHelp
} from "react-icons/lu";
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaYoutube, FaRedditAlien, FaSnapchat, FaFacebook, FaDribbble, FaBehance, FaWhatsapp, FaEnvelope, FaPhone, FaTiktok } from 'react-icons/fa6';

// Card types - simplified to only PRO
export const CARD_TYPES = {
  PRO: 'pro'
};

// Reorganized categories - more logical grouping
const CATEGORIES = {
  ESSENTIALS: 'Essentials',
  CAREER: 'Career',
  CONTENT: 'Content',
  BUSINESS: 'Business',
  SOCIAL: 'Social & Links'
};

// Updated category icons
export const CATEGORY_ICONS = {
  [CATEGORIES.ESSENTIALS]: LuStar,
  [CATEGORIES.CAREER]: LuBriefcase,
  [CATEGORIES.CONTENT]: LuPlay,
  [CATEGORIES.BUSINESS]: LuBuilding2,
  [CATEGORIES.SOCIAL]: LuShare2,
  'Other': LuPackage,
};

// Reorganized section options with better categorization
export const ALL_SECTION_OPTIONS = [
  // ESSENTIALS - Core professional information
  { type: 'projects', name: 'Portfolio', icon: LuFolderOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'ProjectSelector' },
  { type: 'services', name: 'Services Offered', icon: LuWrench, category: CATEGORIES.ESSENTIALS, editorComponent: 'ServicesSelector' },
  { type: 'testimonials', name: 'Client Testimonials', icon: LuHeart, category: CATEGORIES.ESSENTIALS, editorComponent: 'ClientTestimonialSelector' },
  { type: 'skills', name: 'Skills & Technologies', icon: LuCode, category: CATEGORIES.ESSENTIALS, editorComponent: 'SkillsSelector' },
  { type: 'contact', name: 'Contact Information', icon: LuMail, category: CATEGORIES.ESSENTIALS },

  // CAREER - Professional background and credentials
  { type: 'experience', name: 'Work Experience', icon: LuBriefcase, category: CATEGORIES.CAREER, editorComponent: 'ExperienceSelector' },
  { type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.CAREER, editorComponent: 'EducationSelector' },
  { type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.CAREER, editorComponent: 'CertificationSelector' },
  { type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.CAREER, editorComponent: 'LanguageSelector' },
  { type: 'resume', name: 'Resume Download', icon: LuFolderOpen, category: CATEGORIES.CAREER },

  // CONTENT - Media and creative content
  { type: 'gallery', name: 'Gallery', icon: LuImage, category: CATEGORIES.CONTENT, editorComponent: 'GallerySelector' },
  { type: 'featured_video', name: 'Featured Video', icon: LuVideo, category: CATEGORIES.CONTENT, editorComponent: 'VideoSelector' },
  { type: 'publications', name: 'Publications', icon: LuFileText, category: CATEGORIES.CONTENT, editorComponent: 'PublicationSelector' },
  { type: 'events', name: 'Events', icon: LuCalendar, category: CATEGORIES.CONTENT, editorComponent: 'EventSelector' },
  { type: 'x_highlights', name: 'X Highlights', icon: FaXTwitter, category: CATEGORIES.CONTENT, editorComponent: 'XHighlightsEditor' },
  { type: 'youtube_highlights', name: 'YouTube Highlights', icon: FaYoutube, category: CATEGORIES.CONTENT, editorComponent: 'YouTubeHighlightsEditor' },
  { type: 'linkedin_highlights', name: 'LinkedIn Highlights', icon: FaLinkedin, category: CATEGORIES.CONTENT, editorComponent: 'LinkedInHighlightsEditor' },
  { type: 'tiktok_highlights', name: 'TikTok Highlights', icon: FaTiktok, category: CATEGORIES.CONTENT, editorComponent: 'TikHubHighlightsEditor' },
  { type: 'instagram_profile', name: 'Instagram Profile', icon: FaInstagram, category: CATEGORIES.CONTENT, editorComponent: 'InstagramProfileEditor' },
  { type: 'linkedin_profile', name: 'LinkedIn Profile', icon: FaLinkedin, category: CATEGORIES.CONTENT, editorComponent: 'LinkedInProfileEditor' },
  { type: 'x_profile', name: 'X Profile', icon: FaXTwitter, category: CATEGORIES.CONTENT, editorComponent: 'XProfileEditor' },
  { type: 'snapchat_profile', name: 'Snapchat Profile', icon: FaSnapchat, category: CATEGORIES.CONTENT, editorComponent: 'SnapchatProfileEditor' },
  { type: 'tiktok_profile', name: 'TikTok Profile', icon: FaTiktok, category: CATEGORIES.CONTENT, editorComponent: 'TikTokProfileEditor' },
  { type: 'behance_profile', name: 'Behance Profile', icon: FaBehance, category: CATEGORIES.CONTENT, editorComponent: 'BehanceProfileEditor' },
  { type: 'dribbble_profile', name: 'Dribbble Profile', icon: FaDribbble, category: CATEGORIES.CONTENT, editorComponent: 'DribbbleProfileEditor' },
  { type: 'github_highlights', name: 'GitHub Highlights', icon: FaGithub, category: CATEGORIES.CONTENT, editorComponent: 'GitHubHighlightsEditor' },

  // BUSINESS - Professional services and engagement
  { type: 'appointments', name: 'Schedule a Call', icon: LuCalendar, category: CATEGORIES.BUSINESS, editorComponent: 'AppointmentSelector' },
  { type: 'community', name: 'Join the Community', icon: LuUsers, category: CATEGORIES.BUSINESS, editorComponent: 'CommunitySelector' },
  { type: 'faq', name: 'FAQ', icon: LuCircleHelp, category: CATEGORIES.BUSINESS, editorComponent: 'FAQSelector' },
  
  // SOCIAL & LINKS - Social media and contact links (moved to bottom)
  { type: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, category: CATEGORIES.SOCIAL },
  { type: 'github', name: 'GitHub', icon: FaGithub, category: CATEGORIES.SOCIAL },
  { type: 'x', name: 'X (Twitter)', icon: FaXTwitter, category: CATEGORIES.SOCIAL },
  { type: 'instagram', name: 'Instagram', icon: FaInstagram, category: CATEGORIES.SOCIAL },
  { type: 'youtube', name: 'YouTube', icon: FaYoutube, category: CATEGORIES.SOCIAL },
  { type: 'email', name: 'Email', icon: FaEnvelope, category: CATEGORIES.SOCIAL },
  { type: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, category: CATEGORIES.SOCIAL },
  { type: 'facebook', name: 'Facebook', icon: FaFacebook, category: CATEGORIES.SOCIAL },
  { type: 'tiktok', name: 'TikTok', icon: FaTiktok, category: CATEGORIES.SOCIAL },
  { type: 'dribbble', name: 'Dribbble', icon: FaDribbble, category: CATEGORIES.SOCIAL },

  { type: 'snapchat', name: 'Snapchat', icon: FaSnapchat, category: CATEGORIES.SOCIAL },
  { type: 'reddit', name: 'Reddit', icon: FaRedditAlien, category: CATEGORIES.SOCIAL },
  { type: 'phone', name: 'Phone', icon: FaPhone, category: CATEGORIES.SOCIAL },
];

// Simplified card type structure - only PRO remains
export const SECTION_OPTIONS_BY_CARD_TYPE = {
  [CARD_TYPES.PRO]: ALL_SECTION_OPTIONS
};

// Legacy support - now points to consolidated options
export const SECTION_OPTIONS = ALL_SECTION_OPTIONS;

// Get section options - simplified since only PRO exists
export const getSectionOptionsByCardType = (cardType = CARD_TYPES.PRO) => {
  return ALL_SECTION_OPTIONS;
};

// Simplified grouping function with card type support
export const getGroupedSectionOptions = (existingSectionTypes = [], cardType = CARD_TYPES.PRO) => {
  const sectionOptions = getSectionOptionsByCardType(cardType);
  const availableOptions = sectionOptions.filter(option => 
    !existingSectionTypes.includes(option.type)
  );

  const grouped = availableOptions.reduce((acc, option) => {
    const category = option.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {});

  // Category order for all available sections - Social & Links at the bottom
  const categoryOrder = [
    CATEGORIES.ESSENTIALS, 
    CATEGORIES.CAREER, 
    CATEGORIES.CONTENT, 
    CATEGORIES.BUSINESS, 
    CATEGORIES.SOCIAL, 
    'Other'
  ];

  const sortedGrouped = {};
  categoryOrder.forEach(cat => {
    if (grouped[cat]) {
      sortedGrouped[cat] = grouped[cat];
    }
  });

  return sortedGrouped;
};

// Simplified default props with card type support
export const getDefaultSectionProps = (type, cardType = CARD_TYPES.PRO) => {
  const sectionOptions = getSectionOptionsByCardType(cardType);
  const option = sectionOptions.find(opt => opt.type === type);
  const defaultTitle = option ? option.name : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  const defaults = {
    // Pro defaults
    projects: { title: defaultTitle, value: [], editorComponent: 'ProjectSelector' },
    services: { title: defaultTitle, value: [], editorComponent: 'ServicesSelector' },
    testimonials: { title: defaultTitle, value: [], editorComponent: 'ClientTestimonialSelector' },
    skills: { title: defaultTitle, value: [], editorComponent: 'SkillsSelector' },
    
    // Career defaults
    experience: { title: defaultTitle, value: [], editorComponent: 'ExperienceSelector' },
    education: { title: defaultTitle, value: [], editorComponent: 'EducationSelector' },
    certifications: { title: defaultTitle, value: [], editorComponent: 'CertificationSelector' },
    languages: { title: defaultTitle, value: [], editorComponent: 'LanguageSelector' },
    resume: { title: defaultTitle, value: '' },
    contact: { title: defaultTitle, value: '' },
    
    // NEW SECTION DEFAULTS
    gallery: { title: defaultTitle, value: [], editorComponent: 'GallerySelector' },
    featured_video: { title: defaultTitle, value: '', editorComponent: 'VideoSelector' },
    appointments: { title: defaultTitle, value: '', editorComponent: 'AppointmentSelector' },
    publications: { title: defaultTitle, value: [], editorComponent: 'PublicationSelector' },
    community: { title: defaultTitle, value: '', editorComponent: 'CommunitySelector' },
    events: { title: defaultTitle, value: [], editorComponent: 'EventSelector' },
    faq: { title: defaultTitle, value: [], editorComponent: 'FAQSelector' },
    x_highlights: { title: defaultTitle, value: [], editorComponent: 'XHighlightsEditor' },
    youtube_highlights: { title: defaultTitle, value: [], editorComponent: 'YouTubeHighlightsEditor' },
    linkedin_highlights: { title: defaultTitle, value: [], editorComponent: 'LinkedInHighlightsEditor' },
    tiktok_highlights: { title: defaultTitle, value: [], editorComponent: 'TikTokHighlightsEditor' },
    github_highlights: { title: defaultTitle, value: [], editorComponent: 'GitHubHighlightsEditor' },
    
    // Social media defaults (shared across all types)
    linkedin: { title: defaultTitle, value: '' },
    github_gitlab: { title: defaultTitle, value: '' },
    x_profile: { title: defaultTitle, value: '' },
    instagram: { title: defaultTitle, value: '' },
    youtube_channel: { title: defaultTitle, value: '' },
    tiktok: { title: defaultTitle, value: '' },
    facebook: { title: defaultTitle, value: '' },
    email: { title: defaultTitle, value: '' },
    whatsapp: { title: defaultTitle, value: '' },
  };

  return defaults[type] || { title: defaultTitle, value: '' };
}; 

export function getSectionsKey(cardType = 'pro') {
  // Always return card_sections since we only support pro card type now
  return 'card_sections';
} 