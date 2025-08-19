'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuUser, LuExternalLink, LuGlobe } from 'react-icons/lu';
import CustomProfileEditor from '../../shared/CustomProfileEditor';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function CustomProfileSectionContent({ profile, styles, isEditing, onSave, onCancel, onEdit }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color and theme from design settings
  const textColor = settings.text_color || '#000000';
  const isDarkTheme = settings.theme === 'dark';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize custom profile data
  const parseCustomProfileData = (customProfileData) => {
    console.log('🔍 Parsing custom profile data:', {
      customProfileData,
      type: typeof customProfileData,
      isArray: Array.isArray(customProfileData)
    });
    
    if (Array.isArray(customProfileData)) {
      const filtered = customProfileData.filter(entry => 
        entry && 
        typeof entry === 'object' && 
        (entry.platform_name || entry.profile_url)
      );
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof customProfileData === 'string' && customProfileData.trim()) {
      try {
        const parsed = JSON.parse(customProfileData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => 
            entry && 
            typeof entry === 'object' && 
            (entry.platform_name || entry.profile_url)
          );
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing custom profile JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid custom profile data found');
    return [];
  };

  const initialCustomProfileData = useMemo(() => {
    return parseCustomProfileData(profile?.custom_profile);
  }, [profile?.custom_profile]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialCustomProfileData);
    }
  }, [isEditing, initialCustomProfileData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialCustomProfileData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialCustomProfileData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialCustomProfileData.length) % initialCustomProfileData.length);
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

  // Handle profile click
  const handleProfileClick = (profileUrl) => {
    if (profileUrl) {
      // Ensure URL has protocol
      const url = profileUrl.startsWith('http') ? profileUrl : `https://${profileUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Render single custom profile card (like Instagram profile)
  const renderCustomProfileCard = (entry, index, isCarousel = false) => {
    const iconColor = entry.icon_color || textColor;
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          marginBottom: '16px',
          width: '100%'
        }}
      >
        <div style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          width: '100%',
          fontFamily: settings.font_family || 'Inter, sans-serif',
          ...sectionStyle
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Left side - Avatar and text */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1'
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 8px ${iconColor}50`,
                flexShrink: 0
              }}>
                <LuGlobe size={18} color="white" />
              </div>
              
              {/* Text content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {/* Username with @ */}
                <div style={{
                  fontSize: settings.font_size || '16px',
                  fontWeight: settings.font_weight || '600',
                  color: settings.text_color || 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '-0.2px',
                  fontFamily: settings.font_family || 'Inter, sans-serif'
                }}>
                  {entry.username ? `@${entry.username}` : entry.platform_name}
                </div>
                
                {/* Description - Platform Name */}
                <div style={{
                  fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
                  color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '400',
                  fontFamily: settings.font_family || 'Inter, sans-serif'
                }}>
                  {entry.platform_name || 'Custom Profile'}
                </div>
              </div>
            </div>

            {/* Right side - Button */}
            <button style={{
              background: iconColor,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: settings.font_size ? (parseInt(settings.font_size) - 2) + 'px' : '14px',
              fontWeight: settings.font_weight || '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 2px 8px ${iconColor}50`,
              letterSpacing: '-0.1px',
              flexShrink: 0,
              fontFamily: settings.font_family || 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = `0 4px 12px ${iconColor}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 2px 8px ${iconColor}50`;
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick(entry.profile_url);
            }}
            >
              <LuExternalLink size={12} />
              View
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Custom Profile</h3>
        <CustomProfileEditor 
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

  // Render display UI - Show all custom profiles as individual cards (like other social profiles)
  if (initialCustomProfileData.length > 0) {
    // Always render each profile as a separate, independent card (no wrapper styling)
    return (
      <>
        {initialCustomProfileData.map((profile, index) => 
          renderCustomProfileCard(profile, index, false)
        )}
      </>
    );
  } else {
    // Empty state - like other social profiles
    return (
      <div style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        width: '100%',
        fontFamily: settings.font_family || 'Inter, sans-serif',
        ...sectionStyle
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Left side - Icon and text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: '1'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
              flexShrink: 0
            }}>
              <LuUser size={18} color="white" />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{
                fontSize: settings.font_size || '16px',
                fontWeight: settings.font_weight || '600',
                color: settings.text_color || 'rgba(255, 255, 255, 0.95)',
                letterSpacing: '-0.2px',
                fontFamily: settings.font_family || 'Inter, sans-serif'
              }}>
                Custom Profile
              </div>
              <div style={{
                fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
                color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
                fontWeight: '400',
                fontFamily: settings.font_family || 'Inter, sans-serif'
              }}>
                Add your custom platform profile
              </div>
            </div>
          </div>

          {/* Right side - Placeholder button */}
          <button 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: settings.font_size ? (parseInt(settings.font_size) - 2) + 'px' : '14px',
              fontWeight: settings.font_weight || '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.1px',
              flexShrink: 0,
              fontFamily: settings.font_family || 'Inter, sans-serif'
            }}
            onClick={onEdit}
          >
            <LuUser size={12} />
            Add
          </button>
        </div>
      </div>
    );
  }
}
