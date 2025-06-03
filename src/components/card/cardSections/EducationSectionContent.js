'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuGraduationCap, LuCalendar, LuMapPin, LuClock } from 'react-icons/lu';
import EducationSelector from '../../shared/EducationSelector';

export default function EducationSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
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
        return Array.isArray(parsed) ? parsed : [];
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
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
  const renderEducationCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        minHeight: '200px',
        width: '100%'
      }}
    >
      {/* Current Education Badge */}
      {entry.current && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: '#10b981',
          color: 'white',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <LuClock size={10} />
          Current
        </div>
      )}
      
      {/* Header with degree and institution */}
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
            flexShrink: 0
          }}>
            <LuGraduationCap size={20} style={{ color: '#64748b' }} />
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
              {entry.degree}{entry.field ? ` in ${entry.field}` : ''}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: '15px', 
              color: '#475569',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <LuMapPin size={14} style={{ color: '#64748b', flexShrink: 0 }} />
              {entry.institution}
            </p>
          </div>
        </div>
      </div>

      {/* Date range */}
      {(entry.startDate || entry.endDate || entry.current) && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: entry.description ? '12px' : '0',
          padding: '8px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <LuCalendar size={14} style={{ color: '#64748b', flexShrink: 0 }} />
          <span style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {entry.startDate && formatDate(entry.startDate)}
            {entry.startDate && (entry.endDate || entry.current) && ' — '}
            {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
          </span>
        </div>
      )}

      {/* Description */}
      {entry.description && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          borderLeft: '3px solid #e2e8f0'
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
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
    const useCarousel = initialEducationData.length > 1 && initialEducationData[0]?.useCarousel;
    
    return (
      <div style={sectionStyle} title="Click to edit education">
        <h3 style={sectionTitleStyle}>Education</h3>

        {useCarousel ? (
          // Carousel View
          <div>
            <div 
              style={{ 
                touchAction: 'pan-y',
                userSelect: 'none'
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {initialEducationData[currentIndex] && 
                renderEducationCard(initialEducationData[currentIndex], currentIndex)
              }
            </div>

            {/* Navigation dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {initialEducationData.map((_, index) => (
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
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // List View
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {initialEducationData.map((entry, index) => renderEducationCard(entry, index))}
          </div>
        )}
      </div>
    );
  } else {
    // Empty state
    return (
      <div style={placeholderStyle} title="Click to edit education">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <LuGraduationCap size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Click to add your education history
          </p>
        </div>
      </div>
    );
  }
} 