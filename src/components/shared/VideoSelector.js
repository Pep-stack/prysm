'use client';

import React, { useState } from 'react';
import { LuVideo, LuPlay, LuExternalLink } from 'react-icons/lu';

export default function VideoSelector({ value = '', onChange }) {
  const [videoData, setVideoData] = useState({
    title: value?.title || '',
    description: value?.description || '',
    videoUrl: value?.videoUrl || '',
    platform: value?.platform || 'youtube', // youtube, vimeo, custom
    thumbnailUrl: value?.thumbnailUrl || ''
  });

  const handleSave = () => {
    if (videoData.title && videoData.videoUrl) {
      onChange(videoData);
    }
  };

  const getVideoEmbedUrl = (url, platform) => {
    if (!url) return '';
    
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    }
    
    if (platform === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : url;
    }
    
    return url;
  };

  const getThumbnailUrl = (url, platform) => {
    if (!url) return '';
    
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : '';
    }
    
    if (platform === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/);
      return videoId ? `https://vumbnail.com/${videoId[1]}.jpg` : '';
    }
    
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Video</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add a featured video to showcase your work, introduction, or any content you'd like to highlight.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Title *
          </label>
          <input
            type="text"
            value={videoData.title}
            onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter video title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={videoData.description}
            onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Brief description of the video"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            value={videoData.platform}
            onChange={(e) => setVideoData({ ...videoData, platform: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="custom">Custom Embed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL *
          </label>
          <input
            type="url"
            value={videoData.videoUrl}
            onChange={(e) => {
              const url = e.target.value;
              const platform = videoData.platform;
              const thumbnailUrl = getThumbnailUrl(url, platform);
              setVideoData({ 
                ...videoData, 
                videoUrl: url,
                thumbnailUrl: thumbnailUrl
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={
              videoData.platform === 'youtube' 
                ? 'https://www.youtube.com/watch?v=...' 
                : videoData.platform === 'vimeo'
                ? 'https://vimeo.com/...'
                : 'https://example.com/video'
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            {videoData.platform === 'youtube' && 'Paste a YouTube video URL'}
            {videoData.platform === 'vimeo' && 'Paste a Vimeo video URL'}
            {videoData.platform === 'custom' && 'Paste any video embed URL'}
          </p>
        </div>

        {videoData.platform === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Thumbnail URL
            </label>
            <input
              type="url"
              value={videoData.thumbnailUrl}
              onChange={(e) => setVideoData({ ...videoData, thumbnailUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
        )}
      </div>

      {/* Preview */}
      {videoData.videoUrl && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
              {videoData.thumbnailUrl ? (
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <LuVideo size={48} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <LuPlay size={24} className="text-white" />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <h5 className="font-medium text-gray-900">{videoData.title}</h5>
              {videoData.description && (
                <p className="text-sm text-gray-600 mt-1">{videoData.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!videoData.title || !videoData.videoUrl}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Video
        </button>
        <button
          onClick={() => onChange('')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Clear Video
        </button>
      </div>
    </div>
  );
} 