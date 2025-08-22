"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAutomaticColors } from '../../lib/themeSystem';

export const DesignSettingsContext = createContext({ 
  settings: {}, 
  setSettings: (_:any) => {},
  isLoading: false,
  updateThemeColors: (_:string) => {}
});

export function DesignSettingsProvider({ initial, children }) {
  // Ensure initial is not null/undefined
  const safeInitial = initial || {};
  
  // Get automatic colors for initial background
  const initialBackground = safeInitial.background_color || '#ffffff';
  const automaticColors = getAutomaticColors(initialBackground);
  
  const [settings, setSettings] = useState({
    background_color: initialBackground,
    font_family: safeInitial.font_family || 'Inter, sans-serif',
    text_color: automaticColors.text_color,
    icon_color: automaticColors.icon_color,
    social_bar_position: safeInitial.social_bar_position || 'top',
    name_size: safeInitial.name_size || 'small',
    ...safeInitial
  });

  const [isLoading, setIsLoading] = useState(true);

  // Laad de settings uit de database wanneer de component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (safeInitial?.id) {
        console.log('🔄 CONTEXT: Loading settings from database for user:', safeInitial.id);
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('font_family, background_color, text_color, icon_color, social_bar_position, name_size')
            .eq('id', safeInitial.id)
            .single();

          if (error) {
            console.error('❌ CONTEXT: Error loading settings:', error);
            console.error('User ID:', safeInitial?.id);
            console.error('Error details:', JSON.stringify(error, null, 2));
            // Fallback naar initial prop
            setSettings({
              background_color: safeInitial.background_color || '#f8f9fa',
              font_family: safeInitial.font_family || 'Inter, sans-serif',
              text_color: safeInitial.text_color || '#000000',
              icon_color: safeInitial.icon_color || 'auto',
              social_bar_position: safeInitial.social_bar_position || 'top',
              name_size: safeInitial.name_size || 'small',
              ...safeInitial
            });
          } else if (data) {
            console.log('✅ CONTEXT: Successfully loaded settings:', data);
            setSettings(data);
          }
        } catch (error) {
          console.error('❌ CONTEXT: Exception loading settings:', error);
          console.error('User:', safeInitial);
          // Set fallback settings on exception
          setSettings({
            background_color: '#ffffff',
            font_family: 'Inter, sans-serif',
            text_color: '#000000',
            icon_color: 'auto',
            social_bar_position: 'top',
            name_size: 'small'
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('⚠️ CONTEXT: No initial ID provided, using defaults');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [safeInitial?.id]);

  // Function to update theme colors automatically when background changes
  const updateThemeColors = (newBackgroundColor) => {
    const automaticColors = getAutomaticColors(newBackgroundColor);
    setSettings(prev => ({
      ...prev,
      background_color: newBackgroundColor,
      text_color: automaticColors.text_color,
      icon_color: automaticColors.icon_color
    }));
  };

  return (
    <DesignSettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      isLoading, 
      updateThemeColors 
    }}>
      {children}
    </DesignSettingsContext.Provider>
  );
}

export function useDesignSettings() {
  const context = useContext(DesignSettingsContext);
  
  // If no provider is found, return default values
  if (!context || Object.keys(context).length === 0) {
    console.warn('useDesignSettings called outside of DesignSettingsProvider, returning defaults');
    return {
      settings: {
        background_color: '#ffffff',
        font_family: 'Inter, sans-serif',
        text_color: '#000000',
        icon_color: 'auto',
        social_bar_position: 'top',
        name_size: 'small'
      },
      setSettings: () => {},
      isLoading: false,
      updateThemeColors: () => {}
    };
  }
  
  return context;
} 