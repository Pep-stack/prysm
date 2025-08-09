import React from 'react';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaRedditAlien, FaSnapchatGhost, FaFacebook, FaDribbble, FaBehance, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FaXTwitter, FaSpotify } from 'react-icons/fa6';

const SOCIALS = [
  { type: 'github', name: 'GitHub', icon: FaGithub },
  { type: 'linkedin', name: 'LinkedIn', icon: FaLinkedin },
  { type: 'x', name: 'X', icon: FaXTwitter },
  { type: 'instagram', name: 'Instagram', icon: FaInstagram },
  { type: 'youtube', name: 'YouTube', icon: FaYoutube },
  { type: 'spotify', name: 'Spotify', icon: FaSpotify },
  { type: 'tiktok', name: 'TikTok', icon: FaTiktok },
  { type: 'reddit', name: 'Reddit', icon: FaRedditAlien },
  { type: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost },
  { type: 'facebook', name: 'Facebook', icon: FaFacebook },
  { type: 'dribbble', name: 'Dribbble', icon: FaDribbble },
  { type: 'behance', name: 'Behance', icon: FaBehance },
  { type: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp },
];

export default function SocialMediaSectionContent({ section, profile, user, styles = {}, onSocialClick }) {
  // Haal kleur uit design settings (fallback op zwart)
  const { settings } = useDesignSettings();
  
  // Smart icon color - check if this is a colored or dark theme
  const isColoredTheme = settings.background_color && (
    settings.background_color.includes('linear-gradient') && 
    settings.background_color.includes('#ffffff')
  );
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#000000') ||
    settings.background_color.includes('#0a0a0a') ||
    settings.background_color.includes('#18181b') ||
    settings.background_color.includes('#1a1a1a') ||
    settings.background_color.includes('#0c0c0c') ||
    settings.background_color.includes('#111827') ||
    settings.background_color.includes('#1e293b') ||
    settings.background_color.includes('#252525') ||
    settings.background_color.includes('#1c1c1c')
  );
  
  // Use smart contrast for social icons - black for colored themes, white for dark themes
  const iconColor = isColoredTheme ? '#000000' : isDarkTheme ? '#ffffff' : (settings?.icon_color || '#222');
  const iconSize = styles?.iconSize || 32;

  // section.type bepaalt welk icoon we tonen
  const social = SOCIALS.find(s => s.type === section.type);
  if (!social) return null;
  const Icon = social.icon;

  // Get the social media URL from profile based on section type
  const getSocialUrl = () => {
    const socialType = section.type;
    switch (socialType) {
      case 'linkedin':
        return profile?.linkedin;
      case 'x':
        return profile?.x_profile;
      case 'instagram':
        return profile?.instagram;
      case 'facebook':
        return profile?.facebook;
      case 'youtube':
        return profile?.youtube_channel;
      case 'tiktok':
        return profile?.tiktok;
      case 'github':
        return profile?.github_gitlab;
      case 'dribbble':
        return profile?.dribbble_behance;
      case 'snapchat':
        return profile?.snapchat;
      case 'reddit':
        return profile?.reddit;
      case 'whatsapp':
        return profile?.whatsapp;
      case 'spotify':
        return profile?.spotify;
      default:
        return null;
    }
  };

  const socialUrl = getSocialUrl();

  // Handle social click tracking
  const handleClick = () => {
    // Track social clicks for all platforms
    if (onSocialClick) {
      onSocialClick();
    }
  };

  // If no URL, just show the icon without click functionality
  if (!socialUrl) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span
          className="flex items-center justify-center rounded-full opacity-50"
          style={{ color: iconColor, width: iconSize, height: iconSize }}
          title={`${social.name} - Not configured`}
        >
          <Icon size={iconSize} />
        </span>
      </div>
    );
  }

  // If URL exists, make it clickable
  return (
    <div className="flex flex-col items-center justify-center">
      <a
        href={socialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200 cursor-pointer"
        style={{ color: iconColor, width: iconSize, height: iconSize }}
        title={`Visit ${social.name}`}
        onClick={handleClick}
      >
        <Icon size={iconSize} />
      </a>
    </div>
  );
} 