'use client';
import React, { useState, useEffect } from 'react';
import { LuCalendar, LuLink, LuSettings } from 'react-icons/lu';

export default function AppointmentsEditor({ value = '', onChange, onSave, onCancel }) {
  const [appointmentData, setAppointmentData] = useState({
    title: value?.title || 'Schedule a Call',
    description: value?.description || 'Book a time to chat with me',
    calendlyUrl: value?.calendlyUrl || '',
    buttonText: value?.buttonText || 'Schedule Now',
    showCalendar: value?.showCalendar || false
  });

  const handleSave = () => {
    if (appointmentData.calendlyUrl) {
      onChange(appointmentData);
      onSave(appointmentData);
      if (onCancel) onCancel();
    }
  };

  const extractCalendlyUsername = (url) => {
    if (!url) return '';
    
    // Handle different Calendly URL formats
    const patterns = [
      /calendly\.com\/([^\/\?]+)/,
      /calendly\.com\/([^\/\?]+)\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return '';
  };

  const getEmbedUrl = (url) => {
    const username = extractCalendlyUsername(url);
    if (username) {
      return `https://calendly.com/${username}`;
    }
    return url;
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
      {/* Calendly Header with logo and text */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#006BFF'
          }}>
            <LuCalendar className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Schedule a Call</h3>
            <p className="text-gray-400 text-sm">Add your Calendly integration</p>
          </div>
        </div>
      </div>

      {/* Content with form fields */}
      <div className="p-6 pt-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={appointmentData.title}
              onChange={(e) => setAppointmentData({ ...appointmentData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Schedule a Call"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={appointmentData.description}
              onChange={(e) => setAppointmentData({ ...appointmentData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Brief description of what people can expect"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Calendly URL *
            </label>
            <input
              type="url"
              value={appointmentData.calendlyUrl}
              onChange={(e) => setAppointmentData({ ...appointmentData, calendlyUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://calendly.com/yourusername"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste your Calendly scheduling link
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={appointmentData.buttonText}
              onChange={(e) => setAppointmentData({ ...appointmentData, buttonText: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Schedule Now"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCalendar"
              checked={appointmentData.showCalendar}
              onChange={(e) => setAppointmentData({ ...appointmentData, showCalendar: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
            />
            <label htmlFor="showCalendar" className="ml-2 block text-sm text-white">
              Show calendar preview
            </label>
          </div>
        </div>

        {/* Preview */}
        {appointmentData.calendlyUrl && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <h4 className="text-white font-medium mb-3">Preview</h4>
            <div className="space-y-2">
              <div className="text-white text-sm">
                <strong>{appointmentData.title}</strong>
              </div>
              <div className="text-gray-400 text-sm">
                {appointmentData.description}
              </div>
              <div className="text-blue-400 text-sm truncate">
                {appointmentData.calendlyUrl}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!appointmentData.calendlyUrl}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 