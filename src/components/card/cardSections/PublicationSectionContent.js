'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuFileText, LuCalendar, LuExternalLink, LuStar } from 'react-icons/lu';
import PublicationSelector from '../../shared/PublicationSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function PublicationSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize publications data
  const parsePublicationsData = (publicationsData) => {
    if (Array.isArray(publicationsData)) {
      return publicationsData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof publicationsData === 'string' && publicationsData.trim()) {
      try {
        const parsed = JSON.parse(publicationsData);
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

  const initialPublicationsData = useMemo(() => {
    return parsePublicationsData(profile?.publications);
  }, [profile?.publications]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialPublicationsData);
    }
  }, [isEditing, initialPublicationsData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialPublicationsData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Format date for display (compact format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Get platform display info
  const getPlatformDisplay = (platform) => {
    const platformConfig = {
      'medium': { name: 'Medium', color: '#00AB6C' },
      'substack': { name: 'Substack', color: '#FF6719' },
      'personal blog': { name: 'Blog', color: '#6366F1' },
      'linkedin': { name: 'LinkedIn', color: '#0A66C2' },
      'dev.to': { name: 'Dev.to', color: '#0A0A0A' },
      'hashnode': { name: 'Hashnode', color: '#2962FF' },
      'blog': { name: 'Blog', color: '#6366F1' }
    };
    return platformConfig[platform?.toLowerCase()] || { name: platform || 'Article', color: '#6B7280' };
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialPublicationsData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialPublicationsData.length) % initialPublicationsData.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch handling for mobile carousel
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

  // Render individual publication card (compact design)
  const renderPublicationCard = (entry, index) => {
    const platformInfo = getPlatformDisplay(entry.platform);
    
    return (
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
          <h4 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600', 
            color: textColor,
            lineHeight: '1.3',
            flex: 1,
            letterSpacing: '-0.01em'
          }}>
            {entry.title || 'Untitled Publication'}
          </h4>
          {entry.featured && (
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#FFC107',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <LuStar size={8} style={{ color: 'white' }} />
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
          {/* Platform badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            backgroundColor: `${platformInfo.color}15`,
            borderRadius: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: platformInfo.color,
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '11px',
              color: textColor,
              fontWeight: '500',
              opacity: 0.8
            }}>
              {platformInfo.name}
            </span>
          </div>

          {/* Date */}
          {entry.date && (
            <span style={{
              fontSize: '11px',
              color: textColor,
              opacity: 0.6,
              fontWeight: '400'
            }}>
              {formatDate(entry.date)}
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

        {/* Action button */}
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              backgroundColor: `${textColor}08`,
              color: textColor,
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              alignSelf: 'flex-start',
              border: `1px solid ${textColor}15`
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${textColor}12`;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${textColor}08`;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <LuExternalLink size={10} />
            Read Article
          </a>
        )}
      </div>
    );
  };

  // If editing, show the selector
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Publications & Articles</h3>
        <PublicationSelector
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
            Save Publications
          </button>
        </div>
      </div>
    );
  }

  // If no publications, don't show section
  if (initialPublicationsData.length === 0) {
    return null;
  }

  // Show publications with clean, compact design
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
          <LuFileText style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Publications & Articles
        </h2>
      </div>

      {/* Compact content */}
      <div style={{ 
        marginBottom: initialPublicationsData.length > 1 ? '12px' : '0px'
      }}>
        {renderPublicationCard(initialPublicationsData[currentIndex], currentIndex)}
      </div>

      {/* Navigation dots */}
      {initialPublicationsData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {initialPublicationsData.map((_, index) => (
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