'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function PricingSection() {
  return (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <motion.div 
      style={commonStyles.container}
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }} // Reuse animation variant
    >
      <h2 style={commonStyles.h2}>Start Free. Upgrade for More.</h2>
      {/* Simplified pricing display - could use cards */} 
      <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
        <p style={commonStyles.paragraph}><strong>Free Plan:</strong> 1 card, core features, basic customization.</p>
        <p style={commonStyles.paragraph}><strong>Pro Plan (€4.99/mo):</strong> Unlimited cards, advanced analytics, custom domain support, and more.</p>
        {/* Link to a future pricing page or signup */} 
        <Link href="/signup">
           <button style={{...commonStyles.button, ...commonStyles.primaryButton, marginTop: '20px'}}>See Plans</button>
        </Link>
      </div>
    </motion.div>
  </section>
  );
}; 