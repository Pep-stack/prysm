"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

export const DesignSettingsContext = createContext({ settings: {}, setSettings: (_:any) => {} });

export function DesignSettingsProvider({ initial, children }) {
  const [settings, setSettings] = useState({
    background_color: initial?.background_color || '#f8f9fa',
    font_family: initial?.font_family || 'Inter, sans-serif',
    text_color: initial?.text_color || '#000000',
    icon_size: initial?.icon_size || '24px',
    icon_color: initial?.icon_color || 'auto',
    ...initial
  });

  // Laad de settings uit de database wanneer de component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (initial?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('font_family, background_color, text_color, icon_size, icon_color')
          .eq('id', initial.id)
          .single();

        if (!error && data) {
          setSettings(data);
        }
      }
    };

    loadSettings();
  }, [initial?.id]);

  return (
    <DesignSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </DesignSettingsContext.Provider>
  );
}

export function useDesignSettings() {
  return useContext(DesignSettingsContext);
} 