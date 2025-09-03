'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';
import styles from './FeaturesSection.module.css';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaRedditAlien, FaSnapchatGhost, FaFacebook, FaDribbble, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FaXTwitter, FaSpotify } from 'react-icons/fa6';

// Social media platforms that Prysma integrates with (using React Icons)
const socialPlatforms = [
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0077B5' },
  { name: 'GitHub', icon: FaGithub, color: '#333' },
  { name: 'X', icon: FaXTwitter, color: '#000' },
  { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { name: 'Spotify', icon: FaSpotify, color: '#1DB954' },
  { name: 'TikTok', icon: FaTiktok, color: '#000' },
  { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { name: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
  { name: 'Snapchat', icon: FaSnapchatGhost, color: '#FFFC00' },
  { name: 'Reddit', icon: FaRedditAlien, color: '#FF4500' },
];

// Helper component voor een enkele carousel rij
const LogoCarouselRow = ({ logos, uniqueKeyPrefix, reverse = false }) => {
  const doubledLogos = [...logos, ...logos];
  const trackClassName = reverse ? styles.logoTrackReverse : styles.logoTrack;

  return (
    <div className={styles.logoCarouselContainer}>
      <div className={trackClassName}>
        {doubledLogos.map((platform, index) => {
          const IconComponent = platform.icon;
          return (
            <div key={`${uniqueKeyPrefix}-${platform.name}-${index}`} className={styles.logoItem}>
              <IconComponent 
                className={styles.socialIcon}
                style={{ 
                  color: '#000 !important',
                  fontSize: '48px !important',
                  opacity: '0.6 !important',
                  fill: '#000 !important'
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  return (
   <section id="features" style={{
     ...commonStyles.sectionPadding, 
     background: `
       linear-gradient(to bottom, rgba(248, 249, 250, 0.8) 0%, rgba(248, 249, 250, 0.3) 15%, transparent 25%),
       ${colors.white}
     `,
     paddingTop: '80px',
     paddingBottom: '80px'
   }}>
      {/* Trusted by text */}
      <motion.div
        style={{...commonStyles.container, textAlign: 'center', marginBottom: '50px'}}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '700',
          color: '#000',
          marginBottom: '0',
          lineHeight: '1.2'
        }}>
          Integrate Your Favourite Platforms
        </h2>
      </motion.div>

      {/* Eerste Carousel Rij */}
      <LogoCarouselRow logos={socialPlatforms} uniqueKeyPrefix="row1" />

      {/* Tweede Carousel Rij */}
      <LogoCarouselRow logos={socialPlatforms} uniqueKeyPrefix="row2" reverse={true} />

    </section>
  );
}; 