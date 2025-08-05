'use client';
import React, { useState, useEffect } from 'react';
import { LuCalendar, LuLink, LuSettings } from 'react-icons/lu';

export default function AppointmentsEditor({ value = '', onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [appointmentData, setAppointmentData] = useState({
    title: value?.title || 'Schedule a Call',
    description: value?.description || 'Book a time to chat with me',
    calendlyUrl: value?.calendlyUrl || '',
    buttonText: value?.buttonText || 'Schedule Now',
    showCalendar: value?.showCalendar || false
  });

  useEffect(() => {
    if (value && typeof value === 'object') {
      setAppointmentData({
        title: value.title || 'Schedule a Call',
        description: value.description || 'Book a time to chat with me',
        calendlyUrl: value.calendlyUrl || '',
        buttonText: value.buttonText || 'Schedule Now',
        showCalendar: value.showCalendar || false
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
    // Update local data first
    onChange(appointmentData);
    // Save to database via modal
    if (modalOnSave) {
      modalOnSave();
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
            <label className="block text-white font-medium mb-2 text-sm">
              Section Title
            </label>
            <input
              type="text"
              value={appointmentData.title}
              onChange={(e) => {
                const newData = { ...appointmentData, title: e.target.value };
                setAppointmentData(newData);
                onChange(newData);
              }}
              placeholder="Schedule a Call"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Description
            </label>
            <textarea
              value={appointmentData.description}
              onChange={(e) => {
                const newData = { ...appointmentData, description: e.target.value };
                setAppointmentData(newData);
                onChange(newData);
              }}
              placeholder="Brief description of what people can expect"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Calendly URL *
            </label>
            <input
              type="url"
              value={appointmentData.calendlyUrl}
              onChange={(e) => {
                const newData = { ...appointmentData, calendlyUrl: e.target.value };
                setAppointmentData(newData);
                onChange(newData);
              }}
              placeholder="https://calendly.com/yourusername"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
            <p className="text-gray-400 text-xs mt-2">
              Paste your Calendly scheduling link
            </p>
            <p className="text-gray-400 text-xs mt-1">* Required field</p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Button Text
            </label>
            <input
              type="text"
              value={appointmentData.buttonText}
              onChange={(e) => {
                const newData = { ...appointmentData, buttonText: e.target.value };
                setAppointmentData(newData);
                onChange(newData);
              }}
              placeholder="Schedule Now"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#1a1a1a' }}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCalendar"
              checked={appointmentData.showCalendar}
              onChange={(e) => {
                const newData = { ...appointmentData, showCalendar: e.target.checked };
                setAppointmentData(newData);
                onChange(newData);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
            />
            <label htmlFor="showCalendar" className="ml-2 block text-sm text-white">
              Show calendar preview
            </label>
          </div>
        </div>

        {/* Preview */}
        {appointmentData.calendlyUrl && (
          <div className="mt-6 p-4 rounded-lg border border-gray-700" style={{ backgroundColor: '#1a1a1a' }}>
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
            disabled={!appointmentData.calendlyUrl}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#006BFF',
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