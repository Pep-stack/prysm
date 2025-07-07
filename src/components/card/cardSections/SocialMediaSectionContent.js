import React from 'react';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { LuGithub, LuInstagram, LuLinkedin, LuTwitter, LuYoutube, LuMail, LuPhone } from 'react-icons/lu';
import { FaSpotify, FaRedditAlien, FaSnapchatGhost } from 'react-icons/fa';

const SOCIALS = [
  { type: 'github', name: 'GitHub', icon: LuGithub },
  { type: 'instagram', name: 'Instagram', icon: LuInstagram },
  { type: 'linkedin', name: 'LinkedIn', icon: LuLinkedin },
  { type: 'x', name: 'X', icon: LuTwitter },
  { type: 'youtube', name: 'YouTube', icon: LuYoutube },
  { type: 'spotify', name: 'Spotify', icon: FaSpotify },
  { type: 'reddit', name: 'Reddit', icon: FaRedditAlien },
  { type: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost },
  { type: 'mail', name: 'Mail', icon: LuMail },
  { type: 'whatsapp', name: 'WhatsApp', icon: LuPhone },
  { type: 'phone', name: 'Telefoon', icon: LuPhone },
];

export default function SocialMediaSectionContent({ section, profile, user }) {
  // Haal kleur uit design settings (fallback op zwart)
  const { settings } = useDesignSettings();
  const iconColor = settings?.icon_color || '#222';
  const iconSize = 24;

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