// Simplified icon imports - only import what we actually use
import {
  LuGithub, LuLinkedin, LuTwitter,
  LuLanguages, LuYoutube, LuUser, LuMail,
  LuShare2, LuPlay, LuWrench, LuPackage,
  LuBriefcase, LuBookOpen, LuAward, LuMusic, LuCode,
  LuFolderOpen, LuBuilding2, LuCalendar, LuMapPin,
  LuClock, LuDollarSign, LuUsers, LuHeart, LuThumbsUp,
  LuImage, LuVideo, LuFileText, LuCircleHelp, LuLink, LuGlobe
} from "react-icons/lu";
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaYoutube, FaVimeo, FaRedditAlien, FaSnapchat, FaFacebook, FaDribbble, FaBehance, FaWhatsapp, FaTiktok, FaSpotify } from 'react-icons/fa6';

// Card types - simplified to only PRO
export const CARD_TYPES = {
  PRO: 'pro'
};

// Reorganized categories - better logical grouping with 5 categories (removed Essentials)
const CATEGORIES = {
  CAREER: 'Career',
  CONTENT: 'Content',
  SOCIAL_HIGHLIGHTS: 'Social Highlights',
  SOCIAL_PROFILES: 'Social Profiles',
  BUSINESS: 'Business',
  SOCIAL_BUTTONS: 'Social Buttons'
};

// Updated category icons
export const CATEGORY_ICONS = {
  [CATEGORIES.CAREER]: LuBriefcase,
  [CATEGORIES.CONTENT]: LuPlay,
  [CATEGORIES.SOCIAL_HIGHLIGHTS]: LuThumbsUp,
  [CATEGORIES.SOCIAL_PROFILES]: LuUser,
  [CATEGORIES.BUSINESS]: LuBuilding2,
  [CATEGORIES.SOCIAL_BUTTONS]: LuLink,
  'Other': LuPackage,
};

