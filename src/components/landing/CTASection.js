'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './CTASection.module.css';

export default function CTASection() {
  const [inputName, setInputName] = useState('');
  const [copied, setCopied] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const highlightColor = '#00C896';
  const highlightColorRgba = (alpha) => `rgba(0, 200, 150, ${alpha})`;

  const formatUrlSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '')
      .replace(/-+/g, '')
      .substring(0, 30);
  };

  const handleNameChange = (e) => {
    setInputName(e.target.value);
  };

  // Availability check function
  const checkAvailability = async (name) => {
    if (!name || name.length < 2) {
      setAvailabilityStatus(null);
      return;
    }

    setIsChecking(true);
    setAvailabilityStatus('checking');

    try {
      const formattedName = formatUrlSlug(name);
      console.log('CTA: Checking availability for:', formattedName);
      
      const response = await fetch(`/api/check-availability?name=${encodeURIComponent(formattedName)}`);
      console.log('CTA: API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('CTA: API response data:', data);
        setAvailabilityStatus(data.available ? 'available' : 'taken');
      } else {
        console.error('CTA: API error:', response.status);
        setAvailabilityStatus('error');
      }
    } catch (error) {
      console.error('CTA: Check availability error:', error);
      setAvailabilityStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  // Debounced availability check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputName) {
        checkAvailability(inputName);
      } else {
        setAvailabilityStatus(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputName]);

  const handleCopy = async () => {
    const slug = formatUrlSlug(inputName);
    if (slug) {
      const url = `https://useprysma.com/${slug}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const generatedUrl = inputName ? `https://useprysma.com/${formatUrlSlug(inputName)}` : 'https://useprysma.com/yourname';

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
          {/* Green Link Bar */}
          <motion.div 
            className={styles.linkDisplayContainer}
            variants={fadeInUp}
          >
            <motion.div 
              className={styles.greenLinkBar}
              style={{
                background: availabilityStatus === 'available' ? '#f0fdf4' : 
                           availabilityStatus === 'taken' ? '#fef2f2' : 
                           availabilityStatus === 'error' ? '#fef3c7' : 
                           inputName ? '#f0fdf4' : 'linear-gradient(135deg, #bbf7d0 0%, #a7f3d0 100%)',
                borderColor: availabilityStatus === 'available' ? '#10b981' : 
                            availabilityStatus === 'taken' ? '#ef4444' : 
                            availabilityStatus === 'error' ? '#f59e0b' : 
                            inputName ? '#00C896' : '#86efac',
                boxShadow: availabilityStatus === 'available' ? '0 8px 32px rgba(16, 185, 129, 0.2)' : 
                          availabilityStatus === 'taken' ? '0 8px 32px rgba(239, 68, 68, 0.2)' : 
                          availabilityStatus === 'error' ? '0 8px 32px rgba(245, 158, 11, 0.2)' : 
                          inputName ? '0 8px 32px rgba(0, 200, 150, 0.4)' : '0 8px 32px rgba(134, 239, 172, 0.3)'
              }}
              whileHover={{ 
                borderColor: availabilityStatus === 'available' ? '#059669' : 
                            availabilityStatus === 'taken' ? '#dc2626' : 
                            availabilityStatus === 'error' ? '#d97706' : '#00C896',
                boxShadow: availabilityStatus === 'available' ? '0 8px 32px rgba(5, 150, 105, 0.3)' : 
                          availabilityStatus === 'taken' ? '0 8px 32px rgba(220, 38, 38, 0.3)' : 
                          availabilityStatus === 'error' ? '0 8px 32px rgba(217, 119, 6, 0.3)' : 
                          '0 8px 32px rgba(0, 200, 150, 0.4)'
              }}
            >
              <span className={styles.fullUrl}>https://useprysma.com/</span>
              <motion.input
                type="text"
                placeholder="yourname"
                value={inputName}
                onChange={handleNameChange}
                className={styles.nameInput}
                style={{
                  color: availabilityStatus === 'available' ? '#059669' : 
                        availabilityStatus === 'taken' ? '#dc2626' : 
                        availabilityStatus === 'error' ? '#d97706' : '#059669'
                }}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.div 
                className={styles.copyIconContainer}
                onClick={handleCopy}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: copied ? '#10b981' : '#00C896',
                  cursor: inputName ? 'pointer' : 'not-allowed',
                  opacity: inputName ? 1 : 0.6
                }}
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
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Claim Button - Exact copy from Hero */}
          <motion.div 
            className={styles.claimButtonContainer}
            variants={fadeInUp}
          >
            <Link href="/signup">
              <motion.button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: availabilityStatus === 'available' ? highlightColor : 
                             availabilityStatus === 'taken' ? '#ef4444' : 
                             availabilityStatus === 'error' ? '#f59e0b' : 
                             inputName ? highlightColor : '#e5e7eb',
                  color: availabilityStatus === 'available' ? 'white' : 
                        availabilityStatus === 'taken' ? 'white' : 
                        availabilityStatus === 'error' ? 'white' : 
                        inputName ? 'white' : '#9ca3af',
                  border: availabilityStatus === 'available' ? `2px solid ${highlightColor}` : 
                         availabilityStatus === 'taken' ? '2px solid #ef4444' : 
                         availabilityStatus === 'error' ? '2px solid #f59e0b' : 
                         inputName ? `2px solid ${highlightColor}` : '2px solid #e5e7eb',
                  borderRadius: '50px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: availabilityStatus === 'available' ? 'pointer' : 
                         availabilityStatus === 'taken' ? 'pointer' : 
                         availabilityStatus === 'error' ? 'pointer' : 
                         inputName ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: availabilityStatus === 'available' ? '0 4px 20px rgba(0, 200, 150, 0.2)' : 
                            availabilityStatus === 'taken' ? '0 4px 20px rgba(239, 68, 68, 0.2)' : 
                            availabilityStatus === 'error' ? '0 4px 20px rgba(245, 158, 11, 0.2)' : 
                            inputName ? '0 4px 20px rgba(0, 200, 150, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
                  opacity: availabilityStatus === 'available' ? 1 : 
                          availabilityStatus === 'taken' ? 1 : 
                          availabilityStatus === 'error' ? 1 : 
                          inputName ? 1 : 0.6,
                  pointerEvents: availabilityStatus === 'available' ? 'auto' : 
                                availabilityStatus === 'taken' ? 'auto' : 
                                availabilityStatus === 'error' ? 'auto' : 
                                inputName ? 'auto' : 'none'
                }}
                whileHover={availabilityStatus === 'available' ? { 
                  scale: 1.05, 
                  filter: 'brightness(1.1)',
                  boxShadow: `0 6px 25px ${highlightColorRgba(0.3)}`
                } : availabilityStatus === 'taken' ? { 
                  scale: 1.05, 
                  filter: 'brightness(1.1)',
                  boxShadow: '0 6px 25px rgba(239, 68, 68, 0.3)'
                } : availabilityStatus === 'error' ? { 
                  scale: 1.05, 
                  filter: 'brightness(1.1)',
                  boxShadow: '0 6px 25px rgba(245, 158, 11, 0.3)'
                } : inputName ? { 
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
                   'Claim Your Link'}
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
