'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableCardSection from './SortableCardSection';

// Import the new section content components
import BioSectionContent from './cardSections/BioSectionContent';
import SkillsSectionContent from './cardSections/SkillsSectionContent';
import ContactSectionContent from './cardSections/ContactSectionContent';
import LocationSectionContent from './cardSections/LocationSectionContent';
import WebsiteSectionContent from './cardSections/WebsiteSectionContent';
import LinkedInSectionContent from './cardSections/LinkedInSectionContent';
import XSectionContent from './cardSections/XSectionContent';
import InstagramSectionContent from './cardSections/InstagramSectionContent';
import ExperienceSectionContent from './cardSections/ExperienceSectionContent';
import EducationSectionContent from './cardSections/EducationSectionContent';
import CertificationsSectionContent from './cardSections/CertificationsSectionContent';
import ProjectsSectionContent from './cardSections/ProjectsSectionContent';
import PublicationsSectionContent from './cardSections/PublicationsSectionContent';
import EventsSectionContent from './cardSections/EventsSectionContent';
import AwardsSectionContent from './cardSections/AwardsSectionContent';
import LanguagesSectionContent from './cardSections/LanguagesSectionContent';
import TestimonialsSectionContent from './cardSections/TestimonialsSectionContent';
import ServicesSectionContent from './cardSections/ServicesSectionContent';
import CalendarSchedulingSectionContent from './cardSections/CalendarSchedulingSectionContent';
import ContactButtonsSectionContent from './cardSections/ContactButtonsSectionContent';
import ContactFormSectionContent from './cardSections/ContactFormSectionContent';
import NewsletterSignupSectionContent from './cardSections/NewsletterSignupSectionContent';
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

