'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CARD_TYPES } from '../lib/sectionOptions';

export function useCardType(user) {
  const [cardType, setCardType] = useState(CARD_TYPES.PRO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load card type from profile
  useEffect(() => {
    const loadCardType = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('card_type')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading card type:', error);
          setError(error.message);
        } else if (data) {
          setCardType(data.card_type || CARD_TYPES.PRO);
        }
      } catch (err) {
        console.error('Error loading card type:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCardType();
  }, [user]);

  // Update card type
  const updateCardType = useCallback(async (newCardType) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          card_type: newCardType,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setCardType(newCardType);
    } catch (err) {
      console.error('Error updating card type:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    cardType,
    updateCardType,
    loading,
    error
  };
} 