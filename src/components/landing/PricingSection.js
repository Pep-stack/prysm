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

// Real pricing data matching the payment system
const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free Plan',
    subtitle: 'Perfect for getting started',
    price: '€0',
    period: 'forever',
    features: [
      'Basic profile creation',
      'Essential sections',
      'Public profile link',
      'Basic analytics',
      '"Made with Prysma" branding'
    ],
    buttonText: 'Start Free',
    buttonStyle: 'secondary'
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    subtitle: 'Most Popular',
    price: '€7',
    period: 'per month',
    features: [
      'Everything in Free',
      'Multiple cards',
      'Custom branding & domain',
      'Advanced analytics',
      'Priority support',
      'Extra links & integrations'
    ],
    buttonText: 'Choose Pro',
    buttonStyle: 'primary',
    popular: true,
    trial: true
  },
  business: {
    id: 'business',
    name: 'Business Plan',
    subtitle: 'For teams and organizations',
    price: '€25',
    period: 'per month',
    features: [
      'Everything in Pro',
      'Team accounts',
      'Advanced integrations',
      'Custom analytics',
      'Priority support',
      'Dedicated account manager'
    ],
    buttonText: 'Contact Sales',
    buttonStyle: 'secondary',
    trial: true,
    comingSoon: true
  }
};

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
      <h2 className={styles.heading}>Choose Your Professional Journey</h2>
      <p className={styles.subheading}>
        From freelancers to established professionals, Prysma adapts to your needs. Start free and upgrade when you&apos;re ready to unlock advanced features that help you stand out in your industry.
      </p>
      {/* Mobile scroll hint */}
      <div className="block md:hidden text-center text-sm text-gray-500 mb-4">
        ← Swipe to see all plans →
      </div>
      <div className={styles.pricingGrid}>
        {/* Free Plan */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{PRICING_PLANS.free.name}</h3>
          <p className={styles.cardSubtitle}>{PRICING_PLANS.free.subtitle}</p>
          <p className={styles.cardPrice}>{PRICING_PLANS.free.price}</p>
          <p className={styles.priceDetails}>{PRICING_PLANS.free.period}</p>
          <ul className={styles.featureList}>
            {PRICING_PLANS.free.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <CheckIcon /> {feature}
              </li>
            ))}
          </ul>
          <Link href="/signup" passHref>
             <button className={styles.secondaryButton}>{PRICING_PLANS.free.buttonText}</button>
          </Link>
        </div>

        {/* Pro Plan - Highlighted */}
        <div className={styles.highlightedCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '-10px', marginRight: '0px' }}>
              {PRICING_PLANS.pro.name}
            </h3>
            <Image
              src="/images/logo.png"
              alt="Pro Plan Logo"
              width={70}
              height={70}
            />
          </div>
          <p className={styles.cardSubtitle}>{PRICING_PLANS.pro.subtitle}</p>
          <p className={styles.cardPrice}>{PRICING_PLANS.pro.price}</p>
          <p className={styles.priceDetails}>{PRICING_PLANS.pro.period}</p>
          <ul className={styles.featureList}>
            {PRICING_PLANS.pro.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <CheckIcon /> {feature}
              </li>
            ))}
          </ul>
          <Link href="/signup" passHref>
             <button className={styles.primaryButton}>{PRICING_PLANS.pro.buttonText}</button>
          </Link>
          {PRICING_PLANS.pro.trial && (
            <p className={styles.trialInfo}>14-day free trial included</p>
          )}
        </div>

        {/* Business Plan */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{PRICING_PLANS.business.name}</h3>
          <p className={styles.cardSubtitle}>{PRICING_PLANS.business.subtitle}</p>
          <p className={styles.cardPrice}>{PRICING_PLANS.business.price}</p>
          <p className={styles.priceDetails}>{PRICING_PLANS.business.period}</p>
          <ul className={styles.featureList}>
            {PRICING_PLANS.business.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <CheckIcon /> {feature}
              </li>
            ))}
          </ul>
          <Link href="/contact" passHref>
             <button className={styles.secondaryButton}>
               {PRICING_PLANS.business.comingSoon ? 'Coming Soon' : PRICING_PLANS.business.buttonText}
             </button>
          </Link>
          {PRICING_PLANS.business.trial && !PRICING_PLANS.business.comingSoon && (
            <p className={styles.trialInfo}>14-day free trial included</p>
          )}
        </div>
      </div>

      {/* Trial Information */}
      <motion.div 
        className={styles.trialNotice}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className={styles.trialBadge}>
          <svg className={styles.trialIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          All paid plans include a 14-day free trial • Cancel anytime
        </div>
      </motion.div>
    </motion.div>
  </section>
  );
}; 