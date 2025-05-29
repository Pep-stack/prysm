'use client';

import React from 'react';
import { 
  FaPhone, FaEnvelope, FaWhatsapp, FaTelegram, FaSignal,
  FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaTiktok
} from 'react-icons/fa';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

export default function ContactButtonsSectionContent({ profile, user, styles, designSettings, isCompact = false }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
  const {
    buttonColor = '#00C896', // Default green color
    buttonShape = designSettings?.buttonShape || 'rounded-full',
    fontFamily = designSettings?.fontFamily || 'Inter, sans-serif',
    iconPack = designSettings?.iconPack || 'lucide'
  } = designSettings || {};

  const buttonStyle = {
    backgroundColor: buttonColor,
    borderRadius: buttonShape === 'rounded-full' ? '50px' : 
                   buttonShape === 'rounded-xl' ? '12px' : '6px',
    fontFamily: fontFamily,
    border: 'none',
    cursor: 'pointer'
  };

  const renderIcon = (IconComponent) => {
    return <IconComponent size={isCompact ? 16 : 20} />;
  };

  if (isCompact) {
    // Compact mode - render horizontal icon buttons
    return (
      <div className="flex gap-2" style={{ fontFamily }}>
        {profile?.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center justify-center text-white transition-colors hover:opacity-90"
            style={{ 
              ...buttonStyle, 
              width: '40px', 
              height: '40px',
              textDecoration: 'none'
            }}
            title="Call"
          >
            {renderIcon(FaPhone)}
          </a>
        )}
        
        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center justify-center text-white transition-colors hover:opacity-90"
            style={{ 
              ...buttonStyle, 
              width: '40px', 
              height: '40px',
              textDecoration: 'none'
            }}
            title="Email"
          >
            {renderIcon(FaEnvelope)}
          </a>
        )}
        
        {profile?.whatsapp && (
          <a
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-white transition-colors hover:opacity-90"
            style={{ 
              ...buttonStyle, 
              width: '40px', 
              height: '40px',
              textDecoration: 'none'
            }}
            title="WhatsApp"
          >
            {renderIcon(FaWhatsapp)}
          </a>
        )}
      </div>
    );
  }

  // Regular mode - original layout
  return (
    <div className="flex flex-col gap-3" key={`${buttonColor}-${buttonShape}-${fontFamily}-${iconPack}`}>
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