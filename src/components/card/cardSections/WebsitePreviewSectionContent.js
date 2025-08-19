'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuGlobe, LuExternalLink, LuImage } from 'react-icons/lu';
import WebsitePreviewEditor from '../../shared/WebsitePreviewEditor';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function WebsitePreviewSectionContent({ profile, styles, isEditing, onSave, onCancel, onEdit }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color and theme from design settings
  const textColor = settings.text_color || '#000000';
  const isDarkTheme = settings.theme === 'dark';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize website preview data
  const parseWebsitePreviewData = (websitePreviewData) => {
    console.log('🔍 Parsing website preview data:', {
      websitePreviewData,
      type: typeof websitePreviewData,
      isArray: Array.isArray(websitePreviewData)
    });
    
    if (Array.isArray(websitePreviewData)) {
      const filtered = websitePreviewData.filter(entry => 
        entry && 
        typeof entry === 'object' && 
        (entry.title || entry.subtitle || entry.website_url)
      );
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof websitePreviewData === 'string' && websitePreviewData.trim()) {
      try {
        const parsed = JSON.parse(websitePreviewData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => 
            entry && 
            typeof entry === 'object' && 
            (entry.title || entry.subtitle || entry.website_url)
          );
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing website preview JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid website preview data found');
    return [];
  };

  const initialWebsitePreviewData = useMemo(() => {
    return parseWebsitePreviewData(profile?.website_preview);
  }, [profile?.website_preview]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialWebsitePreviewData);
    }
  }, [isEditing, initialWebsitePreviewData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialWebsitePreviewData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialWebsitePreviewData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialWebsitePreviewData.length) % initialWebsitePreviewData.length);
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

  // Handle website click
  const handleWebsiteClick = (websiteUrl) => {
    if (websiteUrl) {
      // Ensure URL has protocol
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Render single website preview card
  const renderWebsitePreviewCard = (entry, index, isCarousel = false) => {
    // Use theme-aware text colors instead of hardcoded white
    const cardTextColor = textColor;
    const cardSecondaryTextColor = textColor;
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          marginBottom: isCarousel ? '0' : '16px',
          width: '100%',
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <div
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0',
            overflow: 'visible',
            boxShadow: 'none',
            border: 'none',
            marginBottom: isCarousel ? '0' : '16px',
            paddingBottom: isCarousel ? '0' : '12px',
            borderBottom: (!isCarousel && index < initialWebsitePreviewData.length - 1) ? `1px solid ${textColor}15` : 'none'
          }}
        >
          <div style={{ 
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Logo/Image on the left */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              backgroundColor: `${cardTextColor}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {entry.logo_url ? (
                <img
                  src={entry.logo_url}
                  alt={entry.title || 'Website logo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <LuGlobe style={{ 
                  color: cardTextColor, 
                  fontSize: '32px',
                  opacity: 0.7
                }} />
              )}
            </div>

            {/* Content on the right */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <h3 style={{ 
                margin: '0 0 2px 0', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: cardTextColor,
                lineHeight: '1.3',
                letterSpacing: '-0.01em'
              }}>
                {entry.title || 'My Website'}
              </h3>
              
              {/* Subtitle */}
              {entry.subtitle && (
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '13px',
                  color: cardSecondaryTextColor,
                  opacity: 0.7,
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {entry.subtitle}
                </p>
              )}
              
              {/* Button */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: `${cardTextColor}15`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: cardTextColor,
                  opacity: 0.9,
                  border: `1px solid ${cardTextColor}30`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWebsiteClick(entry.website_url);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${cardTextColor}25`;
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = `${cardTextColor}15`;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>{entry.button_text || 'Visit Website'}</span>
                <LuExternalLink size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Website Preview</h3>
        <WebsitePreviewEditor 
          value={currentSelection}
          onChange={setCurrentSelection}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={onCancel} 
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              color: textColor,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#007AFF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // Render display UI
  if (initialWebsitePreviewData.length > 0) {
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
        onClick={onEdit}
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
            backgroundColor: needsDarkIconBackground(settings.background_color) 
              ? '#000000' 
              : (settings.icon_color || '#6B7280'),
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LuGlobe style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Website
          </h2>
        </div>

        {/* Website preview content */}
        <div style={{ position: 'relative' }}>
          {initialWebsitePreviewData.length === 1 ? (
            // Single website preview
            renderWebsitePreviewCard(initialWebsitePreviewData[0], 0, false)
          ) : (
            // Carousel for multiple website previews
            <>
              <div style={{ 
                overflow: 'hidden',
                width: '100%'
              }}>
                {renderWebsitePreviewCard(initialWebsitePreviewData[currentIndex], currentIndex, true)}
              </div>

              {/* Navigation dots */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)'
              }}>
                {initialWebsitePreviewData.map((_, index) => (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>


      </div>
    );
  } else {
    // Clean empty state
    return (
      <div 
        style={{
          ...sectionStyle,
          textAlign: 'center',
          opacity: 0.6,
          cursor: 'pointer'
        }}
        onClick={onEdit}
      >
        <div style={{
          padding: '40px 20px',
          border: `2px dashed ${isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '12px',
          backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
        }}>
          <LuGlobe 
            style={{ 
              fontSize: '24px', 
              color: textColor, 
              opacity: 0.5,
              marginBottom: '12px'
            }} 
          />
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: textColor,
            opacity: 0.7
          }}>
            No website preview yet. Click to add your website.
          </p>
        </div>
      </div>
    );
  }
}
