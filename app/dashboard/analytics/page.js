'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  LuEye, LuUsers, LuTrendingUp, LuCalendar, LuSmartphone, LuMonitor, 
  LuGlobe, LuBarChart3, LuRefreshCw, LuArrowUp, LuArrowDown, LuMessageSquare, LuPhone, LuMail, LuMessageCircle, LuShare2, LuQrCode
} from "react-icons/lu";
import { FaLinkedin, FaInstagram, FaGithub, FaYoutube, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone, FaTwitter, FaFacebook, FaDribbble, FaBehance, FaSnapchatGhost, FaRedditAlien } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import GeographicBreakdown from '../../../src/components/analytics/InteractiveGlobe';

export default function AnalyticsPage() {
  const { user, loading: sessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalyticsData = async (period = selectedPeriod) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/analytics/get-data?userId=${user.id}&period=${period}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Analytics fetch error:', data.error);
        return;
      }
      
      console.log('Analytics data received:', data);
      console.log('Geographic points:', data.geographicPoints);
      console.log('Country breakdown:', data.countryBreakdown);
      console.log('City breakdown:', data.cityBreakdown);
      
      setAnalyticsData(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  useEffect(() => {
    if (!sessionLoading && user?.id) {
      fetchAnalyticsData();
      setIsLoading(false);
    } else if (!sessionLoading && !user) {
      setIsLoading(false);
    }
  }, [sessionLoading, user?.id]);

  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    setIsRefreshing(true);
    await fetchAnalyticsData(period);
    setIsRefreshing(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData();
    setIsRefreshing(false);
  };

  // Modern social platform colors - more distinct
  const SOCIAL_COLORS = {
    linkedin: '#0077B5',
    instagram: '#E4405F',
    github: '#333333',
    youtube: '#FF0000',
    tiktok: '#FF0050',
    whatsapp: '#25D366',
    email: '#EA4335',
    phone: '#34A853',
    x: '#1DA1F2',
    facebook: '#1877F2',
    dribbble: '#EA4C89',
    behance: '#1769FF',
    snapchat: '#FFFC00',
    reddit: '#FF4500'
  };

  // Social platform icons - matching PrysmaCard exactly
  const SOCIAL_ICONS = {
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    github: FaGithub,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    whatsapp: FaWhatsapp,
    email: FaEnvelope,
    phone: FaPhone,
    x: FaXTwitter,
    facebook: FaFacebook,
    dribbble: FaDribbble,
    behance: FaBehance,
    snapchat: FaSnapchatGhost,
    reddit: FaRedditAlien
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };

  const getSocialIcon = (platform) => {
    const Icon = SOCIAL_ICONS[platform];
    return Icon ? <Icon className="h-4 w-4" /> : <LuShare2 className="h-4 w-4" />;
  };

  const getReferrerDisplayName = (referrerSource) => {
    switch (referrerSource) {
      case 'direct': return 'Direct';
      case 'qr_code': return 'QR Code';
      case 'instagram': return 'Instagram';
      case 'linkedin': return 'LinkedIn';
      case 'x': return 'X (Twitter)';
      case 'facebook': return 'Facebook';
      case 'tiktok': return 'TikTok';
      case 'youtube': return 'YouTube';
      case 'github': return 'GitHub';
      case 'google': return 'Google';
      case 'whatsapp': return 'WhatsApp';
      case 'telegram': return 'Telegram';
      case 'reddit': return 'Reddit';
      case 'dribbble': return 'Dribbble';
      case 'behance': return 'Behance';
      case 'snapchat': return 'Snapchat';
      case 'discord': return 'Discord';
      case 'twitch': return 'Twitch';
      case 'pinterest': return 'Pinterest';
      case 'safari': return 'Safari';
      case 'email': return 'Email';
      case 'other': return 'Other';
      default: return referrerSource.charAt(0).toUpperCase() + referrerSource.slice(1);
    }
  };

  const getReferrerIcon = (referrerSource) => {
    const iconMap = {
      'qr_code': LuQrCode,
      'instagram': FaInstagram,
      'linkedin': FaLinkedin,
      'x': FaXTwitter,
      'facebook': FaFacebook,
      'tiktok': FaTiktok,
      'youtube': FaYoutube,
      'github': FaGithub,
      'whatsapp': FaWhatsapp,
      'telegram': LuMessageCircle,
      'reddit': FaRedditAlien,
      'dribbble': FaDribbble,
      'behance': FaBehance,
      'snapchat': FaSnapchatGhost,
      'discord': LuMessageCircle,
      'twitch': LuGlobe,
      'pinterest': LuGlobe,
      'safari': LuGlobe,
      'email': FaEnvelope,
      'google': LuGlobe,
      'direct': LuGlobe,
      'other': LuGlobe
    };
    
    const Icon = iconMap[referrerSource] || LuGlobe;
    return <Icon className="h-4 w-4" />;
  };

  const getReferrerColor = (referrerSource) => {
    const colorMap = {
      'qr_code': '#6366F1',
      'instagram': '#E4405F',
      'linkedin': '#0077B5',
      'x': '#1DA1F2',
      'facebook': '#1877F2',
      'tiktok': '#FF0050',
      'youtube': '#FF0000',
      'github': '#333333',
      'whatsapp': '#25D366',
      'telegram': '#0088CC',
      'reddit': '#FF4500',
      'dribbble': '#EA4C89',
      'behance': '#1769FF',
      'snapchat': '#FFFC00',
      'discord': '#7289DA',
      'twitch': '#9146FF',
      'pinterest': '#BD081C',
      'safari': '#007AFF',
      'email': '#EA4335',
      'google': '#4285F4',
      'direct': '#10B981',
      'other': '#8884D8'
    };
    
    return colorMap[referrerSource] || '#8884D8';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Loading analytics data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (!analyticsData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your card performance and engagement</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              Analytics data will appear here once your card receives views.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">{getPeriodLabel(selectedPeriod)}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <LuRefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalViews)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <LuEye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.uniqueVisitors)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <LuUsers className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalSocialClicks)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <LuShare2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.socialConversionRate}%</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <LuTrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [value, 'Views']}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#0088FE" 
                fill="#0088FE" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Social Clicks - Modern Cards Layout */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 relative overflow-hidden">
          {/* Background decoration - smaller on mobile */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-50 transform translate-x-10 sm:translate-x-16 -translate-y-10 sm:-translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-50 to-blue-50 rounded-full opacity-50 transform -translate-x-8 sm:-translate-x-12 translate-y-8 sm:translate-y-12"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Social Platform Engagement</h3>
                <p className="text-xs sm:text-sm text-gray-600">Track which platforms drive the most engagement</p>
              </div>
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <LuShare2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {Object.values(analyticsData.socialBreakdown || {}).reduce((sum, count) => sum + count, 0)} total clicks
                </span>
              </div>
            </div>

            {Object.keys(analyticsData.socialBreakdown || {}).length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <LuShare2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No social clicks yet</h4>
                <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto px-4">
                  When visitors click your social media links, you&apos;ll see engagement data here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(analyticsData.socialBreakdown || {})
                  .sort(([,a], [,b]) => b - a) // Sort by click count descending
                  .map(([platform, count], index) => {
                    const totalClicks = Object.values(analyticsData.socialBreakdown || {}).reduce((sum, clicks) => sum + clicks, 0);
                    const percentage = totalClicks > 0 ? ((count / totalClicks) * 100).toFixed(1) : 0;
                    const isTopPerformer = index === 0 && count > 0;
                    
                    return (
                                            <div 
                        key={platform}
                        className={`group relative bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          isTopPerformer ? 'border-yellow-200 shadow-yellow-100' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        {isTopPerformer && (
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xs font-bold text-white">★</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div 
                            className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                            style={{ 
                              backgroundColor: SOCIAL_COLORS[platform] || '#8884d8',
                              boxShadow: `0 2px 8px ${SOCIAL_COLORS[platform] || '#8884d8'}20`
                            }}
                          >
                            <div className="text-white text-sm sm:text-lg">
                              {getSocialIcon(platform)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">{count}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 capitalize">{platform}</h4>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: SOCIAL_COLORS[platform] || '#8884d8',
                                animation: `growWidth 1s ease-out ${index * 100}ms forwards`,
                                transform: 'scaleX(0)',
                                transformOrigin: 'left'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes growWidth {
              from {
                transform: scaleX(0);
              }
              to {
                transform: scaleX(1);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(analyticsData.deviceBreakdown || {}).map(([device, count]) => ({
                  name: device.charAt(0).toUpperCase() + device.slice(1),
                  value: count
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {Object.entries(analyticsData.deviceBreakdown || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Views']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Referrer Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={Object.entries(analyticsData.referrerBreakdown || {}).map(([referrer, count]) => ({
                  name: getReferrerDisplayName(referrer),
                  views: count,
                  referrer: referrer
                }))}
                margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Views']}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="views" 
                  radius={[4, 4, 0, 0]}
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Referrer Icons Directly Under Each Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
              {Object.entries(analyticsData.referrerBreakdown || {}).map(([referrer, count]) => (
                <div key={referrer} className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: getReferrerColor(referrer) }}
                  >
                    <div className="text-white">
                      {getReferrerIcon(referrer)}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Data Section */}
      <div className="mb-8">
        <GeographicBreakdown 
          geographicData={analyticsData?.geographicPoints || []} 
        />
      </div>
    </div>
  );
} 