'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuCalendar, LuExternalLink } from 'react-icons/lu';
import AppointmentsEditor from '../../shared/AppointmentsEditor';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function AppointmentsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
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

  // Parse and memoize appointments data
  const parseAppointmentsData = (appointmentsData) => {
    console.log('🔍 Parsing appointments data:', {
      appointmentsData,
      type: typeof appointmentsData,
      isObject: typeof appointmentsData === 'object',
      isNull: appointmentsData === null,
      isUndefined: appointmentsData === undefined
    });
    
    if (typeof appointmentsData === 'object' && appointmentsData !== null) {
      console.log('✅ Parsed as object:', appointmentsData);
      return appointmentsData;
    }
    
    if (typeof appointmentsData === 'string' && appointmentsData.trim()) {
      try {
        const parsed = JSON.parse(appointmentsData);
        if (typeof parsed === 'object' && parsed !== null) {
          console.log('✅ Parsed JSON string as object:', parsed);
          return parsed;
        } else {
          console.log('⚠️ Parsed JSON but not an object:', parsed);
          return null;
        }
      } catch (e) {
        console.error('❌ Error parsing appointments JSON:', e);
        console.error('❌ Raw data that failed to parse:', appointmentsData);
        return null;
      }
    }
    
    console.log('ℹ️ No valid appointments data found');
    return null;
  };

  const initialAppointmentsData = useMemo(() => {
    return parseAppointmentsData(profile?.appointments);
  }, [profile?.appointments]);

  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialAppointmentsData || {
        title: 'Book an Appointment',
        description: 'Schedule a meeting or consultation with me',
        calendlyUrl: '',
        buttonText: 'Book Now',
        showCalendar: false
      });
    }
  }, [isEditing, initialAppointmentsData]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Extract Calendly username from URL
  const extractCalendlyUsername = (url) => {
    if (!url) return '';
    
    // Handle different Calendly URL formats
    const patterns = [
      /calendly\.com\/([^\/\?]+)/,
      /calendly\.com\/([^\/\?]+)\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return '';
  };

  // Generate Calendly embed URL
  const getCalendlyEmbedUrl = (url) => {
    const username = extractCalendlyUsername(url);
    if (username) {
      return `https://calendly.com/${username}`;
    }
    return url;
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Appointments</h3>
        <AppointmentsEditor 
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

  // Main render
  if (initialAppointmentsData && initialAppointmentsData.calendlyUrl) {
    const calendlyUrl = initialAppointmentsData.calendlyUrl;
    const embedUrl = getCalendlyEmbedUrl(calendlyUrl);
    const username = extractCalendlyUsername(calendlyUrl);
    
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
            <LuCalendar style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Book an Appointment
          </h2>
        </div>

        {/* Compact content */}
        <div>
          {/* Description */}
          {initialAppointmentsData.description && (
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              color: textColor,
              lineHeight: '1.4',
              opacity: 0.7
            }}>
              {initialAppointmentsData.description}
            </p>
          )}

          {/* Calendar embed or booking section */}
          {initialAppointmentsData.showCalendar && username ? (
            <div style={{
              marginBottom: '12px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: `1px solid ${textColor}30`,
              background: `${textColor}05`
            }}>
              <iframe
                src={`https://calendly.com/${username}`}
                width="100%"
                height="300"
                frameBorder="0"
                title="Calendly Scheduling"
                style={{
                  border: 'none',
                  borderRadius: '6px'
                }}
              />
            </div>
          ) : (
            <p style={{
              fontSize: '13px',
              color: textColor,
              opacity: 0.7,
              margin: '0 0 12px 0'
            }}>
              Click below to book your appointment
            </p>
          )}
          
          {/* Booking button */}
          <a 
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: textColor,
              color: getContrastColor(textColor),
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              border: 'none',
              boxShadow: `0 2px 8px ${textColor}20`,
              position: 'relative',
              minHeight: '44px',
              width: '40%',
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
            <LuExternalLink size={16} />
            {initialAppointmentsData.buttonText || 'Book Now'}
          </a>
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
        <LuCalendar size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No appointment booking added yet. Add your scheduling link to let people book appointments with you.
        </p>
      </div>
    );
  }
} 