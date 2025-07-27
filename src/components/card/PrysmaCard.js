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
      
      {/* Social Bar - Top position (before separator) */}
      {socialBarPosition === 'top' && (
        <SocialBar
          sections={socialBarSections}
          profile={profile}
          user={user}
          position="top"
        />
      )}
      
      {/* Separator line */}
      <div style={{
        height: '1px',
        background: 'rgba(0, 0, 0, 0.15)',
        marginTop: '0px', /* No spacing above separator */
        marginBottom: '8px', /* Minimal spacing below separator */
        marginLeft: '24px', /* Indent from left */
        marginRight: '24px', /* Indent from right */
        borderRadius: '1px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)'
      }}></div>
      
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