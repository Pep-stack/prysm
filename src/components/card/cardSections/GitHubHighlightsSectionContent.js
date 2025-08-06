'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaGithub, FaStar, FaCodeBranch, FaComment } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function GitHubHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
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
      .github-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .github-card-hover:hover {
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
  const [githubData, setGithubData] = useState({});
  const [loadingGithub, setLoadingGithub] = useState(false);

  // Parse and memoize GitHub highlights data
  const parseGitHubHighlightsData = (highlightsData) => {
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
        console.error('Error parsing GitHub highlights JSON:', e);
        return [];
      }
    }
    
    return [];
  };

  const initialGitHubHighlightsData = useMemo(() => {
    return parseGitHubHighlightsData(profile?.github_highlights);
  }, [profile?.github_highlights]);

  // Theme-responsive detection (moved to component level for global access)
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#0a0a0a') || // midnight black
    settings.background_color.includes('#18181b') || // deep charcoal
    settings.background_color.includes('#1a1a1a') || // dark mesh
    settings.text_color === '#f5f5f5' || // light text indicates dark theme
    settings.text_color === '#fafafa' ||
    settings.text_color === '#f8f8f8'
  );

  // Fetch GitHub data using our server-side proxy
  const fetchGitHubData = async (url) => {
    try {
      const response = await fetch(`/api/github-oembed?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.error('Failed to fetch GitHub data:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('GitHub data error:', data.error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return null;
    }
  };

  // Fetch all GitHub data for highlights
  useEffect(() => {
    const fetchAllGitHubData = async () => {
      if (!initialGitHubHighlightsData || initialGitHubHighlightsData.length === 0) {
        console.log('ℹ️ No GitHub highlights to fetch data for');
        return;
      }
      
      console.log('🐙 Starting to fetch GitHub data for', initialGitHubHighlightsData.length, 'highlights');
      
      setLoadingGithub(true);
      const dataMap = {};
      
      try {
        for (const entry of initialGitHubHighlightsData) {
          if (entry.url && !githubData[entry.url]) {
            const data = await fetchGitHubData(entry.url);
            if (data) {
              dataMap[entry.url] = data;
            }
          }
        }
        
        if (Object.keys(dataMap).length > 0) {
          setGithubData(prev => ({ ...prev, ...dataMap }));
        }
      } catch (error) {
        console.error('💥 Error fetching GitHub data:', error);
      } finally {
        setLoadingGithub(false);
      }
    };

    fetchAllGitHubData();
  }, [initialGitHubHighlightsData]);

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
    if (initialGitHubHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === initialGitHubHighlightsData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHighlight = () => {
    if (initialGitHubHighlightsData.length > 1) {
      setCurrentIndex((prev) => 
        prev === 0 ? initialGitHubHighlightsData.length - 1 : prev - 1
      );
    }
  };

  // Extract repository info from GitHub URL
  const extractRepoInfo = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
    return null;
  };

  // Generate a more descriptive title
  const generateRepoTitle = (url, entry) => {
    const repoInfo = extractRepoInfo(url);
    if (repoInfo) {
      return `${repoInfo.owner}/${repoInfo.repo}`;
    }
    return entry.title || 'GitHub Repository';
  };

  // Generate a more descriptive description
  const generateRepoDescription = (entry) => {
    if (entry.description && entry.description !== 'Check out this GitHub repository!') {
      return entry.description;
    }
    return 'Check out this GitHub repository!';
  };

  // Format number for display (e.g., 1000 -> 1K)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Render single GitHub highlight card with new minimalist design
  const renderGitHubHighlightCard = (entry, index, isCarousel = false) => {
    const repoTitle = generateRepoTitle(entry.url, entry);
    const repoDescription = generateRepoDescription(entry);
    const githubDataForUrl = githubData[entry.url];
    
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
        {/* Clean, minimalist repo card */}
        <div 
          className="github-card-hover"
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
          {/* Repository preview area */}
          <div style={{
            position: 'relative',
            padding: '20px'
          }}>
            {/* Subtle GitHub branding */}
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
              <FaGithub style={{ color: '#white', fontSize: '12px' }} />
              <span style={{ 
                color: 'white', 
                fontSize: '11px', 
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>
                GITHUB
              </span>
            </div>

            {/* Repository content */}
            <div style={{ paddingRight: '60px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: cardTextColor,
                margin: '0 0 8px 0',
                lineHeight: '1.3',
                letterSpacing: '-0.01em'
              }}>
                {githubDataForUrl?.title || repoTitle}
              </h3>
              
              {githubDataForUrl?.description && (
                <p style={{
                  fontSize: '14px',
                  color: cardSecondaryTextColor,
                  margin: '0 0 16px 0',
                  lineHeight: '1.4'
                }}>
                  {githubDataForUrl.description}
                </p>
              )}

              {/* Repository stats */}
              {githubDataForUrl && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: cardSecondaryTextColor
                }}>
                  {githubDataForUrl.stars !== undefined && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaStar style={{ fontSize: '11px' }} />
                      <span>{formatNumber(githubDataForUrl.stars)}</span>
                    </div>
                  )}
                  {githubDataForUrl.forks !== undefined && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaCodeBranch style={{ fontSize: '11px' }} />
                      <span>{formatNumber(githubDataForUrl.forks)}</span>
                    </div>
                  )}
                  {githubDataForUrl.language && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cardSecondaryTextColor
                      }} />
                      <span>{githubDataForUrl.language}</span>
                    </div>
                  )}
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
                View Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  if (initialGitHubHighlightsData.length > 0) {
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
          borderBottom: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#24292e',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaGithub style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            GitHub Highlights
          </h2>
        </div>

        {/* Loading state */}
        {loadingGithub && (
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
        {!loadingGithub && (
          <div>
            {/* Single repository display */}
            {initialGitHubHighlightsData.length === 1 && (
              <div>
                {renderGitHubHighlightCard(initialGitHubHighlightsData[0], 0)}
              </div>
            )}

            {/* Carousel for multiple repositories */}
            {initialGitHubHighlightsData.length > 1 && (
              <div style={{
                position: 'relative'
              }}>
                {/* Current highlight */}
                <div style={{ 
                  width: '100%'
                }}>
                  {renderGitHubHighlightCard(initialGitHubHighlightsData[currentIndex], currentIndex, true)}
                </div>

                                 {/* Minimalist carousel indicators */}
                 <div style={{
                   display: 'flex',
                   justifyContent: 'center',
                   gap: '8px',
                   marginTop: '20px'
                 }}>
                   {initialGitHubHighlightsData.map((_, index) => (
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
          borderBottom: textColor === '#f5f5f5' || textColor === '#fafafa' || textColor === '#f8f8f8'
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#24292e',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaGithub style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            GitHub Highlights
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
            <FaGithub style={{ 
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
            No GitHub highlights yet.<br />
            Add your best repositories to showcase your work.
          </p>
        </div>
      </div>
    );
  }
} 