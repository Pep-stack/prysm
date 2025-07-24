'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik next/image voor avatar
import styles from './CardHeader.module.css'; // Importeer de CSS Module
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import { LuBriefcase, LuMapPin, LuGlobe, LuFileText } from 'react-icons/lu';

// Helper functie voor initialen
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
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

  // Avatar grootte bepalen
  const getAvatarSize = (size) => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 120;
      default: return 80; // medium
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
  const avatarBorderRadius = getAvatarBorderRadius(avatarShape);
  const avatarJustification = getAvatarJustification(avatarPosition);

  // Mapping voor personal info per card type
  // Geen secties die als losse section op de card kunnen verschijnen
  const PERSONAL_INFO_FIELDS = {
    pro: ['name', 'headline', 'bio', 'location', 'website'],
    career: ['name', 'headline', 'bio', 'location', 'desired_role'],
    business: ['name', 'headline', 'bio', 'industry', 'location', 'website', 'company_size'],
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
    name: cardType === 'business' ? 'Bedrijfsnaam' : 'Naam',
    headline: cardType === 'business' ? 'Tagline' : 'Headline',
    bio: 'Bio',
    location: 'Locatie',
    website: 'Website',
    desired_role: 'Gewenste functie',
    industry: 'Branche',
    company_size: 'Bedrijfsomvang',
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
        {displayType === 'avatar' && (
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
                width={320}
                height={320}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: 24,
                  width: '320px',
                  height: '320px',
                  display: 'block',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
            ) : (
              <div 
                style={{
                  width: '320px',
                  height: '320px',
                  borderRadius: 24,
                  fontSize: '128px',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  boxShadow: 'none',
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
              marginTop: displayType === 'header' ? '20px' : '16px'
            }}
          >
            {/* Name - stays the same */}
            {personalInfo?.name && (
              <h2 className={styles.name} style={{ color: textColor, marginBottom: '20px' }}>
                {personalInfo.name}
              </h2>
            )}

            {/* Glass containers for other fields */}
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '12px'
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
                    backgroundColor: textColor,
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
                    backgroundColor: textColor,
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
                    backgroundColor: textColor,
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
                marginTop: '8px'
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
                    backgroundColor: textColor,
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {fieldsToShow.map((field) => {
                if (!personalInfo?.[field] || ['name', 'headline', 'bio', 'location', 'website'].includes(field)) return null;
                
                return (
                  <div key={field} style={{
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
                      backgroundColor: textColor,
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
          </div>
        )}
      </div>
    </div>
  );
}
