'use client';

import React, { useState } from 'react';
import { LuUsers, LuSettings } from 'react-icons/lu';

export default function CommunitySelector({ value = '', onChange }) {
  const [communityData, setCommunityData] = useState({
    title: value?.title || 'Join the Community',
    description: value?.description || 'Connect with like-minded people and stay updated with our community.',
    placeholder: value?.placeholder || 'Enter your email',
    buttonText: value?.buttonText || 'Join Community',
    provider: value?.provider || 'discord', // discord, slack, telegram, custom
    formUrl: value?.formUrl || '',
    successMessage: value?.successMessage || 'Welcome to the community!',
    showName: value?.showName || false,
    communityType: value?.communityType || 'discord' // discord, slack, telegram, whatsapp, custom
  });

  const handleSave = () => {
    if (communityData.formUrl) {
      onChange(communityData);
    }
  };

  const getProviderInfo = (provider) => {
    const providers = {
      discord: {
        name: 'Discord',
        url: 'https://discord.com',
        instructions: 'Use your Discord server invite link'
      },
      slack: {
        name: 'Slack',
        url: 'https://slack.com',
        instructions: 'Use your Slack workspace invite link'
      },
      telegram: {
        name: 'Telegram',
        url: 'https://telegram.org',
        instructions: 'Use your Telegram group invite link'
      },
      whatsapp: {
        name: 'WhatsApp',
        url: 'https://whatsapp.com',
        instructions: 'Use your WhatsApp group invite link'
      },
      custom: {
        name: 'Custom',
        url: '',
        instructions: 'Use any community platform invite link'
      }
    };
    return providers[provider] || providers.custom;
  };

  const providerInfo = getProviderInfo(communityData.provider);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Join the Community</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add a community signup form to help people join your Discord, Slack, or other community platforms.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={communityData.title}
            onChange={(e) => setCommunityData({ ...communityData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Join the Community"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={communityData.description}
            onChange={(e) => setCommunityData({ ...communityData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Brief description of your community"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community Platform
          </label>
          <select
            value={communityData.provider}
            onChange={(e) => setCommunityData({ ...communityData, provider: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="discord">Discord</option>
            <option value="slack">Slack</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invite Link *
          </label>
          <input
            type="url"
            value={communityData.formUrl}
            onChange={(e) => setCommunityData({ ...communityData, formUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://discord.gg/your-server"
          />
          <p className="text-xs text-gray-500 mt-1">
            {providerInfo.instructions}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Placeholder
          </label>
          <input
            type="text"
            value={communityData.placeholder}
            onChange={(e) => setCommunityData({ ...communityData, placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={communityData.buttonText}
            onChange={(e) => setCommunityData({ ...communityData, buttonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Join Community"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Success Message
          </label>
          <input
            type="text"
            value={communityData.successMessage}
            onChange={(e) => setCommunityData({ ...communityData, successMessage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Welcome to the community!"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showName"
            checked={communityData.showName}
            onChange={(e) => setCommunityData({ ...communityData, showName: e.target.checked })}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="showName" className="ml-2 block text-sm text-gray-700">
            Include name field (if supported by platform)
          </label>
        </div>
      </div>

      {/* Preview */}
      {communityData.formUrl && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="mb-3">
                <LuUsers size={32} className="mx-auto text-emerald-600" />
              </div>
              <h5 className="font-medium text-gray-900 mb-2">{communityData.title}</h5>
              {communityData.description && (
                <p className="text-sm text-gray-600 mb-4">{communityData.description}</p>
              )}
              <div className="max-w-sm mx-auto">
                <div className="flex gap-2">
                  {communityData.showName && (
                    <input
                      type="text"
                      placeholder="Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      disabled
                    />
                  )}
                  <input
                    type="email"
                    placeholder={communityData.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    disabled
                  />
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 transition-colors">
                    {communityData.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!communityData.formUrl}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Community
        </button>
        <button
          onClick={() => onChange('')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Clear Community
        </button>
      </div>

      {/* Help section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to set up your community</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Create a community on {providerInfo.name} (<a href={providerInfo.url} target="_blank" rel="noopener noreferrer" className="underline">{providerInfo.url}</a>)</li>
          <li>2. Generate an invite link for your community</li>
          <li>3. Copy the invite link</li>
          <li>4. Paste it in the Invite Link field above</li>
        </ol>
      </div>
    </div>
  );
} 