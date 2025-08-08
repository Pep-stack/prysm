'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuGraduationCap, LuCalendar, LuMapPin, LuClock } from 'react-icons/lu';
import EducationSelector from '../../shared/EducationSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function EducationSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize education data to prevent unnecessary recalculations
  const parseEducationData = (educationData) => {
    if (Array.isArray(educationData)) {
      return educationData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof educationData === 'string' && educationData.trim()) {
      try {
        const parsed = JSON.parse(educationData);
        if (Array.isArray(parsed)) {
          return parsed.filter(entry => entry && typeof entry === 'object');
        }
        return [];
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const initialEducationData = useMemo(() => {
    return parseEducationData(profile?.education);
  }, [profile?.education]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialEducationData);
    }
  }, [isEditing, initialEducationData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialEducationData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Format date for display (compact format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.length === 4) return dateString; // Just year
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialEducationData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialEducationData.length) % initialEducationData.length);
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

  // Render single education card (compact design)
  const renderEducationCard = (entry, index) => (
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
            {entry.degree}{entry.field ? ` in ${entry.field}` : ''}
          </h4>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '14px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            {entry.institution}
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

        {/* GPA */}
        {entry.gpa && (
          <span style={{
            fontSize: '11px',
            color: textColor,
            opacity: 0.6,
            fontWeight: '400'
          }}>
            GPA: {entry.gpa}
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
        <h3 style={sectionTitleStyle}>Edit Education</h3>
        <EducationSelector 
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
            Save Education
          </button>
        </div>
      </div>
    );
  }

  // If no education, don't show section
  if (initialEducationData.length === 0) {
    return null;
  }

  // Show education with clean, compact design
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
                      backgroundColor: settings.icon_color || '#6B7280',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LuGraduationCap style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Education
        </h2>
      </div>

      {/* Compact content */}
      <div style={{ 
        marginBottom: initialEducationData.length > 1 ? '12px' : '0px'
      }}>
        {renderEducationCard(initialEducationData[currentIndex], currentIndex)}
      </div>

      {/* Navigation dots */}
      {initialEducationData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {initialEducationData.map((_, index) => (
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