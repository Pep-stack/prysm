'use client';

import React from 'react';
import { LuMapPin, LuGlobe } from 'react-icons/lu';

export default function GeographicBreakdown({ geographicData = [] }) {
  console.log('GeographicBreakdown received data:', geographicData);
  
  // Process geographic data
  const countryBreakdown = {};
  const cityBreakdown = {};
  
  geographicData.forEach(point => {
    if (point.country) {
      countryBreakdown[point.country] = (countryBreakdown[point.country] || 0) + 1;
    }
    if (point.city) {
      cityBreakdown[point.city] = (cityBreakdown[point.city] || 0) + 1;
    }
  });

  console.log('Processed country breakdown:', countryBreakdown);
  console.log('Processed city breakdown:', cityBreakdown);

  const topCountries = Object.entries(countryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topCities = Object.entries(cityBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
      <p className="text-sm text-gray-600 mb-4">
        {geographicData.length} locations tracked
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div>
          <div className="flex items-center mb-3">
            <LuGlobe className="h-4 w-4 text-green-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Top Countries</h4>
          </div>
          <div className="space-y-2">
            {topCountries.length > 0 ? (
              topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{country}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                {geographicData.length === 0 ? 'No geographic data available yet' : 'No country data available'}
              </p>
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div>
          <div className="flex items-center mb-3">
            <LuMapPin className="h-4 w-4 text-blue-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Top Cities</h4>
          </div>
          <div className="space-y-2">
            {topCities.length > 0 ? (
              topCities.map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{city}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                {geographicData.length === 0 ? 'No geographic data available yet' : 'No city data available'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 