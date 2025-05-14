"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

export const DesignSettingsContext = createContext({ settings: {}, setSettings: (_:any) => {} });

export function DesignSettingsProvider({ initial, children }) {
  const [settings, setSettings] = useState({
    avatar_size: initial?.avatar_size || 'medium',
    avatar_position: initial?.avatar_position || 'left',
    avatar_shape: initial?.avatar_shape || 'circle',
    ...initial
  });

  // Laad de settings uit de database wanneer de component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (initial?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('button_color, button_shape, font_family, icon_pack, avatar_size, avatar_position, avatar_shape')
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