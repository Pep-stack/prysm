'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik next/image voor avatar
import styles from './CardHeader.module.css'; // Importeer de CSS Module

// Helper functie voor initialen (kan ook globaal zijn)
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export default function CardHeader({ profile, user, isPublicView = false }) {

  // Definieer de hoogte voor de berekening en inline stijl
  const headerImageHeight = 120; // in pixels
  const headerOverlap = headerImageHeight / 2;

  // Bepaal de achtergrondstijl voor de header afbeelding
  const headerImageStyle = {
    backgroundImage: profile?.header_url ? `url(${profile.header_url})` : 'none',
  };

  // Bepaal de inline stijl voor de overlap berekening
  const headerContentStyle = {
    '--header-overlap': `${headerOverlap}px`, // CSS variabele voor margin-top calc()
  };

  // Avatar settings uit profiel
  const avatarSize = profile?.avatar_size || 'medium';
  const avatarPosition = profile?.avatar_position || 'left';
  const avatarShape = profile?.avatar_shape || 'circle';

  // Grootte bepalen
  const avatarSizePx = avatarSize === 'small' ? 48 : avatarSize === 'large' ? 120 : 80;
  // Vorm bepalen
  const avatarBorderRadius =
    avatarShape === 'circle' ? '50%'
    : avatarShape === 'rounded' ? '16px'
    : '0px';
  // Horizontale positionering
  let avatarJustify = 'flex-start';
  if (avatarPosition === 'center') avatarJustify = 'center';
  if (avatarPosition === 'right') avatarJustify = 'flex-end';

  // Inline style voor avatar container
  const avatarContainerStyle = {
    width: avatarSizePx,
    height: avatarSizePx,
    borderRadius: avatarBorderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#f0f0f0',
    border: '4px solid white',
    overflow: 'hidden',
    marginRight: avatarPosition === 'left' ? 15 : 0,
    marginLeft: avatarPosition === 'right' ? 15 : 0,
  };

  // Wrapper voor horizontale positionering
  const avatarRowStyle = {
    display: 'flex',
    justifyContent: avatarJustify,
    alignItems: 'flex-end',
    width: '100%',
  };

  // Wrapper voor avatar + naam/ headline verticaal
  const avatarColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  };

  return (
    <div> {/* Wrapper div zonder padding */}
      {/* Header Afbeelding */}
      <div
        className={styles.headerImage}
        style={headerImageStyle} // Pas dynamische achtergrond toe
      ></div>

      {/* Header Content (Avatar, Naam, Headline) */}
      <div className={styles.headerContent} style={headerContentStyle}>
        <div style={avatarRowStyle}>
          <div style={avatarColumnStyle}>
            <div
              style={avatarContainerStyle}
              title={profile?.name || 'Profile Picture'}
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile?.name || user?.email || 'Profile Avatar'}
                  width={avatarSizePx}
                  height={avatarSizePx}
                  style={{ width: avatarSizePx, height: avatarSizePx, borderRadius: avatarBorderRadius, objectFit: 'cover' }}
                />
              ) : (
                <span>{getInitials(profile?.name)}</span>
              )}
            </div>
            {/* Naam en Headline altijd onder de avatar */}
            <div className={styles.nameHeadlineContainer} style={{ textAlign: 'center', marginTop: 8 }}>
              <h2 className={styles.name}>{profile?.name || 'Your Name'}</h2>
              {profile?.headline && (
                <p className={styles.headline}>{profile.headline}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 