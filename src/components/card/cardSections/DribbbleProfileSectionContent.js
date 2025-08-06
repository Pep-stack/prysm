'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaDribbble } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function DribbbleProfileSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');

  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  // Parse Dribbble profile data
  const parseDribbbleProfileData = (profileData) => {
    console.log('🔍 Parsing Dribbble profile data:', {
      profileData,
      type: typeof profileData,
      isNull: profileData === null,
      isUndefined: profileData === undefined,
      stringLength: typeof profileData === 'string' ? profileData.length : 'N/A',
      isArray: Array.isArray(profileData),
      keys: typeof profileData === 'object' && profileData !== null ? Object.keys(profileData) : 'N/A'
    });
    
    // Handle string format (direct URL)
    if (typeof profileData === 'string' && profileData.trim()) {
      const url = profileData.trim();
      const extractedUsername = extractUsername(url);
      console.log('✅ Parsed as string, username:', extractedUsername);
      return { url, username: extractedUsername };
    }
    
    // Handle object format (from old highlights format)
    if (typeof profileData === 'object' && profileData !== null) {
      // If it's an array, take the first item
      if (Array.isArray(profileData) && profileData.length > 0) {
        const firstItem = profileData[0];
        if (typeof firstItem === 'string') {
          const url = firstItem.trim();
          const extractedUsername = extractUsername(url);
          console.log('✅ Parsed as array, username:', extractedUsername);
          return { url, username: extractedUsername };
        }
      }
      
      // If it's an object with url property
      if (profileData.url) {
        const url = profileData.url.trim();
        const extractedUsername = extractUsername(url);
        console.log('✅ Parsed as object with url, username:', extractedUsername);
        return { url, username: extractedUsername };
      }
    }
    
    // Handle JSON string format
    if (typeof profileData === 'string' && profileData.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(profileData);
        if (parsed.url) {
          const url = parsed.url.trim();
          const extractedUsername = extractUsername(url);
          console.log('✅ Parsed as JSON string, username:', extractedUsername);
          return { url, username: extractedUsername };
        }
      } catch (e) {
        console.log('❌ Failed to parse JSON string:', e);
      }
    }
    
    console.log('❌ Invalid profile data format');
    return null;
  };

  // Extract username from Dribbble URL
  const extractUsername = (url) => {
    if (!url) return '';
    // Handle dribbble.com/username format
    const match = url.match(/dribbble\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  };

  // Get Dribbble profile data from profile
  const dribbbleProfileData = useMemo(() => {
    console.log('🔍 DEBUG: Profile data received:', {
      profile: profile,
      dribbble_profile: profile?.dribbble_profile,
      profileKeys: profile ? Object.keys(profile) : 'no profile',
      hasDribbbleProfile: !!profile?.dribbble_profile
    });
    return profile?.dribbble_profile;
  }, [profile?.dribbble_profile]);

  // Parse data on mount
  useEffect(() => {
    console.log('🔄 useEffect triggered with dribbbleProfileData:', dribbbleProfileData);
    const parsedData = parseDribbbleProfileData(dribbbleProfileData);
    console.log('📊 Parsed data result:', parsedData);
    
    if (parsedData) {
      console.log('✅ Setting state with:', parsedData);
      setProfileUrl(parsedData.url);
      setUsername(parsedData.username);
    } else {
      console.log('❌ No valid data found, clearing state');
      setProfileUrl('');
      setUsername('');
    }
  }, [dribbbleProfileData]);

  // Section styling
  const defaultSectionStyle = {
    padding: '32px',
    borderRadius: '20px',
    background: settings.background_color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: settings.text_color || '#ffffff',
    fontFamily: settings.font_family || 'Inter, sans-serif',
    fontSize: settings.font_size || '16px',
    fontWeight: settings.font_weight || '400',
    textAlign: settings.text_align || 'left',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: settings.border_style || 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const defaultSectionTitleStyle = {
    fontSize: settings.title_font_size || '28px',
    fontWeight: settings.title_font_weight || '700',
    marginBottom: '24px',
    color: settings.title_color || '#ffffff',
    textAlign: settings.title_align || 'left'
  };

  // Use provided styles or defaults
  const finalSectionStyle = { ...defaultSectionStyle, ...sectionStyle };
  const finalSectionTitleStyle = { ...defaultSectionTitleStyle, ...sectionTitleStyle };

  // If no profile data, show elegant placeholder
  if (!profileUrl || !username) {
    console.log('🚫 Showing placeholder because:', {
      profileUrl: profileUrl,
      username: username,
      hasProfileUrl: !!profileUrl,
      hasUsername: !!username,
      dribbbleProfileData: dribbbleProfileData
    });
    
    // TEMPORARY TEST: Force show profile card for testing
    if (dribbbleProfileData && typeof dribbbleProfileData === 'string' && dribbbleProfileData.includes('dribbble.com')) {
      console.log('🧪 TEST: Forcing profile display with data:', dribbbleProfileData);
      const testUsername = extractUsername(dribbbleProfileData);
      return (
        <div style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '16px',
          padding: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          width: '100%',
          ...sectionStyle
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Left side - Icon and username */}
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
                background: '#EA4C89',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(234, 76, 137, 0.3)',
                flexShrink: 0
              }}>
                <FaDribbble size={18} color="white" />
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
                  @{testUsername}
                </div>
                <div style={{
                  fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
                  color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '400',
                  fontFamily: settings.font_family || 'Inter, sans-serif'
                }}>
                  Dribbble Profile
                </div>
              </div>
            </div>

            {/* Right side - Button */}
                      <button style={{
            background: '#EA4C89',
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
              boxShadow: '0 2px 8px rgba(234, 76, 137, 0.3)',
              letterSpacing: '-0.1px',
              flexShrink: 0,
              fontFamily: settings.font_family || 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(234, 76, 137, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(234, 76, 137, 0.3)';
            }}
            onClick={() => {
              window.open(dribbbleProfileData, '_blank', 'noopener,noreferrer');
            }}
            >
              <FaExternalLinkAlt size={12} />
              View
            </button>
          </div>
        </div>
      );
    }
    
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
              background: '#EA4C89',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(234, 76, 137, 0.3)',
              flexShrink: 0
            }}>
              <FaDribbble size={18} color="white" />
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
                Dribbble Profile
              </div>
              <div style={{
                fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
                color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
                fontWeight: '400',
                fontFamily: settings.font_family || 'Inter, sans-serif'
              }}>
                Add your Dribbble profile
              </div>
            </div>
          </div>

          {/* Right side - Placeholder button */}
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: settings.font_size ? (parseInt(settings.font_size) - 2) + 'px' : '14px',
            fontWeight: settings.font_weight || '600',
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '-0.1px',
            flexShrink: 0,
            opacity: 0.6,
            fontFamily: settings.font_family || 'Inter, sans-serif'
          }}
          disabled
          >
            <FaExternalLinkAlt size={12} />
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '8px 12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      ...sectionStyle
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Left side - Icon and username */}
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
            background: '#EA4C89',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(234, 76, 137, 0.3)',
            flexShrink: 0
          }}>
            <FaDribbble size={18} color="white" />
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
              @{username}
            </div>
            <div style={{
              fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
              color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
              fontWeight: '400',
              fontFamily: settings.font_family || 'Inter, sans-serif'
            }}>
              Dribbble Profile
            </div>
          </div>
        </div>

        {/* Right side - Button */}
        <button style={{
          background: '#EA4C89',
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
          boxShadow: '0 2px 8px rgba(234, 76, 137, 0.3)',
          letterSpacing: '-0.1px',
          flexShrink: 0,
          fontFamily: settings.font_family || 'Inter, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(234, 76, 137, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(234, 76, 137, 0.3)';
        }}
        onClick={() => {
          const displayUrl = profileUrl || (dribbbleProfileData && typeof dribbbleProfileData === 'string' ? dribbbleProfileData : '');
          if (displayUrl) {
            window.open(displayUrl, '_blank', 'noopener,noreferrer');
          }
        }}
        >
          <FaExternalLinkAlt size={12} />
          View
        </button>
      </div>
    </div>
  );
} 