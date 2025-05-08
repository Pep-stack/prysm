'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function UseCaseSection() {
  return (
    <section style={{ ...commonStyles.sectionPadding, backgroundColor: colors.white }}>
      <div className="flex flex-col gap-6 md:gap-12 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Block 1: Left image, right text */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="/images/usecpic.png"
            alt="Example of a Prysma profile"
            className="w-full max-w-xs rounded-xl shadow-md"
            style={{ objectFit: 'cover' }}
          />
          <div className="flex-1 text-left">
            <h3 className="text-2xl font-bold mb-3">Your Digital Business Card, Always Up-to-Date</h3>
            <p className="text-lg text-gray-700 mb-2">
              With a Prysma profile, you have one central place for all your professional links, projects, and contact information. Share your unique link and make an instant impression—whether you're applying for jobs, attracting clients, or expanding your network.
            </p>
            <p className="text-base text-emerald-600 font-semibold">Show who you are. Start with Prysma today!</p>
          </div>
        </motion.div>

        {/* Block 2: Left text, right image */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-1 text-left order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-3">Always Professional, Always Personal</h3>
            <p className="text-lg text-gray-700 mb-2">
              Prysma profiles are fully customizable. Add your own branding, colors, and sections. Always look professional—your way.
            </p>
            <p className="text-base text-emerald-600 font-semibold">Stand out. Claim your unique profile now!</p>
          </div>
          <img
            src="/images/usecasepic2.png"
            alt="Personalize your Prysma profile"
            className="w-full max-w-xs rounded-xl shadow-md order-1 md:order-2"
            style={{ objectFit: 'cover' }}
          />
        </motion.div>

        {/* Block 3: Left image, right text */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <img
            src="/images/usecasepic3.png"
            alt="Share your Prysma profile"
            className="w-full max-w-xs rounded-xl shadow-md"
            style={{ objectFit: 'cover' }}
          />
          <div className="flex-1 text-left">
            <h3 className="text-2xl font-bold mb-3">Shareable and Trackable Success</h3>
            <p className="text-lg text-gray-700 mb-2">
              Share your Prysma profile with one click on social media, your resume, or via a QR code. Track who views your profile and discover new opportunities.
            </p>
            <p className="text-base text-emerald-600 font-semibold">Grow your network. Take the first step with Prysma today!</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 