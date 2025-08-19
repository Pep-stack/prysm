'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik next/image voor avatar
import styles from './CardHeader.module.css'; // Importeer de CSS Module
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../lib/themeSystem';
import { LuBriefcase, LuMapPin, LuGlobe, LuFileText, LuCheck, LuX, LuPause, LuClock, LuUser, LuClock3, LuBuilding2, LuPhone, LuMail } from 'react-icons/lu';

// Helper functie voor initialen
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

// Function to get font size based on name_size setting
const getNameFontSize = (nameSize) => {
  switch (nameSize) {
    case 'small': return '28px';
    case 'medium': return '32px';
    case 'large': return '36px';
    case 'extra-large': return '40px';
    case 'xxl': return '44px';
    default: return '32px';
  }
};

export default function CardHeader({ profile, user, isPublicView = false, backgroundColor }) {
  const { settings } = useDesignSettings();

  // Card type bepalen
  const cardType = profile?.card_type || 'pro';
  
  // Display type per card type uit card_display_settings
  const cardDisplaySettings = profile?.card_display_settings?.[cardType] || {};
  const displayType = cardDisplaySettings.display_type || 'avatar';

  // Context detection for header width behavior
  // We force contained mode for all views to ensure the header image aligns exactly with card edges
  const shouldUseFullWidth = false;

  // Avatar settings per card type uit card_display_settings
  const avatarSize = cardDisplaySettings.avatar_size || 'medium';
  const avatarShape = cardDisplaySettings.avatar_shape || 'circle';
  const avatarPosition = cardDisplaySettings.avatar_position || 'left';

  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  // Get card background color from design settings (fallback op wit)
  const cardBgColor = settings.background_color || '#fff';

  // Avatar grootte bepalen (uitgebreid voor meer sizes)
  const getAvatarSize = (size) => {
    switch (size) {
      case 'xs': return 50;
      case 'small': return 70;
      case 'medium': return 90;
      case 'large': return 110;
      case 'xl': return 130;
      case 'xxl': return 150;
      default: return 90; // medium fallback
    }
  };

  // Display avatar grootte bepalen (voor grote avatar in display modes)
  const getDisplayAvatarSize = (size) => {
    switch (size) {
      case 'xs': return 240;
      case 'small': return 280;
      case 'medium': return 320;
      case 'large': return 360;
      case 'xl': return 400;
      case 'xxl': return 440;
      default: return 320; // medium fallback
    }
  };

  // Avatar vorm bepalen
  const getAvatarBorderRadius = (shape) => {
    switch (shape) {
      case 'square': return '0px';
      case 'rounded': return '12px';
      default: return '50%'; // circle
    }
  };

  // Avatar positie bepalen
  const getAvatarJustification = (position) => {
    switch (position) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start'; // left
    }
  };

  const avatarSizePx = getAvatarSize(avatarSize);
  const displayAvatarSizePx = getDisplayAvatarSize(avatarSize);
  const avatarBorderRadius = getAvatarBorderRadius(avatarShape);
  const avatarJustification = getAvatarJustification(avatarPosition);

  // Get availability status display configuration
  const getAvailabilityStatusDisplay = (status) => {
    const statusConfig = {
      'available': { 
        color: '#059669', 
        icon: LuCheck, 
        label: 'Open for work',
        description: 'Ready for new opportunities'
      },
      'busy': { 
        color: '#d97706', 
        icon: LuPause, 
        label: 'Busy',
        description: 'Limited availability'
      },
      'unavailable': { 
        color: '#dc2626', 
        icon: LuX, 
        label: 'Not available for work',
        description: 'Not taking new work'
      },
      'limited': { 
        color: '#0284c7', 
        icon: LuClock, 
        label: 'Selective opportunities',
        description: 'Open for specific projects'
      }
    };
    return statusConfig[status] || statusConfig['available'];
  };

  // Mapping voor personal info per card type
  // Geen secties die als losse section op de card kunnen verschijnen
  const PERSONAL_INFO_FIELDS = {
    pro: ['name', 'headline', 'bio', 'location', 'website', 'age', 'availability_status', 'timezone', 'current_role', 'phone', 'email'],
    career: ['name', 'headline', 'bio', 'location', 'desired_role', 'age', 'availability_status', 'timezone', 'current_role', 'phone', 'email'],
    business: ['name', 'headline', 'bio', 'industry', 'location', 'website', 'company_size', 'age', 'availability_status', 'timezone', 'current_role', 'phone', 'email'],
  };

  // Haal de juiste personal info uit de card_profiles JSON
  const cardProfiles = profile?.card_profiles || {};
  const personalInfo = cardProfiles[cardType] || {};

  // Haal de juiste images per card type
  const cardImages = profile?.card_images?.[cardType] || {};
  const headerUrl = cardImages.header_url || '';
  const avatarUrl = cardImages.avatar_url || '';

  const fieldsToShow = PERSONAL_INFO_FIELDS[cardType] || PERSONAL_INFO_FIELDS['pro'];

  // Check of er daadwerkelijk personal info is ingevuld
  const hasPersonalInfo = fieldsToShow.some(field => !!personalInfo?.[field]);

  // Labels voor optionele velden
  const FIELD_LABELS = {
    name: cardType === 'business' ? 'Company Name' : 'Name',
    headline: cardType === 'business' ? 'Tagline' : 'Headline',
    bio: 'Bio',
    location: 'Location',
    website: 'Website',
    age: 'Age',
    desired_role: 'Desired Role',
    industry: 'Industry',
    company_size: 'Company Size',
    timezone: 'Timezone',
    current_role: 'Current Role',
    phone: 'Phone',
    email: 'Email',
  };

  return (
    <div className={`${styles.profileSection} ${shouldUseFullWidth ? styles.fullWidth : styles.contained}`}>
      {/* Header afbeelding (alleen tonen als display_type = 'header') */}
      {displayType === 'header' && (
        <div className={styles.profileCoverContainer}>
          {headerUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              <Image
                src={headerUrl}
                alt="Profile Header"
                fill
                className={styles.profileCoverImage}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Header image failed to load:', headerUrl);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Overlay direct ná de afbeelding, zodat deze altijd bovenop ligt */}
              <div 
                className={styles.headerGradientOverlay}
                style={{ '--card-bg-color': cardBgColor }}
              ></div>
              <div 
                className={styles.profileCoverPlaceholder}
                style={{ display: 'none' }}
              >
                <span className={styles.profileInitials}>
                  {getInitials(personalInfo?.name)}
                </span>
              </div>
            </div>
          ) : (
            <div 
              className={styles.profileCoverPlaceholder}
              style={{ background: cardBgColor, position: 'relative' }}
            >
              {/* Subtiele wazige overlay */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: '16px 16px 0 0',
                  zIndex: 2
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Avatar + profile info wrapper (ensures padding does not affect header image) */}
      <div className={styles.avatarRow}>
        {(displayType === 'avatar' || displayType === 'round_avatar') && (
          <div 
            style={{
              justifyContent: 'center',
              marginTop: '48px', // meer padding van boven
              display: 'flex',
              width: '100%'
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={personalInfo?.name || user?.email || 'Profile Avatar'}
                width={displayAvatarSizePx}
                height={displayAvatarSizePx}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: displayType === 'round_avatar' ? '50%' : 24,
                  width: `${displayAvatarSizePx}px`,
                  height: `${displayAvatarSizePx}px`,
                  display: 'block',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ) : (
              <div 
                style={{
                  width: `${displayAvatarSizePx}px`,
                  height: `${displayAvatarSizePx}px`,
                  borderRadius: displayType === 'round_avatar' ? '50%' : 24,
                  fontSize: `${Math.floor(displayAvatarSizePx * 0.4)}px`,
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <span>
                  {getInitials(personalInfo?.name)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Profiel informatie */}
        {hasPersonalInfo && (
          <div 
            className={styles.profileInfo}
            style={{ 
              textAlign: displayType === 'avatar' && avatarPosition === 'center' ? 'center' : 
                        displayType === 'avatar' && avatarPosition === 'right' ? 'right' : 'left',
              marginTop: displayType === 'header' ? '40px' : '32px' // Increased from 32px/24px to 40px/32px
            }}
          >
            {/* Name - stays the same */}
            {personalInfo?.name && (
              <h2 className={styles.name} style={{ 
                color: textColor, 
                marginBottom: '36px',
                fontSize: getNameFontSize(settings.name_size || 'small')
              }}> {/* Increased from 28px to 36px */}
                {personalInfo.name}
              </h2>
            )}

            {/* Glass containers for other fields */}
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '20px' // Increased from 16px to 20px
            }}>
              {/* Headline Container */}
              {personalInfo?.headline && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuBriefcase size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.headline}
                  </span>
                </div>
              )}

              {/* Location Container */}
              {personalInfo?.location && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuMapPin size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.location}
                  </span>
                </div>
              )}

              {/* Website Container */}
              {personalInfo?.website && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => window.open(personalInfo.website, '_blank')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuGlobe size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9,
                    textDecoration: 'none'
                  }}>
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </span>
                </div>
              )}

              {/* Age Container */}
              {personalInfo?.age && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuUser size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.age} years
                  </span>
                </div>
              )}

              {/* Timezone Container */}
              {personalInfo?.timezone && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuClock3 size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.timezone}
                  </span>
                </div>
              )}

              {/* Current Role Container */}
              {personalInfo?.current_role && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuBuilding2 size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.current_role}
                  </span>
                </div>
              )}

              {/* Phone Container */}
              {personalInfo?.phone && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => window.open(`tel:${personalInfo.phone}`, '_blank')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuPhone size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.phone}
                  </span>
                </div>
              )}

              {/* Email Container */}
              {personalInfo?.email && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => window.open(`mailto:${personalInfo.email}`, '_blank')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuMail size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: textColor,
                    opacity: 0.9
                  }}>
                    {personalInfo.email}
                  </span>
                </div>
              )}

              {/* Availability Status Container */}
              {personalInfo?.show_availability && personalInfo?.availability_status && (
                <div style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                >
                  {(() => {
                    const statusDisplay = getAvailabilityStatusDisplay(personalInfo.availability_status);
                    const StatusIcon = statusDisplay.icon;
                    return (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: statusDisplay.color,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.9
                        }}>
                          <StatusIcon size={12} style={{ color: 'white' }} />
                        </div>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: textColor,
                          opacity: 0.9
                        }}>
                          {statusDisplay.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bio Container - Full width */}
            {personalInfo?.bio && (
              <div style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                marginTop: '20px' // Increased from 16px to 20px
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    <LuFileText size={12} style={{ color: 'white' }} />
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: textColor,
                    opacity: 0.8,
                    lineHeight: '1.4'
                  }}>
                    {personalInfo.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Other optional fields in glass containers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0px' }}> {/* Reduced to 0px to test */}
              {fieldsToShow.map((field) => {
                if (!personalInfo?.[field] || ['name', 'headline', 'bio', 'location', 'website', 'age', 'availability_status', 'timezone', 'current_role', 'phone', 'email'].includes(field)) return null;
                
                return (
                  <div key={field} style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: needsDarkIconBackground(settings.background_color) 
                      ? '#000000' 
                      : (settings.icon_color || '#374151'),
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8
                    }}>
                      <LuBriefcase size={12} style={{ color: 'white' }} />
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: textColor,
                      opacity: 0.9
                    }}>
                      <span style={{ fontWeight: 500, opacity: 0.7 }}>{FIELD_LABELS[field]}: </span>
                      {personalInfo[field]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Separator line will be moved to PrysmaCard */}
            
          </div>
        )}
      </div>
    </div>
  );
}
