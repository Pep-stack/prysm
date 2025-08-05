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
      }}>
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
            <LuImage size={14} style={{ color: 'white' }} />
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
            Gallery
          </h3>
        </div>
        
        <div style={placeholderStyle}>
          <LuImage size={48} style={{ color: textColor, opacity: 0.5 }} />
          <p style={{ color: textColor, opacity: 0.7 }}>No gallery images yet</p>
        </div>
      </div>
    );
  }

  const currentImage = galleryData[currentIndex];

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
    }}>
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
          <LuImage size={14} style={{ color: 'white' }} />
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
          {galleryData[0]?.title || 'Gallery'}
        </h3>
      </div>

      <div 
        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentImage.imageUrl && (
          <img
            src={currentImage.imageUrl}
            alt={currentImage.title || 'Gallery image'}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Dots navigation */}
      {galleryData.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          {galleryData.map((image, index) => (
            <div
              key={image.id || index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? textColor : 'rgba(255, 255, 255, 0.4)',
                opacity: index === currentIndex ? 0.8 : 0.4,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setCurrentIndex(index)}
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
} 