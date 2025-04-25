'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function UseCaseSection() {
 return (
   <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}>
    <motion.div 
      style={{...commonStyles.container, ...commonStyles.splitLayout, flexDirection: 'row-reverse'}} 
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.3 }} // Stagger animation
    >
      <div style={commonStyles.splitText}>
        <h3 style={commonStyles.h3}>For creators, freelancers, job seekers and founders</h3>
        <p style={commonStyles.paragraph}>Whether you&apos;re sharing a portfolio, centralizing your online presence, or applying for your next role — Prysma keeps your professional identity clear and in control.</p>
        {/* Maybe add bullet points or specific examples */} 
      </div>
      <div style={{...commonStyles.splitVisual, minHeight: '300px'}}> {/* Adjust min height */} 
        [Mockups Placeholder - Different User Cards]
      </div>
    </motion.div>
  </section>
 );
}; 