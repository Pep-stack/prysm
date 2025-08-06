'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function TikTokHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

  // Add CSS for loading spinner and animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .video-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .video-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }
      .play-button-hover {
        transition: all 0.2s ease;
      }
      .play-button-hover:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.95) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [videoData, setVideoData] = useState({});
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Parse and memoize TikTok highlights data
  const parseTikTokHighlightsData = (highlightsData) => {
    console.log('🔍 Parsing TikTok highlights data:', {
      highlightsData,
      type: typeof highlightsData,
      isArray: Array.isArray(highlightsData)
    });
    
    if (Array.isArray(highlightsData)) {
      const filtered = highlightsData.filter(entry => entry && typeof entry === 'object' && entry.url);
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof highlightsData === 'string' && highlightsData.trim()) {
      try {
        const parsed = JSON.parse(highlightsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object' && entry.url);
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing TikTok highlights JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid TikTok highlights data found');
    return [];
  };

  const initialTikTokHighlightsData = useMemo(() => {
    return parseTikTokHighlightsData(profile?.tiktok_highlights);
  }, [profile?.tiktok_highlights]);

  // Theme-responsive detection (moved to component level for global access)
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#0a0a0a') || // midnight black
    settings.background_color.includes('#18181b') || // deep charcoal
    settings.background_color.includes('#1a1a1a') || // dark mesh
    settings.text_color === '#f5f5f5' || // light text indicates dark theme
    settings.text_color === '#fafafa' ||
    settings.text_color === '#f8f8f8'
  );

  // Fetch video data using our server-side proxy
  const fetchVideoData = async (url) => {
    try {
      const response = await fetch(`/api/tiktok-oembed?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.error('Failed to fetch video data:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Video data error:', data.error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching video data:', error);
      return null;
    }
  };

  // Extract video ID from TikTok URL
  const extractVideoId = (url) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Extract thumbnail URL from video ID (TikTok doesn't provide direct thumbnails)
  const getThumbnailUrl = (videoId) => {
    if (!videoId) return null;
    // TikTok thumbnails are not easily accessible without API
    return null;
  };

  // Fetch video data for all highlights
  useEffect(() => {
    const fetchAllVideoData = async () => {
      if (initialTikTokHighlightsData.length === 0) {
        console.log('ℹ️ No TikTok highlights to fetch data for');
        return;
      }
      
      console.log('🎬 Starting to fetch video data for', initialTikTokHighlightsData.length, 'highlights');
      
      setLoadingVideos(true);
      const newVideoData = {};
      
      try {
        for (const highlight of initialTikTokHighlightsData) {
          if (highlight.url && !videoData[highlight.url]) {
            const data = await fetchVideoData(highlight.url);
            if (data) {
              newVideoData[highlight.url] = data;
            }
          }
        }
        
        if (Object.keys(newVideoData).length > 0) {
          setVideoData(prev => ({ ...prev, ...newVideoData }));
        }
      } catch (error) {
        console.error('💥 Error fetching video data:', error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchAllVideoData();
  }, [initialTikTokHighlightsData]);

  // Touch/swipe handlers for mobile carousel
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextHighlight(); // Swipe left = next
      } else {
        prevHighlight(); // Swipe right = previous
      }
    }
  };

  const nextHighlight = () => {
    if (initialTikTokHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialTikTokHighlightsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHighlight = () => {
    if (initialTikTokHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialTikTokHighlightsData.length - 1 : prev - 1
      );
    }
  };

  const extractTikTokInfo = (url) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      return { videoId };
    }
    return null;
  };

  // Generate a more descriptive title based on the URL
  const generateVideoTitle = (url, entry) => {
    const ttInfo = extractTikTokInfo(url);
    if (ttInfo) {
      return `TikTok Video (${ttInfo.videoId})`;
    }
    return entry.title || 'TikTok Video';
  };

  // Generate a more descriptive description
  const generateVideoDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this TikTok video!') {
      return entry.description;
    }
    return 'Check out this TikTok video!';
  };

  // Render single TikTok highlight card with new minimalist design
  const renderTikTokHighlightCard = (entry, index, isCarousel = false) => {
    const ttInfo = extractTikTokInfo(entry.url);
    const videoTitle = generateVideoTitle(entry.url, entry);
    const videoDescription = generateVideoDescription(entry);
    const videoDataForUrl = videoData[entry.url];
    const videoId = ttInfo?.videoId;
    
    // Theme-responsive colors (using global isDarkTheme)
    
    // For light themes: dark cards for contrast
    // For dark themes: light cards for contrast
    const cardBackgroundColor = isDarkTheme 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.85)';
    
    const cardTextColor = isDarkTheme 
      ? '#ffffff' 
      : '#ffffff';
      
    const cardSecondaryTextColor = isDarkTheme 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(255, 255, 255, 0.8)';
      
    const buttonBackgroundColor = isDarkTheme 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(255, 255, 255, 0.15)';
      
    const buttonTextColor = isDarkTheme 
      ? '#1a1a1a' 
      : '#ffffff';
      
    const buttonHoverBackgroundColor = isDarkTheme 
      ? 'rgba(255, 255, 255, 1)' 
      : 'rgba(255, 255, 255, 0.25)';
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          marginBottom: isCarousel ? '0' : '24px',
          width: '100%',
          animation: 'fadeIn 0.6s ease forwards'
        }}
      >
        {/* Clean, minimalist video card */}
        <div 
          className="video-card-hover"
          style={{
            backgroundColor: cardBackgroundColor,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: isDarkTheme 
              ? '0 2px 16px rgba(0, 0, 0, 0.3)' 
              : '0 2px 16px rgba(0, 0, 0, 0.06)',
            border: isDarkTheme 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          {/* Video thumbnail placeholder with clean overlay */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            overflow: 'hidden',
            backgroundColor: isDarkTheme ? '#2a2a2a' : 'rgba(255, 255, 255, 0.1)',
            backgroundImage: videoDataForUrl?.thumbnail_url ? `url(${videoDataForUrl.thumbnail_url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!videoDataForUrl?.thumbnail_url && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '48px'
              }}>
                <FaTiktok />
              </div>
            )}
            
            {/* Minimalist play button */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}
            className="play-button-hover"
            onClick={() => window.open(entry.url, '_blank')}
            >
              <FaPlay style={{ 
                color: '#1a1a1a', 
                fontSize: '18px',
                marginLeft: '2px' // Optical adjustment for play icon
              }} />
            </div>
            
            {/* Subtle TikTok branding */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <FaTiktok style={{ color: '#ff0050', fontSize: '12px' }} />
              <span style={{ 
                color: 'white', 
                fontSize: '11px', 
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>
                TIKTOK
              </span>
            </div>
          </div>
          
          {/* Clean content area */}
          <div style={{ padding: '20px' }}>
            {/* Video title and info */}
            {videoDataForUrl ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: cardTextColor,
                  margin: '0 0 8px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {videoDataForUrl.title || videoTitle}
                </h3>
                
                {videoDataForUrl.author_name && (
                  <p style={{
                    fontSize: '14px',
                    color: cardSecondaryTextColor,
                    margin: '0 0 16px 0',
                    fontWeight: '500'
                  }}>
                    {videoDataForUrl.author_name}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: cardTextColor,
                  margin: '0 0 8px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {videoTitle}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: cardSecondaryTextColor,
                  margin: '0 0 16px 0'
                }}>
                  {videoDescription}
                </p>
              </div>
            )}
            
            {/* Minimal action button */}
            <a 
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: buttonBackgroundColor,
                color: buttonTextColor,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = buttonHoverBackgroundColor;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = buttonBackgroundColor;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaExternalLinkAlt style={{ fontSize: '10px' }} />
              Watch Video
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  if (initialTikTokHighlightsData.length > 0) {
    return (
      <div 
        style={{
          ...sectionStyle,
          padding: '0',
          margin: '0',
          background: 'transparent',
          border: 'none',
          borderRadius: '0',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
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
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ff0050',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaTiktok style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            TikTok Highlights
          </h2>
        </div>

        {/* Loading state */}
        {loadingVideos && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid #f0f0f0',
              borderTop: '2px solid #1a1a1a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* Content */}
        {!loadingVideos && (
          <div>
            {/* Single video display */}
            {initialTikTokHighlightsData.length === 1 && (
              <div>
                {renderTikTokHighlightCard(initialTikTokHighlightsData[0], 0)}
              </div>
            )}

            {/* Carousel for multiple videos */}
            {initialTikTokHighlightsData.length > 1 && (
              <div style={{
                position: 'relative'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  width: '100%'
                }}>
                  {renderTikTokHighlightCard(initialTikTokHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Minimalist carousel indicators */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '20px'
                }}>
                  {initialTikTokHighlightsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      style={{
                        width: index === currentIndex ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: index === currentIndex 
                          ? (isDarkTheme ? '#ffffff' : '#1a1a1a')
                          : (isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'),
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    // Clean empty state
    return (
      <div style={{
        ...sectionStyle,
        padding: '0',
        margin: '0',
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        width: '100%',
        fontFamily: settings.font_family || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        {/* Clean section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ff0050',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaTiktok style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            TikTok Highlights
          </h2>
        </div>
        
        {/* Minimal empty state */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: '12px',
          border: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px dashed rgba(255, 255, 255, 0.2)' 
            : '1px dashed rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <FaTiktok style={{ 
              color: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
                ? 'rgba(255, 255, 255, 0.6)' 
                : '#6b7280', 
              fontSize: '20px' 
            }} />
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '14px',
            color: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
              ? 'rgba(255, 255, 255, 0.7)' 
              : '#6b7280',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            No TikTok highlights yet.<br />
            Add your best videos to showcase your content.
          </p>
        </div>
      </div>
    );
  }
} 