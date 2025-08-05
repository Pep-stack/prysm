'use client';

import React, { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function SubscribeSelector({ value = '', onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [subscribeData, setSubscribeData] = useState({
    t: value?.title || 'Subscribe',
    d: value?.description || 'Stay updated with our latest news and updates.',
    p: value?.placeholder || 'Your email...',
    b: value?.buttonText || 'Subscribe',
    f: value?.formUrl || '',
    s: value?.successMessage || 'Thank you for subscribing!'
  });

  useEffect(() => {
    if (value && typeof value === 'object') {
      setSubscribeData({
        t: value.title || value.t || 'Subscribe',
        d: value.description || value.d || 'Stay updated with our latest news and updates.',
        p: value.placeholder || value.p || 'Your email...',
        b: value.buttonText || value.b || 'Subscribe',
        f: value.formUrl || value.f || '',
        s: value.successMessage || value.s || 'Thank you for subscribing!'
      });
    }
  }, [value]);

  const handleCancel = () => {
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleSave = () => {
    // Save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
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
      {/* Subscribe Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#10B981'
          }}>
            <FaEnvelope className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Subscribe</h3>
            <p className="text-gray-400 text-sm">Add an email subscription form</p>
          </div>
        </div>
      </div>

      {/* Content with form fields */}
      <div className="p-6 pt-4">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Section Title</label>
            <input
              type="text"
              value={subscribeData.t}
              onChange={(e) => {
                const newData = { ...subscribeData, t: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="Subscribe"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">Description</label>
            <textarea
              value={subscribeData.d}
              onChange={(e) => {
                const newData = { ...subscribeData, d: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="Brief description of your newsletter"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">Form URL *</label>
            <input
              type="url"
              value={subscribeData.f}
              onChange={(e) => {
                const newData = { ...subscribeData, f: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="https://your-form-service.com/form"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
            <p className="text-gray-400 text-xs mt-2">Use services like Mailchimp, ConvertKit, or any form service</p>
            <p className="text-gray-400 text-xs mt-1">* Required field</p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">Email Placeholder</label>
            <input
              type="text"
              value={subscribeData.p}
              onChange={(e) => {
                const newData = { ...subscribeData, p: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="Your email..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">Button Text</label>
            <input
              type="text"
              value={subscribeData.b}
              onChange={(e) => {
                const newData = { ...subscribeData, b: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="Subscribe"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">Success Message</label>
            <input
              type="text"
              value={subscribeData.s}
              onChange={(e) => {
                const newData = { ...subscribeData, s: e.target.value };
                setSubscribeData(newData);
                onChange(newData);
              }}
              placeholder="Thank you for subscribing!"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>
        </div>

        {/* Save/Cancel Buttons - Always visible at bottom */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
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
              backgroundColor: '#10b981',
              color: 'white'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 