'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function TikTokHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

  // Add CSS for loading spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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
    const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    const vmMatch = url.match(/vm\.tiktok\.com\/([^&\s]+)/);
    
    if (tiktokMatch) {
      return tiktokMatch[1];
    } else if (vmMatch) {
      return vmMatch[1];
    }
    return null;
  };

  // Extract username from TikTok URL
  const extractUsername = (url) => {
    const match = url.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Format number for display (e.g., 1000 -> 1K)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Fetch video data for all highlights
  useEffect(() => {
    const fetchAllVideoData = async () => {
      if (initialTikTokHighlightsData.length === 0) return;
      
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
        console.error('Error fetching video data:', error);
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
    const username = extractUsername(url);
    if (videoId) {
      return { videoId, username };
    }
    return null;
  };

  // Generate a more descriptive title based on the URL
  const generateVideoTitle = (url, entry) => {
    const tiktokInfo = extractTikTokInfo(url);
    if (tiktokInfo) {
      return tiktokInfo.username ? `@${tiktokInfo.username}'s TikTok` : `TikTok Video (${tiktokInfo.videoId})`;
    }
    return entry.title || 'TikTok Video';
  };

  // Generate a more descriptive description
  const generateVideoDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this TikTok video!') {
      return entry.description;
    }
    
    // If no custom description, create a generic one
    return 'Check out this TikTok video!';
  };

  // Render single TikTok highlight card
  const renderTikTokHighlightCard = (entry, index, isCarousel = false) => {
    const tiktokInfo = extractTikTokInfo(entry.url);
    const videoTitle = generateVideoTitle(entry.url, entry);
    const videoDescription = generateVideoDescription(entry);
    const videoDataForUrl = videoData[entry.url];
    const videoId = tiktokInfo?.videoId;
    const username = tiktokInfo?.username;
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialTikTokHighlightsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* TikTok-styled wrapper */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          {/* TikTok Header */}
          <div style={{ 
            backgroundColor: '#000000',
            padding: '16px',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* TikTok icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <FaTiktok style={{ color: '#000000', fontSize: '16px' }} />
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  TikTok Video
                </div>
                {username && (
                  <div style={{
                    color: '#cccccc',
                    fontSize: '12px'
                  }}>
                    @{username}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TikTok Content */}
          <div style={{ padding: '16px' }}>
            {/* Video thumbnail */}
            <div style={{
              marginBottom: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {videoDataForUrl?.thumbnail_url ? (
                <>
                  <img 
                    src={videoDataForUrl.thumbnail_url}
                    alt="TikTok video thumbnail"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Play button overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid #ffffff',
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      marginLeft: '2px'
                    }} />
                  </div>
                </>
              ) : (
                /* Fallback thumbnail placeholder */
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666666',
                  fontSize: '14px'
                }}>
                  <FaTiktok style={{ 
                    fontSize: '48px', 
                    color: '#fe2c55',
                    marginBottom: '8px',
                    opacity: 0.5
                  }} />
                  <div>TikTok Video</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    Click to watch
                  </div>
                </div>
              )}
            </div>

            {/* Video title */}
            <div style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {videoDataForUrl?.title || videoTitle}
            </div>

            {/* Video description */}
            {videoDescription && (
              <div style={{
                color: '#cccccc',
                fontSize: '14px',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {videoDescription}
              </div>
            )}

            {/* Video metadata */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#999999'
            }}>
              {videoDataForUrl?.author_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>by</span>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>
                    {videoDataForUrl.author_name}
                  </span>
                </div>
              )}
            </div>

            {/* External link button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  backgroundColor: '#fe2c55',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e62a4d';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fe2c55';
                }}
              >
                <FaExternalLinkAlt style={{ fontSize: '12px' }} />
                Watch on TikTok
              </a>
            </div>
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Section Title */}
        <div style={{
          ...sectionTitleStyle,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaTiktok style={{ color: '#fe2c55', fontSize: '20px' }} />
          <span>TikTok Highlights</span>
        </div>

        {/* Loading state */}
        {loadingVideos && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #fe2c55',
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
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {renderTikTokHighlightCard(initialTikTokHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Carousel indicators - only dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {initialTikTokHighlightsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === currentIndex ? textColor : 'rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
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
  }

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
        <FaTiktok style={{ color: '#fe2c55', fontSize: '20px' }} />
        <span>TikTok Highlights</span>
      </div>
      
      <div style={{
        ...placeholderStyle,
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <FaTiktok style={{ 
          fontSize: '48px', 
          color: '#fe2c55', 
          marginBottom: '16px',
          opacity: 0.5
        }} />
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          No TikTok highlights yet
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          Add your best TikTok videos to showcase your content
        </div>
      </div>
    </div>
  );
} 