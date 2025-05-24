"use client";
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';
import PrysmaCard from '../../../src/components/card/PrysmaCard';

export default function PublicProfilePageContent({ profile, cardSections }) {
  const { settings } = useDesignSettings();
  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.background_color || '#f8f9fa' }}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PrysmaCard 
          profile={profile} 
          user={null}
          cardSections={cardSections} 
          isPublicView={true}
        />
      </div>
    </div>
  );
} 