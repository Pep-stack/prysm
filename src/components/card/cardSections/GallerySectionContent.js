'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuImage, LuChevronLeft, LuChevronRight, LuExternalLink } from 'react-icons/lu';
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
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Gallery</h3>
        <div style={placeholderStyle}>
          <LuImage size={48} style={{ color: textColor, opacity: 0.5 }} />
          <p style={{ color: textColor, opacity: 0.7 }}>No gallery images yet</p>
        </div>
      </div>
    );
  }

  const currentImage = galleryData[currentIndex];

  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Gallery</h3>
      
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
        
        {/* Navigation arrows */}
        {galleryData.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <LuChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <LuChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Image info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h4 className="text-white font-medium mb-1">{currentImage.title}</h4>
          {currentImage.description && (
            <p className="text-white text-sm opacity-90">{currentImage.description}</p>
          )}
          {currentImage.link && (
            <a
              href={currentImage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white text-sm opacity-90 hover:opacity-100 mt-2"
            >
              <LuExternalLink size={14} />
              View Details
            </a>
          )}
        </div>
        
        {/* Image counter */}
        {galleryData.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {galleryData.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail navigation */}
      {galleryData.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {galleryData.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-emerald-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {image.imageUrl && (
                <img
                  src={image.imageUrl}
                  alt={image.title || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 