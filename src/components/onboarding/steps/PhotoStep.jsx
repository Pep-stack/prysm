'use client';

import React, { useState, useCallback } from 'react';
import { LuImage, LuUpload, LuX } from 'react-icons/lu';
import { supabase } from '../../../lib/supabase';

export default function PhotoStep({ data, onUpdateData, onNext, user }) {
  const [photo, setPhoto] = useState(data.photo || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [imageShape, setImageShape] = useState(data.imageShape || 'circle');

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create file reader for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Could not get public URL for avatar.');
      }

      const newAvatarUrl = urlData.publicUrl;
      
      // Update onboarding data with the real URL
      onUpdateData({ photo: newAvatarUrl });
      
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [user, onUpdateData]);

  // Handle image shape change
  const handleShapeChange = (shape) => {
    setImageShape(shape);
    onUpdateData({ imageShape: shape });
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Remove photo
  const removePhoto = () => {
    setPhoto(null);
    onUpdateData({ photo: null });
  };

  // Continue to next step
  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67E] p-3 rounded-full">
            <LuImage className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Add your profile photo
          </h3>
          <p className="text-gray-600 text-sm">
            A professional photo helps people recognize and trust you
          </p>
        </div>
      </div>

      {/* Photo Upload Area */}
      <div className="space-y-4">
        {photo ? (
          // Photo Preview
          <div className="relative space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={photo}
                  alt="Profile preview"
                  className={`w-32 h-32 object-cover border-4 border-gray-200 shadow-lg ${
                    imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                  }`}
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <LuX className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Image Shape Selector */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">
                Choose image shape
              </h4>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleShapeChange('circle')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    imageShape === 'circle'
                      ? 'bg-[#00C896] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 border-2 rounded-full ${
                    imageShape === 'circle' ? 'border-white' : 'border-gray-400'
                  }`} />
                  <span className="text-xs font-medium">Round</span>
                </button>
                
                <button
                  onClick={() => handleShapeChange('square')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    imageShape === 'square'
                      ? 'bg-[#00C896] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 border-2 rounded-lg ${
                    imageShape === 'square' ? 'border-white' : 'border-gray-400'
                  }`} />
                  <span className="text-xs font-medium">Square</span>
                </button>
              </div>
            </div>
            
            {/* Change Photo Button */}
            <div className="text-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-colors">
                <LuUpload className="w-4 h-4" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        ) : (
          // Upload Area
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-[#00C896] bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-2 border-[#00C896] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-600">Uploading photo...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <LuUpload className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Drop your photo here, or click to browse
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C896] hover:bg-[#00A67E] text-white rounded-md cursor-pointer transition-colors">
                  <LuUpload className="w-4 h-4" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Photo Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 text-sm mb-2">📸 Photo guidelines:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Use a clear, well-lit headshot</li>
          <li>• Face should be clearly visible</li>
          <li>• Professional or semi-professional attire</li>
          <li>• Avoid busy backgrounds</li>
        </ul>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleNext}
        className="w-full bg-[#00C896] hover:bg-[#00A67E] text-white py-3 px-6 rounded-md font-semibold transition-colors"
      >
        {photo ? 'Continue with Photo' : 'Skip for Now'}
      </button>
    </div>
  );
}
