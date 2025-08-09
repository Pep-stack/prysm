'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { useProfileEditor } from '../../../src/hooks/useProfileEditor';
import { LuUser, LuImage, LuImagePlus, LuSave, LuArrowLeft, LuSettings, LuMonitor, LuBriefcase, LuBuilding2, LuCheck, LuX, LuPause, LuClock } from 'react-icons/lu';
import SizeSlider from '../../../src/components/shared/SizeSlider';
import { useFileUpload } from '../../../src/hooks/useFileUpload';
import { supabase } from '../../../src/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultSectionProps, CARD_TYPES } from '../../../src/lib/sectionOptions';

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();

  const {
    profile,
    loading,
    updating,
    error,
    message,
    handleChange,
    saveProfileDetails,
    handleAvatarUploadSuccess,
    updateProfileField
  } = useProfileEditor(user);

  // File upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [headerFile, setHeaderFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Profile display settings
  const [displayType, setDisplayType] = useState('avatar');
  const [avatarSize, setAvatarSize] = useState('medium');
  const [avatarShape, setAvatarShape] = useState('circle');
  const [avatarPosition, setAvatarPosition] = useState('left');
  
  // Auto-save tracking
  const hasInitialLoad = useRef(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Card type is now always 'pro' - no longer configurable
  const cardType = 'pro';

  // Card display settings per card type
  const getCardDisplaySettings = (type) => {
    const settings = profile.card_display_settings?.[type] || {
      display_type: 'avatar',
      avatar_size: 'medium',
      avatar_shape: 'circle',
      avatar_position: 'left',
    };
    
    // Convert old 'header' type to 'avatar' for backward compatibility
    if (settings.display_type === 'header') {
      settings.display_type = 'avatar';
    }
    
    return settings;
  };

  // Helper function to get preview size based on avatar size setting (uitgebreid)
  const getPreviewSize = (avatarSize) => {
    switch (avatarSize) {
      case 'xs': return 'w-40 h-40'; // 160px
      case 'small': return 'w-48 h-48'; // 192px
      case 'medium': return 'w-56 h-56'; // 224px
      case 'large': return 'w-64 h-64'; // 256px
      case 'xl': return 'w-72 h-72'; // 288px
      case 'xxl': return 'w-80 h-80'; // 320px
      default: return 'w-56 h-56'; // 224px (medium fallback)
    }
  };
  const [cardDisplaySettings, setCardDisplaySettings] = useState(getCardDisplaySettings(cardType));

  // Card images per card type
  const getCardImages = (type) => profile.card_images?.[type] || { avatar_url: '', header_url: '' };
  const [cardImages, setCardImages] = useState(getCardImages(cardType));

  // Helper om de juiste card_profiles subobject te krijgen
  const getCardProfile = (type) => profile.card_profiles?.[type] || {};
  const cardProfile = getCardProfile(cardType);

  // Helper om een veld in card_profiles te updaten
  const handleCardProfileChange = (e) => {
    const { name, value } = e.target;
    const updatedProfiles = {
      ...profile.card_profiles,
      [cardType]: {
        ...getCardProfile(cardType),
        [name]: value,
      },
    };
    updateProfileField('card_profiles', updatedProfiles);
    console.log('🔄 PROFILE-FORM: Field changed', { field: name, value, cardType });
  };

  // Auto-save function for profile information
  const autoSaveProfile = useCallback(async () => {
    console.log('🔥 AUTO-SAVE-PROFILE: Starting profile auto-save', { 
      hasUser: !!user,
      isCurrentlySaving: isAutoSaving,
      cardType
    });
    
    if (!user || isAutoSaving || updating) {
      console.log('🚫 AUTO-SAVE-PROFILE: Save blocked', {
        reason: !user ? 'no user' : isAutoSaving ? 'already auto-saving' : 'manual save in progress'
      });
      return;
    }
    
    setIsAutoSaving(true);
    try {
      // Call the save function but suppress user-visible messages
      const profileUpdates = {
        card_profiles: profile.card_profiles,
        card_images: profile.card_images,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      console.log('✅ AUTO-SAVE-PROFILE: Profile auto-save completed');
    } catch (error) {
      console.error('❌ AUTO-SAVE-PROFILE: Auto-save failed', error);
    } finally {
      setTimeout(() => {
        setIsAutoSaving(false);
      }, 1000);
    }
  }, [user, isAutoSaving, updating, profile.card_profiles, profile.card_images]);

  // Auto-save function for display settings  
  const autoSaveDisplaySettings = useCallback(async () => {
    console.log('🔥 AUTO-SAVE-DISPLAY: Starting display settings auto-save', { 
      hasUser: !!user,
      isCurrentlySaving: isAutoSaving,
      cardType,
      settings: cardDisplaySettings
    });
    
    if (!user || isAutoSaving) {
      console.log('🚫 AUTO-SAVE-DISPLAY: Save blocked', {
        reason: !user ? 'no user' : 'already auto-saving'
      });
      return;
    }
    
    setIsAutoSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          card_display_settings: {
            ...profile.card_display_settings,
            [cardType]: cardDisplaySettings,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      console.log('✅ AUTO-SAVE-DISPLAY: Display settings auto-save completed');
    } catch (error) {
      console.error('❌ AUTO-SAVE-DISPLAY: Auto-save failed', error);
    } finally {
      setTimeout(() => {
        setIsAutoSaving(false);
      }, 1000);
    }
  }, [user, isAutoSaving, cardDisplaySettings, profile.card_display_settings, cardType]);

  // Sync cardDisplaySettings bij cardType of profile change
  useEffect(() => {
    setCardDisplaySettings(getCardDisplaySettings(cardType));
  }, [cardType, profile]);

  // Sync cardImages bij cardType of profile change
  useEffect(() => {
    setCardImages(getCardImages(cardType));
  }, [cardType, profile]);

  // Effect to track initial load completion
  useEffect(() => {
    if (profile && !loading) {
      hasInitialLoad.current = true;
      console.log('🎯 PROFILE-INITIAL-LOAD: Profile load completed, auto-save enabled', {
        hasProfile: !!profile,
        profileId: profile.id,
        cardType
      });
    }
  }, [profile, loading, cardType]);

  // Auto-save effect for profile information changes
  useEffect(() => {
    if (!user || !hasInitialLoad.current || !profile.card_profiles?.[cardType]) {
      console.log('🚫 AUTO-SAVE-PROFILE-TRIGGER: Blocked', {
        hasUser: !!user,
        hasCompletedInitialLoad: hasInitialLoad.current,
        hasCardProfile: !!profile.card_profiles?.[cardType],
        reason: !user ? 'no user' : !hasInitialLoad.current ? 'initial load not completed' : 'no card profile'
      });
      return;
    }

    console.log('🔄 AUTO-SAVE-PROFILE-TRIGGER: Profile fields changed, scheduling auto-save', {
      cardProfile: profile.card_profiles[cardType],
      cardType
    });

    const timeoutId = setTimeout(() => {
      autoSaveProfile();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [profile.card_profiles, cardType, user, autoSaveProfile]);

  // Auto-save effect for display settings changes
  useEffect(() => {
    if (!user || !hasInitialLoad.current) {
      console.log('🚫 AUTO-SAVE-DISPLAY-TRIGGER: Blocked', {
        hasUser: !!user,
        hasCompletedInitialLoad: hasInitialLoad.current,
        reason: !user ? 'no user' : 'initial load not completed'
      });
      return;
    }

    console.log('🔄 AUTO-SAVE-DISPLAY-TRIGGER: Display settings changed, scheduling auto-save', {
      cardDisplaySettings,
      cardType
    });

    const timeoutId = setTimeout(() => {
      autoSaveDisplaySettings();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cardDisplaySettings, cardType, user, autoSaveDisplaySettings]);

  // Handler voor wijzigen van display settings
  const handleCardDisplaySettingChange = (field, value) => {
    // Zet camelCase om naar snake_case indien nodig
    const fieldMap = {
      displayType: 'display_type',
      avatarSize: 'avatar_size',
      avatarShape: 'avatar_shape',
      avatarPosition: 'avatar_position',
    };
    const snakeField = fieldMap[field] || field;
    const updatedSettings = {
      ...cardDisplaySettings,
      [snakeField]: value,
    };
    setCardDisplaySettings(updatedSettings);
    // Update in profile state direct
    updateProfileField('card_display_settings', {
      ...profile.card_display_settings,
      [cardType]: updatedSettings,
    });
    console.log('🔄 DISPLAY-SETTINGS: Setting changed', { field: snakeField, value, cardType });
  };

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  // Sync display settings with profile data (zonder cardType)
  useEffect(() => {
    if (profile) {
      setDisplayType(profile.display_type || 'avatar');
      setAvatarSize(profile.avatar_size || 'medium');
      setAvatarShape(profile.avatar_shape || 'circle');
      setAvatarPosition(profile.avatar_position || 'left');
    }
  }, [profile]);

  // Card type is always 'pro' now - no syncing needed

  // Avatar upload handler per card type
  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    
    setUploadingAvatar(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${cardType}-avatar-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update card_images in profile state
      const updatedImages = {
        ...profile.card_images,
        [cardType]: {
          ...getCardImages(cardType),
          avatar_url: urlData.publicUrl,
        },
      };
      updateProfileField('card_images', updatedImages);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          card_images: updatedImages,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      handleAvatarUploadSuccess(urlData.publicUrl);
      setAvatarFile(null);
      console.log('✅ AVATAR-UPLOAD: Avatar updated successfully');
    } catch (err) {
      setUploadError(err.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Header upload handler per card type
  const handleHeaderUpload = async () => {
    if (!headerFile || !user) return;
    
    setUploadingHeader(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileExt = headerFile.name.split('.').pop();
      const fileName = `${user.id}-${cardType}-header-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, headerFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update card_images in profile state
      const updatedImages = {
        ...profile.card_images,
        [cardType]: {
          ...getCardImages(cardType),
          header_url: urlData.publicUrl,
        },
      };
      updateProfileField('card_images', updatedImages);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          card_images: updatedImages,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setHeaderFile(null);
      console.log('✅ HEADER-UPLOAD: Header image updated successfully');
    } catch (err) {
      setUploadError(err.message || 'Failed to upload header image');
    } finally {
      setUploadingHeader(false);
    }
  };

  // Remove header image per card type
  const handleRemoveHeaderImage = async () => {
    if (!user) return;

    setUploadingHeader(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const updatedImages = {
        ...profile.card_images,
        [cardType]: {
          ...getCardImages(cardType),
          header_url: '',
        },
      };
      updateProfileField('card_images', updatedImages);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          card_images: updatedImages,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      console.log('✅ HEADER-REMOVE: Header image removed successfully');
    } catch (err) {
      setUploadError(err.message || 'Failed to remove header image');
    } finally {
      setUploadingHeader(false);
    }
  };





  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
        <div className="w-full sm:w-[300px] md:w-[500px] lg:w-[600px]">
          <h1 className="text-xl font-semibold text-black">Profile Settings</h1>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
      <div className="w-full sm:w-[300px] md:w-[500px] lg:w-[600px] space-y-6 pb-16 md:pb-0">






        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <LuUser className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Profile Information</h2>
            </div>
            
            <div className="space-y-4 sm:pl-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cardProfile.name || ''}
                  onChange={handleCardProfileChange}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={40}
                  required
                />
              </div>

              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={cardProfile.headline || ''}
                  onChange={handleCardProfileChange}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={60}
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={cardProfile.bio || ''}
                  onChange={handleCardProfileChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(cardProfile.bio || '').length}/200 characters
                </p>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={cardProfile.location || ''}
                  onChange={handleCardProfileChange}
                  placeholder="e.g., Amsterdam, NL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={60}
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={cardProfile.website || ''}
                  onChange={handleCardProfileChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copy and paste your full website link (including https://)
                </p>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={cardProfile.age || ''}
                  onChange={handleCardProfileChange}
                  placeholder="25"
                  min="13"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your age will be shown on your card
                </p>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={cardProfile.timezone || ''}
                  onChange={handleCardProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select your timezone</option>
                  <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                  <option value="CET (UTC+1)">CET (UTC+1)</option>
                  <option value="CEST (UTC+2)">CEST (UTC+2)</option>
                  <option value="EST (UTC-5)">EST (UTC-5)</option>
                  <option value="EDT (UTC-4)">EDT (UTC-4)</option>
                  <option value="CST (UTC-6)">CST (UTC-6)</option>
                  <option value="PST (UTC-8)">PST (UTC-8)</option>
                  <option value="PDT (UTC-7)">PDT (UTC-7)</option>
                  <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                  <option value="CST (UTC+8)">CST Asia (UTC+8)</option>
                  <option value="JST (UTC+9)">JST (UTC+9)</option>
                  <option value="AEST (UTC+10)">AEST (UTC+10)</option>
                  <option value="BRT (UTC-3)">BRT (UTC-3)</option>
                  <option value="WAT (UTC+1)">WAT (UTC+1)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Your timezone for remote work coordination
                </p>
              </div>

              <div>
                <label htmlFor="current_role" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Role & Company
                </label>
                <input
                  type="text"
                  id="current_role"
                  name="current_role"
                  value={cardProfile.current_role || ''}
                  onChange={handleCardProfileChange}
                  placeholder="Senior Developer at TechCorp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your current position and company
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={cardProfile.phone || ''}
                  onChange={handleCardProfileChange}
                  placeholder="+31 6 12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your phone number will be clickable on your card
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={cardProfile.email || ''}
                  onChange={handleCardProfileChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your email will be clickable on your card
                </p>
              </div>

              {/* Availability Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCardProfileChange({
                      target: {
                        name: 'show_availability',
                        value: !cardProfile.show_availability
                      }
                    })}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      cardProfile.show_availability 
                        ? 'bg-emerald-600 text-black border-emerald-600 hover:bg-emerald-700 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {cardProfile.show_availability ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                {cardProfile.show_availability && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'available', label: 'Open for work', icon: LuCheck, color: '#059669', bgColor: '#d1fae5' },
                      { value: 'busy', label: 'Busy', icon: LuPause, color: '#d97706', bgColor: '#fef3c7' },
                      { value: 'limited', label: 'Selective', icon: LuClock, color: '#0284c7', bgColor: '#dbeafe' },
                      { value: 'unavailable', label: 'Not available', icon: LuX, color: '#dc2626', bgColor: '#fee2e2' }
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = cardProfile.availability_status === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="availability_status"
                            value={option.value}
                            checked={isSelected}
                            onChange={handleCardProfileChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: option.color }}
                            >
                              <Icon size={16} style={{ color: 'white' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm">
                                {option.label}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {option.value === 'available' && 'Ready for new opportunities'}
                                {option.value === 'busy' && 'Limited availability'}
                                {option.value === 'limited' && 'Open for specific projects'}
                                {option.value === 'unavailable' && 'Not taking new work'}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Display Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6 text-gray-700">
              <LuMonitor className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Profile Display</h2>
            </div>
            
            <div className="space-y-8 sm:pl-8">
              {/* Avatar Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Choose Avatar Style
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {/* Square Avatar Option */}
                  <label className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    cardDisplaySettings.display_type === 'avatar' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="displayType"
                      value="avatar"
                      checked={cardDisplaySettings.display_type === 'avatar'}
                      onChange={() => handleCardDisplaySettingChange('displayType', 'avatar')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <LuUser className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Square Avatar</h3>
                      <p className="text-xs text-gray-500 mt-1">Rounded corners, modern look</p>
                    </div>
                    {cardDisplaySettings.display_type === 'avatar' && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                        <LuCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </label>

                  {/* Round Avatar Option */}
                  <label className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    cardDisplaySettings.display_type === 'round_avatar' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="displayType"
                      value="round_avatar"
                      checked={cardDisplaySettings.display_type === 'round_avatar'}
                      onChange={() => handleCardDisplaySettingChange('displayType', 'round_avatar')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <LuUser className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Round Avatar</h3>
                      <p className="text-xs text-gray-500 mt-1">Perfect circle, classic style</p>
                    </div>
                    {cardDisplaySettings.display_type === 'round_avatar' && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                        <LuCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Avatar Upload Section - shows for both avatar types */}
              {(cardDisplaySettings.display_type === 'avatar' || cardDisplaySettings.display_type === 'round_avatar') && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        {cardDisplaySettings.display_type === 'avatar' ? 'Square Avatar' : 'Round Avatar'}
                      </h3>
                      
                      {/* Avatar Preview */}
                      <div className="flex justify-center mb-6">
                        <img 
                          src={cardImages.avatar_url || 'https://via.placeholder.com/220x220?text=Avatar'} 
                          alt="Profile Avatar" 
                          className={`${getPreviewSize(cardDisplaySettings.avatar_size)} object-cover border-4 border-white shadow-xl transition-all duration-300 ${
                            cardDisplaySettings.display_type === 'round_avatar' ? 'rounded-full' : 'rounded-3xl'
                          }`}
                        />
                      </div>

                      {/* Avatar Size Slider */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-900 mb-4 text-center">
                          Avatar Size
                        </label>
                        <SizeSlider
                          value={cardDisplaySettings.avatar_size || 'medium'}
                          onChange={(newSize) => handleCardDisplaySettingChange('avatarSize', newSize)}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    </div>

                    {/* Upload Controls */}
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center w-full h-12 px-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors duration-200">
                          <LuImagePlus className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-600">
                            {avatarFile ? avatarFile.name : 'Choose file'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleAvatarUpload}
                        disabled={!avatarFile || uploadingAvatar}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {uploadingAvatar ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploaden...
                          </>
                        ) : (
                          <>
                            <LuImagePlus className="w-4 h-4" />
                            Upload Avatar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 