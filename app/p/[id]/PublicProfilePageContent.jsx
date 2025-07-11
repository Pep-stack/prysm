"use client";
import { useDesignSettings } from '../../../src/components/dashboard/DesignSettingsContext';
import PrysmaCard from '../../../src/components/card/PrysmaCard';
import { getSectionsKey } from '../../../src/lib/sectionOptions';

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
  
  return (
    <div 
      className="min-h-screen" 
      style={{ 
        ...(settings.background_color?.includes('linear-gradient')
          ? { backgroundImage: settings.background_color || 'linear-gradient(135deg, #f8f9fa 0%, #f8f9fa 100%)' }
          : { backgroundColor: settings.background_color || '#f8f9fa' }
        )
      }}
    >
      <div className="flex justify-center items-start py-10 min-h-screen">
        <div
          className="w-full sm:w-full md:max-w-2xl md:rounded-2xl md:shadow-lg md:p-0"
          style={{ background: settings.background_color || '#fff' }}
        >
          <div className="max-w-3xl mx-auto px-0 py-0">
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