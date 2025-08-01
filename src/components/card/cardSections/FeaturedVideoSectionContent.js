'use client';

import React, { useMemo } from 'react';
import { LuVideo } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function FeaturedVideoSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
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
    return parseVideoData(profile?.featured_video);
  }, [profile?.featured_video]);

  // Render placeholder when no data
  if (!videoData || !videoData.videoUrl) {
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
        {/* Header with logo and title */}
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
            <LuVideo size={14} style={{ color: 'white' }} />
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
            {videoData?.title || 'Featured Video'}
          </h3>
        </div>
        
        <div style={placeholderStyle}>
          <LuVideo size={48} style={{ color: textColor, opacity: 0.5 }} />
          <p style={{ color: textColor, opacity: 0.7 }}>No featured video yet</p>
        </div>
      </div>
    );
  }

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
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with logo and title */}
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
          <LuVideo size={14} style={{ color: 'white' }} />
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
          {videoData.title || 'Featured Video'}
        </h3>
      </div>

      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
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
      </div>
    </div>
  );
} 