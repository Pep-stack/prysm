'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaGithub, FaStar, FaCodeBranch, FaComment, FaExclamationCircle } from 'react-icons/fa';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function GitHubHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
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
      if (!initialGitHubHighlightsData || initialGitHubHighlightsData.length === 0) return;
      
      setLoadingGithub(true);
      const dataMap = {};
      
      for (const entry of initialGitHubHighlightsData) {
        if (entry.url) {
          const data = await fetchGitHubData(entry.url);
          if (data) {
            dataMap[entry.url] = data;
          }
        }
      }
      
      setGithubData(dataMap);
      setLoadingGithub(false);
    };

    fetchAllGitHubData();
  }, [initialGitHubHighlightsData]);

  const handleSave = () => {
    if (onSave) onSave();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const nextHighlight = () => {
    if (initialGitHubHighlightsData.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % initialGitHubHighlightsData.length);
    }
  };

  const prevHighlight = () => {
    if (initialGitHubHighlightsData.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + initialGitHubHighlightsData.length) % initialGitHubHighlightsData.length);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextHighlight();
      } else {
        prevHighlight();
      }
    }
  };

  const extractGitHubInfo = (url) => {
    // Extract owner and repo from GitHub URL
    const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    const gistMatch = url.match(/gist\.github\.com\/([^\/]+)\/([^\/\?#]+)/);
    
    if (repoMatch) {
      return {
        owner: repoMatch[1],
        repo: repoMatch[2]
      };
    } else if (gistMatch) {
      return {
        owner: gistMatch[1],
        gistId: gistMatch[2]
      };
    }
    return null;
  };

  const generateGitHubTitle = (url, entry) => {
    const githubInfo = extractGitHubInfo(url);
    if (githubInfo) {
      if (githubInfo.repo) {
        return `${githubInfo.owner}/${githubInfo.repo}`;
      } else if (githubInfo.gistId) {
        return `@${githubInfo.owner}'s Gist`;
      }
    }
    return entry.title || 'GitHub Content';
  };

  const generateGitHubDescription = (entry) => {
    return entry.description || 'Check out this GitHub content!';
  };

  const renderGitHubHighlightCard = (entry, index, isCarousel = false) => {
    const currentUrl = entry.url;
    const githubDataForUrl = githubData[currentUrl];
    const githubInfo = extractGitHubInfo(currentUrl);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialGitHubHighlightsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          width: '100%'
        }}
      >
        {/* GitHub-styled wrapper */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          {/* GitHub Header */}
          <div style={{ 
            backgroundColor: '#000000',
            padding: '16px',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* GitHub icon */}
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
                <FaGithub style={{ color: '#000000', fontSize: '16px' }} />
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  GitHub {githubDataForUrl?.type ? githubDataForUrl.type.charAt(0).toUpperCase() + githubDataForUrl.type.slice(1) : 'Content'}
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Content */}
          <div style={{ padding: '16px' }}>
            {/* Content based on GitHub data */}
            {githubDataForUrl ? (
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '12px'
              }}>
                {/* Title */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>
                  {githubDataForUrl.title || generateGitHubTitle(currentUrl, entry)}
                </div>
                
                {/* Description */}
                <div style={{
                  fontSize: '14px',
                  color: '#888888',
                  marginBottom: '12px'
                }}>
                  {githubDataForUrl.description}
                </div>

                {/* GitHub-specific metadata */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#8b949e',
                  marginBottom: '12px',
                  flexWrap: 'wrap'
                }}>
                  {githubDataForUrl.author_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>by</span>
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>
                        {githubDataForUrl.author_name}
                      </span>
                    </div>
                  )}

                  {/* Repository-specific stats */}
                  {githubDataForUrl.type === 'repository' && (
                    <>
                      {githubDataForUrl.language && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCodeBranch />
                          <span>{githubDataForUrl.language}</span>
                        </div>
                      )}
                      {githubDataForUrl.stars && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaStar style={{ color: '#fbbf24' }} />
                          <span>{githubDataForUrl.stars.toLocaleString()}</span>
                        </div>
                      )}
                      {githubDataForUrl.forks && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCodeBranch />
                          <span>{githubDataForUrl.forks.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Gist-specific info */}
                  {githubDataForUrl.type === 'gist' && githubDataForUrl.files && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCodeBranch />
                      <span>{githubDataForUrl.files.length} file(s)</span>
                    </div>
                  )}

                  {/* Issue/PR-specific info */}
                  {(githubDataForUrl.type === 'issue' || githubDataForUrl.type === 'pull_request') && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {githubDataForUrl.type === 'issue' ? <FaExclamationCircle /> : <FaCodeBranch />}
                        <span style={{ 
                          color: githubDataForUrl.state === 'open' ? '#238636' : 
                                 githubDataForUrl.state === 'closed' ? '#da3633' : '#f0883e'
                        }}>
                          {githubDataForUrl.state}
                        </span>
                      </div>
                      {githubDataForUrl.comments > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaComment />
                          <span>{githubDataForUrl.comments}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* User-specific info */}
                  {githubDataForUrl.type === 'user' && (
                    <>
                      {githubDataForUrl.followers && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaStar />
                          <span>{githubDataForUrl.followers.toLocaleString()} followers</span>
                        </div>
                      )}
                      {githubDataForUrl.public_repos && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCodeBranch />
                          <span>{githubDataForUrl.public_repos} repos</span>
                        </div>
                      )}
                      {githubDataForUrl.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📍 {githubDataForUrl.location}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Organization-specific info */}
                  {githubDataForUrl.type === 'organization' && (
                    <>
                      {githubDataForUrl.public_repos && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCodeBranch />
                          <span>{githubDataForUrl.public_repos} repos</span>
                        </div>
                      )}
                      {githubDataForUrl.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📍 {githubDataForUrl.location}</span>
                        </div>
                      )}
                      {githubDataForUrl.company && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🏢 {githubDataForUrl.company}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* External link button */}
                <a 
                  href={githubDataForUrl.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                >
                  <FaExternalLinkAlt style={{ fontSize: '12px' }} />
                  View on GitHub
                </a>
              </div>
            ) : loadingGithub ? (
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
                Loading GitHub data...
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
                  {generateGitHubTitle(currentUrl, entry)}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#888888'
                }}>
                  {generateGitHubDescription(entry)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    

    return (
      <div 
        key={entry.id || index}
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* GitHub Header */}
        <div style={titleStyle}>
          <FaGithub style={{ color: '#ffffff', fontSize: '20px' }} />
          <span>{generateGitHubTitle(currentUrl, entry)}</span>
        </div>

        {/* Content based on GitHub data */}
        {githubDataForUrl ? (
          <div>
            {/* Description */}
            <div style={descriptionStyle}>
              {githubDataForUrl.description}
            </div>

            {/* GitHub-specific metadata */}
            <div style={metadataStyle}>
              {githubDataForUrl.author_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>by</span>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>
                    {githubDataForUrl.author_name}
                  </span>
                </div>
              )}

              {/* Repository-specific stats */}
              {githubDataForUrl.type === 'repository' && (
                <>
                  {githubDataForUrl.language && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCodeBranch />
                      <span>{githubDataForUrl.language}</span>
                    </div>
                  )}
                  {githubDataForUrl.stars && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaStar style={{ color: '#fbbf24' }} />
                      <span>{githubDataForUrl.stars.toLocaleString()}</span>
                    </div>
                  )}
                  {githubDataForUrl.forks && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCodeBranch />
                      <span>{githubDataForUrl.forks.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}

              {/* Gist-specific info */}
              {githubDataForUrl.type === 'gist' && githubDataForUrl.files && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCodeBranch />
                  <span>{githubDataForUrl.files.length} file(s)</span>
                </div>
              )}

              {/* Issue/PR-specific info */}
              {(githubDataForUrl.type === 'issue' || githubDataForUrl.type === 'pull_request') && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {githubDataForUrl.type === 'issue' ? <FaExclamationCircle /> : <FaCodeBranch />}
                    <span style={{ 
                      color: githubDataForUrl.state === 'open' ? '#238636' : 
                             githubDataForUrl.state === 'closed' ? '#da3633' : '#f0883e'
                    }}>
                      {githubDataForUrl.state}
                    </span>
                  </div>
                  {githubDataForUrl.comments > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaComment />
                      <span>{githubDataForUrl.comments}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* External link */}
            <a 
              href={githubDataForUrl.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={linkStyle}
            >
              View on GitHub
              <FaExternalLinkAlt />
            </a>
          </div>
        ) : loadingGithub ? (
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
            Loading GitHub data...
          </div>
        ) : (
          <div style={{
            color: '#ffffff',
            fontSize: '14px',
            lineHeight: '1.4',
            marginBottom: '12px',
            minHeight: '40px'
          }}>
            {generateGitHubDescription(entry)}
          </div>
        )}
      </div>
    );
  };

           // If no highlights, show placeholder
         if (!initialGitHubHighlightsData || initialGitHubHighlightsData.length === 0) {
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
                 <FaGithub style={{ color: '#ffffff', fontSize: '20px' }} />
                 <span>GitHub Highlights</span>
               </div>
               
               <div style={{
                 ...placeholderStyle,
                 textAlign: 'center',
                 padding: '40px 20px'
               }}>
                 <FaGithub style={{ 
                   fontSize: '48px', 
                   color: '#ffffff', 
                   marginBottom: '16px',
                   opacity: 0.5
                 }} />
                 <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                   No GitHub highlights yet
                 </div>
                 <div style={{ fontSize: '14px', opacity: 0.7 }}>
                   Add your best GitHub content to showcase your work
                 </div>
               </div>
             </div>
           );
         }
       
         // If only one highlight, show it directly
         if (initialGitHubHighlightsData.length === 1) {
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
             }}
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}
             >
               <div style={{
                 ...sectionTitleStyle,
                 marginBottom: '16px',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px'
               }}>
                 <FaGithub style={{ color: '#ffffff', fontSize: '20px' }} />
                 <span>GitHub Highlights</span>
               </div>
               
               {renderGitHubHighlightCard(initialGitHubHighlightsData[0], 0)}
             </div>
           );
         }
       
         // Multiple highlights - show carousel
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
           }}
           onTouchStart={handleTouchStart}
           onTouchEnd={handleTouchEnd}
           >
             <div style={{
               ...sectionTitleStyle,
               marginBottom: '16px',
               display: 'flex',
               alignItems: 'center',
               gap: '8px'
             }}>
               <FaGithub style={{ color: '#ffffff', fontSize: '20px' }} />
               <span>GitHub Highlights</span>
             </div>
             
             {/* Carousel container */}
             <div style={{ position: 'relative' }}>
               {renderGitHubHighlightCard(initialGitHubHighlightsData[currentIndex], currentIndex, true)}
               
               {/* Dots indicator */}
               <div style={{
                 display: 'flex',
                 justifyContent: 'center',
                 gap: '6px',
                 marginTop: '12px'
               }}>
                 {initialGitHubHighlightsData.map((_, index) => (
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
           </div>
         );
} 