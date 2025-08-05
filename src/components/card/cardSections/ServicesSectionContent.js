'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuWrench, LuDollarSign, LuClock, LuStar, LuChevronLeft, LuChevronRight, LuCheck } from 'react-icons/lu';
import ServicesSelector from '../../shared/ServicesSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

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

  // Render single service card
  const renderServiceCard = (entry, index, isCarousel = false) => {
    const expertiseDisplay = getExpertiseDisplay(entry.expertise);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '16px',
          backgroundColor: isCarousel ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: isCarousel ? '0' : '12px',
          border: isCarousel ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: (!isCarousel && index < initialServicesData.length - 1) ? '12px' : '0',
          width: '100%',
          backdropFilter: isCarousel ? 'none' : 'blur(6px)',
          WebkitBackdropFilter: isCarousel ? 'none' : 'blur(6px)'
        }}
      >
        {/* Header with service title and expertise */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: textColor,
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {entry.title || 'Untitled Service'}
                </h4>
                {entry.isPopular && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    fontSize: '10px',
                    fontWeight: '700',
                    borderRadius: '12px',
                    border: '1px solid #fbbf24'
                  }}>
                    <LuStar size={10} />
                    POPULAR
                  </div>
                )}
              </div>
              
              {/* Category and expertise badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#1e40af',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuWrench size={10} style={{ color: 'white' }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: textColor,
                    fontWeight: '600',
                    opacity: 0.9
                  }}>
                    {entry.category || 'Uncategorized'}
                  </span>
                </div>
                
                {entry.subcategory && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: textColor,
                      fontWeight: '500',
                      opacity: 0.8
                    }}>
                      {entry.subcategory}
                    </span>
                  </div>
                )}
                
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: expertiseDisplay.color,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <span style={{ fontSize: '8px', color: 'white' }}>{expertiseDisplay.icon}</span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: textColor,
                    fontWeight: '600',
                    opacity: 0.9
                  }}>
                    {expertiseDisplay.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description */}
        {entry.description && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: textColor,
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {entry.description}
            </p>
          </div>
        )}

        {/* Service Details */}
        <div style={{ marginBottom: '16px' }}>
          {/* Price and Duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {entry.price && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#059669',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}>
                  <LuDollarSign size={10} style={{ color: 'white' }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: textColor,
                  fontWeight: '600',
                  opacity: 0.9
                }}>
                  {entry.price}
                </span>
              </div>
            )}
            
            {entry.duration && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}>
                  <LuClock size={10} style={{ color: 'white' }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: textColor,
                  fontWeight: '500',
                  opacity: 0.9
                }}>
                  {entry.duration}
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          {entry.features && entry.features.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '12px'
            }}>
              <h5 style={{
                margin: '0 0 8px 0',
                fontSize: '13px',
                fontWeight: '600',
                color: textColor,
                opacity: 0.8
              }}>
                Features & Benefits:
              </h5>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {entry.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '6px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#059669',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      <LuCheck size={8} style={{ color: 'white' }} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: textColor,
                      lineHeight: '1.4',
                      opacity: 0.9
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
                {entry.features.length > 4 && (
                  <div style={{
                    fontSize: '11px',
                    color: textColor,
                    padding: '4px 8px',
                    opacity: 0.7,
                    fontStyle: 'italic'
                  }}>
                    +{entry.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
      title="Click to edit services"
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
            backgroundColor: '#374151',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <LuWrench size={14} style={{ color: 'white' }} />
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
            Services Offered
          </h3>
        </div>

        {/* Services content */}
        <div style={{ position: 'relative' }}>
          {initialServicesData.length === 1 ? (
            // Single service - show directly
            <div style={{ 
              overflow: 'hidden',
              width: '100%'
            }}>
              {renderServiceCard(initialServicesData[0], 0, true)}
            </div>
          ) : (
            // Multiple services - show all in containers
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '100%'
            }}>
              {initialServicesData.map((service, index) => 
                renderServiceCard(service, index, false)
              )}
            </div>
          )}


        </div>
      </div>
    );
  } else {
    // Empty state with standardized preview UI
    return (
      <div style={{
        ...placeholderStyle,
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
      }} title="Click to add services">
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
            <LuWrench size={14} style={{ color: 'white' }} />
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
            Services Offered
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          textAlign: 'center'
        }}>
          <LuWrench size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ 
            margin: 0, 
            fontSize: '16px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            Click to add your professional services with pricing, features, and expertise levels
          </p>
        </div>
      </div>
    );
  }
} 