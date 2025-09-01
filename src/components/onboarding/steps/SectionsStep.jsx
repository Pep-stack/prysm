'use client';

import React, { useState } from 'react';
import { LuGrid3X3, LuCheck, LuBriefcase, LuCode, LuBookOpen, LuFolderOpen, LuAward, LuImage, LuVideo, LuWrench, LuHeart, LuCalendar, LuLanguages } from 'react-icons/lu';

const AVAILABLE_SECTIONS = [
  {
    id: 'experience',
    name: 'Work Experience',
    description: 'Your professional background and career history',
    icon: LuBriefcase,
    recommended: true
  },
  {
    id: 'skills',
    name: 'Skills & Technologies',
    description: 'Technical skills, programming languages, tools',
    icon: LuCode,
    recommended: true
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Academic background, degrees, certifications',
    icon: LuBookOpen,
    recommended: false
  },
  {
    id: 'projects',
    name: 'Portfolio',
    description: 'Showcase your best work and achievements',
    icon: LuFolderOpen,
    recommended: false
  },
  {
    id: 'certifications',
    name: 'Certifications',
    description: 'Professional certifications and achievements',
    icon: LuAward,
    recommended: false
  },
  {
    id: 'languages',
    name: 'Languages',
    description: 'Languages you speak and proficiency levels',
    icon: LuLanguages,
    recommended: false
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Photos and visual content showcase',
    icon: LuImage,
    recommended: false
  },
  {
    id: 'featured_video',
    name: 'Featured Video',
    description: 'Highlight an important video or demo',
    icon: LuVideo,
    recommended: false
  },
  {
    id: 'services',
    name: 'Services Offered',
    description: 'Professional services you provide',
    icon: LuWrench,
    recommended: false
  },
  {
    id: 'testimonials',
    name: 'Client Testimonials',
    description: 'Reviews and feedback from clients',
    icon: LuHeart,
    recommended: false
  },
  {
    id: 'appointments',
    name: 'Book an Appointment',
    description: 'Allow visitors to schedule meetings',
    icon: LuCalendar,
    recommended: false
  }
];

export default function SectionsStep({ data, onUpdateData, onNext }) {
  const [selectedSections, setSelectedSections] = useState(data.selectedSections || ['experience', 'skills']);

  // Toggle section selection
  const toggleSection = (sectionId) => {
    const newSelection = selectedSections.includes(sectionId)
      ? selectedSections.filter(id => id !== sectionId)
      : [...selectedSections, sectionId];
    
    setSelectedSections(newSelection);
    onUpdateData({ selectedSections: newSelection });
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
            <LuGrid3X3 className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            What would you like to showcase?
          </h3>
          <p className="text-gray-600 text-sm">
            Choose the sections you want to include on your digital card
          </p>
        </div>
      </div>

      {/* Recommended Badge */}
      {AVAILABLE_SECTIONS.filter(s => s.recommended).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm font-medium text-center">
            ⭐ Recommended sections are pre-selected for you
          </p>
        </div>
      )}

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {AVAILABLE_SECTIONS.map((section) => {
          const isSelected = selectedSections.includes(section.id);
          const IconComponent = section.icon;
          
          return (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-[#00C896] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-md flex-shrink-0 ${
                  isSelected 
                    ? 'bg-[#00C896] text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${
                      isSelected ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {section.name}
                    </h4>
                    {section.recommended && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isSelected ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>
                </div>
                
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
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
            Selected sections:
          </span>
          <span className="bg-[#00C896] text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedSections.length}
          </span>
        </div>
        {selectedSections.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSections.map((sectionId) => {
              const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
              return (
                <span
                  key={sectionId}
                  className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border"
                >
                  {section?.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Don't worry!</strong> You can always add, remove, or reorder sections later from your dashboard.
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={selectedSections.length === 0}
          className="w-full lg:w-auto lg:min-w-[200px] bg-[#00C896] hover:bg-[#00A67E] disabled:bg-gray-300 text-white py-3 px-6 rounded-md font-semibold transition-colors disabled:cursor-not-allowed"
        >
          {selectedSections.length === 0 
            ? 'Select at least one section' 
            : `Continue with ${selectedSections.length} section${selectedSections.length === 1 ? '' : 's'}`
          }
        </button>
      </div>
    </div>
  );
}
