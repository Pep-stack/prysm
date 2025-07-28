'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function LinkedInHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

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

  // Extract post ID from URL
  const extractPostId = (url) => {
    const activityMatch = url.match(/activity_(\d+)/);
    const updateMatch = url.match(/update\/([^&\s]+)/);
    
    if (activityMatch) {
      return activityMatch[1];
    } else if (updateMatch) {
      return updateMatch[1];
    }
    return null;
  };

  // Fetch post data for all highlights
  useEffect(() => {
    const fetchAllPostData = async () => {
      if (initialLinkedInHighlightsData.length === 0) return;
      
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
        console.error('Error fetching post data:', error);
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

  const extractLinkedInInfo = (url) => {
    const postId = extractPostId(url);
    if (postId) {
      return { postId };
    }
    return null;
  };

  // Generate a more descriptive title based on the URL
  const generatePostTitle = (url, entry) => {
    const linkedinInfo = extractLinkedInInfo(url);
    if (linkedinInfo) {
      return `LinkedIn Post (${linkedinInfo.postId})`;
    }
    return entry.title || 'LinkedIn Post';
  };

  // Generate a more descriptive description
  const generatePostDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this LinkedIn post!') {
      return entry.description;
    }
    
    // If no custom description, create a generic one
    return 'Check out this LinkedIn post!';
  };

  // Render single LinkedIn highlight card
  const renderLinkedInHighlightCard = (entry, index, isCarousel = false) => {
    const linkedinInfo = extractLinkedInInfo(entry.url);
    const postTitle = generatePostTitle(entry.url, entry);
    const postDescription = generatePostDescription(entry);
    const postDataForUrl = postData[entry.url];
    const postId = linkedinInfo?.postId;
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialLinkedInHighlightsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* LinkedIn-styled wrapper */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          {/* LinkedIn Header */}
          <div style={{ 
            backgroundColor: '#000000',
            padding: '16px',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* LinkedIn icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: '#0077B5',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <FaLinkedin style={{ color: '#ffffff', fontSize: '16px' }} />
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  LinkedIn Post
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Content */}
          <div style={{ padding: '16px' }}>
            {/* Post info */}
            {postDataForUrl ? (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px'
              }}>
                {/* Post title from oEmbed API */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>
                  {postDataForUrl.title || postTitle}
                </div>
                
                {/* Post author */}
                {postDataForUrl.author_name && (
                  <div style={{
                    fontSize: '14px',
                    color: '#888888',
                    marginBottom: '8px'
                  }}>
                    by {postDataForUrl.author_name}
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
                  {postTitle}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#888888'
                }}>
                  {postDescription}
                </div>
              </div>
            )}
            
            {/* LinkedIn post preview */}
            <div style={{
              marginBottom: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f2ef',
              padding: '16px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#0077B5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaLinkedin style={{ color: '#ffffff', fontSize: '16px' }} />
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#000000'
                  }}>
                    LinkedIn Post
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666666'
                  }}>
                    Professional content
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#000000',
                lineHeight: '1.4'
              }}>
                {postDataForUrl?.html ? (
                  <div dangerouslySetInnerHTML={{ __html: postDataForUrl.html }} />
                ) : (
                  'Professional LinkedIn post content'
                )}
              </div>
            </div>
            
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
                backgroundColor: '#0077B5',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#005885';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0077B5';
              }}
            >
              <FaExternalLinkAlt style={{ fontSize: '12px' }} />
              View on LinkedIn
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
          <FaLinkedin style={{ color: '#0077B5', fontSize: '20px' }} />
          <span>LinkedIn Highlights</span>
        </div>

        {/* Loading state */}
        {loadingPosts && (
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
              borderTop: '3px solid #0077B5',
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
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {renderLinkedInHighlightCard(initialLinkedInHighlightsData[currentIndex], currentIndex, true)}
                </div>

                {/* Carousel indicators - only dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {initialLinkedInHighlightsData.map((_, index) => (
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
        <div style={{
          ...sectionTitleStyle,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaLinkedin style={{ color: '#0077B5', fontSize: '20px' }} />
          <span>LinkedIn Highlights</span>
        </div>
        
        <div style={{
          ...placeholderStyle,
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <FaLinkedin style={{ 
            fontSize: '48px', 
            color: '#0077B5', 
            marginBottom: '16px',
            opacity: 0.5
          }} />
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            No LinkedIn highlights yet
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Add your best LinkedIn posts to showcase your professional content
          </div>
        </div>
      </div>
    );
  }
} 