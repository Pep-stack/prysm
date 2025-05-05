// Importeer alle benodigde iconen
import {
  LuCircleUser,
  LuLink,
  LuQrCode,
  LuSettings, // Gebruikt voor 'Account Settings' in sidebar, misschien ander icoon hier?
  LuHeading1, // Voorbeeld voor Header sectie
  LuText,     // Voorbeeld voor Text/Bio sectie
  LuImage,    // Voorbeeld voor Image sectie
  LuYoutube,  // Voorbeeld voor YouTube etc.
  LuGithub,
  LuLinkedin,
  LuTwitter, // Of FaXTwitter etc. afhankelijk van set
  LuLanguages // Voorbeeld voor Language sectie
  // Voeg hier ALLE sectie-iconen toe die je nodig hebt
} from "react-icons/lu";
// Of importeer van andere sets zoals Fa, Fa6, etc.

// Map sectie 'type' naar een icoon component
const sectionIconMap = {
  header: LuHeading1,
  bio: LuText,
  text: LuText,
  avatar: LuCircleUser,
  links: LuLink, // Algemene links
  youtube: LuYoutube,
  github: LuGithub,
  linkedin: LuLinkedin,
  twitter: LuTwitter,
  image: LuImage,
  qrcode: LuQrCode,
  languages: LuLanguages,
  // Voeg hier mappings toe voor AL je sectie types
  default: LuLink // Fallback icoon
};

export const getIconForSection = (sectionType) => {
  // Normaliseer type (lowercase, vervang spaties/streepjes indien nodig)
  const normalizedType = sectionType?.toLowerCase().replace(/[\s-]/g, '') || 'default';
  return sectionIconMap[normalizedType] || sectionIconMap.default;
}; 