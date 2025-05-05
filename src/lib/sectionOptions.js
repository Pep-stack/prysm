// Importeer de iconen die je wilt gebruiken
import {
  LuHeading1, LuText, LuLink, LuImage, LuGithub, LuLinkedin, LuTwitter,
  LuQrCode, LuLanguages, LuYoutube, LuUserCircle, LuSettings, LuMail,
  LuMousePointerClick, LuCalendar, LuMapPin, // Voeg alle benodigde iconen toe
  LuStar, // Voor Essentials
  LuShare2, // Voor Social & Links
  LuPlay, // Voor Media & Content
  LuWrench, // Voor Utilities
  LuPackage // Voor Other/Default
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

  // Social & Links
  { id: 'links', type: 'links', name: 'Link Collection', icon: LuLink, category: CATEGORIES.SOCIAL },
  { id: 'button', type: 'button', name: 'Custom Button', icon: LuMousePointerClick, category: CATEGORIES.SOCIAL },
  { id: 'github', type: 'github', name: 'GitHub Profile Link', icon: LuGithub, category: CATEGORIES.SOCIAL },
  { id: 'linkedin', type: 'linkedin', name: 'LinkedIn Profile Link', icon: LuLinkedin, category: CATEGORIES.SOCIAL },
  { id: 'twitter', type: 'twitter', name: 'X (Twitter) Profile Link', icon: LuTwitter, category: CATEGORIES.SOCIAL },
  // { id: 'instagram', type: 'instagram', name: 'Instagram Profile Link', icon: FaInstagram, category: CATEGORIES.SOCIAL }, // Voorbeeld Fa

  // Media & Content
  { id: 'image', type: 'image', name: 'Image', icon: LuImage, category: CATEGORIES.MEDIA },
  { id: 'youtube', type: 'youtube', name: 'YouTube Video', icon: LuYoutube, category: CATEGORIES.MEDIA },
  // { id: 'spotify', type: 'spotify', name: 'Spotify Track/Podcast', icon: FaSpotify, category: CATEGORIES.MEDIA }, // Voorbeeld Fa
  // { id: 'twitch', type: 'twitch', name: 'Twitch Stream', icon: FaTwitch, category: CATEGORIES.MEDIA }, // Voorbeeld Fa

  // Utilities
  { id: 'qrcode', type: 'qrcode', name: 'QR Code', icon: LuQrCode, category: CATEGORIES.TOOLS },
  { id: 'map', type: 'map', name: 'Map Location', icon: LuMapPin, category: CATEGORIES.TOOLS },
  { id: 'event', type: 'event', name: 'Event / Calendar', icon: LuCalendar, category: CATEGORIES.TOOLS },
  { id: 'languages', type: 'languages', name: 'Languages', icon: LuLanguages, category: CATEGORIES.TOOLS }, // Past dit hier?

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
        // ... defaults voor andere types ...
        default: return { title: defaultTitle, value: '' };
    }
}; 