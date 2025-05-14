'use client';

import React from 'react';
import { FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

export default function ContactButtonsSectionContent({ profile, user, styles, designSettings }) {
  const { buttonColor, buttonShape, fontFamily, iconPack } = designSettings || {};

  const buttonStyle = {
    backgroundColor: buttonColor || '#00C48C',
    borderRadius: buttonShape === 'rounded-full' ? '9999px' : 
                 buttonShape === 'rounded-xl' ? '0.75rem' : '0.375rem',
    fontFamily: fontFamily || 'Inter, sans-serif',
  };

  const renderIcon = (Icon) => {
    if (iconPack === 'emoji') {
      switch (Icon) {
        case FaPhone:
          return '📞';
        case FaEnvelope:
          return '✉️';
        case FaWhatsapp:
          return '💬';
        default:
          return Icon;
      }
    }
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col gap-3">
      {profile?.phone && (
        <a
          href={`tel:${profile.phone}`}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors hover:opacity-90"
          style={buttonStyle}
        >
          {renderIcon(FaPhone)}
          <span>Call</span>
        </a>
      )}
      
      {profile?.email && (
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors hover:opacity-90"
          style={buttonStyle}
        >
          {renderIcon(FaEnvelope)}
          <span>Email</span>
        </a>
      )}
      
      {profile?.whatsapp && (
        <a
          href={`https://wa.me/${profile.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors hover:opacity-90"
          style={buttonStyle}
        >
          {renderIcon(FaWhatsapp)}
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  );
} 