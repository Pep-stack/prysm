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

  // Format date for display (compact format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate duration between two dates (compact format)
  const calculateDuration = (startDate, endDate, isCurrent) => {
    if (!startDate) return '';
    
    const start = new Date(startDate + '-01');
    const end = isCurrent ? new Date() : new Date(endDate + '-01');
    
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    if (diffMonths < 12) {
      return `${diffMonths}m`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      
      if (months === 0) {
        return `${years}y`;
      } else {
        return `${years}y ${months}m`;
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

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Render single experience card (compact design)
  const renderExperienceCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
      }}
    >
      {/* Compact header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600', 
            color: textColor,
            lineHeight: '1.3',
            letterSpacing: '-0.01em'
          }}>
            {entry.title || entry.position}
          </h4>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '14px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            {entry.company}
          </p>
        </div>
        {entry.current && (
          <div style={{
            padding: '2px 6px',
            backgroundColor: '#10B981',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            Current
          </div>
        )}
      </div>

      {/* Compact meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Date range */}
        {(entry.startDate || entry.endDate || entry.current) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            backgroundColor: `${textColor}15`,
            borderRadius: '4px'
          }}>
            <LuCalendar size={10} style={{ color: textColor, opacity: 0.6 }} />
            <span style={{
              fontSize: '11px',
              color: textColor,
              fontWeight: '500',
              opacity: 0.8
            }}>
              {entry.startDate && formatDate(entry.startDate)}
              {entry.startDate && (entry.endDate || entry.current) && ' - '}
              {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
              {entry.startDate && (
                <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                  ({calculateDuration(entry.startDate, entry.endDate, entry.current)})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Location */}
        {entry.location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            backgroundColor: `${textColor}15`,
            borderRadius: '4px'
          }}>
            <LuMapPin size={10} style={{ color: textColor, opacity: 0.6 }} />
            <span style={{
              fontSize: '11px',
              color: textColor,
              fontWeight: '500',
              opacity: 0.8
            }}>
              {entry.location}
            </span>
          </div>
        )}

        {/* Employment type */}
        {entry.type && (
          <span style={{
            fontSize: '11px',
            color: textColor,
            opacity: 0.6,
            fontWeight: '400'
          }}>
            {entry.type}
          </span>
        )}
      </div>

      {/* Compact description (optional, truncated) */}
      {entry.description && (
        <p style={{ 
          margin: 0, 
          fontSize: '13px', 
          color: textColor,
          lineHeight: '1.4',
          opacity: 0.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {entry.description}
        </p>
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

  // If no experience, don't show section
  if (initialExperienceData.length === 0) {
    return null;
  }

  // Show experience with clean, compact design
  return (
    <div 
      style={{
        ...sectionStyle,
        padding: '16px',
        margin: '0 0 42px 0',
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: '12px',
        boxShadow: 'none',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        width: '100%',
        fontFamily: settings.font_family || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Clean section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#6B7280',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LuBriefcase style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Work Experience
        </h2>
      </div>

      {/* Compact content */}
      <div style={{ 
        marginBottom: initialExperienceData.length > 1 ? '12px' : '0px'
      }}>
        {renderExperienceCard(initialExperienceData[currentIndex], currentIndex)}
      </div>

      {/* Navigation dots */}
      {initialExperienceData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {initialExperienceData.map((_, index) => (
            <button
              key={index}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentIndex 
                  ? textColor
                  : `${textColor}30`,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)'
              }}
              onClick={() => goToSlide(index)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 