'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function CreatorStorySection() {
 return (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <motion.div 
      style={{...commonStyles.container, textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }} // Reuse animation variant
    >
       <h2 style={commonStyles.h2}>Why I Built Prysma</h2>
       <p style={commonStyles.paragraph}>[Founder&apos;s story placeholder - explain the motivation behind creating Prysma, focusing on the problem of fragmented professional links and the need for clarity.]</p>
       {/* Replace # with actual link later */}
       <a href="#" target="_blank" rel="noopener noreferrer">
         <button style={{...commonStyles.button, ...commonStyles.secondaryButton}}>Follow the build on X</button>
       </a>
    </motion.div>
  </section>
 );
}; 