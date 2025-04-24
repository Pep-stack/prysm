'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Section Component ---
function SortableCardSection({ id, children, onRemove, onClick, sectionData }) {
  console.log('SortableCardSection rendered. id:', id, 'onRemove exists:', !!onRemove, 'onClick exists:', !!onClick);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    border: isDragging ? '1px dashed gray' : '1px solid #eee',
    padding: '10px',
    paddingLeft: '30px', // Make space for drag handle
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const dragHandleStyle = {
    position: 'absolute',
    left: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'grab',
    padding: '5px',
    color: '#888',
    touchAction: 'none', // Important for dnd-kit listeners
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    lineHeight: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 1,
    display: isDragging ? 'none' : 'block',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={() => {
         if (onClick) onClick(sectionData);
      }}
    >
      <span 
        style={dragHandleStyle} 
        {...listeners} 
        {...attributes}
        aria-label="Drag to reorder section"
      >
        ⠿ {/* Grip icon */} 
      </span>
      
      {children}
      
      <button 
        style={removeButtonStyle} 
        onClick={(e) => {
          e.stopPropagation();
          console.log('Remove button clicked for id:', id); 
          if (onRemove) onRemove(id); 
        }}
        aria-label={`Remove ${id} section`}
      >
        X
      </button>
    </div>
  );
}
// --- End Sortable Section Component ---

export default function PrysmaCard({ profile, user, cardSections = [], onRemoveSection, onEditSection }) {
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
        <div style={avatarStyle}>
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile?.name || user?.email} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            getInitials(profile?.name)
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
          let sectionContent = null;
          let isPlaceholder = false;

          switch (section.id) {
            case 'bio':
              if (profile?.bio) {
                sectionContent = <div style={sectionStyle}><p style={{ lineHeight: '1.5' }}>{profile.bio}</p></div>;
              } else {
                 sectionContent = <div style={placeholderStyle}><p>Click to add your Bio</p></div>;
                 isPlaceholder = true;
              }
              break;
            case 'skills':
              if (profile?.skills) {
                sectionContent = (
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Skills</h3>
                    <div>
                      {profile.skills.split(',').map((skill, index) => (
                        <span key={index} style={tagStyle}>{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                );
              } else {
                 sectionContent = <div style={placeholderStyle}><p>Click to add your Skills</p></div>;
                 isPlaceholder = true;
              }
              break;
            case 'contact':
               sectionContent = (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>Contact</h3>
                  <div><p style={{ margin: '5px 0' }}><strong>Email:</strong> {user?.email}</p></div>
                </div>
              );
              break;
             case 'location':
              if (profile?.location) {
                 sectionContent = (
                   <div style={sectionStyle}>
                     <h3 style={sectionTitleStyle}>Location</h3>
                     <p style={{ margin: '5px 0' }}>{profile.location}</p>
                   </div>
                 );
              } else {
                 sectionContent = <div style={placeholderStyle}><p>Click to add your Location</p></div>;
                 isPlaceholder = true;
              }
              break;
             case 'website':
              if (profile?.website) {
                 sectionContent = (
                    <div style={sectionStyle}>
                      <h3 style={sectionTitleStyle}>Website</h3>
                      <p style={{ margin: '5px 0' }}>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>
                          {profile.website}
                        </a>
                      </p>
                    </div>
                 );
              } else {
                 sectionContent = <div style={placeholderStyle}><p>Click to add your Website</p></div>;
                 isPlaceholder = true;
              }
              break;
            default:
              sectionContent = null;
          }
          
          if (section.id === 'contact') {
             return sectionContent;
          }
          
          return sectionContent ? (
            <SortableCardSection 
              key={section.id} 
              id={section.id} 
              onRemove={onRemoveSection}
              onClick={onEditSection}
              sectionData={section}
            >
              {sectionContent}
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
      
      {/* Instructions if profile is incomplete */}
      {(!profile?.name || !profile?.headline || !profile?.bio) && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff9c4', 
          borderRadius: '6px',
          fontSize: '14px',
        }}>
          <p style={{ margin: 0 }}>
            <strong>Tip:</strong> Complete your Prysma Card to share your professional profile
          </p>
        </div>
      )}
    </div>
  );
} 