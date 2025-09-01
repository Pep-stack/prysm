'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { THEME_BACKGROUNDS } from '../lib/themeSystem';

const ONBOARDING_STEPS = {
  WELCOME: 0,
  PROFILE: 1,
  PHOTO: 2,
  THEME: 3,
  SECTIONS: 4,
  SOCIAL_BUTTONS: 5,
  COMPLETION: 6
};

const TOTAL_STEPS = 7;

export function useSimpleOnboarding(user, profile) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  
  // Onboarding data state
  const [onboardingData, setOnboardingData] = useState({
    name: profile?.name || '',
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    photo: profile?.avatar_url || null,
    imageShape: 'circle', // Default to circle
    selectedTheme: 'pure_canvas', // Default theme
    selectedSections: ['experience', 'skills'], // Default sections
    selectedSocialButtons: ['linkedin', 'github'] // Default social buttons
  });

  // Check if user needs onboarding
  const needsOnboarding = !profile?.onboarding_completed && 
    (!profile?.card_sections || profile.card_sections.length === 0);

  // Auto-start onboarding for new users
  useEffect(() => {
    if (user && profile && needsOnboarding && !isOpen) {
      console.log('🎯 New user detected, starting onboarding automatically');
      setIsOpen(true);
      setCurrentStep(ONBOARDING_STEPS.WELCOME);
    }
  }, [user, profile, needsOnboarding, isOpen]);

  // Start onboarding
  const startOnboarding = useCallback(() => {
    if (!user) return;
    
    setIsOpen(true);
    setCurrentStep(ONBOARDING_STEPS.WELCOME);
    console.log('🚀 Starting simple onboarding for:', user.email);
  }, [user]);

  // Go to next step
  const nextStep = useCallback(async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Save progress to database
      if (user) {
        try {
          await supabase
            .from('profiles')
            .upsert({ 
              id: user.id,
              onboarding_step: newStep,
              updated_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error saving onboarding progress:', error);
        }
      }
    }
  }, [currentStep, user]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Update onboarding data
  const updateData = useCallback((newData) => {
    setOnboardingData(prev => ({
      ...prev,
      ...newData
    }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Save final profile data
      const profileUpdate = {
        id: user.id,
        name: onboardingData.name,
        headline: onboardingData.headline,
        bio: onboardingData.bio,
        background_color: getThemeBackgroundValue(onboardingData.selectedTheme),
        onboarding_completed: true,
        onboarding_step: TOTAL_STEPS,
        updated_at: new Date().toISOString()
      };

      if (onboardingData.photo && onboardingData.photo !== profile?.avatar_url) {
        profileUpdate.avatar_url = onboardingData.photo;
      }

      await supabase
        .from('profiles')
        .upsert(profileUpdate);

      // Add selected sections to card_sections
      const allSections = [];
      let orderIndex = 0;

      // Add content sections
      if (onboardingData.selectedSections.length > 0) {
        const sections = onboardingData.selectedSections.map((type) => ({
          id: `${type}-${Date.now()}-${orderIndex++}`,
          type,
          title: getSectionTitle(type),
          value: getSectionDefaultValue(type),
          order: orderIndex - 1
        }));
        allSections.push(...sections);
      }

      // Add social button sections (these go to social bar)
      if (onboardingData.selectedSocialButtons.length > 0) {
        const socialSections = onboardingData.selectedSocialButtons.map((type) => ({
          id: `${type}-${Date.now()}-${orderIndex++}`,
          type,
          title: getSectionTitle(type),
          value: getSectionDefaultValue(type),
          order: orderIndex - 1,
          area: 'social_bar' // This makes them appear in the social bar instead of card sections
        }));
        allSections.push(...socialSections);
      }

      // Update profile with all sections
      if (allSections.length > 0) {
        await supabase
          .from('profiles')
          .update({ 
            card_sections: allSections,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      }

      console.log('✅ Onboarding completed successfully');
      setIsOpen(false);
      
      // Refresh the page to show updated profile
      window.location.reload();
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, onboardingData, profile]);

  // Close onboarding
  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Skip onboarding (mark as completed but don't save data)
  const skipOnboarding = useCallback(async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });
      
      setIsOpen(false);
      console.log('⏭️ Onboarding skipped');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  }, [user]);

  return {
    // State
    isOpen,
    currentStep,
    isLoading,
    onboardingData,
    needsOnboarding,
    
    // Step info
    totalSteps: TOTAL_STEPS,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    progress: Math.round((currentStep / (TOTAL_STEPS - 1)) * 100),
    
    // Actions
    startOnboarding,
    nextStep,
    previousStep,
    updateData,
    completeOnboarding,
    closeOnboarding,
    skipOnboarding
  };
}

// Helper functions
function getSectionTitle(type) {
  const titles = {
    experience: 'Work Experience',
    skills: 'Skills & Technologies',
    education: 'Education',
    projects: 'Portfolio',
    certifications: 'Certifications',
    languages: 'Languages',
    gallery: 'Gallery',
    featured_video: 'Featured Video',
    services: 'Services Offered',
    testimonials: 'Client Testimonials',
    appointments: 'Book an Appointment',
    // Social buttons
    linkedin: 'LinkedIn',
    github: 'GitHub',
    x: 'X (Twitter)',
    instagram: 'Instagram',
    youtube: 'YouTube',
    spotify: 'Spotify',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    dribbble: 'Dribbble',
    snapchat: 'Snapchat',
    reddit: 'Reddit'
  };
  return titles[type] || type;
}

function getSectionDefaultValue(type) {
  switch (type) {
    case 'experience':
    case 'education':
    case 'projects':
    case 'certifications':
    case 'languages':
    case 'gallery':
    case 'services':
    case 'testimonials':
      return [];
    case 'skills':
    case 'featured_video':
    case 'appointments':
      return '';
    // Social buttons - empty string as they'll be configured later
    case 'linkedin':
    case 'github':
    case 'x':
    case 'instagram':
    case 'youtube':
    case 'spotify':
    case 'tiktok':
    case 'whatsapp':
    case 'facebook':
    case 'dribbble':
    case 'snapchat':
    case 'reddit':
      return '';
    default:
      return '';
  }
}

// Helper function to get theme background value
function getThemeBackgroundValue(themeId) {
  const theme = THEME_BACKGROUNDS.find(t => t.id === themeId);
  return theme ? theme.value : '#ffffff'; // fallback to white
}
