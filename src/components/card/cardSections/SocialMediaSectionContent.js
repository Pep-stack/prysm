import React from 'react';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaSpotify, FaRedditAlien, FaSnapchatGhost, FaFacebook, FaDribbble, FaBehance, FaWhatsapp, FaEnvelope, FaPhone, FaTiktok } from 'react-icons/fa';

const SOCIALS = [
  { type: 'github', name: 'GitHub', icon: FaGithub },
  { type: 'linkedin', name: 'LinkedIn', icon: FaLinkedin },
  { type: 'x', name: 'X', icon: FaTwitter },
  { type: 'instagram', name: 'Instagram', icon: FaInstagram },
  { type: 'youtube', name: 'YouTube', icon: FaYoutube },
  { type: 'spotify', name: 'Spotify', icon: FaSpotify },
  { type: 'reddit', name: 'Reddit', icon: FaRedditAlien },
  { type: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost },
  { type: 'facebook', name: 'Facebook', icon: FaFacebook },
  { type: 'dribbble', name: 'Dribbble', icon: FaDribbble },
  { type: 'behance', name: 'Behance', icon: FaBehance },
  { type: 'tiktok', name: 'TikTok', icon: FaTiktok },
  { type: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp },
  { type: 'email', name: 'Email', icon: FaEnvelope },
  { type: 'phone', name: 'Phone', icon: FaPhone },
];

export default function SocialMediaSectionContent({ section, profile, user }) {
  // Haal kleur uit design settings (fallback op zwart)
  const { settings } = useDesignSettings();
  const iconColor = settings?.icon_color || '#222';
  const iconSize = 32;

  // section.type bepaalt welk icoon we tonen
  const social = SOCIALS.find(s => s.type === section.type);
  if (!social) return null;
  const Icon = social.icon;

  return (
    <div className="flex flex-col items-center justify-center">
      <span
        className="flex items-center justify-center rounded-full"
        style={{ color: iconColor, width: iconSize, height: iconSize }}
        title={social.name}
      >
        <Icon size={iconSize} />
      </span>
      {/* Optioneel: naam tonen onder het icoon */}
      {/* <span className="text-xs mt-1" style={{ color: iconColor }}>{social.name}</span> */}
    </div>
  );
} 