'use client';

import React, { useState } from 'react';
import CardHeader from './CardHeader';
import CardSectionRenderer from './CardSectionRenderer';
import styles from './PrysmaCard.module.css';

// Placeholders for components potentially not created yet or needing retry
import GithubGitlabSectionContent from './cardSections/GithubGitlabSectionContent'; // Import actual component
import DribbbleBehanceSectionContent from './cardSections/DribbbleBehanceSectionContent'; // Import actual component
import YoutubeChannelSectionContent from './cardSections/YoutubeChannelSectionContent'; // Import actual component
import TiktokSectionContent from './cardSections/TiktokSectionContent'; // Import actual component
import FacebookSectionContent from './cardSections/FacebookSectionContent'; // Import actual component
import StackoverflowSectionContent from './cardSections/StackoverflowSectionContent'; // Import actual component
import GoogleMapsSectionContent from './cardSections/GoogleMapsSectionContent'; // Import actual component
import TimezoneHoursSectionContent from './cardSections/TimezoneHoursSectionContent'; // Import actual component
import DownloadCvSectionContent from './cardSections/DownloadCvSectionContent'; // Import actual component
import StatisticsProofSectionContent from './cardSections/StatisticsProofSectionContent'; // Import actual component
import BlogArticlesSectionContent from './cardSections/BlogArticlesSectionContent'; // Import actual component
import VideoBannerSectionContent from './cardSections/VideoBannerSectionContent'; // Import actual component

export default function PrysmaCard({
  profile,
  user,
  cardSections = [],
  onSaveLanguages,
}) {
  const [showQR, setShowQR] = useState(false);

  const displayUserId = user?.id || profile?.id;
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${displayUserId}`;
  
  // --- DEFINIEER KNOP CLASSES OPNIEUW ---
  const baseButtonClass = "border rounded-md px-4 py-2 text-sm font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButtonClass = `bg-[#00C896] hover:brightness-110 text-white border-transparent ${baseButtonClass}`;
  // const secondaryButtonClass = ...; // Niet meer nodig?
  // const darkSecondaryButtonClass = ...; // Niet meer nodig?
  // --- EINDE DEFINITIES ---

  return (
    <div className={styles.card}>
      <CardHeader
         profile={profile}
         user={user}
         isPublicView={true}
      />

       <div className={styles.contentArea}>
          <div className={`${styles.qrOverlay} ${showQR ? styles.qrOverlayVisible : ''}`}>
             <div style={{ marginBottom: '20px', textAlign: 'center' }}>
               <h3>Scan this QR Code to view profile</h3>
               <div className={styles.qrCodePlaceholder}>
                 <p>QR Code Placeholder</p>
               </div>
               <p className="text-sm">Or share this link: <span className="font-medium break-all">{profileUrl}</span></p>
             </div>
             <button
               className={primaryButtonClass}
               onClick={() => setShowQR(false)}
             >
               Close
             </button>
          </div>

          <CardSectionRenderer
             cardSections={cardSections}
             profile={profile}
             user={user}
             isPublicView={true}
             containerClassName={styles.sectionsContainer}
             onSaveLanguages={onSaveLanguages}
          />
       </div> 
    </div>
  );
} 