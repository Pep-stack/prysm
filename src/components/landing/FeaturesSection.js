'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="text-blue-600 text-4xl mb-4">{icon}</div> 
    <h3 style={{...commonStyles.h3, textAlign: 'center'}}>{title}</h3>
    <p style={commonStyles.paragraph}>{children}</p>
  </div>
);

export default function FeaturesSection() {
  return (
   <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <motion.div 
      style={commonStyles.container}
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }} // Stagger animation
    >
      <h2 style={commonStyles.h2}>Everything You Need to Shine Online</h2>
      <div style={commonStyles.grid3Col} className="lg:grid-cols-4"> {/* Adjust grid columns for large screens */} 
        <FeatureCard icon="✨" title="AI Generated Profile">
          Get started quickly with AI assistance for your bio and content.
        </FeatureCard>
        <FeatureCard icon="🚀" title="Share with One Click">
          Easily share your complete professional presence anywhere.
        </FeatureCard>
        <FeatureCard icon="🔗" title="Connect Everything">
          Link your socials, portfolio, resume, projects, and more.
        </FeatureCard>
        <FeatureCard icon="🔄" title="Always Up-to-Date">
          One central link means updates reflect everywhere instantly.
        </FeatureCard>
      </div>
    </motion.div>
  </section>
  );
}; 