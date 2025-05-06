import React, { useEffect, useState } from 'react';
import PrysmaCard from './PrysmaCard';
import { supabase } from '@/lib/supabase';

export default function PrysmaCardContainer({ profile, user, onSaveLanguages }) {
  const displayUserId = user?.id || profile?.id;
  const [cardSections, setCardSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Secties ophalen uit Supabase
  async function fetchSections() {
    setLoading(true);
    const { data, error } = await supabase
      .from('card_sections')
      .select('sections')
      .eq('user_id', displayUserId)
      .single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Fout bij ophalen secties:', error);
    }
    setCardSections(data?.sections || []);
    setLoading(false);
  }

  useEffect(() => {
    if (displayUserId) {
      fetchSections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayUserId]);

  // Functie om een sectie toe te voegen en op te slaan
  async function handleAddSection(newSection) {
    const updatedSections = [...cardSections, newSection];
    const { error } = await supabase
      .from('card_sections')
      .upsert([
        {
          user_id: displayUserId,
          sections: updatedSections,
        },
      ]);
    if (error) {
      console.error('Fout bij opslaan secties:', error);
    } else {
      fetchSections(); // Refresh na toevoegen
    }
  }

  if (loading) return <div>Loading...</div>;

  // Log de daadwerkelijk uit Supabase opgehaalde secties
  console.log('Card sections uit Supabase:', cardSections);

  return (
    <PrysmaCard
      profile={profile}
      user={user}
      cardSections={cardSections}
      onSaveLanguages={onSaveLanguages}
      onAddSection={handleAddSection}
    />
  );
} 