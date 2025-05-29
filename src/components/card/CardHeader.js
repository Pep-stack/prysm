'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik next/image voor avatar
import styles from './CardHeader.module.css'; // Importeer de CSS Module
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';

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

  // Avatar settings uit profiel
  const avatarSize = profile?.avatar_size || 'medium';
  const avatarShape = profile?.avatar_shape || 'circle';
  const avatarPosition = profile?.avatar_position || 'left';

  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  // Debug logging
  console.log('CardHeader Debug:', {
    displayType,
    avatarSize,
    avatarShape,
    avatarPosition,
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

  return (
    <div className={styles.profileSection}>
      {/* Header afbeelding (alleen tonen als display_type = 'header') */}
      {displayType === 'header' && (
        <div className={styles.profileCoverContainer}>
          {profile?.header_url ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
              <div 
                className={styles.profileCoverPlaceholder}
                style={{ display: 'none' }}
              >
                <span className={styles.profileInitials}>
                  {getInitials(profile?.name)}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.profileCoverPlaceholder}>
              <span className={styles.profileInitials}>
                {getInitials(profile?.name)}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Avatar sectie (alleen tonen als display_type = 'avatar') */}
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
              alt={profile?.name || user?.email || 'Profile Avatar'}
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
                {getInitials(profile?.name)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Profiel informatie */}
      <div 
        className={styles.profileInfo}
        style={{ 
          textAlign: displayType === 'avatar' && avatarPosition === 'center' ? 'center' : 
                    displayType === 'avatar' && avatarPosition === 'right' ? 'right' : 'left',
          marginTop: displayType === 'header' ? '20px' : '16px'
        }}
      >
        <h2 className={styles.name} style={{ color: textColor }}>{profile?.name || 'Your Name'}</h2>
        {profile?.headline && (
          <p className={styles.headline} style={{ color: textColor, opacity: 0.8 }}>{profile.headline}</p>
        )}
        {profile?.bio && (
          <p className={styles.bio} style={{ color: textColor, opacity: 0.7 }}>{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
