'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuImage } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function GallerySectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Parse and memoize gallery data
  const parseGalleryData = (galleryData) => {
    if (Array.isArray(galleryData)) {
      return galleryData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof galleryData === 'string' && galleryData.trim()) {
      try {
        const parsed = JSON.parse(galleryData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const galleryData = useMemo(() => {
    return parseGalleryData(profile?.gallery);
  }, [profile?.gallery]);

  // Get display type from the first gallery item
  const displayType = galleryData.length > 0 ? galleryData[0]?.displayType || 'standard' : 'standard';

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [galleryData.length]);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(galleryData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const nextImage = () => {
    if (displayType === 'mobile') {
      // For mobile carousel, cycle through all images
      setCurrentIndex((prevIndex) => 
        prevIndex === galleryData.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      // For standard gallery, cycle through all images
      setCurrentIndex((prevIndex) => 
        prevIndex === galleryData.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (displayType === 'mobile') {
      // For mobile carousel, cycle through all images
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? galleryData.length - 1 : prevIndex - 1
      );
    } else {
      // For standard gallery, cycle through all images
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? galleryData.length - 1 : prevIndex - 1
      );
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  // Render placeholder when no data
  if (!galleryData || galleryData.length === 0) {
    return null; // Don't show empty gallery sections
  }

  const currentImage = galleryData[currentIndex];



  return (
    <div 
      style={{
        ...sectionStyle,
        padding: '0',
        margin: '0',
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
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
        marginBottom: '20px',
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
          <LuImage style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          {galleryData[0]?.title || 'Gallery'}
        </h2>
      </div>

      {/* Render based on display type */}
      {displayType === 'mobile' ? (
        // Mobile carousel - desktop hover controls + mobile touch scroll
        <div 
          style={{
            width: '100%',
            height: '250px',
            overflow: 'hidden',
            position: 'relative'
          }}
          onMouseEnter={() => !isMobile && setIsHovering(true)}
          onMouseLeave={() => !isMobile && setIsHovering(false)}
        >
          {/* Carousel container that slides */}
          <div
            style={{
              display: 'flex',
              height: '100%',
              gap: '12px',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${currentIndex * (152)}px)`, // 140px width + 12px gap
              paddingRight: '12px'
            }}
          >
            {galleryData.map((image, index) => (
              <div
                key={image.id || index}
                style={{
                  flex: '0 0 140px', // Fixed width, no grow/shrink
                  height: '240px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: `${textColor}05`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {image.imageUrl && (
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Gallery image'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: index === currentIndex ? 'brightness(1)' : 'brightness(0.85)',
                      transform: index === currentIndex ? 'scale(1.02)' : 'scale(1)'
                    }}
                  />
                )}
                {/* Active indicator */}
                {index === currentIndex && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Touch swipe area for mobile */}
          {isMobile && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          )}
          
          {/* Desktop hover navigation */}
          {!isMobile && galleryData.length > 1 && (
            <>
              {/* Navigation bar - appears on hover */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '20px',
                  opacity: isHovering ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 2
                }}
              >
                {/* Previous button */}
                {currentIndex > 0 && (
                  <button
                    onClick={prevImage}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#000',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ‹
                  </button>
                )}
                
                {/* Dots indicator */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {galleryData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      style={{
                        width: index === currentIndex ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: index === currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                
                {/* Next button */}
                {currentIndex < galleryData.length - 1 && (
                  <button
                    onClick={nextImage}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#000',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ›
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        // Standard gallery format
        <div 
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/10',
            borderRadius: '12px',
            overflow: 'hidden',
            background: `${textColor}05`,
            cursor: galleryData.length > 1 ? 'pointer' : 'default'
          }}
          onClick={galleryData.length > 1 ? nextImage : undefined}
        >
          {currentImage.imageUrl && (
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title || 'Gallery image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (galleryData.length > 1) {
                  e.target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          )}
        </div>
      )}
      
      {/* Elegant navigation dots - only for standard gallery */}
      {displayType === 'standard' && galleryData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
          marginBottom: '24px'
        }}>
          {galleryData.map((image, index) => (
            <button
              key={image.id || index}
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
              onClick={() => setCurrentIndex(index)}
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