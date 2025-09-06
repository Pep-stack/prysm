'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { colors, typography, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function HeroSection() {
  // Define the green highlight color
  const highlightColor = '#00C896';
  
  // Dynamic link builder state
  const [inputName, setInputName] = useState('');
  const [copied, setCopied] = useState(false);

  const formatUrlSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20) || 'yourname';
  };

  const handleNameChange = (e) => {
    setInputName(e.target.value);
  };

  const handleCopy = async () => {
    const url = `https://useprysma.com/${formatUrlSlug(inputName)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Copy failed');
    }
  };

  const generatedUrl = `https://useprysma.com/${formatUrlSlug(inputName)}`;
  
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
        padding: '60px 20px',
        color: colors.darkGrey || '#333',
        background: `
          linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(248, 249, 250, 0.1) 60%, rgba(248, 249, 250, 0.3) 70%, rgba(248, 249, 250, 0.6) 75%, rgba(248, 249, 250, 0.8) 80%, rgba(248, 249, 250, 0.9) 85%, #FFFFFF 90%),
          radial-gradient(ellipse at center bottom, ${highlightColorRgba(0.2)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
          radial-gradient(ellipse at center bottom, ${blackRgba(0.1)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
          #FFFFFF
        `,
        paddingBottom: '100px',
        paddingTop: '80px'
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
         The Professional <span style={{ color: highlightColor }}>Profile</span>{' '}
         <span style={{ color: '#999' }}>for People who</span> <span style={{ color: highlightColor }}>Build</span> and <span style={{ color: highlightColor }}>Create</span>
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

       {/* Interactive Link Builder - Simplified */}
       <motion.div
         style={{ marginBottom: '60px' }}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.6 }}
       >
         {/* Green Link Bar */}
         <motion.div 
           style={{
             display: 'flex',
             alignItems: 'center',
             background: '#f0fdf4',
             border: '2px solid #bbf7d0',
             borderRadius: '50px',
             padding: '6px 8px 6px 20px',
             gap: '12px',
             maxWidth: '500px',
             margin: '0 auto 20px auto',
             boxShadow: '0 4px 20px rgba(0, 200, 150, 0.1)'
           }}
           animate={{ 
             borderColor: inputName ? highlightColor : '#bbf7d0',
             boxShadow: inputName ? '0 4px 25px rgba(0, 200, 150, 0.2)' : '0 4px 20px rgba(0, 200, 150, 0.1)'
           }}
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4 }}
         >
           <span style={{
             fontSize: '0.95rem',
             color: '#059669',
             fontWeight: '500',
             fontFamily: "'Monaco', 'Menlo', monospace"
           }}>
             https://useprysma.com/
           </span>
           
           <motion.input
             type="text"
             value={inputName}
             onChange={handleNameChange}
             placeholder="yourname"
             style={{
               flex: 1,
               border: 'none',
               background: 'transparent',
               fontSize: '0.95rem',
               color: '#059669',
               fontWeight: '500',
               fontFamily: "'Monaco', 'Menlo', monospace",
               outline: 'none',
               minWidth: '120px'
             }}
             whileFocus={{ scale: 1.02 }}
           />

           <motion.button 
             style={{
               width: '36px',
               height: '36px',
               border: 'none',
               borderRadius: '50%',
               background: copied ? '#10b981' : highlightColor,
               color: 'white',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer',
               transition: 'all 0.2s ease',
               flexShrink: 0
             }}
             onClick={handleCopy}
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
           >
             {copied ? (
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
               </svg>
             ) : (
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
               </svg>
             )}
           </motion.button>
         </motion.div>

         {/* Claim Button */}
         <Link href="/signup">
           <motion.button
             style={{
               display: 'inline-flex',
               alignItems: 'center',
               gap: '12px',
               background: inputName ? highlightColor : '#e5e7eb',
               color: inputName ? 'white' : '#9ca3af',
               border: inputName ? `2px solid ${highlightColor}` : '2px solid #e5e7eb',
               borderRadius: '50px',
               padding: '12px 24px',
               fontSize: '16px',
               fontWeight: '600',
               textDecoration: 'none',
               cursor: inputName ? 'pointer' : 'not-allowed',
               transition: 'all 0.3s ease',
               boxShadow: inputName ? '0 4px 20px rgba(0, 200, 150, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
               opacity: inputName ? 1 : 0.6,
               pointerEvents: inputName ? 'auto' : 'none'
             }}
             whileHover={inputName ? { 
               scale: 1.05, 
               filter: 'brightness(1.1)',
               boxShadow: `0 6px 25px ${highlightColorRgba(0.3)}`
             } : {}}
             whileTap={{ scale: 0.95 }}
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
               <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
             </svg>
             <span>Claim Your Link</span>
           </motion.button>
         </Link>
       </motion.div>

       {/* 3D Hero Image with Floating Screens */}
       <motion.div 
         style={{
           marginTop: '60px',
           position: 'relative',
           margin: '60px auto 0 auto',
           width: 'fit-content',
           height: '600px',
           perspective: '1200px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center'
         }}
         initial={{ opacity: 0, y: 40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.8 }}
       >
         {/* Central Profile Card */}
         <motion.div
           style={{
             position: 'relative',
             zIndex: 10,
             borderRadius: '15px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, 3, -3, 0],
             scale: [1, 1.02, 1]
           }}
           transition={{
             duration: 6,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         >
           <Image
             src="/images/profcard.png"
             alt="Professional Profile Card - Alex Carter"
             width={350}
             height={450}
             style={{
               display: 'block',
               borderRadius: '15px',
               boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)'
             }}
           />
         </motion.div>

         {/* Floating Screen 1 - Top Left */}
         <motion.div
           style={{
             position: 'absolute',
             top: '20px',
             left: '-80px',
             zIndex: 5,
             borderRadius: '12px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, -15, 0],
             rotateX: [0, 5, 0],
             y: [0, -10, 0],
             scale: [0.7, 0.75, 0.7]
           }}
           transition={{
             duration: 8,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 0.5
           }}
           initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
           whileInView={{ opacity: 1, scale: 0.7, rotateY: 0 }}
         >
           <Image
             src="/images/screen1.png"
             alt="Screen 1"
             width={200}
             height={250}
             style={{
               display: 'block',
               borderRadius: '12px',
               boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
             }}
           />
         </motion.div>

         {/* Floating Screen 2 - Top Right */}
         <motion.div
           style={{
             position: 'absolute',
             top: '40px',
             right: '-100px',
             zIndex: 4,
             borderRadius: '12px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, 20, 0],
             rotateX: [0, -8, 0],
             y: [0, 15, 0],
             scale: [0.6, 0.65, 0.6]
           }}
           transition={{
             duration: 7,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 1
           }}
           initial={{ opacity: 0, scale: 0.4, rotateY: 40 }}
           whileInView={{ opacity: 1, scale: 0.6, rotateY: 0 }}
         >
           <Image
             src="/images/screen2.png"
             alt="Screen 2"
             width={180}
             height={220}
             style={{
               display: 'block',
               borderRadius: '12px',
               boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)'
             }}
           />
         </motion.div>

         {/* Floating Screen 3 - Bottom Left */}
         <motion.div
           style={{
             position: 'absolute',
             bottom: '60px',
             left: '-60px',
             zIndex: 6,
             borderRadius: '12px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, -10, 0],
             rotateX: [0, 10, 0],
             y: [0, -20, 0],
             scale: [0.65, 0.7, 0.65]
           }}
           transition={{
             duration: 9,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 1.5
           }}
           initial={{ opacity: 0, scale: 0.5, rotateY: -25 }}
           whileInView={{ opacity: 1, scale: 0.65, rotateY: 0 }}
         >
           <Image
             src="/images/screen3.png"
             alt="Screen 3"
             width={190}
             height={240}
             style={{
               display: 'block',
               borderRadius: '12px',
               boxShadow: '0 18px 45px rgba(0, 0, 0, 0.16)'
             }}
           />
         </motion.div>

         {/* Floating Screen 4 - Bottom Right */}
         <motion.div
           style={{
             position: 'absolute',
             bottom: '20px',
             right: '-70px',
             zIndex: 3,
             borderRadius: '12px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, 25, 0],
             rotateX: [0, -5, 0],
             y: [0, 10, 0],
             scale: [0.55, 0.6, 0.55]
           }}
           transition={{
             duration: 10,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 2
           }}
           initial={{ opacity: 0, scale: 0.4, rotateY: 35 }}
           whileInView={{ opacity: 1, scale: 0.55, rotateY: 0 }}
         >
           <Image
             src="/images/screen4.png"
             alt="Screen 4"
             width={170}
             height={210}
             style={{
               display: 'block',
               borderRadius: '12px',
               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.14)'
             }}
           />
         </motion.div>

         {/* Floating Screen 5 - Center Back */}
         <motion.div
           style={{
             position: 'absolute',
             top: '100px',
             right: '20px',
             zIndex: 2,
             borderRadius: '12px',
             overflow: 'hidden'
           }}
           animate={{
             rotateY: [0, 15, 0],
             rotateX: [0, 8, 0],
             y: [0, -25, 0],
             scale: [0.5, 0.55, 0.5]
           }}
           transition={{
             duration: 11,
             repeat: Infinity,
             ease: "easeInOut",
             delay: 2.5
           }}
           initial={{ opacity: 0, scale: 0.3, rotateY: 30 }}
           whileInView={{ opacity: 1, scale: 0.5, rotateY: 0 }}
         >
           <Image
             src="/images/screen5.png"
             alt="Screen 5"
             width={160}
             height={200}
             style={{
               display: 'block',
               borderRadius: '12px',
               boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
             }}
           />
         </motion.div>
       </motion.div>
     </motion.div>
   </section>
  );
}; 