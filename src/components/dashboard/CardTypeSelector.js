'use client';

import React from 'react';
import { LuUser, LuBriefcase, LuBuilding2 } from 'react-icons/lu';
import { CARD_TYPES } from '../../lib/sectionOptions';

export default function CardTypeSelector({ currentCardType, onCardTypeChange, disabled = false }) {
  const cardTypes = [
    {
      type: CARD_TYPES.PRO,
      name: 'Prysma Pro',
      description: 'Freelancers, creators, consultants',
      icon: LuUser,
      color: 'emerald'
    },
    {
      type: CARD_TYPES.CAREER,
      name: 'Prysma Career',
      description: 'Job seekers, career changers, graduates',
      icon: LuBriefcase,
      color: 'emerald'
    },
    {
      type: CARD_TYPES.BUSINESS,
      name: 'Prysma Business',
      description: 'Companies, agencies, stores',
      icon: LuBuilding2,
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 text-gray-700">
          <h2 className="text-base font-medium text-black">Card Type</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose your card type to get relevant sections and layout options.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cardTypes.map((cardType) => {
              const Icon = cardType.icon;
              const isSelected = currentCardType === cardType.type;
              
              return (
                <label 
                  key={cardType.type}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="cardType"
                    value={cardType.type}
                    checked={isSelected}
                    onChange={(e) => !disabled && onCardTypeChange(e.target.value)}
                    className="sr-only"
                    disabled={disabled}
                  />
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      isSelected 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className="font-medium text-gray-900">{cardType.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cardType.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          
          {disabled && (
            <p className="text-xs text-gray-500 mt-2">
              Save your current changes before changing card type.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 