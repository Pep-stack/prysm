'use client';

import React from 'react';
import CardHeader from './CardHeader';
import CardSectionRenderer from './CardSectionRenderer';
import SocialBar from './SocialBar';
import styles from './PrysmaCard.module.css';
import { supabase } from '@/lib/supabase';
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';

// Section content component imports
import GithubGitlabSectionContent from './cardSections/GithubGitlabSectionContent';
import DribbbleBehanceSectionContent from './cardSections/DribbbleBehanceSectionContent';
import YoutubeChannelSectionContent from './cardSections/YoutubeChannelSectionContent';
import TiktokSectionContent from './cardSections/TiktokSectionContent';
import FacebookSectionContent from './cardSections/FacebookSectionContent';
import StackoverflowSectionContent from './cardSections/StackoverflowSectionContent';
import GoogleMapsSectionContent from './cardSections/GoogleMapsSectionContent';
import TimezoneHoursSectionContent from './cardSections/TimezoneHoursSectionContent';
import DownloadCvSectionContent from './cardSections/DownloadCvSectionContent';
import StatisticsProofSectionContent from './cardSections/StatisticsProofSectionContent';
import BlogArticlesSectionContent from './cardSections/BlogArticlesSectionContent';
import VideoBannerSectionContent from './cardSections/VideoBannerSectionContent';

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

  return (
    <div className={`${styles.prysmaCard} ${className}`} style={{ fontFamily: settings.fontFamily || 'Inter, sans-serif' }}>
      {/* Header Section */}
      <CardHeader
        profile={profile}
        user={user}
        isPublicView={isPublicView}
        backgroundColor={settings.background_color || '#f8f9fa'}
      />
      
      {/* Social Bar - Always visible below header when sections exist */}
      <SocialBar
        sections={socialBarSections}
        profile={profile}
        user={user}
      />

      {/* Main Sections */}
      <div className={styles.cardBody}>
        {cardSections && cardSections.length > 0 && (
          cardSections.map((section) => (
            <CardSectionRenderer
              key={section.id}
              section={section}
              profile={profile}
              user={user}
              isPublicView={isPublicView}
            />
          ))
        )}
      </div>
    </div>
  );
}
