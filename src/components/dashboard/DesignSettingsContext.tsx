"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const DesignSettingsContext = createContext({ 
  settings: {}, 
  setSettings: (_:any) => {},
  isLoading: false
});

export function DesignSettingsProvider({ initial, children }) {
  const [settings, setSettings] = useState({
    background_color: initial?.background_color || '#f8f9fa',
    font_family: initial?.font_family || 'Inter, sans-serif',
    text_color: initial?.text_color || '#000000',
    icon_color: initial?.icon_color || 'auto',
    social_bar_position: initial?.social_bar_position || 'top',
    ...initial
  });

  const [isLoading, setIsLoading] = useState(true);

  // Laad de settings uit de database wanneer de component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (initial?.id) {
        console.log('🔄 CONTEXT: Loading settings from database for user:', initial.id);
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('font_family, background_color, text_color, icon_color, social_bar_position')
            .eq('id', initial.id)
            .single();

          if (error) {
            console.error('❌ CONTEXT: Error loading settings:', error);
            // Fallback naar initial prop
            setSettings({
              background_color: initial?.background_color || '#f8f9fa',
              font_family: initial?.font_family || 'Inter, sans-serif',
              text_color: initial?.text_color || '#000000',
              icon_color: initial?.icon_color || 'auto',
              social_bar_position: initial?.social_bar_position || 'top',
              ...initial
            });
          } else if (data) {
            console.log('✅ CONTEXT: Successfully loaded settings:', data);
            setSettings(data);
          }
        } catch (error) {
          console.error('❌ CONTEXT: Exception loading settings:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('⚠️ CONTEXT: No initial ID provided, using defaults');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [initial?.id]);

  // VERWIJDERD: Automatische updates van initial prop om te voorkomen dat settings veranderen voordat save wordt gedrukt

  return (
    <DesignSettingsContext.Provider value={{ settings, setSettings, isLoading }}>
      {children}
    </DesignSettingsContext.Provider>
  );
}

export function useDesignSettings() {
  return useContext(DesignSettingsContext);
} 