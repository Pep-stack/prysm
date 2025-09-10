'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const DynamicBranches = () => {
  const [visibleBranches, setVisibleBranches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const leftBranches = [
    {
      id: 'public-link',
      label: 'Public Link',
      icon: '🔗',
      delay: 1.0,
      rotation: 1,
      position: { 
        mobile: { top: '20px', right: 'calc(50% + 90px)' },
        desktop: { top: '40px', right: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'qr-code',
      label: 'QR Code',
      icon: '📱',
      delay: 1.5,
      rotation: -2,
      position: { 
        mobile: { top: '70px', right: 'calc(50% + 90px)' },
        desktop: { top: '110px', right: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'custom-design',
      label: 'Custom Design',
      icon: '🎨',
      delay: 2.0,
      rotation: 2,
      position: { 
        mobile: { top: '120px', right: 'calc(50% + 90px)' },
        desktop: { top: '180px', right: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: '📊',
      delay: 2.5,
      rotation: -1,
      position: { 
        mobile: { top: '170px', right: 'calc(50% + 90px)' },
        desktop: { top: '250px', right: 'calc(50% + 150px)' }
      }
    }
  ];

  const rightBranches = [
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      delay: 3.0,
      rotation: -1,
      position: { 
        mobile: { top: '20px', left: 'calc(50% + 90px)' },
        desktop: { top: '40px', left: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'social-integration',
      label: 'Social Integration',
      icon: '🌐',
      delay: 3.5,
      rotation: 2,
      position: { 
        mobile: { top: '70px', left: 'calc(50% + 90px)' },
        desktop: { top: '110px', left: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'contact-management',
      label: 'Contact Management',
      icon: '📞',
      delay: 4.0,
      rotation: -2,
      position: { 
        mobile: { top: '120px', left: 'calc(50% + 90px)' },
        desktop: { top: '180px', left: 'calc(50% + 150px)' }
      }
    },
    {
      id: 'lead-generation',
      label: 'Lead Generation',
      icon: '🎯',
      delay: 4.5,
      rotation: 1,
      position: { 
        mobile: { top: '170px', left: 'calc(50% + 90px)' },
        desktop: { top: '250px', left: 'calc(50% + 150px)' }
      }
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
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center overflow-hidden px-4">
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
          width={160}
          height={160}
          className="object-contain sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px]"
        />
      </motion.div>

      {/* Absolutely Positioned Branches */}
      <AnimatePresence>
        {allBranches.map((branch) => {
          const isVisible = visibleBranches.includes(branch.id);
          const currentPosition = isMobile ? branch.position.mobile : branch.position.desktop;
          
          return isVisible ? (
            <motion.div
              key={branch.id}
              className="absolute z-10"
              style={currentPosition}
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
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer hover:shadow-xl transition-shadow duration-200 ${
                  isMobile ? 'px-2 py-2' : 'px-4 py-3'
                }`}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: branch.rotation + 1
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isMobile ? 'text-base' : 'text-lg'}>{branch.icon}</span>
                <span className={`font-medium text-gray-700 whitespace-nowrap ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
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
