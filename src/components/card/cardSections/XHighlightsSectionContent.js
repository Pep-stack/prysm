'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function XHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
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

  // Extract image URLs from tweet HTML
  const extractImageUrls = (html) => {
    if (!html) return [];
    
    const imageUrls = [];
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src.includes('pbs.twimg.com/media/') || src.includes('profile_images') || src.includes('video_thumb')) {
        imageUrls.push(src);
      }
    }
    
    return imageUrls;
  };

  // Extract profile picture URL from tweet HTML
  const extractProfilePicture = (html) => {
    if (!html) return null;
    
    // Look for profile picture in the HTML
    const profileImgMatch = html.match(/<img[^>]+src="([^"]*profile_images[^"]*)"[^>]*>/);
    if (profileImgMatch) {
      return profileImgMatch[1];
    }
    
    return null;
  };

  // Extract engagement metrics from tweet data
  const extractEngagementMetrics = (tweetData) => {
    if (!tweetData) return null;
    
    // Try to extract metrics from the HTML content
    const html = tweetData.html || '';
    
    // Look for common patterns in the HTML that might contain engagement data
    const metrics = {
      likes: null,
      retweets: null,
      replies: null
    };
    
    // Try to find engagement data in the HTML
    // This is a simplified approach - in practice, the oEmbed API might not always include this data
    const likeMatch = html.match(/(\d+)\s*likes?/i);
    const retweetMatch = html.match(/(\d+)\s*retweets?/i);
    const replyMatch = html.match(/(\d+)\s*replies?/i);
    
    if (likeMatch) metrics.likes = parseInt(likeMatch[1]);
    if (retweetMatch) metrics.retweets = parseInt(retweetMatch[1]);
    if (replyMatch) metrics.replies = parseInt(replyMatch[1]);
    
    return metrics;
  };

  // Format number for display (e.g., 1000 -> 1K)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Clean tweet HTML to remove images (we'll show URLs separately)
  const cleanTweetHtml = (html) => {
    if (!html) return '';
    
    // Remove img tags but keep the rest of the content
    return html.replace(/<img[^>]*>/g, '');
  };

  // Fetch tweet data for all highlights
  useEffect(() => {
    const fetchAllTweetData = async () => {
      if (initialXHighlightsData.length === 0) return;
      
      setLoadingTweets(true);
      const newTweetData = {};
      
      try {
        for (const highlight of initialXHighlightsData) {
          if (highlight.url && !tweetData[highlight.url]) {
            const data = await fetchTweetData(highlight.url);
            if (data) {
              // Extract image URLs
              const imageUrls = extractImageUrls(data.html || '');
              newTweetData[highlight.url] = {
                ...data,
                imageUrls: imageUrls
              };
            }
          }
        }
        
        if (Object.keys(newTweetData).length > 0) {
          setTweetData(prev => ({ ...prev, ...newTweetData }));
        }
      } catch (error) {
        console.error('Error fetching tweet data:', error);
      } finally {
        setLoadingTweets(false);
      }
    };

    fetchAllTweetData();
  }, [initialXHighlightsData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialXHighlightsData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(initialXHighlightsData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const nextHighlight = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === initialXHighlightsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevHighlight = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? initialXHighlightsData.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
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

  const extractXInfo = (url) => {
    // Extract username and post ID from X URL
    const xMatch = url.match(/x\.com\/([^\/]+)\/status\/(\d+)/);
    if (xMatch) {
      return {
        username: xMatch[1],
        postId: xMatch[2]
      };
    }
    return null;
  };

  // Generate a more descriptive title based on the URL
  const generatePostTitle = (url, entry) => {
    const xInfo = extractXInfo(url);
    if (xInfo) {
      return `@${xInfo.username}'s post`;
    }
    return entry.title || 'X Post';
  };

  // Generate a more descriptive description
  const generatePostDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this X post!') {
      return entry.description;
    }
    
    // If no custom description, create a generic one
    return 'Check out this X post!';
  };

  // Render single X highlight card
  const renderXHighlightCard = (entry, index, isCarousel = false) => {
    const xInfo = extractXInfo(entry.url);
    const postTitle = generatePostTitle(entry.url, entry);
    const postDescription = generatePostDescription(entry);
    const tweetDataForUrl = tweetData[entry.url];
    
    // Extract image URLs and clean HTML
    const imageUrls = tweetDataForUrl ? extractImageUrls(tweetDataForUrl.html) : [];
    const cleanedTweetHtml = tweetDataForUrl ? cleanTweetHtml(tweetDataForUrl.html) : '';
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialXHighlightsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* X-styled wrapper */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          {/* X Header */}
          <div style={{ 
            backgroundColor: '#000000',
            padding: '16px',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Profile picture or X icon */}
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
                {tweetDataForUrl && tweetDataForUrl.html && (() => {
                  const profilePictureUrl = extractProfilePicture(tweetDataForUrl.html);
                  if (profilePictureUrl) {
                    return (
                      <img 
                        src={profilePictureUrl} 
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.log('Profile picture failed to load:', profilePictureUrl);
                          e.target.style.display = 'none';
                          // Show X icon as fallback
                          e.target.parentElement.innerHTML = '<FaXTwitter style={{ color: "#000000", fontSize: "16px" }} />';
                        }}
                        onLoad={(e) => {
                          console.log('Profile picture loaded successfully:', profilePictureUrl);
                        }}
                      />
                    );
                  }
                  return <FaXTwitter style={{ color: '#000000', fontSize: '16px' }} />;
                })()}
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {xInfo ? `@${xInfo.username}` : 'X User'}
                </div>
                <div style={{
                  color: '#888888',
                  fontSize: '12px'
                }}>
                  {postTitle}
                </div>
              </div>
            </div>
          </div>

          {/* X Content */}
          <div style={{ padding: '16px' }}>
            {/* Tweet content from oEmbed API */}
            {tweetDataForUrl ? (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px',
                minHeight: '40px'
              }}>
                {/* Tweet text */}
                <div 
                  dangerouslySetInnerHTML={{ __html: cleanedTweetHtml }}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.4',
                    color: '#ffffff',
                    marginBottom: imageUrls.length > 0 ? '12px' : '0'
                  }}
                />
                
                {/* Image URLs */}
                {imageUrls.length > 0 && (
                  <div style={{
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      color: '#888888',
                      fontSize: '12px',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      Images in this post:
                    </div>
                    {imageUrls.map((imageUrl, imgIndex) => (
                      <div
                        key={imgIndex}
                        style={{
                          color: '#4a9eff',
                          fontSize: '12px',
                          marginBottom: '4px',
                          wordBreak: 'break-all',
                          fontFamily: 'monospace'
                        }}
                      >
                        {imageUrl}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : loadingTweets ? (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Loading tweet...
              </div>
            ) : (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px',
                minHeight: '40px'
              }}>
                {postDescription}
              </div>
            )}
            
            {/* Post metadata and engagement */}
            <div style={{
              color: '#888888',
              fontSize: '12px',
              marginBottom: '12px'
            }}>
              {/* Post info */}
              {xInfo && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span>Post ID: {xInfo.postId}</span>
                  <span>•</span>
                  <span>@{xInfo.username}</span>
                </div>
              )}
              
              {/* Engagement metrics */}
              {tweetDataForUrl && (() => {
                const metrics = extractEngagementMetrics(tweetDataForUrl);
                if (metrics && (metrics.likes || metrics.retweets || metrics.replies)) {
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '8px 0',
                      borderTop: '1px solid #333',
                      marginTop: '8px'
                    }}>
                      {metrics.replies !== null && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#888888'
                        }}>
                          <span style={{ fontSize: '14px' }}>💬</span>
                          <span>{formatNumber(metrics.replies)}</span>
                        </div>
                      )}
                      {metrics.retweets !== null && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#888888'
                        }}>
                          <span style={{ fontSize: '14px' }}>🔄</span>
                          <span>{formatNumber(metrics.retweets)}</span>
                        </div>
                      )}
                      {metrics.likes !== null && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#888888'
                        }}>
                          <span style={{ fontSize: '14px' }}>❤️</span>
                          <span>{formatNumber(metrics.likes)}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            
            {/* External link button */}
            <a 
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#000000',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              <FaExternalLinkAlt size={10} />
              View on X
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Render display UI
  if (initialXHighlightsData.length > 0) {
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
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} 
      title="Click to edit X highlights"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      >
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
            backgroundColor: textColor,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <FaXTwitter size={14} style={{ color: 'white' }} />
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
            X Highlights
          </h3>
        </div>

        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {initialXHighlightsData.length === 1 ? (
            // Single highlight - show directly
            <div style={{ 
              overflow: 'hidden',
              width: '100%'
            }}>
              {renderXHighlightCard(initialXHighlightsData[0], 0, true)}
            </div>
          ) : (
            // Multiple highlights - show carousel
            <div 
              style={{ 
                position: 'relative',
                overflow: 'hidden',
                width: '100%'
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Current highlight */}
              <div style={{ 
                overflow: 'hidden',
                width: '100%'
              }}>
                {renderXHighlightCard(initialXHighlightsData[currentIndex], currentIndex, true)}
              </div>

              {/* Carousel indicators - only dots */}
              {initialXHighlightsData.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {initialXHighlightsData.map((_, index) => (
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
              )}
            </div>
          )}
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
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
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
            backgroundColor: textColor,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <FaXTwitter size={14} style={{ color: 'white' }} />
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
            X Highlights
          </h3>
        </div>

        {/* Empty state */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: textColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            opacity: 0.6
          }}>
            <FaXTwitter size={20} style={{ color: 'white' }} />
          </div>
          <div style={{
            color: textColor,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            opacity: 0.8
          }}>
            No X Highlights Yet
          </div>
          <div style={{
            color: textColor,
            fontSize: '14px',
            opacity: 0.6,
            lineHeight: '1.4'
          }}>
            Add your best X posts to showcase your content
          </div>
        </div>
      </div>
    );
  }
} 