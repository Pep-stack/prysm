'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuBriefcase, LuCalendar, LuMapPin, LuClock, LuBuilding2 } from 'react-icons/lu';
import ExperienceSelector from '../../shared/ExperienceSelector';

export default function ExperienceSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
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
  const renderExperienceCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: window.innerWidth <= 768 ? '16px' : '20px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        minHeight: window.innerWidth <= 768 ? '160px' : '200px',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Current Job Badge */}
      {entry.current && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: '#059669',
          color: 'white',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
        }}>
          <LuClock size={10} />
          Current
        </div>
      )}
      
      {/* Header with job title and company */}
      <div style={{ marginBottom: '16px', paddingRight: entry.current ? '70px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            flexShrink: 0,
            border: '2px solid #e2e8f0'
          }}>
            <LuBriefcase size={20} style={{ color: '#475569' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b',
              lineHeight: '1.4',
              marginBottom: '4px'
            }}>
              {entry.title || entry.position}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: '15px', 
              color: '#475569',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px'
            }}>
              <LuBuilding2 size={14} style={{ color: '#64748b', flexShrink: 0 }} />
              {entry.company}
            </p>
            {entry.location && (
              <p style={{ 
                margin: 0, 
                fontSize: '13px', 
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <LuMapPin size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                {entry.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Date range and duration */}
      {(entry.startDate || entry.endDate || entry.current) && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: entry.description ? '12px' : '0',
          padding: '8px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <LuCalendar size={14} style={{ color: '#64748b', flexShrink: 0 }} />
            <span style={{
              fontSize: '13px',
              color: '#475569',
              fontWeight: '500'
            }}>
              {entry.startDate && formatDate(entry.startDate)}
              {entry.startDate && (entry.endDate || entry.current) && ' — '}
              {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
            </span>
          </div>
          {entry.startDate && (
            <span style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              padding: '2px 8px',
              backgroundColor: '#e2e8f0',
              borderRadius: '6px'
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
          padding: '4px 10px',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          fontSize: '12px',
          fontWeight: '500',
          borderRadius: '8px',
          marginBottom: entry.description ? '12px' : '0'
        }}>
          {entry.type}
        </div>
      )}

      {/* Description */}
      {entry.description && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          borderLeft: '3px solid #e2e8f0',
          marginTop: '12px'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#475569', 
            lineHeight: '1.6'
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
                  padding: '3px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              >
                {skill}
              </span>
            ))}
            {entry.skills.length > 6 && (
              <span style={{
                fontSize: '11px',
                color: '#6b7280',
                padding: '3px 8px'
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
    const useCarousel = initialExperienceData.length > 1 && initialExperienceData[0]?.useCarousel;
    
    return (
      <div style={{
        ...sectionStyle,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} title="Click to edit work experience">
        <h3 style={sectionTitleStyle}>Work Experience</h3>

        {useCarousel ? (
          // Carousel View
          <div>
            <div 
              style={{ 
                touchAction: 'pan-y',
                userSelect: 'none',
                overflow: 'hidden',
                width: '100%'
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {initialExperienceData[currentIndex] && 
                renderExperienceCard(initialExperienceData[currentIndex], currentIndex)
              }
            </div>

            {/* Navigation dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {initialExperienceData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentIndex ? '#3b82f6' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: index === currentIndex ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // List View
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            overflow: 'hidden',
            width: '100%'
          }}>
            {initialExperienceData.map((entry, index) => renderExperienceCard(entry, index))}
          </div>
        )}
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