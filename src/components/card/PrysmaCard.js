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

export default function PrysmaCard({ profile, user, cardSections = [], onRemoveSection, onEditSection, onAvatarClick }) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  
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
            {/* ADDED: Wrapper div for flex layout */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}> 
              {cardSections.map((section) => {
                let SectionContentComponent = null;

                // Map section ID to the correct content component and required styles
                switch (section.id) {
                  case 'bio':
                    SectionContentComponent = (
                      <BioSectionContent profile={profile} styles={{ sectionStyle, placeholderStyle }} />
                    );
                    break;
                  case 'skills':
                    SectionContentComponent = (
                      <SkillsSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, tagStyle, placeholderStyle }} />
                    );
                    break;
                  case 'contact':
                    // Contact section is rendered directly (not sortable)
                    SectionContentComponent = (
                      <ContactSectionContent user={user} styles={{ sectionStyle, sectionTitleStyle }} />
                    );
                    break;
                 case 'location':
                    SectionContentComponent = (
                      <LocationSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, placeholderStyle }} />
                    );
                    break;
                 case 'website':
                    SectionContentComponent = (
                      <WebsiteSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, placeholderStyle }} />
                    );
                    break;
                 case 'linkedin':
                    SectionContentComponent = (
                      <LinkedInSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, placeholderStyle }} />
                    );
                    break;
                 case 'x_profile':
                    SectionContentComponent = (
                      <XSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, placeholderStyle }} />
                    );
                    break;
                 case 'instagram':
                    SectionContentComponent = (
                      <InstagramSectionContent profile={profile} styles={{ sectionStyle, sectionTitleStyle, placeholderStyle }} />
                    );
                    break;
                  default:
                    // Optionally handle unknown section types
                    console.warn("Unknown section type:", section.id);
                    SectionContentComponent = null;
                }
                
                // Render Contact directly, others within SortableCardSection
                if (section.id === 'contact') {
                  // Contact might need specific styling if it's outside the flex wrapper now or inside?
                  // For now, let's keep it outside the flex wrapper if it should remain full width
                  // Or include it if it should also flex. Let's assume it stays outside for now.
                  // return SectionContentComponent; 
                   return null; // Let's render contact separately below the flex container
                }
                
                // Render sortable sections within the flex container
                return SectionContentComponent ? (
                  <SortableCardSection 
                    key={section.id} 
                    id={section.id} 
                    onRemove={onRemoveSection}
                    onClick={onEditSection} // Pass handler for clicking the section
                    sectionData={section}   // Pass section data for the onClick handler
                    // ADDED: Style for flex item (optional, controls width/basis)
                    style={{ flex: '1 1 calc(50% - 8px)' }} // Example: aim for 2 columns, adjust gap
                  >
                    {SectionContentComponent}
                  </SortableCardSection>
                ) : null;
              })}
            </div>
             {/* Render Contact section separately if it exists and should be full width */}
             {cardSections.find(s => s.id === 'contact') && (
               <ContactSectionContent 
                 user={user} 
                 styles={{ sectionStyle: {...sectionStyle, marginTop: '16px'}, sectionTitleStyle }} // Add margin top
               />
             )}
          </SortableContext>
          
          {/* Action Buttons */} 
          <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap' }}>
            <button 
              style={buttonStyle} 
              onClick={handleEditProfile}
            >
              Edit Profile
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