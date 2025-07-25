'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuFolderOpen, LuCalendar, LuExternalLink, LuGithub, LuPlay, LuImage, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import ProjectSelector from '../../shared/ProjectSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function ProjectsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize projects data
  const parseProjectsData = (projectsData) => {
    console.log('🔍 Parsing projects data:', {
      projectsData,
      type: typeof projectsData,
      isArray: Array.isArray(projectsData)
    });
    
    if (Array.isArray(projectsData)) {
      const filtered = projectsData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof projectsData === 'string' && projectsData.trim()) {
      try {
        const parsed = JSON.parse(projectsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing projects JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid projects data found');
    return [];
  };

  const initialProjectsData = useMemo(() => {
    return parseProjectsData(profile?.projects);
  }, [profile?.projects]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialProjectsData);
    }
  }, [isEditing, initialProjectsData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialProjectsData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.length === 4) return dateString; // Just year
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      'completed': { color: '#059669', bgColor: '#d1fae5', icon: '✓', label: 'Completed' },
      'ongoing': { color: '#0284c7', bgColor: '#dbeafe', icon: '⟳', label: 'Ongoing' },
      'archived': { color: '#6b7280', bgColor: '#f3f4f6', icon: '📦', label: 'Archived' },
      'paused': { color: '#d97706', bgColor: '#fef3c7', icon: '⏸', label: 'Paused' }
    };
    return statusConfig[status] || statusConfig['completed'];
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialProjectsData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialProjectsData.length) % initialProjectsData.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch handling for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNext(); // Swipe left = next
      } else {
        goToPrev(); // Swipe right = previous
      }
    }
  };

  // Render single project card
  const renderProjectCard = (entry, index, isCarousel = false) => {
    const statusDisplay = getStatusDisplay(entry.status);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialProjectsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* Header with project title and status */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700', 
                color: textColor,
                lineHeight: '1.3',
                marginBottom: '6px',
                letterSpacing: '-0.01em'
              }}>
                {entry.title || 'Untitled Project'}
              </h4>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                marginRight: '8px'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: statusDisplay.color,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}>
                  <span style={{ fontSize: '8px', color: 'white' }}>{statusDisplay.icon}</span>
                </div>
                <span style={{
                  fontSize: '12px',
                  color: textColor,
                  fontWeight: '600',
                  opacity: 0.9
                }}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Image/Video - Large display */}
        {entry.mediaUrl && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            {entry.mediaType === 'video' ? (
              <video
                src={entry.mediaUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                muted
                loop
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
            ) : (
              <img
                src={entry.mediaUrl}
                alt={entry.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            
            {/* Media Type Indicator */}
            {entry.mediaType === 'video' && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}>
                <LuPlay size={10} />
                VIDEO
              </div>
            )}
          </div>
        )}

        {/* Project Description */}
        {entry.description && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: textColor,
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {entry.description}
            </p>
          </div>
        )}

        {/* Project Details */}
        <div style={{ marginBottom: '16px' }}>
          {/* Project Date */}
          {(entry.startDate || entry.endDate) && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              marginRight: '8px',
              marginBottom: '8px',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: textColor,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}>
                <LuCalendar size={10} style={{ color: 'white' }} />
              </div>
              <span style={{
                fontSize: '12px',
                color: textColor,
                fontWeight: '500',
                opacity: 0.9
              }}>
                {entry.startDate && formatDate(entry.startDate)}
                {entry.startDate && entry.endDate && ' - '}
                {entry.endDate && formatDate(entry.endDate)}
              </span>
            </div>
          )}

          {/* Technologies */}
          {entry.technologies && entry.technologies.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '8px'
            }}>
              {entry.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: textColor,
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)'
                  }}
                >
                  {tech}
                </span>
              ))}
              {entry.technologies.length > 4 && (
                <span style={{
                  fontSize: '11px',
                  color: textColor,
                  padding: '4px 8px',
                  opacity: 0.7
                }}>
                  +{entry.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Links */}
        {(entry.demoUrl || entry.codeUrl) && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }}>
            {entry.demoUrl && (
              <a
                href={entry.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: textColor,
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                <LuExternalLink size={12} />
                Demo
              </a>
            )}
            {entry.codeUrl && (
              <a
                href={entry.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: textColor,
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <LuGithub size={12} />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Projects & Portfolio</h3>
        <ProjectSelector 
          value={currentSelection}
          onChange={setCurrentSelection}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Save Projects
          </button>
        </div>
      </div>
    );
  }

  // Render display UI
  if (initialProjectsData.length > 0) {
    return (
      <div style={{
        ...sectionStyle,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} 
      title="Click to edit projects"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      >
        {/* Title at the top of the container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: textColor,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <LuFolderOpen size={14} style={{ color: 'white' }} />
          </div>
          <h3 style={{
            ...sectionTitleStyle,
            fontSize: '18px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em',
            opacity: 0.9
          }}>
            Projects & Portfolio
          </h3>
        </div>

        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current project */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderProjectCard(initialProjectsData[currentIndex], currentIndex, true)}
          </div>

          {/* Dots indicator - Only show if more than 1 project */}
          {initialProjectsData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {initialProjectsData.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentIndex ? textColor : 'rgba(255, 255, 255, 0.4)',
                    opacity: index === currentIndex ? 0.8 : 0.4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Empty state
    return (
      <div style={placeholderStyle} title="Click to add projects">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
          textAlign: 'center',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: '#e2e8f0',
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            <LuFolderOpen size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#475569'
          }}>
            Showcase Your Projects
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            Click to add your portfolio projects with images, descriptions, and links
          </p>
        </div>
      </div>
    );
  }
} 