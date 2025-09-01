'use client';

import React from 'react';
import Image from 'next/image';
import { LuUser, LuImage, LuPalette, LuGrid3X3, LuShare2 } from 'react-icons/lu';

export default function WelcomeStep({ onNext }) {
  return (
    <div className="text-center space-y-6">
      {/* Welcome Logo */}
      <div className="flex justify-center mb-2">
        <Image 
          src="/images/prysma-icon.png" 
          alt="Prysma Logo" 
          width={80} 
          height={80}
          className="object-contain"
        />
      </div>

      {/* Welcome Message */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">
          Welcome to Prysma! 🎉
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Let's create your professional digital business card in just a few simple steps.
        </p>
      </div>

      {/* Preview Steps */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          What we'll set up:
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-[#00C896] p-2 rounded-md">
              <LuUser className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700">Your Profile</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-[#00C896] p-2 rounded-md">
              <LuImage className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700">Profile Photo</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-[#00C896] p-2 rounded-md">
              <LuPalette className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700">Card Theme</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-[#00C896] p-2 rounded-md">
              <LuGrid3X3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700">Content Sections</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-[#00C896] p-2 rounded-md">
              <LuShare2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700">Social Buttons</span>
          </div>
        </div>
      </div>

      {/* Time Estimate */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 text-blue-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Takes about 4-5 minutes</span>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={onNext}
        className="w-full bg-[#00C896] hover:bg-[#00A67E] text-white py-3 px-6 rounded-md font-semibold transition-colors text-lg"
      >
        Get Started
      </button>

      {/* Skip Option */}
      <p className="text-xs text-gray-500">
        You can complete this setup later in your dashboard
      </p>
    </div>
  );
}
