'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

const TestimonialCard = ({ quote, author, title }) => (
   <blockquote className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 italic mb-4">
        {quote} {/* Pass quote as children or prop */}
      </p>
      <footer className="font-semibold text-gray-700">- {author}{title && `, ${title}`}</footer>
    </blockquote>
);

export default function TestimonialsSection() {
 return (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}> {/* Changed background to white */} 
    <motion.div 
      style={commonStyles.container}
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.4 }} // Stagger animation
    >
      <h2 style={commonStyles.h2}>What Professionals Are Saying</h2>
      {/* Use grid for testimonials */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
         <TestimonialCard 
          quote="&quot;Prysma finally gives me one link to put in my bio that actually looks professional and holds everything I need.&quot;" 
          author="Alex R."
          title="Freelance Designer"
         />
         <TestimonialCard 
          quote="&quot;Sharing my portfolio and socials for job applications is so much easier now. It&apos;s clean and simple.&quot;" 
          author="Sarah J."
          title="Software Engineer"
         />
      </div>
    </motion.div>
  </section>
 );
}; 