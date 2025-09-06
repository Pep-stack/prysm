'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

const XTweetCard = ({ name, username, verified, tweet, timestamp, likes, replies, profileImage, size = 'normal' }) => {
  const cardSizes = {
    small: 'col-span-1 row-span-1',
    normal: 'col-span-1 row-span-1',
    large: 'col-span-1 row-span-2 md:col-span-2 lg:col-span-1'
  };

  return (
    <motion.div 
      className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 ${cardSizes[size]}`}
      whileHover={{ y: -2 }}
    >
      {/* Tweet Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={profileImage} 
              alt={`${name} profile`}
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 text-sm">{name}</span>
              {verified && (
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </div>
            <span className="text-gray-500 text-sm">@{username}</span>
          </div>
        </div>
        {/* X Logo - Now Black */}
        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>

      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-gray-900 text-sm leading-relaxed">
          {tweet}
        </p>
      </div>

      {/* Tweet Footer */}
      <div className="flex items-center justify-between text-gray-500 text-xs">
        <span>{timestamp}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>{replies}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-green-500 cursor-pointer transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            <span>Share</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {/* Use dynamic grid for X embeds */} 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-auto">
        {/* First testimonial - always visible */}
        <XTweetCard 
          name="Aisha Patel"
          username="aisha_p_design"
          verified={true}
          tweet="Just launched my new Prysma profile! 🚀 Finally have one link that shows everything - portfolio, socials, contact info. Game changer for freelancers like me. Check it out: useprysma.com/aisha-p-design"
          timestamp="3h"
          likes="24"
          replies="3"
          profileImage="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
          size="normal"
        />

        {/* Additional testimonials - hidden on mobile unless showMore is true */}
        <AnimatePresence>
          {(showMore || !isMobile) && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <XTweetCard 
                  name="Kwame Asante"
                  username="kwame_consulting"
                  verified={true}
                  tweet="Been using Prysma for my consulting business. The analytics show which projects clients are most interested in. Super valuable insights! 📊 #entrepreneur #consulting

Perfect for tracking ROI on my professional content and seeing which services get the most interest from potential clients."
                  timestamp="1d"
                  likes="31"
                  replies="5"
                  profileImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  size="large"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <XTweetCard 
                  name="Zara Al-Rashid"
                  username="zara_creates_art"
                  verified={false}
                  tweet="Love how Prysma integrates with all my platforms. GitHub, Dribbble, LinkedIn - everything in one place. My network finally knows where to find my work! ✨"
                  timestamp="6h"
                  likes="42"
                  replies="12"
                  profileImage="https://api.dicebear.com/7.x/avataaars/svg?seed=zara&backgroundColor=b6e3f4&clothesColor=262e33&eyeType=happy&facialHairType=blank&hairColor=f59e0b&hatColor=3b82f6&mouthType=smile&skinColor=fdbcb4&topType=longHairStraight"
                  size="normal"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <XTweetCard 
                  name="Raj Mehta"
                  username="rajstartupguy"
                  verified={true}
                  tweet="Switched from Linktree to Prysma and wow... the difference is night and day. Actually looks professional and the analytics are incredibly detailed 📈"
                  timestamp="2d"
                  likes="56"
                  replies="9"
                  profileImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                  size="small"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <XTweetCard 
                  name="Sofia Johansson"
                  username="sofia_writes_code"
                  verified={false}
                  tweet="As a content creator, Prysma has been perfect for showcasing my writing portfolio alongside my social presence. One link, everything included! 📝"
                  timestamp="4d"
                  likes="29"
                  replies="4"
                  profileImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
                  size="normal"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Show More Button - Only visible on mobile */}
      <div className="block md:hidden mt-8 text-center">
        <motion.button
          onClick={() => setShowMore(!showMore)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showMore ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/>
              </svg>
              Show Less
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
              Show More Reviews ({4})
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  </section>
 );
}; 