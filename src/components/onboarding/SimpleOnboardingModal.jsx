'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';

// Import step components
import WelcomeStep from './steps/WelcomeStep';
import ProfileStep from './steps/ProfileStep';
import PhotoStep from './steps/PhotoStep';
import ThemeStep from './steps/ThemeStep';
import SectionsStep from './steps/SectionsStep';
import SocialButtonsStep from './steps/SocialButtonsStep';
import CompletionStep from './steps/CompletionStep';

/**
 * Simple Onboarding Modal - Prysma Style
 * Mobile-responsive modal with clean design
 */
export default function SimpleOnboardingModal({
  isOpen,
  currentStep,
  totalSteps,
  onboardingData,
  isLoading,
  isFirstStep,
  isLastStep,
  progress,
  onNext,
  onPrevious,
  onUpdateData,
  onComplete,
  onClose,
  onSkip,
  user
}) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Step component mapping
  const stepComponents = {
    0: WelcomeStep,
    1: ProfileStep,
    2: PhotoStep,
    3: ThemeStep,
    4: SectionsStep,
    5: SocialButtonsStep,
    6: CompletionStep
  };

  const StepComponent = stepComponents[currentStep];

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop - transparent with blur */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#00C896] to-[#00A67E] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-semibold">
                Get Started with Prysma
              </h2>
              <p className="text-green-100 text-sm">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors p-1 rounded-md hover:bg-white hover:bg-opacity-10"
              aria-label="Close onboarding"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="bg-green-200 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {StepComponent && (
            <StepComponent
              data={onboardingData}
              onUpdateData={onUpdateData}
              onNext={onNext}
              onPrevious={onPrevious}
              onComplete={onComplete}
              onSkip={onSkip}
              isLoading={isLoading}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              user={user}
            />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex-shrink-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            {!isFirstStep && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-md hover:bg-gray-100"
                disabled={isLoading}
              >
                Previous
              </button>
            )}
            
            {/* Skip/Later Button */}
            {!isLastStep && (
              <button
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors ml-auto mr-3"
                disabled={isLoading}
              >
                Complete Later
              </button>
            )}

            {/* Next/Complete Button */}
            <button
              onClick={isLastStep ? onComplete : onNext}
              disabled={isLoading}
              className="bg-[#00C896] hover:bg-[#00A67E] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLastStep ? 'Completing...' : 'Next'}
                </>
              ) : (
                isLastStep ? 'Complete Setup' : 'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
