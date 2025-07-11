'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik next/image voor avatar
import styles from './CardHeader.module.css'; // Importeer de CSS Module
import { useDesignSettings } from '../dashboard/DesignSettingsContext';

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

  // Display type from profile (header or avatar)
  const displayType = profile?.display_type || 'avatar';

  // Context detection for header width behavior
  // We force contained mode for all views to ensure the header image aligns exactly with card edges
  const shouldUseFullWidth = false;

  // Avatar settings uit profiel
  const avatarSize = profile?.avatar_size || 'medium';
  const avatarShape = profile?.avatar_shape || 'circle';
  const avatarPosition = profile?.avatar_position || 'left';

  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  // Get card background color from design settings (fallback op wit)
  const cardBgColor = settings.background_color || '#fff';

  // Debug logging
  console.log('CardHeader Debug:', {
    displayType,
    shouldUseFullWidth,
    isPublicView,
    header_url: profile?.header_url,
    avatar_url: profile?.avatar_url,
    textColor
  });

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

  // Card type bepalen
  const cardType = profile?.card_type || 'pro';
  // Haal de juiste personal info uit de card_profiles JSON
  const cardProfiles = profile?.card_profiles || {};
  const personalInfo = cardProfiles[cardType] || {};

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
          {profile?.header_url ? (
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              <Image
                src={profile.header_url}
                alt="Profile Header"
                fill
                className={styles.profileCoverImage}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Header image failed to load:', profile.header_url);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Overlay direct ná de afbeelding, zodat deze altijd bovenop ligt */}
              <div 
                className={styles.headerGradientOverlay}
                style={{ '--card-bg-color': cardBgColor }}
              ></div>
              {(() => { console.log('[CardHeader overlay]', { displayType, header_url: profile?.header_url, cardBgColor, isPublicView }); return null; })()}
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
            <div className={styles.profileCoverPlaceholder}>
              <span className={styles.profileInitials}>
                {getInitials(personalInfo?.name)}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Avatar + profile info wrapper (ensures padding does not affect header image) */}
      <div className={styles.avatarRow}>
        {displayType === 'avatar' && (
          <div 
            className={styles.avatarContainer}
            style={{ 
              justifyContent: avatarJustification,
              marginTop: '0px',
              display: 'flex',
              width: '100%'
            }}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={personalInfo?.name || user?.email || 'Profile Avatar'}
                width={avatarSizePx}
                height={avatarSizePx}
                className={styles.avatar}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: avatarBorderRadius,
                  width: `${avatarSizePx}px`,
                  height: `${avatarSizePx}px`,
                  flexShrink: 0
                }}
              />
            ) : (
              <div 
                className={styles.avatarPlaceholder}
                style={{
                  width: `${avatarSizePx}px`,
                  height: `${avatarSizePx}px`,
                  borderRadius: avatarBorderRadius,
                  fontSize: `${avatarSizePx * 0.4}px`,
                  flexShrink: 0
                }}
              >
                <span className={styles.avatarInitials}>
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
            {fieldsToShow.map((field) => {
              if (!personalInfo?.[field]) return null;
              if (field === 'name') {
                return (
                  <h2 key={field} className={styles.name} style={{ color: textColor }}>{personalInfo.name}</h2>
                );
              }
              if (field === 'headline') {
                return (
                  <p key={field} className={styles.headline} style={{ color: textColor, opacity: 0.8 }}>{personalInfo.headline}</p>
                );
              }
              if (field === 'bio') {
                return (
                  <p key={field} className={styles.bio} style={{ color: textColor, opacity: 0.7 }}>{personalInfo.bio}</p>
                );
              }
              // Optionele velden met label
              return (
                <p key={field} className={styles[field] || styles.bio} style={{ color: textColor, opacity: 0.7 }}>
                  <span style={{ fontWeight: 500 }}>{FIELD_LABELS[field]}: </span>{personalInfo[field]}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
