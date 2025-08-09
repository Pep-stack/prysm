'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaVimeo } from 'react-icons/fa6';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function VimeoHighlightsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {

  // Add CSS for loading spinner and constrain iframe width
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
      .vimeo-card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .vimeo-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(26, 183, 234, 0.2);
      }
      .vimeo-embed-container {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden;
      }
      .vimeo-embed-container iframe {
        width: 100% !important;
        max-width: 100% !important;
        height: auto;
        aspect-ratio: 16/9;
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
  const [vimeoData, setVimeoData] = useState({});
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Parse and memoize Vimeo highlights data
  const parseVimeoHighlightsData = (highlightsData) => {
    console.log('🔍 Parsing Vimeo highlights data:', {
      highlightsData,
      type: typeof highlightsData,
      isArray: Array.isArray(highlightsData),
      isNull: highlightsData === null,
      isUndefined: highlightsData === undefined,
      stringLength: typeof highlightsData === 'string' ? highlightsData.length : 'N/A'
    });
    
    if (Array.isArray(highlightsData)) {
      const filtered = highlightsData.filter(entry => 
        entry && 
        typeof entry === 'object' && 
        (entry.embedCode || entry.url)
      );
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      console.log('📋 Filtered entries:', filtered.map(entry => ({ 
        url: entry.url, 
        title: entry.title,
        hasEmbedCode: !!entry.embedCode 
      })));
      return filtered;
    }
    
    if (typeof highlightsData === 'string' && highlightsData.trim()) {
      try {
        const parsed = JSON.parse(highlightsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => 
            entry && 
            typeof entry === 'object' && 
            (entry.embedCode || entry.url)
          );
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          console.log('📋 Filtered entries:', filtered.map(entry => ({ 
            url: entry.url, 
            title: entry.title,
            hasEmbedCode: !!entry.embedCode 
          })));
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing Vimeo highlights JSON:', e);
        console.error('❌ Raw data that failed to parse:', highlightsData);
        return [];
      }
    }
    
    console.log('ℹ️ No valid Vimeo highlights data found');
    return [];
  };

  const initialVimeoHighlightsData = useMemo(() => {
    return parseVimeoHighlightsData(profile?.vimeo_highlights);
  }, [profile?.vimeo_highlights]);

  // Theme-responsive detection (moved to component level for global access)
  const isDarkTheme = settings.background_color && (
    settings.background_color.includes('#0a0a0a') || // midnight black
    settings.background_color.includes('#18181b') || // deep charcoal
    settings.background_color.includes('#1a1a1a') || // dark mesh
    settings.text_color === '#f5f5f5' || // light text indicates dark theme
    settings.text_color === '#fafafa' ||
    settings.text_color === '#f8f8f8'
  );

  // Process Vimeo highlights data (no need to fetch external data anymore)
  useEffect(() => {
    if (!initialVimeoHighlightsData || initialVimeoHighlightsData.length === 0) {
      console.log('ℹ️ No Vimeo highlights to process');
      setVimeoData({});
      return;
    }

    console.log('🎬 Processing Vimeo highlights:', initialVimeoHighlightsData.length, 'highlights');
    
    setLoadingVideos(true);
    const dataMap = {};
    
    try {
      for (const highlight of initialVimeoHighlightsData) {
        const key = highlight.url || highlight.id;
        if (key) {
          // Create data object from stored highlight data
          dataMap[key] = {
            title: highlight.title || 'Vimeo Video',
            author_name: highlight.description || 'Creator',
            video_id: highlight.videoId || '',
            url: highlight.url || '',
            embed_code: highlight.embedCode || '', // Store the embed code directly
            embed_url: highlight.embedUrl || '', // Backup embed URL
            fallback: false // This is direct embed data, not fallback
          };
        }
      }
      
      console.log('✅ Processed Vimeo highlights:', Object.keys(dataMap).length, 'entries');
      setVimeoData(dataMap);
    } catch (error) {
      console.error('💥 Error processing Vimeo highlights:', error);
    } finally {
      setLoadingVideos(false);
    }
  }, [initialVimeoHighlightsData]);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? initialVimeoHighlightsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === initialVimeoHighlightsData.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile swiping
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  // Section styling - clean minimal container
  const defaultSectionStyle = {
    padding: '0',
    background: 'transparent',
    color: settings.text_color || '#ffffff',
    fontFamily: settings.font_family || 'Inter, sans-serif',
    fontSize: settings.font_size || '16px',
    fontWeight: settings.font_weight || '400',
    textAlign: settings.text_align || 'left',
    border: 'none',
    position: 'relative'
  };

  const defaultSectionTitleStyle = {
    fontSize: settings.title_font_size || '28px',
    fontWeight: settings.title_font_weight || '700',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    color: settings.title_color || '#ffffff',
    textAlign: settings.title_align || 'left'
  };

  // Use provided styles or defaults
  const finalSectionStyle = { ...defaultSectionStyle, ...sectionStyle };
  const finalSectionTitleStyle = { ...defaultSectionTitleStyle, ...sectionTitleStyle };

  // If no highlights, show placeholder
  if (!initialVimeoHighlightsData || initialVimeoHighlightsData.length === 0) {
    return (
      <div style={finalSectionStyle}>
        <h3 style={{...finalSectionTitleStyle, display: 'flex', alignItems: 'center'}}>
          <FaVimeo style={{ marginRight: '8px', color: '#1ab7ea' }} />
          Vimeo Highlights
        </h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          opacity: 0.7,
          ...placeholderStyle 
        }}>
          <FaVimeo size={48} style={{ margin: '0 auto 16px', color: '#1ab7ea' }} />
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            No Vimeo highlights yet
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Add your favorite videos to showcase your creative work
          </p>
        </div>
      </div>
    );
  }

  const currentHighlight = initialVimeoHighlightsData[currentIndex];
  const currentData = currentHighlight ? vimeoData[currentHighlight.url || currentHighlight.id] : null;

  return (
    <div style={finalSectionStyle}>
      <h3 style={{...finalSectionTitleStyle, display: 'flex', alignItems: 'center'}}>
        <FaVimeo style={{ marginRight: '8px', color: '#1ab7ea' }} />
        Vimeo Highlights
      </h3>

      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          marginBottom: initialVimeoHighlightsData.length > 1 ? '0' : '24px'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loadingVideos ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(26, 183, 234, 0.2)',
              borderTop: '4px solid #1ab7ea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ 
              fontSize: '16px', 
              color: textColor,
              opacity: 0.8 
            }}>
              Loading Vimeo content...
            </p>
          </div>
        ) : currentData ? (
          /* Clean, minimalist Vimeo card */
          <div 
            className="vimeo-card-hover"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.85)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 2px 16px rgba(0, 0, 0, 0.3)' 
                : '0 2px 16px rgba(0, 0, 0, 0.06)',
              border: isDarkTheme 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              animation: 'fadeIn 0.6s ease forwards'
            }}
          >
            {/* Embedded Vimeo player - the main focus */}
            {(currentData.embed_code || currentData.embed_url) && (
              <div 
                className="vimeo-embed-container"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '100%'
                }}
              >
                {currentData.embed_code ? (
                  // Use direct embed code (preferred method)
                  <div 
                    className="vimeo-embed-container"
                    dangerouslySetInnerHTML={{ __html: currentData.embed_code }}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      width: '100%',
                      maxWidth: '100%'
                    }}
                  />
                ) : (
                  // Fallback to iframe with embed URL
                  <iframe
                    src={currentData.embed_url}
                    width="100%"
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ 
                      border: 'none',
                      borderRadius: '12px',
                      width: '100%',
                      maxWidth: '100%'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.85)',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}>
            <FaVimeo size={32} style={{ color: '#1ab7ea', marginBottom: '12px' }} />
            <p style={{ 
              color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: 0
            }}>
              Unable to load Vimeo content
            </p>
          </div>
        )}

        {/* Minimalist carousel indicators - consistent with other highlights */}
        {initialVimeoHighlightsData.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px'
          }}>
            {initialVimeoHighlightsData.map((_, index) => (
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
        )}
      </div>
    </div>
  );
}
