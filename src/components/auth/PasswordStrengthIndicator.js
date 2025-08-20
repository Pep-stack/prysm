'use client';

import React from 'react';
import { getPasswordStrengthColor } from '../../lib/validation';

export default function PasswordStrengthIndicator({ password, validation }) {
  if (!password || !validation) return null;

  const { 
    strength = 0, 
    strengthText = 'Unknown', 
    suggestions = {
      needsLength: true,
      needsLowercase: true,
      needsUppercase: true,
      needsNumbers: true,
      needsSpecialChars: true
    } 
  } = validation;
  
  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength 
                ? getPasswordStrengthColor(strength)
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Strength text */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          Password strength: <span className="font-medium">{strengthText}</span>
        </span>
      </div>
      
      {/* Suggestions */}
      {strength < 4 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>To improve your password:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            {suggestions.needsLength && (
              <li>Use at least 8 characters</li>
            )}
            {suggestions.needsLowercase && (
              <li>Include lowercase letters (a-z)</li>
            )}
            {suggestions.needsUppercase && (
              <li>Include uppercase letters (A-Z)</li>
            )}
            {suggestions.needsNumbers && (
              <li>Include numbers (0-9)</li>
            )}
            {suggestions.needsSpecialChars && (
              <li>Include special characters (!@#$%^&*)</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
