'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuFileText, LuCalendar, LuExternalLink, LuChevronLeft, LuChevronRight, LuStar } from 'react-icons/lu';
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
    console.log('🔍 Parsing publications data:', {
      publicationsData,
      type: typeof publicationsData,
      isArray: Array.isArray(publicationsData),
      isString: typeof publicationsData === 'string',
      length: publicationsData?.length
    });
    
    if (Array.isArray(publicationsData)) {
      const filtered = publicationsData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof publicationsData === 'string' && publicationsData.trim()) {
      try {
        const parsed = JSON.parse(publicationsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing publications JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid publications data found');
    return [];
  };

  const initialPublicationsData = useMemo(() => {
    return parsePublicationsData(profile?.publications);
  }, [profile?.publications]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      console.log('🔄 Initializing publications for editing:', {
        initialPublicationsData,
        dataLength: initialPublicationsData.length
      });
      setCurrentSelection(initialPublicationsData);
    }
  }, [isEditing, initialPublicationsData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialPublicationsData.length]);

  const handleSave = () => {
    console.log('💾 PublicationSectionContent: Saving publications:', {
      currentSelection,
      selectionLength: currentSelection.length,
      onSave: !!onSave
    });
    
    if (onSave) {
      onSave(currentSelection);
    } else {
      console.warn('⚠️ No onSave handler provided for publications');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get platform display info
  const getPlatformDisplay = (platform) => {
    const platformConfig = {
      'medium': { name: 'Medium', color: '#00AB6C', bgColor: '#E8F5E8' },
      'substack': { name: 'Substack', color: '#FF6719', bgColor: '#FFF0E8' },
      'personal blog': { name: 'Personal Blog', color: '#6366F1', bgColor: '#EEF2FF' },
      'linkedin': { name: 'LinkedIn', color: '#0A66C2', bgColor: '#E8F4FD' },
      'dev.to': { name: 'Dev.to', color: '#0A0A0A', bgColor: '#F5F5F5' },
      'hashnode': { name: 'Hashnode', color: '#2962FF', bgColor: '#E8F0FF' }
    };
    return platformConfig[platform?.toLowerCase()] || { name: platform || 'Article', color: '#6B7280', bgColor: '#F3F4F6' };
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

  // Render individual publication card
  const renderPublicationCard = (entry, index, isCarousel = false) => {
    const platformInfo = getPlatformDisplay(entry.platform);
    
    return (
      <div 
        key={entry.id || index}
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialPublicationsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* Header with publication title and featured badge */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700', 
                color: textColor,
                lineHeight: '1.3',
                marginBottom: '6px',
                letterSpacing: '-0.01em'
              }}>
                {entry.title || 'Untitled Publication'}
              </h4>
              {entry.featured && (
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  background: 'rgba(255, 193, 7, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  marginRight: '8px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#FFC107',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuStar size={8} style={{ color: 'white' }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: textColor,
                    fontWeight: '600',
                    opacity: 0.9
                  }}>
                    Featured
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publication Description */}
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

        {/* Publication Details */}
        <div style={{ marginBottom: '16px' }}>
          {/* Platform */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            marginRight: '8px',
            marginBottom: '8px',
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
              backgroundColor: platformInfo.color,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}>
              <LuFileText size={10} style={{ color: 'white' }} />
            </div>
            <span style={{
              fontSize: '12px',
              color: textColor,
              fontWeight: '500',
              opacity: 0.9
            }}>
              {platformInfo.name}
            </span>
          </div>

          {/* Publication Date */}
          {entry.date && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              marginRight: '8px',
              marginBottom: '8px',
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
                <LuCalendar size={10} style={{ color: 'white' }} />
              </div>
              <span style={{
                fontSize: '12px',
                color: textColor,
                fontWeight: '500',
                opacity: 0.9
              }}>
                {formatDate(entry.date)}
              </span>
            </div>
          )}
        </div>

        {/* Action Link */}
        {entry.url && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }}>
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: textColor,
                fontSize: '12px',
                fontWeight: '500',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
              }}
            >
              <LuExternalLink size={12} />
              Read Article
            </a>
          </div>
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

  // If no publications, show placeholder
  if (initialPublicationsData.length === 0) {
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
            <LuFileText size={14} style={{ color: 'white' }} />
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
            Publications & Articles
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <LuFileText size={28} style={{ color: textColor, opacity: 0.7 }} />
          </div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            opacity: 0.9
          }}>
            Share Your Articles
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: textColor,
            fontWeight: '500',
            lineHeight: '1.5',
            opacity: 0.7
          }}>
            Add your blog posts, articles, and publications here
          </p>
        </div>
      </div>
    );
  }

  // Show publications with modern UI
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
    title="Click to edit publications"
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
          <LuFileText size={14} style={{ color: 'white' }} />
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
          Publications & Articles
        </h3>
      </div>

      {/* Carousel content */}
      <div style={{ position: 'relative' }}>
        {/* Current publication */}
        <div style={{ 
          overflow: 'hidden',
          width: '100%'
        }}>
          {renderPublicationCard(initialPublicationsData[currentIndex], currentIndex, true)}
        </div>

        {/* Dots indicator - Only show if more than 1 publication */}
        {initialPublicationsData.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {initialPublicationsData.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? textColor : 'rgba(255, 255, 255, 0.4)',
                  opacity: index === currentIndex ? 0.8 : 0.4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => goToSlide(index)}
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
    </div>
  );
} 