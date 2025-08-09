'use client';

import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaFolder, FaBriefcase } from 'react-icons/fa';
import { LuFolderOpen } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';
import ProjectSelector from '../../shared/ProjectSelector';

// Proper child component so hooks are used safely
function ProjectCard({ entry, index, isDarkTheme }) {
  const allMediaItems = entry.mediaItems && entry.mediaItems.length > 0
    ? entry.mediaItems
    : (entry.mediaUrl ? [{ url: entry.mediaUrl, type: entry.mediaType || 'image' }] : []);

  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [touchStartX, setTouchStartX] = React.useState(0);
  const cardBackgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.85)';
  const cardTextColor = '#ffffff';
  const cardSecondaryTextColor = isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)';

  const currentMedia = allMediaItems[currentMediaIndex];

  // Mount guard to avoid SSR hydration mismatches for interactive controls
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Touch/swipe handlers for mobile media navigation
  const handleTouchStart = (e) => {
    if (allMediaItems.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (allMediaItems.length <= 1 || !touchStartX) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left = next image
        setCurrentMediaIndex((prev) => 
          prev === allMediaItems.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe right = previous image
        setCurrentMediaIndex((prev) => 
          prev === 0 ? allMediaItems.length - 1 : prev - 1
        );
      }
    }
    setTouchStartX(0);
  };

  return (
    <div
      key={entry.id || index}
      style={{
        width: '100%',
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      <div
        className="project-card-hover"
        style={{
          backgroundColor: cardBackgroundColor,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isDarkTheme ? '0 2px 16px rgba(0, 0, 0, 0.3)' : '0 2px 16px rgba(0, 0, 0, 0.06)',
          border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {currentMedia?.url && (
          <div 
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              overflow: 'hidden',
              backgroundColor: isDarkTheme ? '#2a2a2a' : 'rgba(255, 255, 255, 0.1)',
              cursor: allMediaItems.length > 1 ? 'pointer' : 'default'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                loop
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={entry.title || 'Project image'}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Media dots indicator and counter for multiple media items - render after mount to avoid SSR mismatch */}
            {isMounted && allMediaItems.length > 1 && (
              <>
                {/* Image counter and swipe hint */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '11px', 
                    fontWeight: '600' 
                  }}>
                    {currentMediaIndex + 1}/{allMediaItems.length}
                  </span>
                </div>

                {/* Navigation dots */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                  {allMediaItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      style={{
                        width: idx === currentMediaIndex ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        border: 'none',
                        backgroundColor: idx === currentMediaIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                {/* Subtle swipe indicators on mobile */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '12px', 
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}>
                  <span style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '10px',
                    fontWeight: '500'
                  }}>
                    ← Swipe →
                  </span>
                </div>
              </>
            )}

            {/* Category badge */}
            {entry.category && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '6px',
                padding: '4px 8px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <span style={{ color: '#1a1a1a', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {entry.category}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Clean content area */}
        <div style={{ padding: '20px' }}>
          <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: cardTextColor, lineHeight: '1.3', letterSpacing: '-0.01em' }}>
            {entry.title || 'Untitled Project'}
          </h3>
          {entry.description && (
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: cardSecondaryTextColor,
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSectionContent({ profile, styles, isEditing, onSave, onCancel, onEdit }) {

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .project-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .project-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color and theme from design settings
  const textColor = settings.text_color || '#000000';
  const isDarkTheme = settings.theme === 'dark';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [currentSelection, setCurrentSelection] = useState([]);

  // Parse and memoize projects data
  const initialProjectsData = React.useMemo(() => {
    console.log('🔍 Parsing projects data:', {
      projectsData: profile?.projects,
      type: typeof profile?.projects,
      isArray: Array.isArray(profile?.projects)
    });

    if (!profile?.projects) {
      console.log('⚠️ No projects data found');
      return [];
    }

    let projectsArray = [];
    
    try {
      if (typeof profile.projects === 'string') {
        projectsArray = JSON.parse(profile.projects);
        console.log('✅ Parsed JSON string as array, filtered entries:', projectsArray.length);
      } else if (Array.isArray(profile.projects)) {
        projectsArray = profile.projects;
        console.log('✅ Using existing array, entries:', projectsArray.length);
      }
      
      // Filter out entries without required fields
      const filteredEntries = projectsArray.filter(entry => {
        const hasRequired = entry && (entry.title || entry.description || entry.mediaItems?.length > 0 || entry.mediaUrl);
        if (!hasRequired) {
          console.log('⚠️ Filtering out entry missing required fields:', entry);
        }
        return hasRequired;
      });
      
      console.log('📋 Filtered entries:', filteredEntries.map(entry => ({
        title: entry.title,
        hasMedia: !!(entry.mediaItems?.length || entry.mediaUrl)
      })));
      
      return filteredEntries;
    } catch (error) {
      console.error('💥 Error parsing projects data:', error);
      return [];
    }
  }, [profile?.projects]);

  // Custom portfolio title from first entry
  const portfolioTitle = React.useMemo(() => {
    if (initialProjectsData.length > 0 && initialProjectsData[0].portfolioTitle) {
      return initialProjectsData[0].portfolioTitle;
    }
    return 'Portfolio';
  }, [initialProjectsData]);

  // Touch/swipe handlers for mobile carousel
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextProject(); // Swipe left = next
      } else {
        prevProject(); // Swipe right = previous
      }
    }
  };

  const nextProject = () => {
    if (initialProjectsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialProjectsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevProject = () => {
    if (initialProjectsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialProjectsData.length - 1 : prev - 1
      );
    }
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit {portfolioTitle}</h3>
        <ProjectSelector 
          value={currentSelection}
          onChange={setCurrentSelection}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={onCancel} 
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              color: textColor,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(currentSelection)} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#007AFF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // Main component  
  if (initialProjectsData.length > 0) {
    return (
      <div 
        style={{
          ...sectionStyle,
          padding: '0',
          margin: '0',
          background: 'transparent',
          border: 'none',
          borderRadius: '0',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          width: '100%',
          fontFamily: settings.font_family || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
        onClick={onEdit}
      >
        {/* Clean section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: needsDarkIconBackground(settings.background_color) 
              ? '#000000' 
              : (settings.icon_color || '#6B7280'),
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaBriefcase style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Portfolio
          </h2>
        </div>

        {/* Projects content - All projects displayed vertically */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {initialProjectsData.map((project, index) => (
            <div key={project.id || index} style={{ width: '100%' }}>
              <ProjectCard entry={project} index={index} isDarkTheme={isDarkTheme} />
            </div>
          ))}
        </div>

        {/* Extra spacing at bottom */}
        <div style={{ marginBottom: '32px' }} />
      </div>
    );
  } else {
    // Clean empty state
    return (
      <div 
        style={{
          ...sectionStyle,
          textAlign: 'center',
          opacity: 0.6,
          cursor: 'pointer'
        }}
        onClick={onEdit}
      >
        <div style={{
          padding: '40px 20px',
          border: `2px dashed ${isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '12px',
          backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
        }}>
          <LuFolderOpen 
            style={{ 
              fontSize: '24px', 
              color: textColor, 
              opacity: 0.5,
              marginBottom: '12px'
            }} 
          />
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: textColor,
            opacity: 0.7
          }}>
            No portfolio items yet. Click to add your first project.
          </p>
        </div>
      </div>
    );
  }
} 