// Reorganized section options with better categorization
export const ALL_SECTION_OPTIONS = [
  // CAREER - Professional background, credentials and skills
  { type: 'experience', name: 'Work Experience', icon: LuBriefcase, category: CATEGORIES.CAREER, editorComponent: 'ExperienceSelector' },
  { type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.CAREER, editorComponent: 'EducationSelector' },
  { type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.CAREER, editorComponent: 'CertificationSelector' },
  { type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.CAREER, editorComponent: 'LanguageSelector' },
  { type: 'skills', name: 'Skills & Technologies', icon: LuCode, category: CATEGORIES.CAREER, editorComponent: 'SkillsSelector' },

  // CONTENT - Media, creative content and portfolio
  { type: 'gallery', name: 'Gallery', icon: LuImage, category: CATEGORIES.CONTENT, editorComponent: 'GallerySelector' },
  { type: 'featured_video', name: 'Featured Video', icon: LuVideo, category: CATEGORIES.CONTENT, editorComponent: 'VideoSelector' },
  { type: 'publications', name: 'Publications', icon: LuFileText, category: CATEGORIES.CONTENT, editorComponent: 'PublicationSelector' },
  { type: 'projects', name: 'Portfolio', icon: LuFolderOpen, category: CATEGORIES.CONTENT, editorComponent: 'ProjectSelector' },

  // BUSINESS - Professional services, testimonials and engagement
  { type: 'services', name: 'Services Offered', icon: LuWrench, category: CATEGORIES.BUSINESS, editorComponent: 'ServicesSelector' },
  { type: 'testimonials', name: 'Client Testimonials', icon: LuHeart, category: CATEGORIES.BUSINESS, editorComponent: 'ClientTestimonialSelector' },
  { type: 'appointments', name: 'Book an Appointment', icon: LuCalendar, category: CATEGORIES.BUSINESS, editorComponent: 'AppointmentsEditor' },
  { type: 'subscribe', name: 'Subscribe', icon: LuMail, category: CATEGORIES.BUSINESS, editorComponent: 'SubscribeSelector' },
  { type: 'faq', name: 'FAQ', icon: LuCircleHelp, category: CATEGORIES.BUSINESS, editorComponent: 'FAQSelector' },
  { type: 'website_preview', name: 'Website Preview', icon: LuGlobe, category: CATEGORIES.BUSINESS, editorComponent: 'WebsitePreviewEditor' },
  
  // SOCIAL HIGHLIGHTS - Social media content highlights
  { type: 'x_highlights', name: 'X Highlights', icon: FaXTwitter, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'XHighlightsEditor' },
  { type: 'youtube_highlights', name: 'YouTube Highlights', icon: FaYoutube, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'YouTubeHighlightsEditor' },
  { type: 'vimeo_highlights', name: 'Vimeo Highlights', icon: FaVimeo, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'VimeoHighlightsEditor' },
  { type: 'spotify_highlights', name: 'Spotify Highlights', icon: FaSpotify, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'SpotifyHighlightsEditor' },
  { type: 'linkedin_highlights', name: 'LinkedIn Highlights', icon: FaLinkedin, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'LinkedInHighlightsEditor' },
  { type: 'tiktok_highlights', name: 'TikTok Highlights', icon: FaTiktok, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'TikTokHighlightsEditor' },
  { type: 'github_highlights', name: 'GitHub Highlights', icon: FaGithub, category: CATEGORIES.SOCIAL_HIGHLIGHTS, editorComponent: 'GitHubHighlightsEditor' },

  // SOCIAL PROFILES - Embedded social media profiles
  { type: 'instagram_profile', name: 'Instagram Profile', icon: FaInstagram, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'InstagramProfileEditor' },
  { type: 'linkedin_profile', name: 'LinkedIn Profile', icon: FaLinkedin, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'LinkedInProfileEditor' },
  { type: 'x_profile', name: 'X Profile', icon: FaXTwitter, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'XProfileEditor' },
  { type: 'spotify_profile', name: 'Spotify Profile', icon: FaSpotify, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'SpotifyProfileEditor' },
  { type: 'snapchat_profile', name: 'Snapchat Profile', icon: FaSnapchat, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'SnapchatProfileEditor' },
  { type: 'tiktok_profile', name: 'TikTok Profile', icon: FaTiktok, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'TikTokProfileEditor' },
  { type: 'behance_profile', name: 'Behance Profile', icon: FaBehance, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'BehanceProfileEditor' },
  { type: 'dribbble_profile', name: 'Dribbble Profile', icon: FaDribbble, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'DribbbleProfileEditor' },
  { type: 'custom_profile', name: 'Custom Profile', icon: LuUser, category: CATEGORIES.SOCIAL_PROFILES, editorComponent: 'CustomProfileEditor' },

  // SOCIAL MEDIA BUTTONS - Simple social media links for social bar
  { type: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'github', name: 'GitHub', icon: FaGithub, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'x', name: 'X (Twitter)', icon: FaXTwitter, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'instagram', name: 'Instagram', icon: FaInstagram, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'youtube', name: 'YouTube', icon: FaYoutube, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'spotify', name: 'Spotify', icon: FaSpotify, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'facebook', name: 'Facebook', icon: FaFacebook, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'tiktok', name: 'TikTok', icon: FaTiktok, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'dribbble', name: 'Dribbble', icon: FaDribbble, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'snapchat', name: 'Snapchat', icon: FaSnapchat, category: CATEGORIES.SOCIAL_BUTTONS },
  { type: 'reddit', name: 'Reddit', icon: FaRedditAlien, category: CATEGORIES.SOCIAL_BUTTONS },
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

  // Updated category order with new 5-category structure - Business before social categories
  const categoryOrder = [
    CATEGORIES.CAREER, 
    CATEGORIES.CONTENT, 
    CATEGORIES.BUSINESS, 
    CATEGORIES.SOCIAL_HIGHLIGHTS,
    CATEGORIES.SOCIAL_PROFILES,
    CATEGORIES.SOCIAL_BUTTONS,
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
    experience: { title: defaultTitle, value: [], editorComponent: 'ExperienceSelector' },
    education: { title: defaultTitle, value: [], editorComponent: 'EducationSelector' },
    certifications: { title: defaultTitle, value: [], editorComponent: 'CertificationSelector' },
    languages: { title: defaultTitle, value: [], editorComponent: 'LanguageSelector' },
    skills: { title: defaultTitle, value: [], editorComponent: 'SkillsSelector' },
    
    // Content defaults
    gallery: { title: defaultTitle, value: [], editorComponent: 'GallerySelector' },
    featured_video: { title: defaultTitle, value: '', editorComponent: 'VideoSelector' },
    publications: { title: defaultTitle, value: [], editorComponent: 'PublicationSelector' },
    projects: { title: defaultTitle, value: [], editorComponent: 'ProjectSelector' },

         // Business defaults
     services: { title: defaultTitle, value: [], editorComponent: 'ServicesSelector' },
     testimonials: { title: defaultTitle, value: [], editorComponent: 'ClientTestimonialSelector' },
     appointments: { title: defaultTitle, value: '', editorComponent: 'AppointmentsEditor' },
    subscribe: { title: defaultTitle, value: '', editorComponent: 'SubscribeSelector' },
    faq: { title: defaultTitle, value: [], editorComponent: 'FAQSelector' },
    website_preview: { title: defaultTitle, value: [], editorComponent: 'WebsitePreviewEditor' },

     // Social highlights defaults
    x_highlights: { title: defaultTitle, value: [], editorComponent: 'XHighlightsEditor' },
    youtube_highlights: { title: defaultTitle, value: [], editorComponent: 'YouTubeHighlightsEditor' },
    vimeo_highlights: { title: defaultTitle, value: [], editorComponent: 'VimeoHighlightsEditor' },
    spotify_highlights: { title: defaultTitle, value: [], editorComponent: 'SpotifyHighlightsEditor' },
    linkedin_highlights: { title: defaultTitle, value: [], editorComponent: 'LinkedInHighlightsEditor' },
    tiktok_highlights: { title: defaultTitle, value: [], editorComponent: 'TikTokHighlightsEditor' },
    github_highlights: { title: defaultTitle, value: [], editorComponent: 'GitHubHighlightsEditor' },
    
    // Social media defaults (shared across all types)
    linkedin: { title: defaultTitle, value: '' },
    github_gitlab: { title: defaultTitle, value: '' },
    x_profile: { title: defaultTitle, value: '' },
    spotify_profile: { title: defaultTitle, value: '' },
    instagram: { title: defaultTitle, value: '' },
    youtube_channel: { title: defaultTitle, value: '' },
    tiktok: { title: defaultTitle, value: '' },
    facebook: { title: defaultTitle, value: '' },
    spotify: { title: defaultTitle, value: '' },
    whatsapp: { title: defaultTitle, value: '' },
    custom_profile: { title: defaultTitle, value: [], editorComponent: 'CustomProfileEditor' },
  };

  return defaults[type] || { title: defaultTitle, value: '' };
}; 

export function getSectionsKey(cardType = 'pro') {
  // Always return card_sections since we only support pro card type now
  return 'card_sections';
} 