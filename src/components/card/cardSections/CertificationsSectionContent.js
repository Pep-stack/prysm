'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuAward, LuCalendar, LuBuilding2, LuExternalLink } from 'react-icons/lu';
import CertificationSelector from '../../shared/CertificationSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function CertificationsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize certification data
  const parseCertificationData = (certificationData) => {
    if (Array.isArray(certificationData)) {
      return certificationData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof certificationData === 'string' && certificationData.trim()) {
      try {
        const parsed = JSON.parse(certificationData);
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

  const initialCertificationData = useMemo(() => {
    return parseCertificationData(profile?.certifications);
  }, [profile?.certifications]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialCertificationData);
    }
  }, [isEditing, initialCertificationData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialCertificationData.length]);

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
    setCurrentIndex((prev) => (prev + 1) % initialCertificationData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialCertificationData.length) % initialCertificationData.length);
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

  // Render single certification card (compact design)
  const renderCertificationCard = (entry, index) => (
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
            {entry.name || entry.title || 'Certificate'}
          </h4>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '14px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            {entry.issuer || entry.organization}
          </p>
        </div>
        {entry.credentialUrl && (
          <a 
            href={entry.credentialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '2px 6px',
              backgroundColor: '#3B82F6',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexShrink: 0
            }}
          >
            <LuExternalLink size={8} />
            View
          </a>
        )}
      </div>

      {/* Compact meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Issue date */}
        {entry.issueDate && (
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
              {formatDate(entry.issueDate)}
              {entry.expiryDate && ` - ${formatDate(entry.expiryDate)}`}
            </span>
          </div>
        )}

        {/* Credential ID */}
        {entry.credentialId && (
          <span style={{
            fontSize: '11px',
            color: textColor,
            opacity: 0.6,
            fontWeight: '400'
          }}>
            ID: {entry.credentialId}
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
        <h3 style={sectionTitleStyle}>Edit Certifications</h3>
        <CertificationSelector 
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
            Save Certifications
          </button>
        </div>
      </div>
    );
  }

  // If no certifications, don't show section
  if (initialCertificationData.length === 0) {
    return null;
  }

  // Show certifications with clean, compact design
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
          <LuAward style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Certifications
        </h2>
      </div>

      {/* Compact content */}
      <div style={{ 
        marginBottom: initialCertificationData.length > 1 ? '12px' : '0px'
      }}>
        {renderCertificationCard(initialCertificationData[currentIndex], currentIndex)}
      </div>

      {/* Navigation dots */}
      {initialCertificationData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {initialCertificationData.map((_, index) => (
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