'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function LinkedInHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

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
      .linkedin-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .linkedin-card-hover:hover {
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
  const [postData, setPostData] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Parse and memoize LinkedIn highlights data
  const parseLinkedInHighlightsData = (highlightsData) => {
    if (Array.isArray(highlightsData)) {
      const filtered = highlightsData.filter(entry => entry && typeof entry === 'object' && entry.url);
      return filtered;
    }
    
    if (typeof highlightsData === 'string' && highlightsData.trim()) {
      try {
        const parsed = JSON.parse(highlightsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object' && entry.url);
          return filtered;
        } else {
          return [];
        }
      } catch (e) {
        console.error('Error parsing LinkedIn highlights JSON:', e);
        return [];
      }
    }
    
    return [];
  };

  const initialLinkedInHighlightsData = useMemo(() => {
    return parseLinkedInHighlightsData(profile?.linkedin_highlights);
  }, [profile?.linkedin_highlights]);

  // Theme-responsive detection (moved to component level for global access)
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#0a0a0a') || // midnight black
    settings.background_color.includes('#18181b') || // deep charcoal
    settings.background_color.includes('#1a1a1a') || // dark mesh
    settings.text_color === '#f5f5f5' || // light text indicates dark theme
    settings.text_color === '#fafafa' ||
    settings.text_color === '#f8f8f8'
  );

  // Fetch post data using our server-side proxy
  const fetchPostData = async (url) => {
    try {
      const response = await fetch(`/api/linkedin-oembed?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.error('Failed to fetch post data:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Post data error:', data.error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching post data:', error);
      return null;
    }
  };

  // Fetch post data for all highlights
  useEffect(() => {
    const fetchAllPostData = async () => {
      if (initialLinkedInHighlightsData.length === 0) {
        console.log('ℹ️ No LinkedIn highlights to fetch data for');
        return;
      }
      
      console.log('💼 Starting to fetch post data for', initialLinkedInHighlightsData.length, 'highlights');
      
      setLoadingPosts(true);
      const newPostData = {};
      
      try {
        for (const highlight of initialLinkedInHighlightsData) {
          if (highlight.url && !postData[highlight.url]) {
            const data = await fetchPostData(highlight.url);
            if (data) {
              newPostData[highlight.url] = data;
            }
          }
        }
        
        if (Object.keys(newPostData).length > 0) {
          setPostData(prev => ({ ...prev, ...newPostData }));
        }
      } catch (error) {
        console.error('💥 Error fetching post data:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchAllPostData();
  }, [initialLinkedInHighlightsData]);

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
    if (initialLinkedInHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialLinkedInHighlightsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHighlight = () => {
    if (initialLinkedInHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialLinkedInHighlightsData.length - 1 : prev - 1
      );
    }
  };

  // Generate a more descriptive title
  const generatePostTitle = (entry) => {
    return entry.title || 'LinkedIn Post';
  };

  // Generate a more descriptive description
  const generatePostDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this LinkedIn post!') {
      return entry.description;
    }
    return 'Check out this LinkedIn post!';
  };

  // Render single LinkedIn highlight card with new minimalist design
  const renderLinkedInHighlightCard = (entry, index, isCarousel = false) => {
    const postTitle = generatePostTitle(entry);
    const postDescription = generatePostDescription(entry);
    const postDataForUrl = postData[entry.url];
    
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
        {/* Clean, minimalist post card */}
        <div 
          className="linkedin-card-hover"
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
          {/* Post preview area */}
          <div style={{
            position: 'relative',
            padding: '20px',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Subtle LinkedIn branding */}
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
              <FaLinkedin style={{ color: '#0077b5', fontSize: '12px' }} />
              <span style={{ 
                color: 'white', 
                fontSize: '11px', 
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>
                LINKEDIN
              </span>
            </div>

            {/* Post content */}
            {postDataForUrl ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: cardTextColor,
                  margin: '0 0 8px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {postDataForUrl.title || postTitle}
                </h3>
                
                {postDataForUrl.author_name && (
                  <p style={{
                    fontSize: '14px',
                    color: cardSecondaryTextColor,
                    margin: '0 0 16px 0',
                    fontWeight: '500'
                  }}>
                    {postDataForUrl.author_name}
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
                  {postTitle}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: cardSecondaryTextColor,
                  margin: '0 0 16px 0'
                }}>
                  {postDescription}
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
  if (initialLinkedInHighlightsData.length > 0) {
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
            backgroundColor: '#0077b5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaLinkedin style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            LinkedIn Highlights
          </h2>
        </div>

        {/* Loading state */}
        {loadingPosts && (
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
        {!loadingPosts && (
          <div>
            {/* Single post display */}
            {initialLinkedInHighlightsData.length === 1 && (
              <div>
                {renderLinkedInHighlightCard(initialLinkedInHighlightsData[0], 0)}
              </div>
            )}

            {/* Carousel for multiple posts */}
            {initialLinkedInHighlightsData.length > 1 && (
              <div style={{
                position: 'relative'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  width: '100%'
                }}>
                  {renderLinkedInHighlightCard(initialLinkedInHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Minimalist carousel indicators */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '20px'
                }}>
                  {initialLinkedInHighlightsData.map((_, index) => (
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
            backgroundColor: '#0077b5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaLinkedin style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            LinkedIn Highlights
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
            <FaLinkedin style={{ 
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
            No LinkedIn highlights yet.<br />
            Add your best posts to showcase your content.
          </p>
        </div>
      </div>
    );
  }
} 