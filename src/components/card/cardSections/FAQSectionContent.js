'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuCircleHelp, LuChevronDown, LuChevronRight } from 'react-icons/lu';
import FAQSelector from '../../shared/FAQSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function FAQSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize FAQ data
  const parseFAQData = (faqData) => {
    console.log('🔍 Parsing FAQ data:', {
      faqData,
      type: typeof faqData,
      isArray: Array.isArray(faqData)
    });
    
    if (Array.isArray(faqData)) {
      const filtered = faqData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof faqData === 'string' && faqData.trim()) {
      try {
        const parsed = JSON.parse(faqData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing FAQ JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid FAQ data found');
    return [];
  };

  const initialFAQData = useMemo(() => {
    return parseFAQData(profile?.faq);
  }, [profile?.faq]);

  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialFAQData);
    }
  }, [isEditing, initialFAQData]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialFAQData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialFAQData.length) % initialFAQData.length);
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

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Reset carousel index when data changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialFAQData.length]);

  // Render single FAQ item - compact style like other sections
  const renderFAQCard = (faqItem, index, isCarousel = false) => {
    const isExpanded = expandedItems.has(index);
    
    return (
      <div 
        key={faqItem.id || index}
        style={{
          marginBottom: '12px',
          padding: '12px 0',
          borderBottom: (!isCarousel && index < initialFAQData.length - 1) ? `1px solid ${textColor}15` : 'none'
        }}
      >
        {/* Question header - always clickable */}
        <button
          onClick={() => toggleExpanded(index)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 0,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            marginBottom: '6px'
          }}
        >
          <h4 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            lineHeight: '1.3',
            flex: 1,
            paddingRight: '12px'
          }}>
            {faqItem.question}
          </h4>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            backgroundColor: `${textColor}15`,
            borderRadius: '4px',
            flexShrink: 0
          }}>
            {isExpanded ? (
              <LuChevronDown size={14} style={{ color: textColor, opacity: 0.8 }} />
            ) : (
              <LuChevronRight size={14} style={{ color: textColor, opacity: 0.8 }} />
            )}
          </div>
        </button>

        {/* Answer - collapsible */}
        {isExpanded && (
          <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: `1px solid ${textColor}15`
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: textColor,
              lineHeight: '1.4',
              opacity: 0.7
            }}>
              {faqItem.answer}
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
        <h3 style={sectionTitleStyle}>Edit FAQ</h3>
        <FAQSelector 
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
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  if (initialFAQData.length > 0) {
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
            <LuCircleHelp style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            FAQ
          </h2>
        </div>
        
        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current FAQ */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderFAQCard(initialFAQData[currentIndex], currentIndex, true)}
          </div>

          {/* Navigation dots - Only show if more than 1 FAQ */}
          {initialFAQData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              {initialFAQData.map((_, index) => (
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
        <LuCircleHelp size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No FAQs added yet. Add frequently asked questions to help your visitors.
        </p>
      </div>
    );
  }
} 