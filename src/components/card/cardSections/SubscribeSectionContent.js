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
    <div style={{
      ...sectionStyle,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(255, 255, 255, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }} className="w-full">
      {/* Title at the top of the container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#374151',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8
        }}>
          <FaEnvelope size={14} style={{ color: 'white' }} />
        </div>
        <h3 style={{
          ...sectionTitleStyle,
          fontSize: '18px',
          fontWeight: '600',
          color: '#000000',
          margin: 0,
          letterSpacing: '-0.01em',
          opacity: 0.9
        }}>
          {title}
        </h3>
      </div>
      
      {description && (
        <div style={{
          marginBottom: '16px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#000000',
            opacity: 0.7,
            margin: 0,
            lineHeight: '1.5'
          }}>
            {description}
          </p>
        </div>
      )}

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
          We&apos;ll never share your email with anyone else.
        </p>
      </div>
    </div>
  );
} 