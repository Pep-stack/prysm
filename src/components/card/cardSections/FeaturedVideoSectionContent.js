'use client';

import React, { useMemo, useState } from 'react';
import { LuVideo, LuPlay } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { needsDarkIconBackground } from '../../../lib/themeSystem';

export default function FeaturedVideoSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [showVideo, setShowVideo] = useState(false);
  
  // Extract video ID from various platforms
  const extractVideoInfo = (url) => {
    if (!url) return null;
    
    // YouTube patterns
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        videoId: youtubeMatch[1],
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }
    
    // Vimeo patterns
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        videoId: vimeoMatch[1],
        thumbnailUrl: `https://vumbnail.com/${vimeoMatch[1]}.jpg`,
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      };
    }
    
    // TikTok patterns
    const tiktokMatch = url.match(/tiktok\.com.*\/video\/(\d+)/);
    if (tiktokMatch) {
      return {
        platform: 'tiktok',
        videoId: tiktokMatch[1],
        thumbnailUrl: null, // TikTok doesn't provide easy thumbnail access
        embedUrl: url
      };
    }
    
    // Generic video file
    return {
      platform: 'generic',
      videoId: null,
      thumbnailUrl: null,
      embedUrl: url
    };
  };

  // Parse and memoize video data
  const parseVideoData = (videoData) => {
    if (typeof videoData === 'string' && videoData.trim()) {
      try {
        return JSON.parse(videoData);
      } catch (e) {
        return null;
      }
    }
    
    if (typeof videoData === 'object' && videoData !== null) {
      return videoData;
    }
    
    return null;
  };

  const videoData = useMemo(() => {
    const parsed = parseVideoData(profile?.featured_video);
    if (parsed && parsed.videoUrl) {
      const videoInfo = extractVideoInfo(parsed.videoUrl);
      return {
        ...parsed,
        ...videoInfo
      };
    }
    return parsed;
  }, [profile?.featured_video]);

  // Render placeholder when no data
  if (!videoData || !videoData.videoUrl) {
    return null; // Don't show empty featured video sections
  }

  const handlePlayClick = () => {
    setShowVideo(true);
  };

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
          backgroundColor: needsDarkIconBackground(settings.background_color) 
            ? '#000000' 
            : (settings.icon_color || '#DC2626'),
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LuVideo style={{ color: 'white', fontSize: '11px' }} />
        </div>
        <h2 style={{
          ...sectionTitleStyle,
          fontSize: '16px',
          fontWeight: '600',
          color: textColor,
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          {videoData.title || 'Featured Video'}
        </h2>
      </div>

      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/10',
        borderRadius: '12px',
        overflow: 'hidden',
        background: `${textColor}05`,
        cursor: 'pointer',
        marginBottom: '24px'
      }}>
        {!showVideo && videoData.thumbnailUrl ? (
          // Thumbnail view with play button
          <>
            <img
              src={videoData.thumbnailUrl}
              alt={videoData.title || 'Featured Video'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onClick={handlePlayClick}
            />
            {/* Play button overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onClick={handlePlayClick}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <LuPlay style={{ color: 'white', fontSize: '24px', marginLeft: '4px' }} />
            </div>
          </>
        ) : (
          // Video player or fallback
          <>
            {videoData.platform === 'youtube' || videoData.platform === 'vimeo' ? (
              <iframe
                src={videoData.embedUrl}
                title={videoData.title || 'Featured Video'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoData.videoUrl}
                title={videoData.title || 'Featured Video'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls
                preload="metadata"
                poster={videoData.thumbnailUrl || ''}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 