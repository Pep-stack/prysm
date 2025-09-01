'use client';

import React, { useState } from 'react';
import { LuPalette, LuCheck } from 'react-icons/lu';
import { THEME_BACKGROUNDS } from '../../../lib/themeSystem';

export default function ThemeStep({ data, onUpdateData, onNext }) {
  const [selectedTheme, setSelectedTheme] = useState(data.selectedTheme || 'pure_canvas');

  // Handle theme selection
  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    onUpdateData({ selectedTheme: themeId });
  };

  // Continue to next step
  const handleNext = () => {
    onNext();
  };

  // Group themes by category
  const themesByCategory = THEME_BACKGROUNDS.reduce((acc, theme) => {
    const category = theme.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(theme);
    return acc;
  }, {});

  const categoryOrder = ['light', 'color', 'dark', 'pattern'];
  const categoryLabels = {
    light: 'Light & Clean',
    color: 'Colorful & Bold', 
    dark: 'Dark & Modern',
    pattern: 'Textured & Unique'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67E] p-3 rounded-full">
            <LuPalette className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Choose your card theme
          </h3>
          <p className="text-gray-600 text-sm">
            Pick a background style that represents your personality
          </p>
        </div>
      </div>

      {/* Themes by Category */}
      <div className="space-y-6">
        {categoryOrder.map(category => {
          const themes = themesByCategory[category];
          if (!themes || themes.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                {categoryLabels[category]}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {themes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative group flex flex-col items-center p-2 md:p-3 rounded-lg border transition-all hover:shadow-md aspect-square ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      type="button"
                      aria-label={`Select ${theme.label} theme`}
                    >
                      <div 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-gray-200 mb-1.5 overflow-hidden flex-shrink-0"
                        style={{ 
                          ...(theme.isPattern
                            ? { 
                                backgroundColor: theme.backgroundColor,
                                backgroundImage: theme.value,
                                backgroundSize: theme.backgroundSize || 'auto'
                              }
                            : theme.isGradient 
                            ? { backgroundImage: theme.value }
                            : { backgroundColor: theme.value }
                          )
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight flex-grow">{theme.label}</span>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <LuCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            Selected theme:
          </span>
          <span className="bg-[#00C896] text-white px-3 py-1 rounded-full text-sm font-medium">
            {THEME_BACKGROUNDS.find(t => t.id === selectedTheme)?.name || 'Pure Canvas'}
          </span>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Don't worry!</strong> You can change your theme anytime from the design settings in your dashboard.
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="w-full lg:w-auto lg:min-w-[200px] bg-[#00C896] hover:bg-[#00A67E] text-white py-3 px-6 rounded-md font-semibold transition-colors"
        >
          Continue with {THEME_BACKGROUNDS.find(t => t.id === selectedTheme)?.name || 'Pure Canvas'}
        </button>
      </div>
    </div>
  );
}