export default function PrysmaCard({ profile, user, cardSections = [], onRemoveSection, onEditSection, onAvatarClick, onSaveLayoutClick, isSavingLayout, onSaveLanguages }) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [editingLanguageSectionId, setEditingLanguageSectionId] = useState(null);
  
  // Make the card a droppable area
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: 'prysma-card-dropzone',
    data: {
      type: 'card-container'
    }
  });

  // Generate a shareable profile URL
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${user?.id}`;
  
  // CSS styles for the Prysma Card
  const headerHeight = '120px'; // Define header height

  const cardStyle = {
    border: isOver ? '2px dashed #0070f3' : '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '0', // Remove main padding, apply to content area instead
    backgroundColor: isOver ? '#f0f8ff' : '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '400px',
    margin: '30px auto',
    position: 'relative',
    overflow: 'visible', // Allow avatar to overflow slightly if needed
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
  };
  
  const headerStyle = {
     height: headerHeight,
     backgroundColor: '#d1d5db', // Default grey background
     backgroundImage: profile?.header_url ? `url(${profile.header_url})` : 'none',
     backgroundSize: 'cover',
     backgroundPosition: 'center',
     borderTopLeftRadius: '12px',
     borderTopRightRadius: '12px',
     position: 'relative', // Needed for positioning avatar
  };
  
  const contentAreaStyle = {
      padding: '24px', // Add padding back here
      paddingTop: '60px', // Adjust top padding to make space for overlapping avatar
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-end', // Align items to bottom for overlap effect
    marginTop: `calc(-${headerHeight} / 2 - 10px)`, // Pull header content up over the header image
    position: 'relative', // Ensure it overlaps correctly
    paddingLeft: '24px', // Align with content area padding
    marginBottom: '20px',
  };
  
  const avatarContainerStyle = {
     // Styles for the div containing the avatar image itself
     width: '80px',
     height: '80px',
     borderRadius: '50%',
     backgroundColor: '#f0f0f0',
     border: '4px solid white', // Add white border around avatar
     overflow: 'hidden',
     marginRight: '15px',
     boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional shadow
     cursor: 'pointer',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     fontSize: '32px',
     color: '#666',
     fontWeight: 'bold',
  };
  
  const nameHeadlineStyle = {
      // Styles for the name and headline container
      // Optional: Add background/styling if needed for readability over header
  };
  
  const nameStyle = {
    margin: '0 0 2px 0',
    fontSize: '20px', // Slightly smaller? Adjust as needed
    fontWeight: 'bold',
    color: '#1f2937', // Darker color for better contrast potentially
    // textShadow: '0 1px 1px rgba(255,255,255,0.7)', // Optional text shadow
  };
  
  const headlineStyle = {
    margin: '0',
    color: '#4b5563', // Adjust color
    fontSize: '14px',
    // textShadow: '0 1px 1px rgba(255,255,255,0.7)', // Optional text shadow
  };
  
  const sectionStyle = {
    marginTop: '10px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    position: 'relative',
  };
  
  const placeholderStyle = {
    ...sectionStyle, 
    fontStyle: 'italic', 
    color: '#888',
    cursor: 'pointer',
    padding: '15px 10px',
    border: '1px dashed #ccc',
    borderRadius: '4px',
  };
  
  const sectionTitleStyle = {
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
    fontWeight: 'bold',
  };
  
  const tagStyle = {
    display: 'inline-block',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    padding: '4px 10px',
    margin: '0 8px 8px 0',
    fontSize: '14px',
    color: '#333',
  };
  
  const buttonStyle = {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '10px',
    marginTop: '10px',
    opacity: 1, // Default opacity
    transition: 'opacity 0.2s ease' // Smooth transition for disabled state
  };
  
  const disabledButtonStyle = {
     ...buttonStyle,
     opacity: 0.5,
     cursor: 'not-allowed'
  };
  
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #0070f3',
    color: '#0070f3',
  };
  
  const qrContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: showQR ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    padding: '20px',
  };
  
  // Helper to get first letter of name for avatar placeholder
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  // Function to copy profile URL to clipboard
  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl).then(
      () => {
        alert('Profile link copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  // Handle editing the profile
  const handleEditProfile = () => {
    router.push('/dashboard/profile');
  };
  
  // Function to handle clicks on sections
  const handleSectionClick = (sectionData) => {
    if (sectionData.id === 'languages') {
      setEditingLanguageSectionId(sectionData.id);
    } else if (onEditSection) {
      if (sectionData.inputType !== 'none' || sectionData.editorComponent) {
         onEditSection(sectionData);
      }
    }
  };

  return (
    <div ref={setDroppableNodeRef} style={cardStyle}>
       {/* --- Header Image --- */} 
       <div style={headerStyle}></div>

       {/* --- Content Area --- */} 
       <div style={contentAreaStyle}>
          {/* QR Code Overlay - needs adjustment if it covers header */}
          <div style={qrContainerStyle}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h3>Scan this QR Code to view profile</h3>
              <div style={{ 
                width: '200px', 
                height: '200px', 
                backgroundColor: '#f0f0f0', 
                margin: '20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Placeholder for QR code - will be implemented later */}
                <p>QR Code Placeholder</p>
              </div>
              <p>Or share this link: {profileUrl}</p>
            </div>
            <button 
              style={buttonStyle} 
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>

          {/* Card Header with Avatar and Name - Adjusted position */}
          <div style={cardHeaderStyle}>
             {/* Avatar Container */} 
             <div 
               style={avatarContainerStyle} 
               onClick={onAvatarClick} 
               title="Change Profile Picture"
             >
               {profile?.avatar_url ? (
                 <img 
                   src={profile.avatar_url} 
                   alt={profile?.name || user?.email} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 />
               ) : (
                 <span style={{cursor: 'pointer'}}>{getInitials(profile?.name)}</span>
               )}
             </div>
             {/* Name and Headline */} 
             <div style={nameHeadlineStyle}>
               <h2 style={nameStyle}>{profile?.name || 'Your Name'}</h2>
               <p style={headlineStyle}>{profile?.headline || 'Add a headline'}</p>
             </div>
          </div>
          
          {/* --- Dynamically Rendered & Sortable Sections --- */} 
          <SortableContext items={cardSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}> 
              {cardSections.map((section) => {
                let SectionContentComponent = null;
                const sectionProps = { profile, user, styles: { sectionStyle, sectionTitleStyle, placeholderStyle, tagStyle } }; // Consolidate props

                switch (section.id) {
                  // Existing cases
                  case 'bio': SectionContentComponent = <BioSectionContent {...sectionProps} />; break;
                  case 'skills': SectionContentComponent = <SkillsSectionContent {...sectionProps} />; break;
                  case 'contact': SectionContentComponent = <ContactSectionContent {...sectionProps} />; break;
                  case 'location': SectionContentComponent = <LocationSectionContent {...sectionProps} />; break;
                  case 'website': SectionContentComponent = <WebsiteSectionContent {...sectionProps} />; break;
                  case 'linkedin': SectionContentComponent = <LinkedInSectionContent {...sectionProps} />; break;
                  case 'x_profile': SectionContentComponent = <XSectionContent {...sectionProps} />; break;
                  case 'instagram': SectionContentComponent = <InstagramSectionContent {...sectionProps} />; break;
                  
                  // Newly added cases
                  case 'experience': SectionContentComponent = <ExperienceSectionContent {...sectionProps} />; break;
                  case 'education': SectionContentComponent = <EducationSectionContent {...sectionProps} />; break;
                  case 'certifications': SectionContentComponent = <CertificationsSectionContent {...sectionProps} />; break;
                  case 'projects': SectionContentComponent = <ProjectsSectionContent {...sectionProps} />; break;
                  case 'publications': SectionContentComponent = <PublicationsSectionContent {...sectionProps} />; break;
                  case 'events': SectionContentComponent = <EventsSectionContent {...sectionProps} />; break;
                  case 'awards': SectionContentComponent = <AwardsSectionContent {...sectionProps} />; break;
                  case 'languages': SectionContentComponent = <LanguagesSectionContent {...sectionProps} />; break;
                  case 'testimonials': SectionContentComponent = <TestimonialsSectionContent {...sectionProps} />; break;
                  case 'services': SectionContentComponent = <ServicesSectionContent {...sectionProps} />; break;
                  case 'calendar_scheduling': SectionContentComponent = <CalendarSchedulingSectionContent {...sectionProps} />; break;
                  case 'contact_buttons': SectionContentComponent = <ContactButtonsSectionContent {...sectionProps} />; break;
                  case 'contact_form': SectionContentComponent = <ContactFormSectionContent {...sectionProps} />; break;
                  case 'newsletter_signup': SectionContentComponent = <NewsletterSignupSectionContent {...sectionProps} />; break;
                  
                  // Cases for components potentially not created yet (render placeholder)
                  case 'github_gitlab': SectionContentComponent = <GithubGitlabSectionContent {...sectionProps} />; break;
                  case 'dribbble_behance': SectionContentComponent = <DribbbleBehanceSectionContent {...sectionProps} />; break;
                  case 'youtube_channel': SectionContentComponent = <YoutubeChannelSectionContent {...sectionProps} />; break;
                  case 'tiktok': SectionContentComponent = <TiktokSectionContent {...sectionProps} />; break;
                  case 'facebook': SectionContentComponent = <FacebookSectionContent {...sectionProps} />; break;
                  case 'stackoverflow': SectionContentComponent = <StackoverflowSectionContent {...sectionProps} />; break;
                  case 'google_maps': SectionContentComponent = <GoogleMapsSectionContent {...sectionProps} />; break;
                  case 'timezone_hours': SectionContentComponent = <TimezoneHoursSectionContent {...sectionProps} />; break;
                  case 'download_cv': SectionContentComponent = <DownloadCvSectionContent {...sectionProps} />; break;
                  case 'statistics_proof': SectionContentComponent = <StatisticsProofSectionContent {...sectionProps} />; break;
                  case 'blog_articles': SectionContentComponent = <BlogArticlesSectionContent {...sectionProps} />; break;
                  case 'video_banner': SectionContentComponent = <VideoBannerSectionContent {...sectionProps} />; break;

                  default:
                    console.warn("Unknown section type:", section.id);
                    SectionContentComponent = null;
                }
                
                // Render ALL sections within the flex container using SortableCardSection
                return SectionContentComponent ? (
                  <SortableCardSection 
                    key={section.id} 
                    id={section.id} 
                    onRemove={onRemoveSection}
                    onClick={() => handleSectionClick(section)}
                    sectionData={section}
                    style={{ flex: '1 1 calc(50% - 8px)' }}
                  >
                    {/* Pass editing state and save handler to LanguageSectionContent */} 
                    {React.cloneElement(SectionContentComponent, {
                       isEditing: editingLanguageSectionId === section.id,
                       onSave: (newCodes) => {
                          if (onSaveLanguages) {
                              onSaveLanguages(newCodes); 
                          }
                          setEditingLanguageSectionId(null);
                       },
                       onCancel: () => setEditingLanguageSectionId(null)
                    })}
                  </SortableCardSection>
                ) : null;
              })}
            </div>
          </SortableContext>
          
          {/* Action Buttons */} 
          <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap' }}>
            <button 
              style={buttonStyle} 
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
             {/* ADDED: Save Layout Button */}
             <button 
               style={isSavingLayout ? disabledButtonStyle : buttonStyle} 
               onClick={onSaveLayoutClick} 
               disabled={isSavingLayout} // Disable button while saving
             >
               {isSavingLayout ? 'Saving Layout...' : 'Save Layout'}
             </button>
            <button 
              style={secondaryButtonStyle} 
              onClick={() => setShowQR(true)}
            >
              Share Profile
            </button>
            <button 
              style={{
                ...secondaryButtonStyle,
                backgroundColor: 'transparent',
                border: '1px solid #333',
                color: '#333',
              }} 
              onClick={copyProfileUrl}
            >
              Copy Profile Link
            </button>
          </div>
       </div> 
    </div>
  );
} 