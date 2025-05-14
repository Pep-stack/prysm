'use client';

import React from 'react';
import CardHeader from './CardHeader';
import CardSectionRenderer from './CardSectionRenderer';
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
  onSaveLanguages,
  onReorder,
}) {
  const { settings } = useDesignSettings();
  const displayUserId = user?.id || profile?.id;
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${displayUserId}`;

  return (
    <div className={styles.card} style={{ backgroundColor: settings.card_color || '#ffffff' }}>
      <CardHeader
        profile={profile}
        user={user}
        isPublicView={true}
        backgroundColor={settings.background_color || '#f8f9fa'}
      />
      <div className={styles.contentArea}>
        <CardSectionRenderer
          cardSections={cardSections}
          profile={profile}
          user={user}
          isPublicView={true}
          containerClassName={styles.sectionsContainer}
          onSaveLanguages={onSaveLanguages}
          onReorder={onReorder}
        />
      </div>
    </div>
  );
}
