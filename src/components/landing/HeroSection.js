'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { colors, typography, commonStyles, fadeInUp } from '../../lib/landingStyles';
import DynamicBranches from './DynamicBranches';

export default function HeroSection() {
  // Define the green highlight color
  const highlightColor = '#00C896';
  
  // Dynamic link builder state
  const [inputName, setInputName] = useState('');
  const [copied, setCopied] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const [isChecking, setIsChecking] = useState(false);

  const formatUrlSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20) || 'yourname';
  };

  // Check availability function
  const checkAvailability = async (name) => {
    if (!name || name.length < 2) {
      setAvailabilityStatus(null);
      return;
    }

    setIsChecking(true);
    setAvailabilityStatus('checking');

    try {
      console.log('Checking availability for:', name);
      const response = await fetch(`/api/check-availability?name=${encodeURIComponent(name)}`);
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      setAvailabilityStatus(data.available ? 'available' : 'taken');
    } catch (error) {
      console.error('Availability check failed:', error);
      // Don't simulate random availability - show error state instead
      setAvailabilityStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  // Debounced availability check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputName) {
        checkAvailability(formatUrlSlug(inputName));
      } else {
        setAvailabilityStatus(null);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [inputName]);

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
        paddingBottom: '20px',
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

       {/* Main Headline 
       
       ALTERNATIVE HEADLINES FOR A/B TESTING:
       
       Option A: "Stop Losing Clients to a Bad First Impression"
       
       Option B (Current): "Turn Your Skills Into a Client Magnet"
       
       Option C: "Your Portfolio Is Costing You Clients"
       
       Option D: "Why 73% of Freelancers Lose Clients in the First 10 Seconds"
       
       ALTERNATIVE SUBHEADLINES:
       
       Option A: "Create a professional profile that converts visitors into paying clients in under 5 minutes. No design skills needed."
       
       Option B (Current): "Build a stunning professional profile that gets you hired faster. Takes 5 minutes, works 24/7."
       
       Option C: "Stop sending clients to your messy LinkedIn. Create a conversion-focused profile that actually sells your services."
       
       Option D: "The professional profile that turns your skills into a steady stream of high-paying clients."
       
       */}
       
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
         Turn Your <span style={{ color: highlightColor }}>Skills</span>{' '}
         <span style={{ color: '#999' }}>Into a</span> <span style={{ color: highlightColor }}>Client Magnet</span>
       </motion.h1>

       {/* Subheadline */}
       <motion.p 
         style={{
           fontFamily: "'Inter', sans-serif",
           fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
           fontWeight: '700',
           color: '#666',
           maxWidth: '650px',
           margin: '0 auto 40px auto',
           lineHeight: '1.5',
         }}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.4 }}
       >
         Build a stunning professional profile that gets you hired faster. Takes 5 minutes, works 24/7.
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
             background: availabilityStatus === 'available' ? '#f0fdf4' : 
                        availabilityStatus === 'taken' ? '#fef2f2' : 
                        availabilityStatus === 'error' ? '#fef3c7' : '#f0fdf4',
             border: availabilityStatus === 'available' ? '2px solid #bbf7d0' :
                    availabilityStatus === 'taken' ? '2px solid #fecaca' :
                    availabilityStatus === 'error' ? '2px solid #fde68a' : '2px solid #bbf7d0',
             borderRadius: '50px',
             padding: '6px 8px 6px 20px',
             gap: '12px',
             maxWidth: '500px',
             margin: '0 auto 20px auto',
             boxShadow: availabilityStatus === 'available' ? '0 4px 25px rgba(0, 200, 150, 0.2)' :
                       availabilityStatus === 'taken' ? '0 4px 25px rgba(239, 68, 68, 0.2)' :
                       availabilityStatus === 'error' ? '0 4px 25px rgba(245, 158, 11, 0.2)' : '0 4px 20px rgba(0, 200, 150, 0.1)'
           }}
           animate={{ 
             borderColor: inputName ? (availabilityStatus === 'available' ? highlightColor : 
                                     availabilityStatus === 'taken' ? '#ef4444' :
                                     availabilityStatus === 'error' ? '#f59e0b' : highlightColor) : '#bbf7d0',
             boxShadow: inputName ? (availabilityStatus === 'available' ? '0 4px 25px rgba(0, 200, 150, 0.2)' :
                                   availabilityStatus === 'taken' ? '0 4px 25px rgba(239, 68, 68, 0.2)' :
                                   availabilityStatus === 'error' ? '0 4px 25px rgba(245, 158, 11, 0.2)' : '0 4px 25px rgba(0, 200, 150, 0.2)') : '0 4px 20px rgba(0, 200, 150, 0.1)'
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
               color: availabilityStatus === 'taken' ? '#dc2626' : '#059669',
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
               background: inputName && availabilityStatus === 'available' ? highlightColor : 
                         inputName && availabilityStatus === 'taken' ? '#ef4444' :
                         inputName && availabilityStatus === 'error' ? '#f59e0b' :
                         inputName ? '#6b7280' : '#e5e7eb',
               color: inputName ? 'white' : '#9ca3af',
               border: inputName && availabilityStatus === 'available' ? `2px solid ${highlightColor}` :
                      inputName && availabilityStatus === 'taken' ? '2px solid #ef4444' :
                      inputName && availabilityStatus === 'error' ? '2px solid #f59e0b' :
                      inputName ? '2px solid #6b7280' : '2px solid #e5e7eb',
               borderRadius: '50px',
               padding: '12px 24px',
               fontSize: '16px',
               fontWeight: '600',
               textDecoration: 'none',
               cursor: inputName && availabilityStatus === 'available' ? 'pointer' : 'not-allowed',
               transition: 'all 0.3s ease',
               boxShadow: inputName && availabilityStatus === 'available' ? '0 4px 20px rgba(0, 200, 150, 0.2)' :
                         inputName && availabilityStatus === 'taken' ? '0 4px 20px rgba(239, 68, 68, 0.2)' :
                         inputName && availabilityStatus === 'error' ? '0 4px 20px rgba(245, 158, 11, 0.2)' :
                         inputName ? '0 4px 20px rgba(107, 114, 128, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
               opacity: inputName ? 1 : 0.6,
               pointerEvents: inputName && availabilityStatus === 'available' ? 'auto' : 'none'
             }}
             whileHover={inputName && availabilityStatus === 'available' ? { 
               scale: 1.05, 
               filter: 'brightness(1.1)',
               boxShadow: `0 6px 25px ${highlightColorRgba(0.3)}`
             } : {}}
             whileTap={{ scale: 0.95 }}
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
               <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
             </svg>
             <span>
               {availabilityStatus === 'available' ? 'Get Your Professional Link' :
                availabilityStatus === 'taken' ? 'Choose a Different Name' :
                availabilityStatus === 'error' ? 'Check Failed - Try Again' :
                isChecking ? 'Checking Availability...' :
                'Get Your Professional Link'}
             </span>
           </motion.button>
         </Link>
       </motion.div>

      {/* Dynamic Branches Visualization */}
      <motion.div 
        style={{
          marginTop: 'clamp(40px, 8vw, 60px)',
          position: 'relative',
          margin: 'clamp(40px, 8vw, 60px) auto 0 auto',
          width: '100%',
          maxWidth: '1000px',
          height: 'clamp(300px, 50vw, 600px)',
          minHeight: '250px'
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <DynamicBranches />
      </motion.div>
     </motion.div>
   </section>
  );
}; 