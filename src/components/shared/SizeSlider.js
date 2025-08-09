'use client';

import React, { useState, useCallback } from 'react';

export default function SizeSlider({ 
  value = 'medium', 
  onChange, 
  min = 'small', 
  max = 'large',
  className = '',
  disabled = false 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [sliderValue, setSliderValue] = useState(50); // Track internal slider value

  // Uitgebreide size mapping voor realistische sizes
  const sizeMapping = {
    'xs': { value: 0, label: 'Extra Small', pixels: 50 },
    'small': { value: 20, label: 'Small', pixels: 70 },
    'medium': { value: 40, label: 'Medium', pixels: 90 },
    'large': { value: 60, label: 'Large', pixels: 110 },
    'xl': { value: 80, label: 'Extra Large', pixels: 130 },
    'xxl': { value: 100, label: 'Maximum', pixels: 150 }
  };

  // Labels voor de slider (alleen hoofdposities)
  const mainSizes = {
    'small': { value: 20, label: 'Minimum', pixels: 70 },
    'medium': { value: 50, label: 'Recommended', pixels: 100 },
    'large': { value: 80, label: 'Great', pixels: 130 }
  };

  // Initialize slider value based on current size
  React.useEffect(() => {
    const mappedValue = sizeMapping[value]?.value || 50;
    setSliderValue(mappedValue);
  }, [value]);

  // Handle voor slider verandering met realistische size mapping
  const handleSliderChange = useCallback((e) => {
    const rawValue = parseInt(e.target.value);
    setSliderValue(rawValue); // Update internal value immediately for smooth movement
    
    // Bepaal welke size het dichtst bij de waarde ligt (meer granulaire mapping)
    let newSize;
    if (rawValue < 10) {
      newSize = 'xs';
    } else if (rawValue < 30) {
      newSize = 'small';
    } else if (rawValue < 50) {
      newSize = 'medium';
    } else if (rawValue < 70) {
      newSize = 'large';
    } else if (rawValue < 90) {
      newSize = 'xl';
    } else {
      newSize = 'xxl';
    }
    
    if (onChange && newSize !== value) {
      onChange(newSize);
    }
  }, [onChange, value]);

  // Simple mouse events
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
  }, []);

  // Krijg info van huidige size
  const currentSizeInfo = sizeMapping[value] || sizeMapping['medium'];

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Slider Container */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Track */}
        <div className={`relative h-6 bg-gray-200 rounded-full shadow-inner transition-all duration-150 ${
          isHovering || isDragging ? 'bg-gray-300' : 'bg-gray-200'
        }`}>
          
          {/* Progress */}
          <div 
            className={`absolute top-0 left-0 h-6 bg-gradient-to-r from-gray-800 to-black rounded-full transition-all duration-200 ${
              isDragging ? 'from-emerald-500 to-emerald-700' : 'from-gray-800 to-black'
            }`}
            style={{ width: `${sliderValue}%` }}
          />
          
          {/* Handle */}
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black rounded-full shadow-lg border-2 border-white transition-all duration-100 cursor-grab ${
              isDragging 
                ? 'scale-125 cursor-grabbing bg-emerald-600 shadow-xl shadow-emerald-200' 
                : isHovering 
                  ? 'scale-110 shadow-xl' 
                  : 'scale-100'
            }`}
            style={{ left: `calc(${sliderValue}% - 12px)` }}
            onMouseDown={handleMouseDown}
          >
            {/* Inner circle */}
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Simplified input */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      {/* Interactive Labels */}
      <div className="flex justify-between items-center mt-4 px-1">
        {Object.entries(mainSizes).map(([key, info]) => (
          <button
            key={key}
            onClick={() => !disabled && onChange?.(key)}
            disabled={disabled}
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed ${
              value === key 
                ? 'text-gray-900 bg-gray-100 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>

      {/* Enhanced size info */}
      <div className={`text-center mt-3 transition-all duration-200 ${
        isDragging ? 'scale-105' : 'scale-100'
      }`}>
        <div className="text-sm font-medium text-gray-900">
          {currentSizeInfo.label}
        </div>
        <div className="text-xs text-gray-500">
          {currentSizeInfo.pixels}px
        </div>
      </div>
    </div>
  );
}
