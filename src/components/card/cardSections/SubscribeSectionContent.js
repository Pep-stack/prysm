'use client';

import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function SubscribeSectionContent({ section, profile, styles, isPublicView = false }) {
  const { sectionStyle, sectionTitleStyle } = styles || {};
  
  // Extract data from section
  const subscribeData = section?.value || {};
  const {
    title = subscribeData.t || 'Subscribe',
    description = subscribeData.d || 'Stay updated with our latest news and updates.',
    placeholder = subscribeData.p || 'Your email...',
    buttonText = subscribeData.b || 'Subscribe',
    formUrl = subscribeData.f || '',
    successMessage = subscribeData.s || 'Thank you for subscribing!'
  } = subscribeData;

  const handleSubscribe = () => {
    if (formUrl) {
      window.open(formUrl, '_blank');
    }
  };

  return (
    <div style={sectionStyle} className="w-full">
      {/* Section Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={sectionTitleStyle} className="text-lg font-semibold mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
        )}
      </div>

      {/* Subscribe Form */}
      <div className="w-full">
        <div className="flex gap-3 items-center">
          {/* Email Input */}
          <div className="flex-1">
            <input
              type="email"
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{
                backgroundColor: 'white',
                color: '#374151'
              }}
              readOnly={!isPublicView}
            />
          </div>
          
          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={!formUrl}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              backgroundColor: '#10B981',
              minWidth: 'fit-content'
            }}
          >
            <FaEnvelope className="text-sm" />
            {buttonText}
          </button>
        </div>
        
        {/* Help text */}
        <p className="text-xs text-gray-500 mt-2">
          We'll never share your email with anyone else.
        </p>
      </div>
    </div>
  );
} 