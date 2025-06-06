'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuFolderOpen, LuCalendar, LuExternalLink, LuGithub, LuPlay, LuImage, LuChevronLeft, LuChevronRight, LuClock } from 'react-icons/lu';
import ProjectSelector from '../../shared/ProjectSelector';

export default function ProjectsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize projects data
  const parseProjectsData = (projectsData) => {
    if (Array.isArray(projectsData)) {
      return projectsData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof projectsData === 'string' && projectsData.trim()) {
      try {
        const parsed = JSON.parse(projectsData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
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
    setCurrentStartIndex(0);
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
  const maxVisibleProjects = 2; // 2 projects per view for better display
  const totalProjects = initialProjectsData.length;
  const needsCarousel = totalProjects > maxVisibleProjects;

  const goToNext = () => {
    if (needsCarousel) {
      setCurrentStartIndex((prev) => 
        prev + maxVisibleProjects >= totalProjects ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (needsCarousel) {
      setCurrentStartIndex((prev) => 
        prev === 0 ? Math.max(0, totalProjects - maxVisibleProjects) : prev - 1
      );
    }
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

  // Get visible projects
  const getVisibleProjects = () => {
    if (!needsCarousel) {
      return initialProjectsData;
    }
    return initialProjectsData.slice(currentStartIndex, currentStartIndex + maxVisibleProjects);
  };

  // Calculate grid columns based on number of projects
  const getGridColumns = (count) => {
    if (count === 1) return 1;
    return 2; // Maximum 2 projects side by side
  };

  // Render single project card
  const renderProjectCard = (entry, index) => {
    const statusDisplay = getStatusDisplay(entry.status);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          backgroundColor: 'white',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          cursor: entry.demoUrl ? 'pointer' : 'default',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
        onClick={() => entry.demoUrl && window.open(entry.demoUrl, '_blank')}
        onMouseEnter={(e) => {
          if (entry.demoUrl) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        }}
      >
        {/* Project Image/Video */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          backgroundColor: '#f8fafc',
          overflow: 'hidden'
        }}>
          {entry.mediaUrl ? (
            entry.mediaType === 'video' ? (
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
            )
          ) : (
            // Placeholder
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f1f5f9',
              border: '2px dashed #cbd5e1'
            }}>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <LuImage size={32} style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '500' }}>No Image</p>
              </div>
            </div>
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
              borderRadius: '12px'
            }}>
              <LuPlay size={10} />
              VIDEO
            </div>
          )}

          {/* Status Badge */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: statusDisplay.bgColor,
            color: statusDisplay.color,
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '12px',
            border: `1px solid ${statusDisplay.color}20`
          }}>
            <span>{statusDisplay.icon}</span>
            {statusDisplay.label}
          </div>
        </div>

        {/* Project Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Project Title */}
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '16px', 
            fontWeight: '700', 
            color: '#1e293b',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {entry.title || 'Untitled Project'}
          </h4>

          {/* Project Description */}
          {entry.description && (
            <p style={{ 
              margin: '0 0 12px 0', 
              fontSize: '13px', 
              color: '#64748b',
              lineHeight: '1.5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {entry.description}
            </p>
          )}

          {/* Project Date */}
          {(entry.startDate || entry.endDate) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px'
            }}>
              <LuCalendar size={12} style={{ color: '#64748b', flexShrink: 0 }} />
              <span style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {entry.startDate && formatDate(entry.startDate)}
                {entry.startDate && entry.endDate && ' - '}
                {entry.endDate && formatDate(entry.endDate)}
              </span>
            </div>
          )}

          {/* Technologies */}
          {entry.technologies && entry.technologies.length > 0 && (
            <div style={{ marginTop: 'auto' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginBottom: '8px',
                overflow: 'hidden',
                maxWidth: '100%'
              }}>
                {entry.technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      fontSize: '10px',
                      fontWeight: '500',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {entry.technologies.length > 4 && (
                  <span style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    padding: '2px 6px'
                  }}>
                    +{entry.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px'
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
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dbeafe';
                }}
              >
                <LuExternalLink size={10} />
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
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
              >
                <LuGithub size={10} />
                Code
              </a>
            )}
          </div>
        </div>
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
    const visibleProjects = getVisibleProjects();
    const gridColumns = getGridColumns(visibleProjects.length);
    
    return (
      <div style={{
        ...sectionStyle,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} title="Click to edit projects">
        <h3 style={sectionTitleStyle}>Projects & Portfolio</h3>

        <div style={{ position: 'relative' }}>
          {/* Carousel Navigation - Previous */}
          {needsCarousel && currentStartIndex > 0 && (
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.color = '#64748b';
              }}
            >
              <LuChevronLeft size={16} />
            </button>
          )}

          {/* Projects Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : `repeat(${gridColumns}, 1fr)`,
              gap: window.innerWidth <= 768 ? '16px' : '20px',
              touchAction: 'pan-y',
              userSelect: 'none',
              padding: window.innerWidth <= 768 ? '0 8px' : '0',
              overflow: 'hidden'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleProjects.map((entry, index) => 
              renderProjectCard(entry, currentStartIndex + index)
            )}
          </div>

          {/* Carousel Navigation - Next */}
          {needsCarousel && currentStartIndex + maxVisibleProjects < totalProjects && (
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.color = '#64748b';
              }}
            >
              <LuChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Carousel Dots Indicator */}
        {needsCarousel && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px'
          }}>
            {Array.from({ length: Math.ceil(totalProjects / maxVisibleProjects) }).map((_, groupIndex) => (
              <button
                key={groupIndex}
                onClick={() => setCurrentStartIndex(groupIndex * maxVisibleProjects)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: Math.floor(currentStartIndex / maxVisibleProjects) === groupIndex ? '#3b82f6' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: Math.floor(currentStartIndex / maxVisibleProjects) === groupIndex ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              />
            ))}
          </div>
        )}
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