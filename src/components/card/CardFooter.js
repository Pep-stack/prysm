'use client';

import React from 'react';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';
import styles from './PrysmaCard.module.css';
import Image from 'next/image';

export default function CardFooter({ profile, user }) {
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  return (
    <div 
      className={`${styles.cardFooter} w-full px-6 py-4`}
      style={{ 
        fontFamily: settings.fontFamily || 'Inter, sans-serif',
        color: textColor
      }}
    >
      <div className="flex items-center justify-center gap-2 text-sm text-gray-700 font-medium">
        <Image 
          src="/images/prysma-icon.png" 
          alt="Prysma Icon" 
          width={80} 
          height={80}
          className="opacity-90"
        />
        <span>Powered by Prysma</span>
      </div>
    </div>
  );
} 