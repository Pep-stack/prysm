'use client';

import React from 'react';
import { LuCheck, LuEye, LuShare2, LuPencil, LuStar, LuBriefcase, LuCode, LuBookOpen, LuFolderOpen, LuAward, LuImage, LuVideo, LuWrench, LuHeart, LuCalendar, LuLanguages } from 'react-icons/lu';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaRedditAlien, FaSnapchatGhost, FaFacebook, FaDribbble, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FaXTwitter, FaSpotify } from 'react-icons/fa6';

// Helper function to get section icon
function getSectionIcon(sectionId) {
  const icons = {
    experience: LuBriefcase,
    skills: LuCode,
    education: LuBookOpen,
    projects: LuFolderOpen,
    certifications: LuAward,
    languages: LuLanguages,
    gallery: LuImage,
    featured_video: LuVideo,
    services: LuWrench,
    testimonials: LuHeart,
    appointments: LuCalendar
  };
  return icons[sectionId] || LuCode;
}

// Helper function to get social platform icon and color
function getSocialPlatformData(platformId) {
  const platforms = {
    linkedin: { icon: FaLinkedin, color: '#0077B5', name: 'LinkedIn' },
    github: { icon: FaGithub, color: '#333', name: 'GitHub' },
    x: { icon: FaXTwitter, color: '#000', name: 'X' },
    instagram: { icon: FaInstagram, color: '#E4405F', name: 'Instagram' },
    youtube: { icon: FaYoutube, color: '#FF0000', name: 'YouTube' },
    spotify: { icon: FaSpotify, color: '#1DB954', name: 'Spotify' },
    tiktok: { icon: FaTiktok, color: '#000', name: 'TikTok' },
    whatsapp: { icon: FaWhatsapp, color: '#25D366', name: 'WhatsApp' },
    facebook: { icon: FaFacebook, color: '#1877F2', name: 'Facebook' },
    dribbble: { icon: FaDribbble, color: '#EA4C89', name: 'Dribbble' },
    snapchat: { icon: FaSnapchatGhost, color: '#FFFC00', name: 'Snapchat' },
    reddit: { icon: FaRedditAlien, color: '#FF4500', name: 'Reddit' }
  };
  return platforms[platformId] || { icon: FaLinkedin, color: '#0077B5', name: platformId };
}

export default function CompletionStep({ data, onComplete, isLoading }) {
  return (
    <div className="space-y-6">
      {/* Success Icon */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67E] p-4 rounded-full">
            <LuCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            🎉 Your digital card is ready!
          </h3>
          <p className="text-gray-600">
            Great job! You've successfully set up your professional profile.
          </p>
        </div>
      </div>

      {/* Profile Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border">
        <div className="text-center space-y-4">
          {/* Avatar Preview */}
          {data.photo ? (
            <img
              src={data.photo}
              alt="Profile"
              className={`w-20 h-20 mx-auto object-cover border-4 border-white shadow-lg ${
                data.imageShape === 'square' ? 'rounded-lg' : 'rounded-full'
              }`}
            />
          ) : (
            <div className={`w-20 h-20 mx-auto bg-[#00C896] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg ${
              data.imageShape === 'square' ? 'rounded-lg' : 'rounded-full'
            }`}>
              {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          
          {/* Profile Info */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900">
              {data.name || 'Your Name'}
            </h4>
            {data.headline && (
              <p className="text-gray-600 font-medium">
                {data.headline}
              </p>
            )}
            {data.bio && (
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {data.bio}
              </p>
            )}
          </div>
          
          {/* Sections Preview */}
          {(data.selectedSections?.length > 0 || data.selectedSocialButtons?.length > 0) && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {data.selectedSections && data.selectedSections.length > 0 && (
                <div>
                  <p className="text-gray-600 text-sm mb-3">
                    Content sections:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {data.selectedSections.map((section) => {
                      const IconComponent = getSectionIcon(section);
                      return (
                        <div
                          key={section}
                          className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm"
                        >
                          <IconComponent className="w-4 h-4 text-[#00C896]" />
                          <span className="text-xs font-medium text-gray-700">
                            {getSectionName(section)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {data.selectedSocialButtons && data.selectedSocialButtons.length > 0 && (
                <div>
                  <p className="text-gray-600 text-sm mb-3">
                    Social platforms:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {data.selectedSocialButtons.map((button) => {
                      const platformData = getSocialPlatformData(button);
                      const IconComponent = platformData.icon;
                      return (
                        <div
                          key={button}
                          className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm"
                        >
                          <IconComponent 
                            className="w-4 h-4" 
                            style={{ color: platformData.color }} 
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {platformData.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-3">
          🚀 What's next?
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-800 text-sm">
            <LuPencil className="w-4 h-4 text-blue-600" />
            <span>Fill in your section details</span>
          </div>
          <div className="flex items-center gap-3 text-blue-800 text-sm">
            <LuEye className="w-4 h-4 text-blue-600" />
            <span>Preview your card</span>
          </div>
          <div className="flex items-center gap-3 text-blue-800 text-sm">
            <LuShare2 className="w-4 h-4 text-blue-600" />
            <span>Share with your network</span>
          </div>
        </div>
      </div>



      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={isLoading}
        className="w-full bg-[#00C896] hover:bg-[#00A67E] disabled:bg-gray-400 text-white py-4 px-6 rounded-md font-bold text-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating your card...
          </>
        ) : (
          <>
            <LuStar className="w-5 h-5" />
            Complete Setup
          </>
        )}
      </button>

      {/* Success Message */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          You'll be redirected to your dashboard where you can customize further
        </p>
      </div>
    </div>
  );
}

// Helper function to get section names
function getSectionName(sectionId) {
  const names = {
    experience: 'Work Experience',
    skills: 'Skills & Technologies',
    education: 'Education',
    projects: 'Projects & Portfolio',
    social: 'Social Media',
    contact: 'Contact Information'
  };
  return names[sectionId] || sectionId;
}
