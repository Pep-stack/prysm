'use client';

import React from 'react';
import CardHeader from './CardHeader';
import CardSectionRenderer from './CardSectionRenderer';
import SocialBar from './SocialBar';
import CardFooter from './CardFooter';
import styles from './PrysmaCard.module.css';
import { supabase } from '@/lib/supabase';
import { useDesignSettings } from '../dashboard/DesignSettingsContext';

// Section rendering is handled by CardSectionRenderer

export default function PrysmaCard({
  profile,
  user,
  cardSections = [],
  socialBarSections = [],
  isPublicView = false,
  className = ""
}) {
  const { settings } = useDesignSettings();
  const displayUserId = user?.id || profile?.id;
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${displayUserId}`;
  
  // Check if header is present
  const hasHeader = profile?.display_type === 'header';
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  // Get social bar position from design settings
  const socialBarPosition = settings.social_bar_position || 'top';

  // Debug font family
  console.log('🎨 PRYSMA-CARD: Font family:', {
    settingsFontFamily: settings.font_family,
    appliedFont: settings.font_family || 'Inter, sans-serif'
  });

  return (
    <div className={`${styles.prysmaCard} ${className}`} style={{ fontFamily: settings.font_family || 'Inter, sans-serif' }}>
      {/* Header Section */}
      <CardHeader
        profile={profile}
        user={user}
        isPublicView={isPublicView}
      />
      
      {/* Social Bar - Position based on settings */}
      {socialBarPosition === 'top' && (
        <SocialBar
          sections={socialBarSections}
          profile={profile}
          user={user}
          position="top"
        />
      )}
      
      {/* Main Sections */}
      <div className={`${styles.cardBody} ${hasHeader ? styles.hasHeader : ''}`}>
        {cardSections && cardSections.length > 0 && (
          cardSections.map((section) => {
            return (
              <CardSectionRenderer
                key={section.id}
                section={section}
                profile={profile}
                user={user}
                isPublicView={isPublicView}
              />
            );
          })
        )}
      </div>
      
      {/* Social Bar - Bottom position */}
      {socialBarPosition === 'bottom' && (
        <SocialBar
          sections={socialBarSections}
          profile={profile}
          user={user}
          position="bottom"
        />
      )}
      
      {/* Fixed Footer */}
      <CardFooter
        profile={profile}
        user={user}
      />
    </div>
  );
}