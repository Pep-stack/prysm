"use client";
import { useDesignSettings } from '../../../src/components/dashboard/DesignSettingsContext';
import PrysmaCard from '../../../src/components/card/PrysmaCard';
import { getSectionsKey } from '../../../src/lib/sectionOptions';
import { useEffect } from 'react';

// Define which section types are considered social media (same as in the hook)
const SOCIAL_MEDIA_TYPES = [
  'linkedin', 'x_profile', 'instagram', 'github_gitlab', 'dribbble_behance',
  'youtube_channel', 'tiktok', 'facebook', 'stackoverflow', 'contact_buttons',
  'email', 'whatsapp'
];

export default function PublicProfilePageContent({ profile }) {
  const { settings } = useDesignSettings();
  const cardType = profile.card_type || 'pro';
  const sectionsKey = getSectionsKey(cardType);
  const cardSections = Array.isArray(profile[sectionsKey]) ? profile[sectionsKey] : [];

  // Split sections into regular and social bar sections
  const regularSections = cardSections.filter(section => 
    !SOCIAL_MEDIA_TYPES.includes(section.type) && section.area !== 'social_bar'
  );
  const socialBarSections = cardSections.filter(section => 
    SOCIAL_MEDIA_TYPES.includes(section.type) || section.area === 'social_bar'
  );

  // Analytics tracking
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Determine source from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source') || 'direct';
        
        // Get client IP and user agent
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || 'direct';
        
        // Get IP address (this will be determined server-side)
        const ip = 'client-ip'; // Will be determined server-side
        
        await fetch('/api/analytics/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: profile.id,
            ip: ip,
            userAgent: userAgent,
            referrer: referrer
          })
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    // Track page view after component mounts
    trackPageView();
  }, [profile.id]);
  
  // Complete background options for patterns (same as dashboard)
  const BACKGROUND_COLOR_OPTIONS = [
    { label: 'Subtle Dots', value: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)', name: 'Subtle Dots', isPattern: true, backgroundColor: '#ffffff', backgroundSize: '20px 20px' },
    { label: 'Fine Grid', value: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', name: 'Fine Grid', isPattern: true, backgroundColor: '#ffffff', backgroundSize: '24px 24px' },
    { label: 'Soft Lines', value: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)', name: 'Soft Lines', isPattern: true, backgroundColor: '#fafafa' },
    { label: 'Paper Texture', value: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0), radial-gradient(circle at 12px 12px, rgba(0,0,0,0.015) 1px, transparent 0)', name: 'Paper Texture', isPattern: true, backgroundColor: '#fefefe', backgroundSize: '16px 16px, 24px 24px' },
    { label: 'Dark Mesh', value: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', name: 'Dark Mesh', isPattern: true, backgroundColor: '#1a1a1a', backgroundSize: '18px 18px' }
  ];
  
  const backgroundOption = BACKGROUND_COLOR_OPTIONS.find(opt => opt.value === settings.background_color);
  
  // Style for full page background (solid color only for patterns)
  const getPageBackgroundStyle = () => {
    if (backgroundOption?.isPattern) {
      return {
        backgroundColor: backgroundOption.backgroundColor // Only solid color for patterns
      };
    } else if (settings.background_color?.includes('linear-gradient') || 
               settings.background_color?.includes('radial-gradient') || 
               settings.background_color?.includes('repeating-linear-gradient')) {
      return {
        backgroundImage: settings.background_color || 'linear-gradient(135deg, #f8f9fa 0%, #f8f9fa 100%)'
      };
    } else {
      return {
        backgroundColor: settings.background_color || '#f8f9fa'
      };
    }
  };

  // Style for card container (full pattern for patterns, same as page for gradients)
  const getCardContainerStyle = () => {
    if (backgroundOption?.isPattern) {
      return {
        backgroundColor: backgroundOption.backgroundColor,
        backgroundImage: settings.background_color,
        backgroundSize: backgroundOption.backgroundSize || 'auto'
      };
    } else if (settings.background_color?.includes('linear-gradient') || 
               settings.background_color?.includes('radial-gradient') || 
               settings.background_color?.includes('repeating-linear-gradient')) {
      return {
        backgroundImage: settings.background_color || 'linear-gradient(135deg, #f8f9fa 0%, #f8f9fa 100%)'
      };
    } else {
      return {
        backgroundColor: settings.background_color || '#f8f9fa'
      };
    }
  };

  return (
    <div 
      className="min-h-screen" 
      style={getPageBackgroundStyle()}
    >
      <div className="flex justify-center items-start py-10 min-h-screen">
        <div 
          className="w-full sm:w-full md:max-w-2xl md:rounded-2xl md:shadow-lg md:p-0"
          style={getCardContainerStyle()}
        >
          <div className="max-w-3xl mx-auto px-0 py-0 h-full">
            <PrysmaCard 
              profile={profile} 
              user={null}
              cardSections={regularSections}
              socialBarSections={socialBarSections}
              isPublicView={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 