'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './CreatorStorySection.module.css';

export default function CreatorStorySection() {
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
        {/* Logo */}
        <motion.div 
          className={styles.logoContainer}
          variants={fadeInUp}
        >
          <Image
            src="/images/logo.png"
            alt="Prysma Logo"
            width={120}
            height={40}
            className={styles.logo}
          />
        </motion.div>

        {/* Heading */}
        <motion.h2 
          className={styles.heading}
          variants={fadeInUp}
        >
          Why I Built Prysma
        </motion.h2>

        {/* Story */}
        <motion.p 
          className={styles.paragraph}
          variants={fadeInUp}
        >
          Prysma was born from a simple insight: in a world full of noise, professionals need clarity. As a founder, I kept seeing how hard it was for ambitious individuals to present themselves online without relying on scattered tools or generic platforms. So I built Prysma — a smart, streamlined hub where your digital presence actually works for you.
        </motion.p>

        {/* Follow Button */}
        <motion.a
          href="https://x.com/useprysma"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.followButton}
          variants={fadeInUp}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Follow the build on</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.xIcon}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </motion.a>
      </div>
    </motion.div>
  </section>
 );
}; 