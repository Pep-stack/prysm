'use client';

import React, { useState, useEffect } from 'react';
import { LuUser } from 'react-icons/lu';

export default function ProfileStep({ data, onUpdateData, onNext }) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    headline: data.headline || '',
    bio: data.bio || ''
  });

  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.headline && formData.headline.length > 60) {
      newErrors.headline = 'Headline should be under 60 characters';
    }
    
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = 'Bio should be under 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      onUpdateData(formData);
      onNext();
    }
  };

  // Auto-save data when form changes
  useEffect(() => {
    onUpdateData(formData);
  }, [formData, onUpdateData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67E] p-3 rounded-full">
            <LuUser className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Tell us about yourself
          </h3>
          <p className="text-gray-600 text-sm">
            This information will appear on your digital business card
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#00C896] focus:border-[#00C896] transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Headline Field */}
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
            Professional Headline
          </label>
          <input
            type="text"
            id="headline"
            value={formData.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="e.g., Full Stack Developer at Tech Company"
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#00C896] focus:border-[#00C896] transition-colors ${
              errors.headline ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={60}
          />
          {errors.headline && (
            <p className="text-red-500 text-xs mt-1">{errors.headline}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.headline.length}/60 characters
          </p>
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Short Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell people a bit about yourself and what you do..."
            rows={3}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#00C896] focus:border-[#00C896] transition-colors resize-none ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={200}
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.bio.length}/200 characters
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 text-sm mb-2">💡 Tips for a great profile:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Use your real name for credibility</li>
          <li>• Keep your headline clear and specific</li>
          <li>• Mention your key skills or expertise</li>
        </ul>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleNext}
        disabled={!formData.name.trim()}
        className="w-full bg-[#00C896] hover:bg-[#00A67E] disabled:bg-gray-300 text-white py-3 px-6 rounded-md font-semibold transition-colors disabled:cursor-not-allowed"
      >
        Continue to Photo
      </button>
    </div>
  );
}
