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
  const cardStyle = {
    border: isOver ? '2px dashed #0070f3' : '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: isOver ? '#f0f8ff' : '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '400px',
    margin: '30px auto',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
  };
  
  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };
  
  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#666',
    fontWeight: 'bold',
    marginRight: '20px',
    overflow: 'hidden',
  };
  
  const nameStyle = {
    margin: '0 0 5px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  };
  
  const headlineStyle = {
    margin: '0',
    color: '#666',
    fontSize: '16px',
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
      {/* QR Code Overlay */}
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
      
      {/* Card Header with Avatar and Name */}
      <div style={cardHeaderStyle}>
        <div 
          style={{...avatarStyle, cursor: 'pointer', position: 'relative'}}
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
            <span style={{cursor: 'pointer'}}> 
               {getInitials(profile?.name)}
            </span>
          )}
        </div>
        <div>
          <h2 style={nameStyle}>{profile?.name || 'Your Name'}</h2>
          <p style={headlineStyle}>{profile?.headline || 'Add a headline to your profile'}</p>
        </div>
      </div>
      
      {/* --- Dynamically Rendered & Sortable Sections --- */}
      <SortableContext items={cardSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
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
            default:
              // Optionally handle unknown section types
              console.warn("Unknown section type:", section.id);
              SectionContentComponent = null;
          }
          
          // Render Contact directly, others within SortableCardSection
          if (section.id === 'contact') {
             return SectionContentComponent; // Render directly
          }
          
          // Render sortable sections
          return SectionContentComponent ? (
            <SortableCardSection 
              key={section.id} 
              id={section.id} 
              onRemove={onRemoveSection}
              onClick={onEditSection} // Pass handler for clicking the section
              sectionData={section}   // Pass section data for the onClick handler
            >
              {SectionContentComponent}
            </SortableCardSection>
          ) : null;
        })}
      </SortableContext>
      {/* --- End Dynamically Rendered Sections --- */}
      
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
  );
} 