'use client';

import React from 'react';
import Image from 'next/image'; // Gebruik Next.js Image
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';
import styles from './FeaturesSection.module.css'; // Importeer de CSS Module

// Definieer je logo's
const supportedLogos = [
  { name: 'youtube', src: '/images/logo/youtube.png' },
  { name: 'GitHub', src: '/images/logo/github.png' },
  { name: 'X', src: '/images/logo/x.png' },
  { name: 'Dribbble', src: '/images/logo/dribbble.png' },
  { name: 'youtube', src: '/images/logo/youtube.png' },
  { name: 'shopify', src: '/images/logo/shopify.png' },
  { name: 'Spotify', src: '/images/logo/spotify.png' },
  { name: 'applepodcast', src: '/images/logo/applepodcast.png' },
  { name: 'tiktok', src: '/images/logo/tiktok.png' },
  { name: 'linkdin', src: '/images/logo/linkdin.png' },
  { name: 'soundcloud', src: '/images/logo/soundcloud.png' },
  { name: 'facebook', src: '/images/logo/facebook.png' },
  { name: 'instagram', src: '/images/logo/instagram.png' },
  { name: 'Spotify', src: '/images/logo/spotify.png' },
  // Voeg meer logo's toe als nodig
];

// Helper component voor een enkele carousel rij
const LogoCarouselRow = ({ logos, uniqueKeyPrefix, reverse = false }) => {
  const doubledLogos = [...logos, ...logos];
  const trackClassName = reverse ? styles.logoTrackReverse : styles.logoTrack;

  return (
    <div className={styles.logoCarouselContainer}>
      <div className={trackClassName}>
        {doubledLogos.map((logo, index) => (
          <div key={`${uniqueKeyPrefix}-${logo.name}-${index}`} className={styles.logoItem}>
            <Image
              src={logo.src}
              alt={`${logo.name} logo`}
              width={140} // Indicatieve breedte aangepast
              height={80} // <<<<<< Aangepast aan de nieuwe CSS hoogte (80px)
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  // Je kunt hier eventueel twee verschillende lijsten met logo's maken
  // const topRowLogos = [...];
  // const bottomRowLogos = [...];

  return (
   <section id="features" style={{...commonStyles.sectionPadding, backgroundColor: colors.white }}>
      {/* Optioneel: Fade-in voor de sectie titel */}
      <motion.div
        style={{...commonStyles.container, textAlign: 'center', marginBottom: '30px'}}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
         {/* Pas de titel aan of verwijder deze */}
        <h2 style={commonStyles.h2}>Integrate Your Favourite Platforms</h2>
      </motion.div>

      {/* Eerste Carousel Rij */}
      <LogoCarouselRow logos={supportedLogos} uniqueKeyPrefix="row1" />

      {/* Tweede Carousel Rij */}
      <LogoCarouselRow logos={supportedLogos} uniqueKeyPrefix="row2" reverse={true} />

      {/* Je kunt hieronder meer inhoud toevoegen indien nodig */}

    </section>
  );
}; 