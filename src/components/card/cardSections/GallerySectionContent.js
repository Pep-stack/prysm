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
    return (
      <div style={{
        ...sectionStyle,
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}>
        {/* Minimalist title section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '2px',
            height: '20px',
            background: `linear-gradient(135deg, ${textColor}40, ${textColor}20)`,
            borderRadius: '1px'
          }} />
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.02em',
            opacity: 0.8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Gallery
          </h3>
        </div>
        
        {/* Clean placeholder */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${textColor}08`,
            borderRadius: '12px'
          }}>
            <LuImage size={20} style={{ color: textColor, opacity: 0.4 }} />
          </div>
          <p style={{ 
            color: textColor, 
            opacity: 0.5, 
            fontSize: '14px',
            fontWeight: '400',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            No images to display
          </p>
        </div>
      </div>
    );
  }

  const currentImage = galleryData[currentIndex];

  return (
    <div style={{
      ...sectionStyle,
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'none',
      borderRadius: '20px',
      padding: '32px 24px',
      boxShadow: 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      {/* Minimalist title section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '2px',
          height: '20px',
          background: `linear-gradient(135deg, ${textColor}40, ${textColor}20)`,
          borderRadius: '1px'
        }} />
        <h3 style={{
          fontSize: '16px',
          fontWeight: '500',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.02em',
          opacity: 0.8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {galleryData[0]?.title || 'Gallery'}
        </h3>
      </div>

      {/* Pure image container */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          borderRadius: '16px',
          overflow: 'hidden',
          background: `${textColor}05`,
          cursor: galleryData.length > 1 ? 'pointer' : 'default'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
        
        {/* Subtle image counter for multiple images */}
        {galleryData.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '500',
            color: 'white',
            letterSpacing: '0.5px'
          }}>
            {currentIndex + 1} / {galleryData.length}
          </div>
        )}
      </div>
      
      {/* Elegant navigation dots */}
      {galleryData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          {galleryData.map((image, index) => (
            <button
              key={image.id || index}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentIndex 
                  ? `linear-gradient(135deg, ${textColor}60, ${textColor}40)`
                  : `${textColor}20`,
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