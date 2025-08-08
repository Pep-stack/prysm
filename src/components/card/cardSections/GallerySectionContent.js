'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuImage } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function GallerySectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

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

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [galleryData.length]);

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
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryData.length - 1 : prevIndex - 1
    );
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
                      backgroundColor: settings.icon_color || '#6B7280',
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

      {/* Pure image container */}
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
      
      {/* Elegant navigation dots */}
      {galleryData.length > 1 && (
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