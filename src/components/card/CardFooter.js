'use client';

import React from 'react';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import styles from './PrysmaCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function CardFooter({ profile, user }) {
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  return (
    <div 
      className={`${styles.cardFooter} w-full px-6 py-4`}
      style={{ 
        fontFamily: settings.font_family || 'Inter, sans-serif',
      }}
    >
      <div className="flex justify-center">
        <div 
          className="flex items-center gap-2 text-xs font-medium px-0.5 py-0.5 rounded-lg"
          style={{ 
            color: textColor,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/images/prysma-icon.png" 
              alt="Prysma Icon" 
              width={40} 
              height={40}
              className="opacity-90 cursor-pointer"
            />
          </Link>
          <span>Powered by Prysma</span>
        </div>
      </div>
    </div>
  );
} 