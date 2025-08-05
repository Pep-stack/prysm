'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function YouTubeHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

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

  // Parse and memoize YouTube highlights data
  const parseYouTubeHighlightsData = (highlightsData) => {
    console.log('🔍 Parsing YouTube highlights data:', {
      highlightsData,
      type: typeof highlightsData,
      isArray: Array.isArray(highlightsData),
      isNull: highlightsData === null,
      isUndefined: highlightsData === undefined,
      stringLength: typeof highlightsData === 'string' ? highlightsData.length : 'N/A'
    });
    
    if (Array.isArray(highlightsData)) {
      const filtered = highlightsData.filter(entry => entry && typeof entry === 'object' && entry.url);
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      console.log('📋 Filtered entries:', filtered.map(entry => ({ url: entry.url, title: entry.title })));
      return filtered;
    }
    
    if (typeof highlightsData === 'string' && highlightsData.trim()) {
      try {
        const parsed = JSON.parse(highlightsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object' && entry.url);
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          console.log('📋 Filtered entries:', filtered.map(entry => ({ url: entry.url, title: entry.title })));
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing YouTube highlights JSON:', e);
        console.error('❌ Raw data that failed to parse:', highlightsData);
        return [];
      }
    }
    
    console.log('ℹ️ No valid YouTube highlights data found');
    return [];
  };

  const initialYouTubeHighlightsData = useMemo(() => {
    return parseYouTubeHighlightsData(profile?.youtube_highlights);
  }, [profile?.youtube_highlights]);



  // Fetch video data using our server-side proxy
  const fetchVideoData = async (url) => {
    try {
      console.log('🎬 Fetching YouTube video data for URL:', url);
      
      const response = await fetch(`/api/youtube-oembed?url=${encodeURIComponent(url)}`);
      
      console.log('📡 YouTube oEmbed API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('❌ Failed to fetch video data:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorData: errorData
        });
        return null;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Video data error:', {
          error: data.error,
          url: url,
          details: data.details
        });
        return null;
      }
      
      console.log('✅ Successfully fetched video data:', {
        title: data.title,
        author_name: data.author_name,
        video_id: data.video_id
      });
      
      return data;
    } catch (error) {
      console.error('💥 Error fetching video data:', {
        error: error.message,
        url: url,
        stack: error.stack
      });
      return null;
    }
  };

  // Extract video ID from URL
  const extractVideoId = (url) => {
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    const shortMatch = url.match(/youtu\.be\/([^&\s]+)/);
    const embedMatch = url.match(/youtube\.com\/embed\/([^&\s]+)/);
    
    if (watchMatch) {
      return watchMatch[1];
    } else if (shortMatch) {
      return shortMatch[1];
    } else if (embedMatch) {
      return embedMatch[1];
    }
    return null;
  };

  // Extract thumbnail URL from video ID
  const getThumbnailUrl = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      if (initialYouTubeHighlightsData.length === 0) {
        console.log('ℹ️ No YouTube highlights to fetch data for');
        return;
      }
      
      console.log('🎬 Starting to fetch video data for', initialYouTubeHighlightsData.length, 'highlights');
      
      setLoadingVideos(true);
      const newVideoData = {};
      
      try {
        for (const highlight of initialYouTubeHighlightsData) {
          console.log('🎬 Processing highlight:', {
            id: highlight.id,
            url: highlight.url,
            title: highlight.title
          });
          
          if (highlight.url && !videoData[highlight.url]) {
            console.log('🎬 Fetching data for URL:', highlight.url);
            const data = await fetchVideoData(highlight.url);
            if (data) {
              newVideoData[highlight.url] = data;
              console.log('✅ Successfully fetched data for:', highlight.url);
            } else {
              console.log('❌ Failed to fetch data for:', highlight.url);
            }
          } else if (videoData[highlight.url]) {
            console.log('ℹ️ Already have data for:', highlight.url);
          } else {
            console.log('⚠️ No URL found for highlight:', highlight);
          }
        }
        
        if (Object.keys(newVideoData).length > 0) {
          console.log('✅ Setting new video data:', Object.keys(newVideoData));
          setVideoData(prev => ({ ...prev, ...newVideoData }));
        } else {
          console.log('ℹ️ No new video data to set');
        }
      } catch (error) {
        console.error('💥 Error fetching video data:', error);
      } finally {
        setLoadingVideos(false);
        console.log('🏁 Finished fetching video data');
      }
    };

    fetchAllVideoData();
  }, [initialYouTubeHighlightsData]);

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
    if (initialYouTubeHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialYouTubeHighlightsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHighlight = () => {
    if (initialYouTubeHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialYouTubeHighlightsData.length - 1 : prev - 1
      );
    }
  };

  const extractYouTubeInfo = (url) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      return { videoId };
    }
    return null;
  };

  // Generate a more descriptive title based on the URL
  const generateVideoTitle = (url, entry) => {
    const ytInfo = extractYouTubeInfo(url);
    if (ytInfo) {
      return `YouTube Video (${ytInfo.videoId})`;
    }
    return entry.title || 'YouTube Video';
  };

  // Generate a more descriptive description
  const generateVideoDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this YouTube video!') {
      return entry.description;
    }
    
    // If no custom description, create a generic one
    return 'Check out this YouTube video!';
  };

  // Render single YouTube highlight card
  const renderYouTubeHighlightCard = (entry, index, isCarousel = false) => {
    const ytInfo = extractYouTubeInfo(entry.url);
    const videoTitle = generateVideoTitle(entry.url, entry);
    const videoDescription = generateVideoDescription(entry);
    const videoDataForUrl = videoData[entry.url];
    const videoId = ytInfo?.videoId;
    const thumbnailUrl = videoId ? getThumbnailUrl(videoId) : null;
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialYouTubeHighlightsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* YouTube-styled wrapper */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          {/* YouTube Header */}
          <div style={{ 
            backgroundColor: '#000000',
            padding: '16px',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* YouTube icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: '#FF0000',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <FaYoutube style={{ color: '#ffffff', fontSize: '16px' }} />
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  YouTube Video
                </div>

              </div>
            </div>
          </div>

          {/* YouTube Content */}
          <div style={{ padding: '16px' }}>
            {/* Video thumbnail and info */}
            {videoDataForUrl ? (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px'
              }}>
                {/* Video title from oEmbed API */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>
                  {videoDataForUrl.title || videoTitle}
                </div>
                
                {/* Video description */}
                {videoDataForUrl.author_name && (
                  <div style={{
                    fontSize: '14px',
                    color: '#888888',
                    marginBottom: '8px'
                  }}>
                    by {videoDataForUrl.author_name}
                  </div>
                )}
                

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
                  {videoTitle}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#888888'
                }}>
                  {videoDescription}
                </div>
              </div>
            )}
            
            {/* Thumbnail preview */}
            {thumbnailUrl && (
              <div style={{
                marginBottom: '12px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.log('Thumbnail failed to load:', thumbnailUrl);
                    e.target.style.display = 'none';
                  }}
                />
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(255, 0, 0, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <FaYoutube style={{ color: '#ffffff', fontSize: '24px' }} />
                </div>
              </div>
            )}
            
            {/* External link button */}
            <a 
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#FF0000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#CC0000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FF0000';
              }}
            >
              <FaExternalLinkAlt style={{ fontSize: '12px' }} />
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  if (initialYouTubeHighlightsData.length > 0) {
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
          <FaYoutube style={{ color: '#FF0000', fontSize: '20px' }} />
          <span>YouTube Highlights</span>
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
              borderTop: '3px solid #FF0000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* Content */}
        {!loadingVideos && (
          <div>
            {/* Single video display */}
            {initialYouTubeHighlightsData.length === 1 && (
              <div>
                {renderYouTubeHighlightCard(initialYouTubeHighlightsData[0], 0)}
              </div>
            )}

            {/* Carousel for multiple videos */}
            {initialYouTubeHighlightsData.length > 1 && (
              <div style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {renderYouTubeHighlightCard(initialYouTubeHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Carousel indicators - only dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {initialYouTubeHighlightsData.map((_, index) => (
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
            <FaYoutube size={14} style={{ color: 'white' }} />
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
            YouTube Highlights
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          textAlign: 'center'
        }}>
          <FaYoutube size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ 
            margin: 0, 
            fontSize: '16px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            No YouTube highlights yet. Add your best YouTube videos to showcase your content.
          </p>
        </div>
      </div>
    );
  }
} 