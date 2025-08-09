'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuMail } from 'react-icons/lu';
import SubscribeSelector from '../../shared/SubscribeSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function SubscribeSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  // Function to get contrasting text color
  const getContrastColor = (backgroundColor) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  const [currentSelection, setCurrentSelection] = useState(null);

  // Parse and memoize subscribe data
  const parseSubscribeData = (subscribeData) => {
    if (typeof subscribeData === 'object' && subscribeData !== null) {
      return subscribeData;
    }
    
    if (typeof subscribeData === 'string' && subscribeData.trim()) {
      try {
        const parsed = JSON.parse(subscribeData);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    
    return null;
  };

  const initialSubscribeData = useMemo(() => {
    return parseSubscribeData(profile?.subscribe);
  }, [profile?.subscribe]);

  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialSubscribeData || {
        t: 'Subscribe',
        d: 'Stay updated with our latest news and updates.',
        p: 'Your email...',
        b: 'Subscribe',
        f: '',
        s: 'Thank you for subscribing!'
      });
    }
  }, [isEditing, initialSubscribeData]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Subscribe</h3>
        <SubscribeSelector 
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

  if (initialSubscribeData && initialSubscribeData.f) {
    // Extract data from initialSubscribeData
    const {
      t: title = 'Subscribe',
      d: description = 'Stay updated with our latest news and updates.',
      p: placeholder = 'Your email...',
      b: buttonText = 'Subscribe',
      f: formUrl = '',
      s: successMessage = 'Thank you for subscribing!'
    } = initialSubscribeData;

    const handleSubscribe = () => {
      if (formUrl) {
        window.open(formUrl, '_blank');
      }
    };

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
      >
        <style jsx>{`
          .subscribe-input::placeholder {
            color: ${textColor}70;
            opacity: 1;
          }
          .subscribe-input::-webkit-input-placeholder {
            color: ${textColor}70;
          }
          .subscribe-input::-moz-placeholder {
            color: ${textColor}70;
            opacity: 1;
          }
          .subscribe-input:-ms-input-placeholder {
            color: ${textColor}70;
          }
        `}</style>
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
            <LuMail style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            {title}
          </h2>
        </div>

        {/* Compact content */}
        <div>
          {/* Description */}
          {description && (
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              color: textColor,
              lineHeight: '1.4',
              opacity: 0.7
            }}>
              {description}
            </p>
          )}

          {/* Email input */}
          <input
            type="email"
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1px solid ${textColor}30`,
              background: `${textColor}05`,
              color: textColor,
              fontSize: '13px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
            className="subscribe-input"
            onFocus={(e) => {
              e.target.style.borderColor = textColor;
              e.target.style.backgroundColor = `${textColor}10`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${textColor}30`;
              e.target.style.backgroundColor = `${textColor}05`;
            }}
          />
          
          {/* Subscribe button */}
          <button
            onClick={handleSubscribe}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: textColor,
              color: getContrastColor(textColor),
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 2px 8px ${textColor}20`,
              position: 'relative',
              minHeight: '44px',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = `0 4px 12px ${textColor}30`;
              e.target.style.backgroundColor = `${textColor}e6`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = `0 2px 8px ${textColor}20`;
              e.target.style.backgroundColor = textColor;
            }}
          >
            <LuMail size={16} />
            {buttonText}
          </button>
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
        <LuMail size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No subscription form added yet. Add a form URL to let people subscribe to your newsletter.
        </p>
      </div>
    );
  }
} 