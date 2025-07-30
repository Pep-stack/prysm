'use client';

import React, { useState, useEffect } from 'react';
import { LuImage, LuPlus, LuTrash2, LuUpload, LuLoader, LuX } from 'react-icons/lu';
import { supabase } from '../../lib/supabase';
import { getAvailableBucket } from '../../lib/supabase-storage-setup';

export default function GalleryEditor({ value = '', onChange, onSave, onCancel }) {
  const [gallery, setGallery] = useState([]);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (value) {
      try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value);
        setGallery(parsed);
        // Set title from first item if available
        if (parsed.length > 0 && parsed[0].title) {
          setTitle(parsed[0].title);
        }
      } catch (e) {
        setGallery([]);
      }
    } else {
      setGallery([]);
    }
  }, [value]);

  // Add CSS animation globally once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes prysm-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .prysm-spin {
        animation: prysm-spin 1s linear infinite;
        transform-origin: center;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || gallery.length >= 20) return;

    console.log('🔄 Starting gallery file upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setIsUploading(true);
    setUploadError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload files');
      }

      console.log('👤 User authenticated:', user.id);

      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 50MB');
      }

      // Check file type
      const allowedTypes = ['image/'];
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        throw new Error('Only image files are allowed');
      }

      // Try multiple bucket strategies
      let uploadResult = null;
      let finalBucketName = null;

      // Strategy 1: Try project-media bucket
      try {
        console.log('🗂️ Trying strategy 1: project-media bucket');
        const bucketName = 'project-media';
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        console.log('📂 Upload details:', { bucketName, fileName });

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!error && data) {
          uploadResult = { data, fileName };
          finalBucketName = bucketName;
          console.log('✅ Strategy 1 SUCCESS:', { data, fileName });
        } else {
          console.log('❌ Strategy 1 FAILED:', error);
        }
      } catch (err) {
        console.log('❌ Strategy 1 EXCEPTION:', err.message);
      }

      // Strategy 2: Try uploads bucket if project-media failed
      if (!uploadResult) {
        try {
          console.log('🗂️ Trying strategy 2: uploads bucket');
          const bucketName = 'uploads';
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('📂 Upload details:', { bucketName, fileName });

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!error && data) {
            uploadResult = { data, fileName };
            finalBucketName = bucketName;
            console.log('✅ Strategy 2 SUCCESS:', { data, fileName });
          } else {
            console.log('❌ Strategy 2 FAILED:', error);
          }
        } catch (err) {
          console.log('❌ Strategy 2 EXCEPTION:', err.message);
        }
      }

      // Strategy 3: Try any available bucket
      if (!uploadResult) {
        console.log('🗂️ Trying strategy 3: dynamic bucket detection');
        const bucketName = await getAvailableBucket();
        if (bucketName) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('📂 Upload details:', { bucketName, fileName });

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!error && data) {
            uploadResult = { data, fileName };
            finalBucketName = bucketName;
            console.log('✅ Strategy 3 SUCCESS:', { data, fileName });
          } else {
            console.log('❌ Strategy 3 FAILED:', error);
          }
        }
      }

      if (!uploadResult || !finalBucketName) {
        throw new Error('All upload strategies failed. Please check Supabase Storage configuration and RLS policies.');
      }

      console.log('📡 Getting public URL for:', { bucket: finalBucketName, fileName: uploadResult.fileName });

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(finalBucketName)
        .getPublicUrl(uploadResult.fileName);

      console.log('🔗 Public URL received:', publicUrl);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Add new image to gallery
      const newImage = {
        id: Date.now(),
        imageUrl: publicUrl,
        title: title || 'Gallery Image',
        description: '',
        link: ''
      };

      setGallery([...gallery, newImage]);

      console.log('✅ Gallery image uploaded successfully:', { 
        publicUrl, 
        bucketName: finalBucketName, 
        fileName: uploadResult.fileName
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  const handleRemoveImage = (id) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  const handleSave = () => {
    // Create gallery data with title
    const galleryData = gallery.map(img => ({
      ...img,
      title: title || 'Gallery Image'
    }));
    
    onChange(galleryData);
    onSave(galleryData);
    if (onCancel) onCancel();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
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
      {/* Gallery Header with icon and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#ffffff'
          }}>
            <LuImage className="text-black text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Gallery</h3>
            <p className="text-gray-400 text-sm">Add your best images</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Gallery Title Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Gallery Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter gallery title"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
        </div>

        {/* Add Image Section */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Upload Image
          </label>
          
          {/* Upload Error Message */}
          {uploadError && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm mb-3">
              {uploadError}
            </div>
          )}
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isUploading 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            {isUploading ? (
              <>
                <LuLoader 
                  size={24} 
                  className="text-blue-400 mb-2 prysm-spin mx-auto" 
                />
                <p className="text-blue-400 text-sm font-medium mb-2">
                  Uploading image...
                </p>
              </>
            ) : (
              <>
                <LuUpload size={24} className="text-gray-400 mb-2 mx-auto" />
                <p className="text-gray-400 text-sm mb-2">
                  Upload gallery image
                </p>
              </>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading || gallery.length >= 20}
              className="hidden"
              id="gallery-upload"
            />
            <label
              htmlFor="gallery-upload"
              className={`inline-block px-4 py-2 rounded-lg font-medium transition-colors ${
                isUploading || gallery.length >= 20
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </label>
            
            {gallery.length >= 20 && (
              <p className="text-red-400 text-sm mt-2">Maximum 20 images reached</p>
            )}
          </div>
        </div>

        {/* Current Images */}
        {gallery.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 text-sm">
              Added Images ({gallery.length}/20)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {gallery.map((image) => (
                <div 
                  key={image.id}
                  className="p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                        <LuImage className="text-white text-sm" />
                      </div>
                      <div className="text-white text-sm truncate">
                        {image.title}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                    >
                      <LuTrash2 size={14} />
                      Remove
                    </button>
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {image.imageUrl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {gallery.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuImage className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm">No images yet. Upload your first image to get started.</p>
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
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
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