'use client';

import React, { useState } from 'react';
import { LuCheck, LuLink } from 'react-icons/lu';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaRedditAlien, FaSnapchatGhost, FaFacebook, FaDribbble, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FaXTwitter, FaSpotify } from 'react-icons/fa6';

const AVAILABLE_SOCIAL_BUTTONS = [
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0077B5', recommended: true },
  { id: 'github', name: 'GitHub', icon: FaGithub, color: '#333', recommended: true },
  { id: 'x', name: 'X (Twitter)', icon: FaXTwitter, color: '#000', recommended: false },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', recommended: false },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', recommended: false },
  { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954', recommended: false },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000', recommended: false },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', recommended: false },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2', recommended: false },
  { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: '#EA4C89', recommended: false },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost, color: '#FFFC00', recommended: false },
  { id: 'reddit', name: 'Reddit', icon: FaRedditAlien, color: '#FF4500', recommended: false }
];

export default function SocialButtonsStep({ data, onUpdateData, onNext }) {
  const [selectedButtons, setSelectedButtons] = useState(data.selectedSocialButtons || ['linkedin', 'github']);

  // Toggle button selection
  const toggleButton = (buttonId) => {
    const newSelection = selectedButtons.includes(buttonId)
      ? selectedButtons.filter(id => id !== buttonId)
      : [...selectedButtons, buttonId];
    
    setSelectedButtons(newSelection);
    onUpdateData({ selectedSocialButtons: newSelection });
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
            <LuLink className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Add your social media buttons
          </h3>
          <p className="text-gray-600 text-sm">
            Choose which social platforms you want to display on your card
          </p>
        </div>
      </div>

      {/* Recommended Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-green-800 text-sm font-medium text-center">
          ⭐ Professional platforms are pre-selected
        </p>
      </div>

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_SOCIAL_BUTTONS.map((button) => {
          const isSelected = selectedButtons.includes(button.id);
          const IconComponent = button.icon;
          
          return (
            <button
              key={button.id}
              onClick={() => toggleButton(button.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                isSelected
                  ? 'border-[#00C896] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icon with platform color */}
                <div className={`p-3 rounded-full flex-shrink-0 ${
                  isSelected 
                    ? 'bg-white shadow-sm' 
                    : 'bg-gray-100'
                }`}>
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ 
                      color: isSelected ? button.color : '#6B7280' 
                    }} 
                  />
                </div>
                
                {/* Platform Name */}
                <div className="text-center">
                  <h4 className={`font-semibold text-sm ${
                    isSelected ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {button.name}
                  </h4>
                  {button.recommended && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                      Recommended
                    </span>
                  )}
                </div>
                
                {/* Checkbox */}
                <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'border-[#00C896] bg-[#00C896]'
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <LuCheck className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            Selected platforms:
          </span>
          <span className="bg-[#00C896] text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedButtons.length}
          </span>
        </div>
        {selectedButtons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedButtons.map((buttonId) => {
              const button = AVAILABLE_SOCIAL_BUTTONS.find(b => b.id === buttonId);
              const IconComponent = button?.icon;
              return (
                <div
                  key={buttonId}
                  className="bg-white text-gray-700 px-3 py-2 rounded-full text-sm border flex items-center gap-2"
                >
                  {IconComponent && (
                    <IconComponent 
                      className="w-4 h-4" 
                      style={{ color: button.color }} 
                    />
                  )}
                  <span>{button?.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Note:</strong> You'll need to add your profile URLs for each platform later in your dashboard settings.
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="w-full lg:w-auto lg:min-w-[200px] bg-[#00C896] hover:bg-[#00A67E] text-white py-3 px-6 rounded-md font-semibold transition-colors"
        >
          {selectedButtons.length === 0 
            ? 'Continue without social buttons' 
            : `Continue with ${selectedButtons.length} button${selectedButtons.length === 1 ? '' : 's'}`
          }
        </button>
      </div>
    </div>
  );
}
