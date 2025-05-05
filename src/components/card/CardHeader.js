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

  return (
    <div> {/* Wrapper div */}
      {/* Header Afbeelding */}
      <div
        className={styles.headerImage}
        style={headerImageStyle} // Pas dynamische achtergrond toe
      ></div>

      {/* Header Content (Avatar, Naam, Headline) */}
      <div className={styles.headerContent} style={headerContentStyle}>
        {/* Avatar Container */}
        <div
          className={styles.avatarContainer}
          title={profile?.name || 'Profile Picture'}
        >
          {profile?.avatar_url ? (
            // Gebruik next/image voor optimalisatie
            <Image
              src={profile.avatar_url}
              alt={profile?.name || user?.email || 'Profile Avatar'}
              width={80} // Exacte grootte specificeren
              height={80} // Exacte grootte specificeren
              className={styles.avatarImage} // Gebruik class voor object-fit etc.
            />
          ) : (
            <span>{getInitials(profile?.name)}</span>
          )}
        </div>

        {/* Naam en Headline */}
        <div className={styles.nameHeadlineContainer}>
          <h2 className={styles.name}>{profile?.name || 'Your Name'}</h2>
          <p className={styles.headline}>{profile?.headline || 'Add a headline'}</p>
        </div>
      </div>
    </div>
  );
} 