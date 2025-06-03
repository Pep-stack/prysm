// Importeer de iconen die je wilt gebruiken
import {
  LuHeading1, LuText, LuLink, LuImage, LuGithub, LuLinkedin, LuTwitter,
  LuQrCode, LuLanguages, LuYoutube, LuUser, LuSettings, LuMail,
  LuMousePointerClick, LuCalendar, LuMapPin, LuPhone, // Voeg alle benodigde iconen toe
  LuStar, // Voor Essentials
  LuShare2, // Voor Social & Links
  LuPlay, // Voor Media & Content
  LuWrench, // Voor Utilities
  LuPackage, // Voor Other/Default
  LuBriefcase, LuBookOpen, LuAward, LuPalette, LuMusic, LuCode,
  LuFolderOpen, LuBook, LuMessageCircle, LuChartBar, LuFileText, LuDownload, LuClock
} from "react-icons/lu";
// Importeer eventueel uit andere sets zoals Fa, Fa6 etc.
// import { FaSpotify, FaTwitch } from "react-icons/fa";

// Definieer categorieën voor groepering
const CATEGORIES = {
  ESSENTIALS: 'Essentials',
  SOCIAL: 'Social & Links',
  MEDIA: 'Media & Content',
  TOOLS: 'Utilities',
  // Voeg meer categorieën toe indien nodig
};

// NIEUW: Mapping van categorie naam naar icoon component
export const CATEGORY_ICONS = {
  [CATEGORIES.ESSENTIALS]: LuStar,
  [CATEGORIES.SOCIAL]: LuShare2,
  [CATEGORIES.MEDIA]: LuPlay,
  [CATEGORIES.TOOLS]: LuWrench,
  'Other': LuPackage, // Fallback voor categorieën zonder specifiek icoon
};

