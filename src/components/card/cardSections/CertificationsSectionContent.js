'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuAward, LuCalendar, LuBuilding2, LuExternalLink, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import CertificationSelector from '../../shared/CertificationSelector';

export default function CertificationsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize certification data
  const parseCertificationData = (certificationData) => {
    if (Array.isArray(certificationData)) {
      return certificationData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof certificationData === 'string' && certificationData.trim()) {
      try {
        const parsed = JSON.parse(certificationData);
        return Array.isArray(parsed) ? parsed : [];
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
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        backgroundColor: 'white',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Certificate Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        marginBottom: '12px',
        alignSelf: 'flex-start'
      }}>
        <LuAward size={16} style={{ color: '#475569' }} />
      </div>

      {/* Certificate Title */}
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#1e293b',
        lineHeight: '1.4',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
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
          <LuBuilding2 size={12} style={{ color: '#64748b', flexShrink: 0 }} />
          <p style={{ 
            margin: 0, 
            fontSize: '12px', 
            color: '#475569',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
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
          <LuCalendar size={12} style={{ color: '#64748b', flexShrink: 0 }} />
          <span style={{
            fontSize: '12px',
            color: '#64748b',
            fontWeight: '500'
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
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#64748b',
          fontFamily: 'monospace'
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
            color: '#64748b',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.target.style.color = '#64748b'}
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
      <div style={sectionStyle} title="Click to edit certifications">
        <h3 style={sectionTitleStyle}>Certifications & Licenses</h3>

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
                border: '1px solid #e2e8f0',
                backgroundColor: 'transparent',
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
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
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
                border: '1px solid #e2e8f0',
                backgroundColor: 'transparent',
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
                e.target.style.backgroundColor = 'transparent';
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
            marginTop: '20px'
          }}>
            {Array.from({ length: Math.ceil(totalCerts / maxVisibleCerts) }).map((_, groupIndex) => (
              <button
                key={groupIndex}
                onClick={() => setCurrentStartIndex(groupIndex * maxVisibleCerts)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: Math.floor(currentStartIndex / maxVisibleCerts) === groupIndex ? '#3b82f6' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: Math.floor(currentStartIndex / maxVisibleCerts) === groupIndex ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
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