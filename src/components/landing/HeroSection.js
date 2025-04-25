'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { colors, typography, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function HeroSection() {
  return (
   <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}>
    <motion.div 
      style={commonStyles.container} 
      className="text-center" // Use className for Tailwind centering
      initial="initial" 
      animate="animate" 
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      {/* Optional Badge */} 
      <span style={{ display: 'inline-block', background: colors.lightGrey, color: colors.darkGrey, padding: '5px 10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>
        Built by creators, for professionals.
      </span>
      <h1 style={commonStyles.h1}>Your career. One clear link.</h1>
      <p style={{...commonStyles.subheadline, maxWidth: '700px', margin: '0 auto 30px auto'}}> {/* Centered subheadline */} 
          Prysma helps you build a digital card that puts your best work, projects, and socials in one professional place.
      </p>
      <Link href="/signup">
        <motion.button 
          style={{...commonStyles.button, ...commonStyles.primaryButton}}
          className="hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105" // Use Tailwind classes for hover/transition/transform
          whileHover={{ scale: 1.05 }} // Keep framer motion for simplicity here
          whileTap={{ scale: 0.95 }}
        >
          Start Now
        </motion.button>
      </Link>
       {/* Placeholder for visual - maybe add later */}
       <div style={{...commonStyles.splitVisual, height: 'auto', minHeight: '300px', marginTop: '50px', background: colors.lightGrey }}>
         [App Mockup Placeholder - Digital Card]
       </div>
    </motion.div>
  </section>
  );
}; 