'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuBriefcase, LuCalendar, LuMapPin, LuClock, LuBuilding2 } from 'react-icons/lu';
import ExperienceSelector from '../../shared/ExperienceSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function ExperienceSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize experience data to prevent unnecessary recalculations
  const parseExperienceData = (experienceData) => {
    if (Array.isArray(experienceData)) {
      return experienceData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof experienceData === 'string' && experienceData.trim()) {
      try {
        const parsed = JSON.parse(experienceData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const initialExperienceData = useMemo(() => {
    return parseExperienceData(profile?.experience || profile?.workHistory);
  }, [profile?.experience, profile?.workHistory]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialExperienceData);
    }
  }, [isEditing, initialExperienceData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialExperienceData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate duration between two dates
  const calculateDuration = (startDate, endDate, isCurrent) => {
    if (!startDate) return '';
    
    const start = new Date(startDate + '-01');
    const end = isCurrent ? new Date() : new Date(endDate + '-01');
    
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      } else {
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
      }
    }
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialExperienceData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialExperienceData.length) % initialExperienceData.length);
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

  // Render single experience card
  const renderExperienceCard = (entry, index, isCarousel = false) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: isCarousel ? '0' : '20px 0',
        borderBottom: (!isCarousel && index < initialExperienceData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
        width: '100%'
      }}
    >
              {/* Header with job title and company */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              backgroundColor: '#374151',
              opacity: 0.8,
              borderRadius: '50%',
              flexShrink: 0,
              border: '3px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <LuBriefcase size={20} style={{ color: 'white' }} />
            </div>
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
                {entry.title || entry.position}
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
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}>
                  <LuBuilding2 size={10} style={{ color: 'white' }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: textColor,
                  fontWeight: '600',
                  opacity: 0.9
                }}>
                  {entry.company}
                </span>
              </div>
              {entry.location && (
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  marginTop: '6px',
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
                    backgroundColor: '#374151',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.6
                  }}>
                    <LuMapPin size={10} style={{ color: 'white' }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: textColor,
                    fontWeight: '500',
                    opacity: 0.8
                  }}>
                    {entry.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Job Badge */}
        {entry.current && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#374151',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            marginBottom: '12px'
          }}>
            <LuClock size={10} />
            Current
          </div>
        )}

      {/* Date range and duration */}
      {(entry.startDate || entry.endDate || entry.current) && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: entry.description ? '12px' : '0',
          padding: '10px 14px',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}>
              <LuCalendar size={14} style={{ color: 'white' }} />
            </div>
            <span style={{
              fontSize: '13px',
              color: textColor,
              fontWeight: '600',
              opacity: 0.9
            }}>
              {entry.startDate && formatDate(entry.startDate)}
              {entry.startDate && (entry.endDate || entry.current) && ' — '}
              {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
            </span>
          </div>
          {entry.startDate && (
            <span style={{
              fontSize: '12px',
              color: textColor,
              fontWeight: '500',
              padding: '4px 8px',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              opacity: 0.8
            }}>
              {calculateDuration(entry.startDate, entry.endDate, entry.current)}
            </span>
          )}
        </div>
      )}

      {/* Employment type */}
      {entry.type && (
        <div style={{
          display: 'inline-block',
          padding: '6px 12px',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'rgba(255, 255, 255, 0.4)',
          color: textColor,
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: '8px',
          marginBottom: entry.description ? '12px' : '0',
          marginTop: '8px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          {entry.type}
        </div>
      )}

      {/* Description */}
      {entry.description && (
        <div style={{
          padding: '16px 20px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
          marginTop: '12px'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: textColor, 
            lineHeight: '1.7',
            fontWeight: '500',
            opacity: 0.9
          }}>
            {entry.description}
          </p>
        </div>
      )}

      {/* Skills/Technologies */}
      {entry.skills && entry.skills.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            overflow: 'hidden',
            maxWidth: '100%'
          }}>
            {entry.skills.slice(0, 6).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: textColor,
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  opacity: 0.8
                }}
              >
                {skill}
              </span>
            ))}
            {entry.skills.length > 6 && (
              <span style={{
                fontSize: '11px',
                color: textColor,
                padding: '4px 8px',
                opacity: 0.6
              }}>
                +{entry.skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Work Experience</h3>
        <ExperienceSelector 
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
            Save Experience
          </button>
        </div>
      </div>
    );
  }

  // Render display UI
  if (initialExperienceData.length > 0) {
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
      title="Click to edit work experience"
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
            backgroundColor: '#374151',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <LuBriefcase size={14} style={{ color: 'white' }} />
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
            Work Experience
          </h3>
        </div>

        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current experience */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderExperienceCard(initialExperienceData[currentIndex], currentIndex, true)}
          </div>

          {/* Dots indicator - Only show if more than 1 experience */}
          {initialExperienceData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {initialExperienceData.map((_, index) => (
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
      <div style={placeholderStyle} title="Click to add work experience">
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
            <LuBriefcase size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#475569'
          }}>
            Share Your Work Experience
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            Click to add your professional journey and career highlights
          </p>
        </div>
      </div>
    );
  }
} 