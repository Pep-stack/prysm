"use client";
import { useDesignSettings } from '../../../components/dashboard/DesignSettingsContext';
import PrysmaCard from '../../../src/components/card/PrysmaCard';

export default function PublicProfilePageContent({ profile, cardSections }) {
  const { settings } = useDesignSettings();
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: settings.background_color || '#f8f9fa' }}>
      <div className="max-w-xl mx-auto">
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