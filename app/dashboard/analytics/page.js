'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { LuChartBar, LuEye, LuMousePointer, LuShare2, LuTrendingUp, LuCalendar, LuUsers, LuHeart, LuMessageSquare, LuDownload } from "react-icons/lu";

export default function AnalyticsPage() {
  const { user, loading: sessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    shares: 0,
    engagementRate: 0,
    profileViews: 0,
    contactClicks: 0,
    downloads: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (!sessionLoading && user?.id) {
      // TODO: Fetch actual analytics data from your backend
      // For now, using mock data
      setAnalyticsData({
        totalViews: 2847,
        uniqueVisitors: 1892,
        shares: 456,
        engagementRate: 34.2,
        profileViews: 1247,
        contactClicks: 89,
        downloads: 23,
        recentActivity: [
          { id: 1, type: 'view', timestamp: new Date(Date.now() - 1000 * 60 * 30), location: 'Amsterdam, NL', source: 'QR Code' },
          { id: 2, type: 'share', timestamp: new Date(Date.now() - 1000 * 60 * 60), platform: 'WhatsApp' },
          { id: 3, type: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 90), method: 'Email' },
          { id: 4, type: 'view', timestamp: new Date(Date.now() - 1000 * 60 * 120), location: 'Rotterdam, NL', source: 'Direct Link' },
          { id: 5, type: 'download', timestamp: new Date(Date.now() - 1000 * 60 * 180), item: 'Resume' },
          { id: 6, type: 'share', timestamp: new Date(Date.now() - 1000 * 60 * 240), platform: 'Instagram' },
          { id: 7, type: 'view', timestamp: new Date(Date.now() - 1000 * 60 * 300), location: 'Utrecht, NL', source: 'Social Media' }
        ]
      });
      setIsLoading(false);
    } else if (!sessionLoading && !user) {
      setIsLoading(false);
    }
  }, [sessionLoading, user?.id]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view':
        return <LuEye className="h-4 w-4 text-blue-600" />;
      case 'share':
        return <LuShare2 className="h-4 w-4 text-purple-600" />;
      case 'contact':
        return <LuMessageSquare className="h-4 w-4 text-green-600" />;
      case 'download':
        return <LuDownload className="h-4 w-4 text-orange-600" />;
      default:
        return <LuEye className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'view':
        return 'bg-blue-100';
      case 'share':
        return 'bg-purple-100';
      case 'contact':
        return 'bg-green-100';
      case 'download':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your card performance and engagement</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your card performance and engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LuEye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <LuUsers className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LuShare2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shares</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.shares.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <LuTrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.engagementRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <LuEye className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.profileViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <LuMessageSquare className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contact Clicks</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.contactClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <LuDownload className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.downloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {analyticsData.recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'view' && 'Card Viewed'}
                    {activity.type === 'share' && 'Card Shared'}
                    {activity.type === 'contact' && 'Contact Clicked'}
                    {activity.type === 'download' && 'File Downloaded'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.type === 'view' && `${activity.location} • ${activity.source}`}
                    {activity.type === 'share' && `via ${activity.platform}`}
                    {activity.type === 'contact' && `via ${activity.method}`}
                    {activity.type === 'download' && `${activity.item}`}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center">
          <LuChartBar className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Advanced Analytics Coming Soon</h3>
            <p className="text-blue-700 mt-1">
              We're working on detailed analytics including geographic data, time-based trends, conversion tracking, and more detailed insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 