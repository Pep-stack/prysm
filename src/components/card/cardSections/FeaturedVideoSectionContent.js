'use client';

import React, { useState, useMemo } from 'react';
import { LuVideo, LuPlay } from 'react-icons/lu';

export default function FeaturedVideoSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoData = useMemo(() => {
    if (!profile?.featured_video) return null;
    
    try {
      return typeof profile.featured_video === 'string' 
        ? JSON.parse(profile.featured_video) 
        : profile.featured_video;
    } catch (e) {
      console.error('Error parsing featured video data:', e);
      return null;
    }
  }, [profile?.featured_video]);

  const textColor = styles?.textColor || '#ffffff';
  const sectionTitleStyle = styles?.sectionTitleStyle || {};

  if (!videoData || !videoData.videoUrl) {
    return (
      <div
        style={{
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
            Featured Video
          </h3>
        </div>

        {/* Empty state */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <LuVideo size={24} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            No featured video yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
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

      {/* Video Description */}
      {videoData.description && (
        <div style={{
          marginTop: '12px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0
          }}>
            {videoData.description}
          </p>
        </div>
      )}
    </div>
  );
} 