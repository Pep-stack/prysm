// Simplified icon imports - only import what we actually use
import {
  LuGithub, LuLinkedin, LuTwitter,
  LuLanguages, LuYoutube, LuUser, LuMail, LuPhone,
  LuStar, LuShare2, LuPlay, LuWrench, LuPackage,
  LuBriefcase, LuBookOpen, LuAward, LuMusic, LuCode,
  LuFolderOpen
} from "react-icons/lu";

// Simplified categories
const CATEGORIES = {
  ESSENTIALS: 'Essentials',
  SOCIAL: 'Social & Links',
  CONTENT: 'Content',
  TOOLS: 'Tools'
};

// Simplified category icons
export const CATEGORY_ICONS = {
  [CATEGORIES.ESSENTIALS]: LuStar,
  [CATEGORIES.SOCIAL]: LuShare2,
  [CATEGORIES.CONTENT]: LuPlay,
  [CATEGORIES.TOOLS]: LuWrench,
  'Other': LuPackage,
};

// Consolidated section options - removed duplicates and simplified
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

// Simplified grouping function
export const getGroupedSectionOptions = (existingSectionTypes = []) => {
  const availableOptions = SECTION_OPTIONS.filter(option => 
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

  // Maintain category order
  const categoryOrder = [CATEGORIES.ESSENTIALS, CATEGORIES.SOCIAL, CATEGORIES.CONTENT, CATEGORIES.TOOLS, 'Other'];
  const sortedGrouped = {};
  categoryOrder.forEach(cat => {
    if (grouped[cat]) {
      sortedGrouped[cat] = grouped[cat];
    }
  });

  return sortedGrouped;
};

// Simplified default props
export const getDefaultSectionProps = (type) => {
  const option = SECTION_OPTIONS.find(opt => opt.type === type);
  const defaultTitle = option ? option.name : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  const defaults = {
    experience: { title: defaultTitle, value: [], editorComponent: 'ExperienceSelector' },
    education: { title: defaultTitle, value: [], editorComponent: 'EducationSelector' },
    certifications: { title: defaultTitle, value: [], editorComponent: 'CertificationSelector' },
    projects: { title: defaultTitle, value: [], editorComponent: 'ProjectSelector' },
    languages: { title: defaultTitle, value: [], editorComponent: 'LanguageSelector' },
    // Social media defaults
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