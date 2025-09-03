'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { colors, typography, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function HeroSection() {
  // Define the green highlight color
  const highlightColor = '#00C896';
  
  // Announcement badge style
  const announcementBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e2e8f0',
    borderRadius: '50px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    textDecoration: 'none',
    marginBottom: '40px',
    transition: 'all 0.2s ease',
  };

  // Primary CTA button style (Prysma green)
  const primaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: highlightColor,
    color: '#ffffff',
    borderRadius: '50px',
    padding: '12px 24px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const highlightColorRgba = (alpha) => `rgba(0, 200, 150, ${alpha})`;
  const blackRgba = (alpha) => `rgba(0, 0, 0, ${alpha})`;

  return (
    <section style={{
        ...commonStyles.sectionPadding,
        color: colors.darkGrey || '#333',
        background: `
          linear-gradient(to bottom, transparent 0%, transparent 85%, rgba(248, 249, 250, 0.3) 95%, rgba(248, 249, 250, 0.8) 100%),
          radial-gradient(ellipse at center bottom, ${highlightColorRgba(0.2)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
          radial-gradient(ellipse at center bottom, ${blackRgba(0.1)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
          ${colors.white}
        `,
        paddingBottom: '100px',
        paddingTop: '80px',
     }}>
     <motion.div
       style={commonStyles.container}
       className="text-center"
       initial="initial"
       animate="animate"
       variants={fadeInUp}
       transition={{ duration: 0.6 }}
     >
       {/* Announcement Badge */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.1 }}
       >
         <Link href="#features" style={announcementBadgeStyle}>
           <Image
             src="/images/prysma-icon.png"
             alt="Prysma Icon"
             width={40}
             height={40}
             style={{ flexShrink: 0 }}
           />
           <span>NEW: Enhanced Profile Builder</span>
           <span style={{ fontSize: '12px' }}>→</span>
         </Link>
       </motion.div>

       {/* Main Headline */}
       <motion.h1 
         style={{
           fontFamily: "'Inter', sans-serif",
           fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
           fontWeight: '700',
           lineHeight: '1.1',
           marginBottom: '24px',
           color: '#000',
         }}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.2 }}
       >
         The professional <span style={{ color: highlightColor }}>profile</span>{' '}
         <span style={{ color: '#999' }}>for people who</span> <span style={{ color: highlightColor }}>build</span> and <span style={{ color: highlightColor }}>create</span>
       </motion.h1>

       {/* Subheadline */}
       <motion.p 
         style={{
           fontFamily: "'Inter', sans-serif",
           fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
           fontWeight: '700',
           color: '#666',
           maxWidth: '600px',
           margin: '0 auto 40px auto',
           lineHeight: '1.5',
         }}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.4 }}
       >
         Prysma takes your work, skills, and projects and makes them awesome
       </motion.p>

       {/* CTA Button */}
       <motion.div
         style={{ marginBottom: '60px' }}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.6 }}
       >
         <Link href="/signup">
           <motion.button
             style={primaryButtonStyle}
             whileHover={{ 
               scale: 1.05, 
               filter: 'brightness(1.1)',
               boxShadow: `0 8px 25px ${highlightColorRgba(0.3)}`
             }}
             whileTap={{ scale: 0.95 }}
           >
             <span>🔗</span>
             <span>Claim Your Link</span>
           </motion.button>
         </Link>
       </motion.div>

       {/* Product Image */}
       <motion.div 
         style={{
           marginTop: '20px',
           borderRadius: '12px',
           position: 'relative',
           margin: '20px auto 0 auto',
           width: 'fit-content',
         }}
         initial={{ opacity: 0, y: 40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.8 }}
       >
         <Image
           src="/images/Prysma mock up.png"
           alt="Prysma App Mockup"
           width={450}
           height={300}
           style={{
             display: 'block',
             maxWidth: '100%',
             height: 'auto',
             borderRadius: '12px',
             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
           }}
         />
       </motion.div>
     </motion.div>
   </section>
  );
}; 