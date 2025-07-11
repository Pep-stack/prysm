// Simplified icon imports - only import what we actually use
import {
  LuGithub, LuLinkedin, LuTwitter,
  LuLanguages, LuYoutube, LuUser, LuMail, LuPhone,
  LuStar, LuShare2, LuPlay, LuWrench, LuPackage,
  LuBriefcase, LuBookOpen, LuAward, LuMusic, LuCode,
  LuFolderOpen, LuBuilding2, LuCalendar, LuMapPin,
  LuClock, LuDollarSign, LuUsers, LuHeart, LuThumbsUp
} from "react-icons/lu";

// Card types
export const CARD_TYPES = {
  PRO: 'pro',
  CAREER: 'career', 
  BUSINESS: 'business'
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

// Card type-specific section options
export const SECTION_OPTIONS_BY_CARD_TYPE = {
  [CARD_TYPES.PRO]: [
    // Essentials for Pro (Freelancers, Creators, Consultants)
    { type: 'portfolio', name: 'Portfolio', icon: LuFolderOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'ProjectSelector' },
    { type: 'services', name: 'Services Offered', icon: LuWrench, category: CATEGORIES.ESSENTIALS },
    { type: 'testimonials', name: 'Client Testimonials', icon: LuHeart, category: CATEGORIES.ESSENTIALS },
    { type: 'skills', name: 'Skills & Technologies', icon: LuCode, category: CATEGORIES.ESSENTIALS },
    { type: 'availability', name: 'Availability Status', icon: LuCalendar, category: CATEGORIES.ESSENTIALS },
    { type: 'pricing', name: 'Pricing Information', icon: LuDollarSign, category: CATEGORIES.ESSENTIALS },
    
    // Social & Links for Pro
    { type: 'linkedin', name: 'LinkedIn', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
    { type: 'github_gitlab', name: 'GitHub/GitLab', icon: LuGithub, category: CATEGORIES.SOCIAL },
    { type: 'x_profile', name: 'X (Twitter)', icon: LuTwitter, category: CATEGORIES.SOCIAL },
    { type: 'instagram', name: 'Instagram', icon: LuUser, category: CATEGORIES.SOCIAL },
    { type: 'youtube_channel', name: 'YouTube', icon: LuYoutube, category: CATEGORIES.SOCIAL },
    { type: 'email', name: 'Email', icon: LuMail, category: CATEGORIES.SOCIAL },
    { type: 'whatsapp', name: 'WhatsApp', icon: LuPhone, category: CATEGORIES.SOCIAL },
  ],

  [CARD_TYPES.CAREER]: [
    // Essentials for Career (Job Seekers, Career Changers, Graduates)
    { type: 'experience', name: 'Work Experience', icon: LuBriefcase, category: CATEGORIES.ESSENTIALS, editorComponent: 'ExperienceSelector' },
    { type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'EducationSelector' },
    { type: 'skills', name: 'Skills & Competencies', icon: LuCode, category: CATEGORIES.ESSENTIALS },
    { type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.ESSENTIALS, editorComponent: 'CertificationSelector' },
    { type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.TOOLS, editorComponent: 'LanguageSelector' },
    { type: 'resume', name: 'Resume Download', icon: LuFolderOpen, category: CATEGORIES.ESSENTIALS },
    { type: 'contact', name: 'Contact Information', icon: LuMail, category: CATEGORIES.ESSENTIALS },
    
    // Social & Links for Career
    { type: 'linkedin', name: 'LinkedIn', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
    { type: 'github_gitlab', name: 'GitHub/GitLab', icon: LuGithub, category: CATEGORIES.SOCIAL },
    { type: 'x_profile', name: 'X (Twitter)', icon: LuTwitter, category: CATEGORIES.SOCIAL },
    { type: 'email', name: 'Email', icon: LuMail, category: CATEGORIES.SOCIAL },
    { type: 'whatsapp', name: 'WhatsApp', icon: LuPhone, category: CATEGORIES.SOCIAL },
  ],

  [CARD_TYPES.BUSINESS]: [
    // Essentials for Business (Companies, Agencies, Stores)
    { type: 'company_info', name: 'Company Information', icon: LuBuilding2, category: CATEGORIES.BUSINESS },
    { type: 'services_products', name: 'Services/Products', icon: LuPackage, category: CATEGORIES.BUSINESS },
    { type: 'team', name: 'Team Members', icon: LuUsers, category: CATEGORIES.BUSINESS },
    { type: 'contact', name: 'Contact Details', icon: LuMail, category: CATEGORIES.ESSENTIALS },
    { type: 'business_hours', name: 'Business Hours', icon: LuClock, category: CATEGORIES.BUSINESS },
    { type: 'location', name: 'Location/Address', icon: LuMapPin, category: CATEGORIES.BUSINESS },
    { type: 'reviews', name: 'Customer Reviews', icon: LuThumbsUp, category: CATEGORIES.BUSINESS },
    
    // Social & Links for Business
    { type: 'instagram', name: 'Instagram', icon: LuUser, category: CATEGORIES.SOCIAL },
    { type: 'facebook', name: 'Facebook', icon: LuUser, category: CATEGORIES.SOCIAL },
    { type: 'linkedin', name: 'LinkedIn', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
    { type: 'youtube_channel', name: 'YouTube', icon: LuYoutube, category: CATEGORIES.SOCIAL },
    { type: 'email', name: 'Email', icon: LuMail, category: CATEGORIES.SOCIAL },
    { type: 'whatsapp', name: 'WhatsApp', icon: LuPhone, category: CATEGORIES.SOCIAL },
  ]
};

// Legacy support - keep the old SECTION_OPTIONS for backward compatibility
export const SECTION_OPTIONS = [
  // Essentials
  { type: 'experience', name: 'Experience', icon: LuBriefcase, category: CATEGORIES.ESSENTIALS, editorComponent: 'ExperienceSelector' },
  { type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'EducationSelector' },
  { type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.ESSENTIALS, editorComponent: 'CertificationSelector' },
  { type: 'projects', name: 'Projects', icon: LuFolderOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'ProjectSelector' },

  // Social & Links
  { type: 'linkedin', name: 'LinkedIn', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
  { type: 'github_gitlab', name: 'GitHub/GitLab', icon: LuGithub, category: CATEGORIES.SOCIAL },
  { type: 'x_profile', name: 'X (Twitter)', icon: LuTwitter, category: CATEGORIES.SOCIAL },
  { type: 'instagram', name: 'Instagram', icon: LuUser, category: CATEGORIES.SOCIAL },
  { type: 'youtube_channel', name: 'YouTube', icon: LuYoutube, category: CATEGORIES.SOCIAL },
  { type: 'tiktok', name: 'TikTok', icon: LuMusic, category: CATEGORIES.SOCIAL },
  { type: 'facebook', name: 'Facebook', icon: LuUser, category: CATEGORIES.SOCIAL },
  { type: 'email', name: 'Email', icon: LuMail, category: CATEGORIES.SOCIAL },
  { type: 'whatsapp', name: 'WhatsApp', icon: LuPhone, category: CATEGORIES.SOCIAL },

  // Tools
  { type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.TOOLS, editorComponent: 'LanguageSelector' },
];

// Get section options based on card type
export const getSectionOptionsByCardType = (cardType) => {
  return SECTION_OPTIONS_BY_CARD_TYPE[cardType] || SECTION_OPTIONS;
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

  // Maintain category order based on card type
  let categoryOrder;
  if (cardType === CARD_TYPES.PRO) {
    categoryOrder = [CATEGORIES.ESSENTIALS, CATEGORIES.SOCIAL];
  } else if (cardType === CARD_TYPES.CAREER) {
    categoryOrder = [CATEGORIES.ESSENTIALS, CATEGORIES.TOOLS, CATEGORIES.SOCIAL];
  } else if (cardType === CARD_TYPES.BUSINESS) {
    categoryOrder = [CATEGORIES.BUSINESS, CATEGORIES.ESSENTIALS, CATEGORIES.SOCIAL];
  } else {
    categoryOrder = [CATEGORIES.ESSENTIALS, CATEGORIES.SOCIAL, CATEGORIES.CONTENT, CATEGORIES.TOOLS, 'Other'];
  }

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
    testimonials: { title: defaultTitle, value: '' },
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