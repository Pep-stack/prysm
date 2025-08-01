'use client';

import React, { useState, useEffect } from 'react';
import { LuVideo, LuPlay, LuUpload, LuLoader, LuX } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket, ensureStoragePolicies } from '../../lib/supabase-storage-setup';

export default function VideoEditor({ value = '', onChange, onSave, onCancel }) {
  const [videoData, setVideoData] = useState({
    title: '',
    videoUrl: '',
    platform: 'custom',
    thumbnailUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        setVideoData(parsed);
      } catch (e) {
        setVideoData({
          title: '',
          videoUrl: '',
          platform: 'custom',
          thumbnailUrl: ''
        });
      }
    }
  }, [value]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setUploadError('Video file size must be less than 100MB. Please compress your video or choose a smaller file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated. Please refresh the page and try again.');
      }

      console.log('User authenticated:', user.id);
      console.log('File size:', file.size, 'bytes');

      // Check storage policies
      await ensureStoragePolicies();

      // Get available bucket
      const bucket = await getAvailableBucket();
      if (!bucket) {
        throw new Error('Storage bucket not available. Please check your Supabase storage setup.');
      }

      console.log('Using bucket:', bucket);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `videos/${user.id}/${timestamp}.${fileExtension}`;

      console.log('Uploading to:', fileName);

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Handle specific file size error
        if (uploadError.message && uploadError.message.includes('maximum allowed size')) {
          throw new Error('File is too large for the current storage settings. Please compress your video or contact support to increase the file size limit.');
        }
        
        throw new Error(uploadError.message || 'Upload failed. Please try again.');
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      // Update video data
      const newVideoData = {
        ...videoData,
        videoUrl: urlData.publicUrl,
        platform: 'custom',
        thumbnailUrl: '' // Will be generated or user can upload separately
      };

      setVideoData(newVideoData);
      onChange(newVideoData);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (videoData.title && videoData.videoUrl) {
      onChange(videoData);
      onSave(videoData);
      if (onCancel) onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const removeVideo = () => {
    setVideoData({
      title: '',
      videoUrl: '',
      platform: 'custom',
      thumbnailUrl: ''
    });
    onChange('');
  };

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Video Header with icon and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <LuVideo className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {videoData.title || 'Featured Video'}
            </h3>
            <p className="text-gray-400 text-sm">Upload your featured video</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Video Title Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={videoData.title}
            onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
            placeholder="Enter video title"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
        </div>

        {/* Video Upload */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Upload Video
          </label>
          
          {!videoData.videoUrl ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  {isUploading ? (
                    <LuLoader className="text-gray-400 text-3xl animate-spin" />
                  ) : (
                    <LuUpload className="text-gray-400 text-3xl" />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {isUploading ? 'Uploading...' : 'Click to upload video'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      MP4, WebM, OGG, MOV (max 100MB)
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      For larger files, compress your video first
                    </p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LuVideo className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-white font-medium">Video uploaded</p>
                    <p className="text-gray-400 text-sm">Ready to save</p>
                  </div>
                </div>
                <button
                  onClick={removeVideo}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LuX size={20} />
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <p className="text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        {/* Preview */}
        {videoData.videoUrl && (
          <div className="mb-6">
            <h4 className="text-white text-sm font-medium mb-2">Preview</h4>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden relative">
                <video
                  src={videoData.videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              </div>
              <div className="mt-3">
                <h5 className="font-medium text-white">{videoData.title}</h5>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!videoData.videoUrl && !isUploading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuVideo className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm">No video yet. Upload your featured video to get started.</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!videoData.title || !videoData.videoUrl || isUploading}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 