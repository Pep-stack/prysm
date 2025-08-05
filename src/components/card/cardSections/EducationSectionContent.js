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
    console.log('🔍 Parsing education data:', {
      educationData,
      type: typeof educationData,
      isArray: Array.isArray(educationData)
    });
    
    if (Array.isArray(educationData)) {
      const filtered = educationData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof educationData === 'string' && educationData.trim()) {
      try {
        const parsed = JSON.parse(educationData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing education JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid education data found');
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

  // Format date for display
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

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNext(); // Swipe left = next
      } else {
        goToPrev(); // Swipe right = previous
      }
    }
  };

  // Render single education card
  const renderEducationCard = (entry, index, isCarousel = false) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: isCarousel ? '0' : '20px 0',
        borderBottom: (!isCarousel && index < initialEducationData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
        width: '100%'
      }}
    >
      {/* Header with degree and institution */}
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
              {entry.degree}{entry.field ? ` in ${entry.field}` : ''}
            </h4>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px'
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
                <LuMapPin size={10} style={{ color: 'white' }} />
              </div>
              <span style={{
                fontSize: '14px',
                color: textColor,
                fontWeight: '600',
                opacity: 0.9
              }}>
                {entry.institution}
              </span>
            </div>
          </div>
          
          {/* Current Education Badge */}
          {entry.current && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: textColor,
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <LuClock size={10} />
              Current
            </div>
          )}
        </div>
      </div>

      {/* Date range */}
      {(entry.startDate || entry.endDate || entry.current) && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          marginRight: '8px',
          marginBottom: '12px',
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
            {entry.startDate && (entry.endDate || entry.current) && ' — '}
            {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
          </span>
        </div>
      )}

      {/* Description */}
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

  // Render display UI
  if (initialEducationData.length > 0) {
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
      title="Click to edit education"
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
            <LuGraduationCap size={14} style={{ color: 'white' }} />
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
            Education
          </h3>
        </div>

        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current education */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderEducationCard(initialEducationData[currentIndex], currentIndex, true)}
          </div>

          {/* Dots indicator - Only show if more than 1 education entry */}
          {initialEducationData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {initialEducationData.map((_, index) => (
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
    // Empty state with standardized preview UI
    return (
      <div style={{
        ...placeholderStyle,
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
      }} title="Click to add education">
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
            <LuGraduationCap size={14} style={{ color: 'white' }} />
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
            Education
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          textAlign: 'center'
        }}>
          <LuGraduationCap size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ 
            margin: 0, 
            fontSize: '16px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            Click to add your educational background and achievements
          </p>
        </div>
      </div>
    );
  }
} 