// Definieer ALLE beschikbare sectie opties
// Zorg dat 'type' overeenkomt met hoe je je componenten laadt/identificeert
export const SECTION_OPTIONS = [
  // Essentials
  { id: 'header', type: 'header', name: 'Header', icon: LuHeading1, category: CATEGORIES.ESSENTIALS }, // Misschien niet toevoegbaar?
  { id: 'bio', type: 'bio', name: 'Bio / Text Block', icon: LuText, category: CATEGORIES.ESSENTIALS },
  // { id: 'avatar', type: 'avatar', name: 'Avatar', icon: LuUserCircle, category: CATEGORIES.ESSENTIALS }, // Meestal onderdeel van Header/Profile?
  { id: 'contact', type: 'contact', name: 'Contact Details', icon: LuMail, category: CATEGORIES.ESSENTIALS },
  { id: 'experience', type: 'experience', name: 'Experience', icon: LuBriefcase, category: CATEGORIES.ESSENTIALS, editorComponent: 'ExperienceSelector' },
  { id: 'education', type: 'education', name: 'Education', icon: LuBookOpen, category: CATEGORIES.ESSENTIALS, editorComponent: 'EducationSelector' },
  { id: 'certifications', type: 'certifications', name: 'Certifications', icon: LuAward, category: CATEGORIES.ESSENTIALS },
  { id: 'awards', type: 'awards', name: 'Awards', icon: LuAward, category: CATEGORIES.ESSENTIALS },

  // Social & Links
  { id: 'links', type: 'links', name: 'Link Collection', icon: LuLink, category: CATEGORIES.SOCIAL },
  { id: 'button', type: 'button', name: 'Custom Button', icon: LuMousePointerClick, category: CATEGORIES.SOCIAL },
  { id: 'email', type: 'email', name: 'Email', icon: LuMail, category: CATEGORIES.SOCIAL },
  { id: 'whatsapp', type: 'whatsapp', name: 'WhatsApp', icon: LuPhone, category: CATEGORIES.SOCIAL },
  { id: 'github', type: 'github', name: 'GitHub Profile Link', icon: LuGithub, category: CATEGORIES.SOCIAL },
  { id: 'linkedin', type: 'linkedin', name: 'LinkedIn Profile Link', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
  { id: 'x_profile', type: 'x_profile', name: 'X (Twitter) Profile Link', icon: LuTwitter, category: CATEGORIES.SOCIAL },
  { id: 'instagram', type: 'instagram', name: 'Instagram Profile Link', icon: LuUser, category: CATEGORIES.SOCIAL },
  { id: 'github_gitlab', type: 'github_gitlab', name: 'GitHub/GitLab', icon: LuGithub, category: CATEGORIES.SOCIAL },
  { id: 'dribbble_behance', type: 'dribbble_behance', name: 'Dribbble/Behance', icon: LuPalette, category: CATEGORIES.SOCIAL },
  { id: 'youtube_channel', type: 'youtube_channel', name: 'YouTube Channel', icon: LuYoutube, category: CATEGORIES.SOCIAL },
  { id: 'tiktok', type: 'tiktok', name: 'TikTok', icon: LuMusic, category: CATEGORIES.SOCIAL },
  { id: 'facebook', type: 'facebook', name: 'Facebook', icon: LuUser, category: CATEGORIES.SOCIAL },
  { id: 'stackoverflow', type: 'stackoverflow', name: 'Stack Overflow', icon: LuCode, category: CATEGORIES.SOCIAL },

  // Media & Content
  { id: 'image', type: 'image', name: 'Image', icon: LuImage, category: CATEGORIES.MEDIA },
  { id: 'youtube', type: 'youtube', name: 'YouTube Video', icon: LuYoutube, category: CATEGORIES.MEDIA },
  { id: 'projects', type: 'projects', name: 'Projects', icon: LuFolderOpen, category: CATEGORIES.MEDIA },
  { id: 'publications', type: 'publications', name: 'Publications', icon: LuBook, category: CATEGORIES.MEDIA },
  { id: 'events', type: 'events', name: 'Events', icon: LuCalendar, category: CATEGORIES.MEDIA },
  { id: 'testimonials', type: 'testimonials', name: 'Testimonials', icon: LuMessageCircle, category: CATEGORIES.MEDIA },
  { id: 'services', type: 'services', name: 'Services', icon: LuSettings, category: CATEGORIES.MEDIA },
  { id: 'statistics_proof', type: 'statistics_proof', name: 'Statistics/Proof', icon: LuChartBar, category: CATEGORIES.MEDIA },
  { id: 'blog_articles', type: 'blog_articles', name: 'Blog Articles', icon: LuFileText, category: CATEGORIES.MEDIA },
  { id: 'video_banner', type: 'video_banner', name: 'Video Banner', icon: LuPlay, category: CATEGORIES.MEDIA },

  // Utilities
  { id: 'qrcode', type: 'qrcode', name: 'QR Code', icon: LuQrCode, category: CATEGORIES.TOOLS },
  { id: 'map', type: 'map', name: 'Map Location', icon: LuMapPin, category: CATEGORIES.TOOLS },
  { id: 'google_maps', type: 'google_maps', name: 'Google Maps', icon: LuMapPin, category: CATEGORIES.TOOLS },
  { id: 'event', type: 'event', name: 'Event / Calendar', icon: LuCalendar, category: CATEGORIES.TOOLS },
  { id: 'calendar_scheduling', type: 'calendar_scheduling', name: 'Calendar Scheduling', icon: LuCalendar, category: CATEGORIES.TOOLS },
  { id: 'languages', type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.TOOLS, editorComponent: 'LanguageSelector' },
  { id: 'timezone_hours', type: 'timezone_hours', name: 'Timezone/Hours', icon: LuClock, category: CATEGORIES.TOOLS },
  { id: 'download_cv', type: 'download_cv', name: 'Download CV', icon: LuDownload, category: CATEGORIES.TOOLS },
  { id: 'contact_buttons', type: 'contact_buttons', name: 'Contact Buttons', icon: LuMousePointerClick, category: CATEGORIES.ESSENTIALS },
  { id: 'contact_form', type: 'contact_form', name: 'Contact Form', icon: LuMail, category: CATEGORIES.ESSENTIALS },
  { id: 'newsletter_signup', type: 'newsletter_signup', name: 'Newsletter Signup', icon: LuMail, category: CATEGORIES.ESSENTIALS },

  // Zorg ervoor dat ALLE component-types uit app/components/card/cardsections hier een entry hebben
];

// Functie om opties te groeperen op categorie, gefilterd op wat al bestaat
export const getGroupedSectionOptions = (existingSectionTypes = []) => {
   // BELANGRIJK: Hoe bepaal je of een sectie "al bestaat"?
   // Optie 1: Op basis van de *gegenereerde unieke ID* (zoals in de state). Dit laat toe om bv. meerdere 'links' secties te hebben.
   const availableOptionsFilteredByType = SECTION_OPTIONS.filter(option => !existingSectionTypes.includes(option.type));

   // Optie 2: Op basis van het *type*. Dit voorkomt dat je bv. twee 'bio' secties toevoegt (als dat de bedoeling is).
   // const existingSectionTypes = existingSectionsState.map(s => s.type); // Je moet de hele sectie state hier hebben
   // const availableOptions = SECTION_OPTIONS.filter(option => !existingSectionTypes.includes(option.type));

   // Kies de filtermethode die past bij jouw logica. We gaan hier uit van Optie 1 (filteren op ID uit options array).
   // Dit betekent dat als je een sectie toevoegt, je de `id` uit `SECTION_OPTIONS` moet gebruiken ipv uuidv4(),
   // of je moet de filterlogica aanpassen naar Optie 2 (filteren op type). Laten we voor nu filteren op type.

   // We nemen aan dat existingSectionTypes nu een array van *types* is van de huidige kaart secties
   const grouped = availableOptionsFilteredByType.reduce((acc, option) => {
     const category = option.category || 'Other'; // Default category
     if (!acc[category]) {
       acc[category] = [];
     }
     acc[category].push(option);
     return acc;
   }, {});

   // Optioneel: Definieer een vaste volgorde voor categorieën
   const categoryOrder = [CATEGORIES.ESSENTIALS, CATEGORIES.SOCIAL, CATEGORIES.MEDIA, CATEGORIES.TOOLS, 'Other'];
   const sortedGrouped = {};
   categoryOrder.forEach(cat => {
       if (grouped[cat]) {
           sortedGrouped[cat] = grouped[cat];
       }
   });
   // Voeg overige categorieën toe
   Object.keys(grouped).forEach(cat => {
       if (!sortedGrouped[cat]) {
           sortedGrouped[cat] = grouped[cat];
       }
   });

   return sortedGrouped;
};

// Default props (blijft grotendeels hetzelfde, zorg dat types matchen)
export const getDefaultSectionProps = (type) => {
    // Vind de bijbehorende optie voor de naam
    const option = SECTION_OPTIONS.find(opt => opt.type === type);
    const defaultTitle = option ? option.name : `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`;

    switch (type) {
        case 'header': return { title: defaultTitle, value: '' }; // Of standaard naam/titel?
        case 'bio': return { title: defaultTitle, value: '' };
        case 'links': return { title: defaultTitle, value: [] };
        case 'image': return { title: defaultTitle, value: null };
        case 'button': return { title: 'Button Text', value: { url: '', text: 'Click Me' } }; // Voorbeeld voor complexere waarde
        case 'email': return { title: defaultTitle, value: '' };
        case 'whatsapp': return { title: defaultTitle, value: '' };
        case 'languages': return { title: defaultTitle, value: [], editorComponent: 'LanguageSelector' };
        case 'education': return { title: defaultTitle, value: [], editorComponent: 'EducationSelector' };
        case 'experience': return { title: defaultTitle, value: [], editorComponent: 'ExperienceSelector' };
        // ... defaults voor andere types ...
        default: return { title: defaultTitle, value: '' };
    }
}; 