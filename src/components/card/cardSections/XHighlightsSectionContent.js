'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function XHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
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
      .tweet-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .tweet-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
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
  const [tweetData, setTweetData] = useState({});
  const [loadingTweets, setLoadingTweets] = useState(false);

  // Parse and memoize X highlights data
  const parseXHighlightsData = (highlightsData) => {
    console.log('🔍 Parsing X highlights data:', {
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
        console.error('❌ Error parsing X highlights JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid X highlights data found');
    return [];
  };

  const initialXHighlightsData = useMemo(() => {
    return parseXHighlightsData(profile?.x_highlights);
  }, [profile?.x_highlights]);

  // Theme-responsive detection (moved to component level for global access)
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#0a0a0a') || // midnight black
    settings.background_color.includes('#18181b') || // deep charcoal
    settings.background_color.includes('#1a1a1a') || // dark mesh
    settings.text_color === '#f5f5f5' || // light text indicates dark theme
    settings.text_color === '#fafafa' ||
    settings.text_color === '#f8f8f8'
  );

  // Fetch tweet data using our server-side proxy
  const fetchTweetData = async (url) => {
    try {
      const response = await fetch(`/api/x-oembed?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.error('Failed to fetch tweet data:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Tweet data error:', data.error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching tweet data:', error);
      return null;
    }
  };

  // Fetch tweet data for all highlights
  useEffect(() => {
    const fetchAllTweetData = async () => {
      if (initialXHighlightsData.length === 0) {
        console.log('ℹ️ No X highlights to fetch data for');
        return;
      }
      
      console.log('🐦 Starting to fetch tweet data for', initialXHighlightsData.length, 'highlights');
      
      setLoadingTweets(true);
      const newTweetData = {};
      
      try {
        for (const highlight of initialXHighlightsData) {
          if (highlight.url && !tweetData[highlight.url]) {
            const data = await fetchTweetData(highlight.url);
            if (data) {
              newTweetData[highlight.url] = data;
            }
          }
        }
        
        if (Object.keys(newTweetData).length > 0) {
          setTweetData(prev => ({ ...prev, ...newTweetData }));
        }
      } catch (error) {
        console.error('💥 Error fetching tweet data:', error);
      } finally {
        setLoadingTweets(false);
      }
    };

    fetchAllTweetData();
  }, [initialXHighlightsData]);

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
    if (initialXHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialXHighlightsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHighlight = () => {
    if (initialXHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialXHighlightsData.length - 1 : prev - 1
      );
    }
  };

  // Generate a more descriptive title
  const generateTweetTitle = (entry) => {
    return entry.title || 'X Post';
  };

  // Generate a more descriptive description
  const generateTweetDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this X post!') {
      return entry.description;
    }
    return 'Check out this X post!';
  };

  // Render single X highlight card with new minimalist design
  const renderXHighlightCard = (entry, index, isCarousel = false) => {
    const tweetTitle = generateTweetTitle(entry);
    const tweetDescription = generateTweetDescription(entry);
    const tweetDataForUrl = tweetData[entry.url];
    
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
        {/* Clean, minimalist tweet card */}
        <div 
          className="tweet-card-hover"
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
          {/* Tweet preview area */}
          <div style={{
            position: 'relative',
            padding: '20px',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Subtle X branding */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              borderRadius: '6px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <FaXTwitter style={{ color: '#ffffff', fontSize: '12px' }} />
            </div>

            {/* Tweet content */}
            {tweetDataForUrl ? (
              <div>
                {tweetDataForUrl.author_name && (
                  <p style={{
                    fontSize: '14px',
                    color: cardSecondaryTextColor,
                    margin: '0 0 12px 0',
                    fontWeight: '500'
                  }}>
                    @{tweetDataForUrl.author_name}
                  </p>
                )}
                
                {/* Show actual tweet HTML content if available */}
                {tweetDataForUrl.html ? (
                  <div 
                    style={{
                      fontSize: '16px',
                      color: cardTextColor,
                      margin: '0 0 16px 0',
                      lineHeight: '1.4'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: tweetDataForUrl.html.replace(
                        /<a /g, 
                        `<a style="color: ${isDarkTheme ? '#60a5fa' : '#3b82f6'}; text-decoration: none;" `
                      )
                    }}
                  />
                ) : tweetDataForUrl.title ? (
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: cardTextColor,
                    margin: '0 0 16px 0',
                    lineHeight: '1.4',
                    letterSpacing: '-0.01em'
                  }}>
                    {tweetDataForUrl.title}
                  </h3>
                ) : (
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: cardTextColor,
                    margin: '0 0 16px 0',
                    lineHeight: '1.4',
                    letterSpacing: '-0.01em'
                  }}>
                    {tweetTitle}
                  </h3>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: cardTextColor,
                  margin: '0 0 8px 0',
                  lineHeight: '1.4',
                  letterSpacing: '-0.01em'
                }}>
                  {tweetTitle}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: cardSecondaryTextColor,
                  margin: '0 0 16px 0'
                }}>
                  {tweetDescription}
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
                letterSpacing: '0.01em',
                alignSelf: 'flex-start'
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
              View Post
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  if (initialXHighlightsData.length > 0) {
    return (
      <div 
        style={{
          ...sectionStyle,
          padding: '0',
          paddingBottom: '16px',
          margin: '0',
          marginBottom: '48px',
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
          borderBottom: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#000000',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaXTwitter style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            X Highlights
          </h2>
        </div>

        {/* Loading state */}
        {loadingTweets && (
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
        {!loadingTweets && (
          <div>
            {/* Single post display */}
            {initialXHighlightsData.length === 1 && (
              <div>
                {renderXHighlightCard(initialXHighlightsData[0], 0)}
              </div>
            )}

            {/* Carousel for multiple posts */}
            {initialXHighlightsData.length > 1 && (
              <div style={{
                position: 'relative'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  width: '100%'
                }}>
                  {renderXHighlightCard(initialXHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Minimalist carousel indicators */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  marginBottom: '16px'
                }}>
                  {initialXHighlightsData.map((_, index) => (
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
        paddingBottom: '16px',
        margin: '0',
        marginBottom: '48px',
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
          borderBottom: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#000000',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaXTwitter style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            X Highlights
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
            <FaXTwitter style={{ 
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
            No X highlights yet.<br />
            Add your best posts to showcase your content.
          </p>
        </div>
      </div>
    );
  }
} 