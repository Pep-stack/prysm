'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const DynamicBranches = () => {
  const [visibleBranches, setVisibleBranches] = useState([]);

  const leftBranches = [
    {
      id: 'public-link',
      label: 'Public Link',
      icon: '🔗',
      delay: 1.0,
      rotation: 1,
      position: { top: '40px', right: 'calc(50% + 150px)' }
    },
    {
      id: 'qr-code',
      label: 'QR Code',
      icon: '📱',
      delay: 1.5,
      rotation: -2,
      position: { top: '110px', right: 'calc(50% + 150px)' }
    },
    {
      id: 'custom-design',
      label: 'Custom Design',
      icon: '🎨',
      delay: 2.0,
      rotation: 2,
      position: { top: '180px', right: 'calc(50% + 150px)' }
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: '📊',
      delay: 2.5,
      rotation: -1,
      position: { top: '250px', right: 'calc(50% + 150px)' }
    }
  ];

  const rightBranches = [
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      delay: 3.0,
      rotation: -1,
      position: { top: '40px', left: 'calc(50% + 150px)' }
    },
    {
      id: 'social-integration',
      label: 'Social Integration',
      icon: '🌐',
      delay: 3.5,
      rotation: 2,
      position: { top: '110px', left: 'calc(50% + 150px)' }
    },
    {
      id: 'contact-management',
      label: 'Contact Management',
      icon: '📞',
      delay: 4.0,
      rotation: -2,
      position: { top: '180px', left: 'calc(50% + 150px)' }
    },
    {
      id: 'lead-generation',
      label: 'Lead Generation',
      icon: '🎯',
      delay: 4.5,
      rotation: 1,
      position: { top: '250px', left: 'calc(50% + 150px)' }
    }
  ];

  const allBranches = [...leftBranches, ...rightBranches];

  useEffect(() => {
    allBranches.forEach((branch) => {
      setTimeout(() => {
        setVisibleBranches(prev => [...prev, branch.id]);
      }, branch.delay * 1000);
    });
  }, []);


  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Central Prysma Icon */}
      <motion.div 
        className="relative z-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
      >
        <Image
          src="/images/prysma-icon.png"
          alt="Prysma Icon"
          width={220}
          height={220}
          className="object-contain"
        />
      </motion.div>

      {/* Absolutely Positioned Branches */}
      <AnimatePresence>
        {allBranches.map((branch) => {
          const isVisible = visibleBranches.includes(branch.id);
          return isVisible ? (
            <motion.div
              key={branch.id}
              className="absolute z-10"
              style={branch.position}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: branch.rotation }}
              transition={{ 
                duration: 0.5, 
                ease: "backOut",
                type: "spring",
                stiffness: 150
              }}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: branch.rotation + 1
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{branch.icon}</span>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {branch.label}
                </span>
              </motion.div>
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default DynamicBranches;
