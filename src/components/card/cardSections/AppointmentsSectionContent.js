'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuCalendar, LuExternalLink } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function AppointmentsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [appointmentData, setAppointmentData] = useState(null);

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

  // Main render
  if (initialAppointmentsData && initialAppointmentsData.calendlyUrl) {
    const calendlyUrl = initialAppointmentsData.calendlyUrl;
    const embedUrl = getCalendlyEmbedUrl(calendlyUrl);
    const username = extractCalendlyUsername(calendlyUrl);
    
    return (
      <div 
        style={{
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
          fontFamily: settings.font_family || 'Inter, sans-serif'
        }}
      >
        {/* Section Title */}
        <div style={{
          ...sectionTitleStyle,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <LuCalendar style={{ color: '#006BFF', fontSize: '20px' }} />
          <span>{initialAppointmentsData.title || 'Schedule a Call'}</span>
        </div>

        {/* Content */}
        <div>
          {/* Description */}
          {initialAppointmentsData.description && (
            <div style={{
              color: textColor,
              fontSize: '14px',
              lineHeight: '1.4',
              marginBottom: '16px',
              opacity: 0.8
            }}>
              {initialAppointmentsData.description}
            </div>
          )}

          {/* Calendly-styled wrapper */}
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            border: '1px solid #333',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            {/* Calendly Header */}
            <div style={{ 
              backgroundColor: '#000000',
              padding: '16px',
              borderBottom: '1px solid #333'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Calendly icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#006BFF',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}>
                  <LuCalendar style={{ color: '#ffffff', fontSize: '16px' }} />
                </div>
                <div>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Calendly
                  </div>
                  <div style={{
                    color: '#888888',
                    fontSize: '12px'
                  }}>
                    {username ? `@${username}` : 'Scheduling'}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendly Content */}
            <div style={{ padding: '16px' }}>
              {/* Calendar preview or button */}
              {initialAppointmentsData.showCalendar && username ? (
                <div style={{
                  marginBottom: '12px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '200px'
                }}>
                  <iframe
                    src={`https://calendly.com/${username}`}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    title="Calendly Scheduling"
                    style={{
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Ready to schedule?
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#888888'
                  }}>
                    Click the button below to book your appointment
                  </div>
                </div>
              )}
              
              {/* External link button */}
              <a 
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#006BFF',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0056CC';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#006BFF';
                }}
              >
                <LuExternalLink style={{ fontSize: '12px' }} />
                {initialAppointmentsData.buttonText || 'Schedule Now'}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Empty state
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
        fontFamily: settings.font_family || 'Inter, sans-serif'
      }}>
        <div style={{
          ...sectionTitleStyle,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <LuCalendar style={{ color: '#006BFF', fontSize: '20px' }} />
          <span>Schedule a Call</span>
        </div>
        
        <div style={{
          ...placeholderStyle,
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <LuCalendar style={{ 
            fontSize: '48px', 
            color: '#006BFF', 
            marginBottom: '16px',
            opacity: 0.5
          }} />
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            No scheduling link yet
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Add your Calendly link to let people book appointments
          </div>
        </div>
      </div>
    );
  }
} 