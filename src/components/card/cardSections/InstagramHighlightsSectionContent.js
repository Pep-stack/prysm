'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function InstagramProfileSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');

  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';

  // Parse Instagram profile data
  const parseInstagramProfileData = (profileData) => {
    console.log('🔍 Parsing Instagram profile data:', {
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

  // Extract username from Instagram URL
  const extractUsername = (url) => {
    if (!url) return '';
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  };

  // Get Instagram profile data from profile
  const instagramProfileData = useMemo(() => {
    console.log('🔍 DEBUG: Profile data received:', {
      profile: profile,
      instagram_profile: profile?.instagram_profile,
      profileKeys: profile && typeof profile === 'object' ? Object.keys(profile) : 'no profile',
      hasInstagramProfile: !!profile?.instagram_profile
    });
    return profile?.instagram_profile;
  }, [profile?.instagram_profile]);

  // Parse data on mount
  useEffect(() => {
    console.log('🔄 useEffect triggered with instagramProfileData:', instagramProfileData);
    const parsedData = parseInstagramProfileData(instagramProfileData);
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
  }, [instagramProfileData]);

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
      instagramProfileData: instagramProfileData
    });
    
    // TEMPORARY TEST: Force show profile card for testing
    if (instagramProfileData && typeof instagramProfileData === 'string' && instagramProfileData.includes('instagram.com')) {
      console.log('🧪 TEST: Forcing profile display with data:', instagramProfileData);
      const testUsername = extractUsername(instagramProfileData);
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
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)',
                flexShrink: 0
              }}>
                <FaInstagram size={18} color="white" />
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
                  Instagram Profile
                </div>
              </div>
            </div>

            {/* Right side - Button */}
            <button style={{
              background: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
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
              boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)',
              letterSpacing: '-0.1px',
              flexShrink: 0,
              fontFamily: settings.font_family || 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 39, 67, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(220, 39, 67, 0.3)';
            }}
            onClick={() => {
              window.open(instagramProfileData, '_blank', 'noopener,noreferrer');
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
              background: '#E4405F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)',
              flexShrink: 0
            }}>
              <FaInstagram size={18} color="white" />
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
                Instagram Profile
              </div>
              <div style={{
                fontSize: (parseInt(settings.font_size) || 16) - 3 + 'px',
                color: settings.text_color ? `${settings.text_color}CC` : 'rgba(255, 255, 255, 0.7)',
                fontWeight: '400',
                fontFamily: settings.font_family || 'Inter, sans-serif'
              }}>
                Add your Instagram profile
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
            background: '#E4405F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)',
            flexShrink: 0
          }}>
            <FaInstagram size={18} color="white" />
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
              Instagram Profile
            </div>
          </div>
        </div>

        {/* Right side - Button */}
        <button style={{
          background: '#E4405F',
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
          boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)',
          letterSpacing: '-0.1px',
          flexShrink: 0,
          fontFamily: settings.font_family || 'Inter, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(220, 39, 67, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(220, 39, 67, 0.3)';
        }}
        onClick={() => {
          const displayUrl = profileUrl || (instagramProfileData && typeof instagramProfileData === 'string' ? instagramProfileData : '');
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