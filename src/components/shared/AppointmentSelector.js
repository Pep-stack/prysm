'use client';

import React, { useState } from 'react';
import { LuCalendar, LuLink, LuSettings } from 'react-icons/lu';

export default function AppointmentSelector({ value = '', onChange }) {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Call</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add a Calendly integration to let people book appointments with you directly.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={appointmentData.title}
            onChange={(e) => setAppointmentData({ ...appointmentData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Schedule a Call"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={appointmentData.description}
            onChange={(e) => setAppointmentData({ ...appointmentData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Brief description of what people can expect"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calendly URL *
          </label>
          <input
            type="url"
            value={appointmentData.calendlyUrl}
            onChange={(e) => setAppointmentData({ ...appointmentData, calendlyUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://calendly.com/yourusername"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste your Calendly scheduling link
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={appointmentData.buttonText}
            onChange={(e) => setAppointmentData({ ...appointmentData, buttonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Schedule Now"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showCalendar"
            checked={appointmentData.showCalendar}
            onChange={(e) => setAppointmentData({ ...appointmentData, showCalendar: e.target.checked })}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="showCalendar" className="ml-2 block text-sm text-gray-700">
            Show calendar preview
          </label>
        </div>
      </div>

      {/* Preview */}
      {appointmentData.calendlyUrl && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="mb-3">
                <LuCalendar size={32} className="mx-auto text-emerald-600" />
              </div>
              <h5 className="font-medium text-gray-900 mb-2">{appointmentData.title}</h5>
              {appointmentData.description && (
                <p className="text-sm text-gray-600 mb-4">{appointmentData.description}</p>
              )}
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                {appointmentData.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!appointmentData.calendlyUrl}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Appointment
        </button>
        <button
          onClick={() => onChange('')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Clear Appointment
        </button>
      </div>

      {/* Help section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to set up Calendly</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Go to <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="underline">calendly.com</a> and create an account</li>
          <li>2. Create a new event type (e.g., "15 Minute Meeting")</li>
          <li>3. Copy the share link from your event</li>
          <li>4. Paste it in the Calendly URL field above</li>
        </ol>
      </div>
    </div>
  );
} 