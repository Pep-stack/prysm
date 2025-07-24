// Simplified icon imports - only import what we actually use
import {
  LuGithub, LuLinkedin, LuTwitter,
  LuLanguages, LuYoutube, LuUser, LuMail, LuPhone,
  LuStar, LuShare2, LuPlay, LuWrench, LuPackage,
  LuBriefcase, LuBookOpen, LuAward, LuMusic, LuCode,
  LuFolderOpen, LuBuilding2, LuCalendar, LuMapPin,
  LuClock, LuDollarSign, LuUsers, LuHeart, LuThumbsUp
} from "react-icons/lu";
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaYoutube, FaSpotify, FaRedditAlien, FaSnapchat, FaFacebook, FaDribbble, FaBehance, FaWhatsapp, FaEnvelope, FaPhone, FaTiktok } from 'react-icons/fa6';

// Card types - simplified to only PRO
export const CARD_TYPES = {
  PRO: 'pro'
};

// Simplified categories
const CATEGORIES = {
  ESSENTIALS: 'Essentials',
  SOCIAL: 'Social & Links',
  CONTENT: 'Content',
  TOOLS: 'Tools',
  BUSINESS: 'Business',
  CAREER: 'Career'
};

// Simplified category icons
export const CATEGORY_ICONS = {
  [CATEGORIES.ESSENTIALS]: LuStar,
  [CATEGORIES.SOCIAL]: LuShare2,
  [CATEGORIES.CONTENT]: LuPlay,
  [CATEGORIES.TOOLS]: LuWrench,
  [CATEGORIES.BUSINESS]: LuBuilding2,
  [CATEGORIES.CAREER]: LuBriefcase,
  'Other': LuPackage,
};

// All section options - consolidated from previous card types  
export const ALL_SECTION_OPTIONS = [
  // Core Essentials (from Pro)
  { type: 'portfolio', name: 'Portfolio', icon: LuFolderOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'ProjectSelector' },
  { type: 'services', name: 'Services Offered', icon: LuWrench, category: CATEGORIES.ESSENTIALS },
  { type: 'testimonials', name: 'Client Testimonials', icon: LuHeart, category: CATEGORIES.ESSENTIALS, editorComponent: 'ClientTestimonialSelector' },
  { type: 'skills', name: 'Skills & Technologies', icon: LuCode, category: CATEGORIES.ESSENTIALS },
  { type: 'availability', name: 'Availability Status', icon: LuCalendar, category: CATEGORIES.ESSENTIALS },
  { type: 'pricing', name: 'Pricing Information', icon: LuDollarSign, category: CATEGORIES.ESSENTIALS },
  
  // Career sections (from Career)
  { type: 'experience', name: 'Work Experience', icon: LuBriefcase, category: CATEGORIES.CAREER, editorComponent: 'ExperienceSelector' },
  { type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.CAREER, editorComponent: 'EducationSelector' },
  { type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.CAREER, editorComponent: 'CertificationSelector' },
  { type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.TOOLS, editorComponent: 'LanguageSelector' },
  { type: 'resume', name: 'Resume Download', icon: LuFolderOpen, category: CATEGORIES.CAREER },
  { type: 'contact', name: 'Contact Information', icon: LuMail, category: CATEGORIES.ESSENTIALS },

  // Business sections (from Business)
  { type: 'company_info', name: 'Company Information', icon: LuBuilding2, category: CATEGORIES.BUSINESS },
  { type: 'services_products', name: 'Services/Products', icon: LuPackage, category: CATEGORIES.BUSINESS },
  { type: 'team', name: 'Team Members', icon: LuUsers, category: CATEGORIES.BUSINESS },
  { type: 'business_hours', name: 'Business Hours', icon: LuClock, category: CATEGORIES.BUSINESS },
  { type: 'location', name: 'Location/Address', icon: LuMapPin, category: CATEGORIES.BUSINESS },
  { type: 'reviews', name: 'Customer Reviews', icon: LuThumbsUp, category: CATEGORIES.BUSINESS },
  
  // Social & Links (consolidated from all types)
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
  { type: 'spotify', name: 'Spotify', icon: FaSpotify, category: CATEGORIES.SOCIAL },
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

  // Category order for all available sections
  const categoryOrder = [
    CATEGORIES.ESSENTIALS, 
    CATEGORIES.CAREER, 
    CATEGORIES.BUSINESS, 
    CATEGORIES.TOOLS,
    CATEGORIES.SOCIAL, 
    CATEGORIES.CONTENT, 
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
    portfolio: { title: defaultTitle, value: [], editorComponent: 'ProjectSelector' },
    services: { title: defaultTitle, value: '' },
    testimonials: { title: defaultTitle, value: [], editorComponent: 'ClientTestimonialSelector' },
    skills: { title: defaultTitle, value: '' },
    availability: { title: defaultTitle, value: '' },
    pricing: { title: defaultTitle, value: '' },
    
    // Career defaults
    experience: { title: defaultTitle, value: [], editorComponent: 'ExperienceSelector' },
    education: { title: defaultTitle, value: [], editorComponent: 'EducationSelector' },
    certifications: { title: defaultTitle, value: [], editorComponent: 'CertificationSelector' },
    languages: { title: defaultTitle, value: [], editorComponent: 'LanguageSelector' },
    resume: { title: defaultTitle, value: '' },
    contact: { title: defaultTitle, value: '' },
    
    // Business defaults
    company_info: { title: defaultTitle, value: '' },
    services_products: { title: defaultTitle, value: '' },
    team: { title: defaultTitle, value: '' },
    business_hours: { title: defaultTitle, value: '' },
    location: { title: defaultTitle, value: '' },
    reviews: { title: defaultTitle, value: '' },
    
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