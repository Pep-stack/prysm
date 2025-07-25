'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuAward, LuCalendar, LuBuilding2, LuExternalLink, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import CertificationSelector from '../../shared/CertificationSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function CertificationsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize certification data
  const parseCertificationData = (certificationData) => {
    console.log('🔍 Parsing certification data:', {
      certificationData,
      type: typeof certificationData,
      isArray: Array.isArray(certificationData)
    });
    
    if (Array.isArray(certificationData)) {
      const filtered = certificationData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof certificationData === 'string' && certificationData.trim()) {
      try {
        const parsed = JSON.parse(certificationData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing certification JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid certification data found');
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
    setCurrentStartIndex(0);
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
  const maxVisibleCerts = 4;
  const totalCerts = initialCertificationData.length;
  const needsCarousel = totalCerts > maxVisibleCerts;

  const goToNext = () => {
    if (needsCarousel) {
      setCurrentStartIndex((prev) => 
        prev + maxVisibleCerts >= totalCerts ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (needsCarousel) {
      setCurrentStartIndex((prev) => 
        prev === 0 ? Math.max(0, totalCerts - maxVisibleCerts) : prev - 1
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

  // Get visible certifications
  const getVisibleCertifications = () => {
    if (!needsCarousel) {
      return initialCertificationData;
    }
    return initialCertificationData.slice(currentStartIndex, currentStartIndex + maxVisibleCerts);
  };

  // Calculate grid columns based on number of certificates
  const getGridColumns = (count) => {
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4 or more
  };

  // Render single certification card
  const renderCertificationCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Certificate Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        backgroundColor: textColor,
        borderRadius: '8px',
        marginBottom: '12px',
        alignSelf: 'flex-start',
        opacity: 0.8
      }}>
        <LuAward size={16} style={{ color: 'white' }} />
      </div>

      {/* Certificate Title */}
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: textColor,
        lineHeight: '1.4',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        opacity: 0.9
      }}>
        {entry.name || entry.title || 'Certificate'}
      </h4>

      {/* Issuing Organization */}
      {entry.organization && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: textColor,
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6
          }}>
            <LuBuilding2 size={8} style={{ color: 'white' }} />
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '12px', 
            color: textColor,
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: 0.8
          }}>
            {entry.organization}
          </p>
        </div>
      )}

      {/* Date */}
      {entry.date && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: textColor,
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6
          }}>
            <LuCalendar size={8} style={{ color: 'white' }} />
          </div>
          <span style={{
            fontSize: '12px',
            color: textColor,
            fontWeight: '500',
            opacity: 0.8
          }}>
            {formatDate(entry.date)}
          </span>
        </div>
      )}

      {/* Credential ID */}
      {entry.credentialId && (
        <div style={{
          marginTop: 'auto',
          padding: '6px 8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          fontSize: '11px',
          color: textColor,
          fontFamily: 'monospace',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: 0.7
        }}>
          ID: {entry.credentialId}
        </div>
      )}

      {/* External Link */}
      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: textColor,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            opacity: 0.6
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.6';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <LuExternalLink size={14} />
        </a>
      )}
    </div>
  );

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Certifications & Licenses</h3>
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

  // Render display UI
  if (initialCertificationData.length > 0) {
    const visibleCertifications = getVisibleCertifications();
    const gridColumns = getGridColumns(visibleCertifications.length);
    
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
      title="Click to edit certifications"
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
            <LuAward size={14} style={{ color: 'white' }} />
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
            Certifications & Licenses
          </h3>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Carousel Navigation - Previous */}
          {needsCarousel && currentStartIndex > 0 && (
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <LuChevronLeft size={16} />
            </button>
          )}

          {/* Certifications Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: '16px',
              touchAction: 'pan-y',
              userSelect: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleCertifications.map((entry, index) => 
              renderCertificationCard(entry, currentStartIndex + index)
            )}
          </div>

          {/* Carousel Navigation - Next */}
          {needsCarousel && currentStartIndex + maxVisibleCerts < totalCerts && (
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
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
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {Array.from({ length: Math.ceil(totalCerts / maxVisibleCerts) }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                onClick={() => setCurrentStartIndex(groupIndex * maxVisibleCerts)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: Math.floor(currentStartIndex / maxVisibleCerts) === groupIndex ? textColor : 'rgba(255, 255, 255, 0.4)',
                  opacity: Math.floor(currentStartIndex / maxVisibleCerts) === groupIndex ? 0.8 : 0.4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
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
    );
  } else {
    // Empty state
    return (
      <div style={placeholderStyle} title="Click to add certifications">
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
            <LuAward size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#475569'
          }}>
            Showcase Your Certifications
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            Click to add your professional certifications and licenses
          </p>
        </div>
      </div>
    );
  }
} 