'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './DesignCustomizationSection.module.css';
import { FaPalette, FaFont, FaEye } from 'react-icons/fa';

const DESIGN_OPTIONS = {
  themes: [
    {
      id: 'soft_pearl',
      name: 'Soft Pearl',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      textColor: '#1e293b',
      preview: '#f1f5f9'
    },
    {
      id: 'midnight_elegance',
      name: 'Midnight Elegance',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      textColor: '#ffffff',
      preview: '#1e293b'
    },
    {
      id: 'azure_professional',
      name: 'Azure Professional',
      background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 25%, #b3e5fc 75%, #0277bd 100%)',
      textColor: '#000000',
      preview: '#0277bd'
    }
  ],
  fonts: [
    { name: 'Inter', value: 'Inter, sans-serif', style: 'Modern & Clean' },
    { name: 'Poppins', value: 'Poppins, sans-serif', style: 'Friendly & Round' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', style: 'Elegant & Classic' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', style: 'Bold & Strong' },
    { name: 'DM Sans', value: 'DM Sans, sans-serif', style: 'Minimal & Sharp' }
  ],
  nameSizes: [
    { label: 'Small', value: 'small', fontSize: '28px' },
    { label: 'Medium', value: 'medium', fontSize: '32px' },
    { label: 'Large', value: 'large', fontSize: '36px' },
    { label: 'Extra Large', value: 'extra-large', fontSize: '40px' }
  ]
};

export default function DesignCustomizationSection() {
  const [selectedTheme, setSelectedTheme] = useState(DESIGN_OPTIONS.themes[0]);
  const [selectedFont, setSelectedFont] = useState(DESIGN_OPTIONS.fonts[0]);
  const [selectedNameSize, setSelectedNameSize] = useState(DESIGN_OPTIONS.nameSizes[1]);

  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.container}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.heading}>
              Make it uniquely yours
            </h2>
            <p className={styles.subheading}>
              Customize every aspect of your profile with professional themes, fonts, and layouts. 
              Your brand, your style, your way.
            </p>
          </div>
          
          <div className={styles.visualContent}>
            {/* Central Hub Layout */}
            <div className={styles.designHub}>
              {/* Central Card Image */}
              <motion.div 
                className={styles.cardImageContainer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src="/images/creative.png"
                  alt="Professional Card Example"
                  className={styles.cardImage}
                />
              </motion.div>

              {/* Design Settings Button - Top Center */}
              <div className={styles.optionGroup} style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}>
                <motion.button
                  className={styles.designSettingsButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <FaPalette size={16} />
                  <span>Design Settings</span>
                </motion.button>
              </div>

              {/* Font Options - Left */}
              <div className={styles.optionGroup} style={{ top: '50%', left: '0', transform: 'translateY(-50%)' }}>
                <span className={styles.optionLabel}>Typography</span>
                <div className={styles.fontOptions}>
                  {DESIGN_OPTIONS.fonts.slice(0, 3).map((font, index) => (
                    <motion.button
                      key={font.name}
                      className={`${styles.fontOption} ${selectedFont.name === font.name ? styles.optionSelected : ''}`}
                      onClick={() => setSelectedFont(font)}
                      whileHover={{ scale: 1.05, x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <span 
                        className={styles.fontName}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </span>
                      <span className={styles.fontStyle}>{font.style}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 3 Themes - Right */}
              <div className={styles.optionGroup} style={{ top: '50%', right: '0', transform: 'translateY(-50%)' }}>
                <span className={styles.optionLabel}>Themes</span>
                <div className={styles.themeOptions}>
                  {DESIGN_OPTIONS.themes.slice(0, 3).map((theme, index) => (
                    <motion.button
                      key={theme.id}
                      className={`${styles.themeOption} ${selectedTheme.id === theme.id ? styles.optionSelected : ''}`}
                      onClick={() => setSelectedTheme(theme)}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div 
                        className={styles.themePreview}
                        style={{ background: theme.preview }}
                      />
                      <span className={styles.themeName}>{theme.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Font Sizes - Bottom */}
              <div className={styles.optionGroup} style={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
                <span className={styles.optionLabel}>Name Sizes</span>
                <div className={styles.sizeOptions}>
                  {DESIGN_OPTIONS.nameSizes.map((size, index) => (
                    <motion.button
                      key={size.value}
                      className={`${styles.sizeOption} ${selectedNameSize.value === size.value ? styles.optionSelected : ''}`}
                      onClick={() => setSelectedNameSize(size)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <span className={styles.sizeName}>{size.label}</span>
                      <span className={styles.sizePreview} style={{ fontSize: `${parseInt(size.fontSize) / 3}px` }}>
                        Aa
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
