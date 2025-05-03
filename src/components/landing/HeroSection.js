'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { colors, typography, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function HeroSection() {
  // Define button style for the primary green button
  const primaryGreenButtonStyle = {
    ...commonStyles.button,
    backgroundColor: '#00C896', // Specific green color
    color: colors.white,
    borderRadius: '25px',
    padding: '12px 25px',
    margin: '0 10px',
    border: 'none',
  };

  // Define button style for the secondary outline button
  const outlineBlackButtonStyle = {
    ...commonStyles.button,
    backgroundColor: 'transparent', // Transparent background
    color: colors.black || '#000', // Black text
    border: `1px solid ${colors.black || '#000'}`, // Black border
    borderRadius: '25px',
    padding: '12px 25px',
    margin: '0 10px',
  };

  // Style for the faded green words in H1
  const fadedGreenStyle = {
    color: '#00C896', // Same green color
    opacity: 0.7, // Adjust opacity as needed
  };

  // Define the green highlight color
  const highlightColor = '#00C896';
  // Convert hex to rgba for transparency (adjust alpha as needed)
  // #00C896 -> rgba(0, 200, 150)
  const highlightColorRgba = (alpha) => `rgba(0, 200, 150, ${alpha})`;
  const blackRgba = (alpha) => `rgba(0, 0, 0, ${alpha})`;

  return (
   // Apply background with gradient glow at the bottom of the section
   <section style={{
       ...commonStyles.sectionPadding,
       color: colors.darkGrey || '#333', // Default text color
       // Layered background: Gradients on top of solid white
       background: `
         /* Green Glow - positioned at bottom center, large size, no repeat */
         radial-gradient(ellipse at center bottom, ${highlightColorRgba(0.2)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
         /* Black Glow - positioned at bottom center, large size, no repeat */
         radial-gradient(ellipse at center bottom, ${blackRgba(0.1)} 0%, transparent 60%) center bottom / 150% 80% no-repeat,
         /* Base solid white background */
         ${colors.white}
       `,
       // Ensure enough padding at the bottom for the effect to be visible below content
       paddingBottom: '100px', // Example: Increase bottom padding if needed
    }}>
    <motion.div
      style={commonStyles.container}
      className="text-center"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      {/* H1 with Inter font and specific faded green words */}
      <h1 style={{
          ...commonStyles.h1,
          fontFamily: "'Inter', sans-serif",
          color: colors.darkGrey || '#333', // Default color
          marginBottom: '20px',
          // Responsive font size: min 2.2rem, schaalt met viewport, max 3.5rem
          fontSize: 'clamp(2.2rem, 5vw + 1rem, 3.5rem)',
        }}>
        For Builders, <span style={fadedGreenStyle}>Creators</span> & Professionals who need more than just a <span style={fadedGreenStyle}>Link</span>
      </h1>
      {/* Subheadline with Inter font */}
      <p style={{
          ...commonStyles.subheadline,
          fontFamily: "'Inter', sans-serif",
          color: colors.mediumGrey || '#333',
          maxWidth: '650px',
          margin: '0 auto 35px auto',
          // Responsive font size: min 0.9rem, schaalt met viewport, max 1.1rem
          fontSize: 'clamp(0.9rem, 2vw + 0.7rem, 1.1rem)',
          lineHeight: 1.6, // Optioneel: verbeter leesbaarheid
        }}>
          Prysma turns your work, skills, and projects into one professional profile – fast to build, powerful to share.
      </p>
       {/* Container for the two buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }}>
          <Link href="/signup">
            <motion.button
              style={primaryGreenButtonStyle} // Use the new green button style
              // Hover effect for green button
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Create a Prysma
            </motion.button>
          </Link>
          <Link href="#features">
             <motion.button
              style={outlineBlackButtonStyle} // Use the new outline button style
              // Hover effect for outline button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.05)' }} // Slight background fill on hover
              whileTap={{ scale: 0.95 }}
            >
              See how it works
            </motion.button>
          </Link>
      </div>
       {/* Container div for the Image, centered with margin */}
       <div style={{
         marginTop: '20px',
         borderRadius: '8px',
         position: 'relative',
         // Center the div horizontally using auto margins
         margin: '20px auto 0 auto',
         // Set a width on the container to constrain the image if needed,
         // or let the image width dictate the container width.
         // Example: maxWidth: '600px', // Match the new image width
         width: 'fit-content', // Let the container shrink to the image size
       }}>
         <Image
           src="/images/Prysma mock up.png"
           alt="Prysma App Mockup"
           // Reduced width and corresponding height (adjust ratio if needed)
           width={400}  // Reduced from 700
           height={260} // Adjusted height (approx 450 * 600 / 700)
           style={{
             display: 'block', // Good practice for images within centered divs
             maxWidth: '100%', // Still ensures responsiveness
             height: 'auto', // Maintain aspect ratio
             borderRadius: '8px'
           }}
         />
       </div>
    </motion.div>
  </section>
  );
}; 