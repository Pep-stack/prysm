'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuWrench, LuDollarSign, LuClock, LuStar, LuChevronLeft, LuChevronRight, LuCheck } from 'react-icons/lu';
import ServicesSelector from '../../shared/ServicesSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function ServicesSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize services data
  const parseServicesData = (servicesData) => {
    console.log('🔍 Parsing services data:', {
      servicesData,
      type: typeof servicesData,
      isArray: Array.isArray(servicesData)
    });
    
    if (Array.isArray(servicesData)) {
      const filtered = servicesData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof servicesData === 'string' && servicesData.trim()) {
      try {
        const parsed = JSON.parse(servicesData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing services JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid services data found');
    return [];
  };

  const initialServicesData = useMemo(() => {
    return parseServicesData(profile?.services);
  }, [profile?.services]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialServicesData);
    }
  }, [isEditing, initialServicesData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialServicesData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Get expertise color and icon
  const getExpertiseDisplay = (expertise) => {
    const expertiseConfig = {
      'beginner': { color: '#059669', bgColor: '#d1fae5', icon: '🌱', label: 'Beginner' },
      'intermediate': { color: '#0284c7', bgColor: '#dbeafe', icon: '⚡', label: 'Intermediate' },
      'advanced': { color: '#7c3aed', bgColor: '#e9d5ff', icon: '🚀', label: 'Advanced' },
      'expert': { color: '#dc2626', bgColor: '#fee2e2', icon: '👑', label: 'Expert' }
    };
    return expertiseConfig[expertise] || expertiseConfig['intermediate'];
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialServicesData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialServicesData.length) % initialServicesData.length);
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

  // Render single service card - compact style like other sections
  const renderServiceCard = (entry, index, isCarousel = false) => {
    const expertiseDisplay = getExpertiseDisplay(entry.expertise);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          marginBottom: '12px',
          padding: '12px 0',
          borderBottom: (!isCarousel && index < initialServicesData.length - 1) ? `1px solid ${textColor}15` : 'none'
        }}
      >
        {/* Header with service title and badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '600', 
                color: textColor,
                lineHeight: '1.3'
              }}>
                {entry.title || 'Untitled Service'}
              </h4>
              {entry.isPopular && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '2px 6px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: '1px solid #fbbf24'
                }}>
                  <LuStar size={8} />
                  POPULAR
                </div>
              )}
            </div>
            
            {/* Category and subcategory badges under title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                backgroundColor: '#3b82f6',
                borderRadius: '6px'
              }}>
                <LuWrench size={10} style={{ color: 'white' }} />
                <span style={{
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {entry.category || 'Uncategorized'}
                </span>
              </div>
              
              {entry.subcategory && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 8px',
                  backgroundColor: `${textColor}15`,
                  borderRadius: '6px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: textColor,
                    fontWeight: '500',
                    opacity: 0.8
                  }}>
                    {entry.subcategory}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Expertise badge */}
          <div style={{
            padding: '2px 6px',
            backgroundColor: expertiseDisplay.color,
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            {expertiseDisplay.label}
          </div>
        </div>

        {/* Price and Duration tags with icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {entry.price && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              backgroundColor: '#10b981',
              borderRadius: '6px'
            }}>
              <LuDollarSign size={10} style={{ color: 'white' }} />
              <span style={{
                fontSize: '11px',
                color: 'white',
                fontWeight: '600'
              }}>
                {entry.price}
              </span>
            </div>
          )}
          
          {entry.duration && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              backgroundColor: settings.icon_color || '#6b7280',
              borderRadius: '6px'
            }}>
              <LuClock size={10} style={{ color: 'white' }} />
              <span style={{
                fontSize: '11px',
                color: 'white',
                fontWeight: '600'
              }}>
                {entry.duration}
              </span>
            </div>
          )}
        </div>

        {/* Compact description */}
        {entry.description && (
          <div style={{ marginTop: '8px' }}>
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
          </div>
        )}
      </div>
    );
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Services Offered</h3>
        <ServicesSelector 
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
            Save Services
          </button>
        </div>
      </div>
    );
  }

  // Render display UI
  if (initialServicesData.length > 0) {
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
            backgroundColor: needsDarkIconBackground(settings.background_color) 
              ? '#000000' 
              : (settings.icon_color || '#6B7280'),
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LuWrench style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Services Offered
          </h2>
        </div>
        
        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current service */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderServiceCard(initialServicesData[currentIndex], currentIndex, true)}
          </div>

          {/* Navigation dots - Only show if more than 1 service */}
          {initialServicesData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              {initialServicesData.map((_, index) => (
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
      </div>
    );
  } else {
    // Empty state
    return (
      <div style={{
        ...sectionStyle,
        textAlign: 'center',
        padding: '40px 20px',
        color: textColor,
        opacity: 0.7
      }}>
        <LuWrench size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No services added yet. Add your professional services with pricing and expertise levels.
        </p>
      </div>
    );
  }
} 