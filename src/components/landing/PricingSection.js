'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './PricingSection.module.css';

const CheckIcon = () => (
  <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

export default function PricingSection() {
  return (
  <section className={styles.section}>
    <motion.div 
      className={styles.container}
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className={styles.heading}>Start Free. Upgrade for More.</h2>
      <div className={styles.pricingGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Free Plan</h3>
          <p className={styles.cardSubtitle}>Entry Level</p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}><CheckIcon /> 1 digital card</li>
            <li className={styles.featureItem}><CheckIcon /> Limited templates</li>
            <li className={styles.featureItem}><CheckIcon /> Basic analytics</li>
            <li className={styles.featureItem}><CheckIcon /> "Made with Prysma" branding</li>
          </ul>
          <Link href="/signup" passHref>
             <button className={styles.secondaryButton}>Start Free</button>
          </Link>
        </div>
        <div className={styles.highlightedCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '-10px', marginRight: '0px' }}>Pro Plan</h3>
            <Image
              src="/images/logo.png"
              alt="Pro Plan Logo"
              width={70}
              height={70}
            />
          </div>
          <p className={styles.cardSubtitle}>Most Popular</p>
          <p className={styles.cardPrice}>€7-10</p>
          <p className={styles.priceDetails}>per month</p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}><CheckIcon /> Multiple cards</li>
            <li className={styles.featureItem}><CheckIcon /> Custom branding and domain</li>
            <li className={styles.featureItem}><CheckIcon /> Advanced analytics</li>
            <li className={styles.featureItem}><CheckIcon /> Extra links & social media integration</li>
          </ul>
          <Link href="/signup" passHref>
             <button className={styles.primaryButton}>Choose Pro</button>
          </Link>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Business Plan</h3>
          <p className={styles.cardSubtitle}>For Teams</p>
          <p className={styles.cardPrice}>€20-30</p>
          <p className={styles.priceDetails}>per month</p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}><CheckIcon /> Team accounts</li>
            <li className={styles.featureItem}><CheckIcon /> CRM integrations (in future)</li>
            <li className={styles.featureItem}><CheckIcon /> Priority support</li>
          </ul>
           <Link href="/contact" passHref>
             <button className={styles.secondaryButton}>Contact Sales</button>
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
  );
}; 