'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { useProfileEditor } from '../../../src/hooks/useProfileEditor';
import { LuUser, LuImage, LuImagePlus, LuSave, LuArrowLeft, LuSettings, LuMonitor, LuBriefcase, LuBuilding2, LuCheck, LuX, LuPause, LuClock } from 'react-icons/lu';
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
  const getCardDisplaySettings = (type) => profile.card_display_settings?.[type] || {
    display_type: 'avatar',
    avatar_size: 'medium',
    avatar_shape: 'circle',
    avatar_position: 'left',
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            type="button"
          >
            <LuArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-black">Profile Settings</h1>
        </div>





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
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <LuMonitor className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Profile Display</h2>
            </div>
            <div className="space-y-6 sm:pl-8">
              {/* Display Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Display Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    cardDisplaySettings.display_type === 'avatar' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
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
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <LuUser className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900">Avatar</h3>
                      <p className="text-xs text-gray-500 mt-1">Small circular profile photo</p>
                    </div>
                    {cardDisplaySettings.display_type === 'avatar' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    cardDisplaySettings.display_type === 'header' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="displayType"
                      value="header"
                      checked={cardDisplaySettings.display_type === 'header'}
                      onChange={() => handleCardDisplaySettingChange('displayType', 'header')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-16 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <LuImage className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">Header Image</h3>
                      <p className="text-xs text-gray-500 mt-1">Large banner image</p>
                    </div>
                    {cardDisplaySettings.display_type === 'header' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </div>
              {/* Avatar Settings (alleen tonen als avatar geselecteerd is) */}
              {cardDisplaySettings.display_type === 'avatar' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Avatar</h3>
                  {/* Preview + upload */}
                  <div className="flex flex-col items-center gap-4 mb-2">
                    <img 
                      src={cardImages.avatar_url || 'https://via.placeholder.com/220x220?text=Avatar'} 
                      alt="Profile Avatar" 
                      style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: 24, border: 'none', display: 'block' }}
                    />
                    <div className="flex flex-col gap-2 w-full items-center">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      <button
                        onClick={handleAvatarUpload}
                        disabled={!avatarFile || uploadingAvatar}
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LuImagePlus className="w-4 h-4" />
                        {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Header Settings (alleen tonen als header geselecteerd is) */}
              {cardDisplaySettings.display_type === 'header' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Header Image</h3>
                  {/* Preview + upload/delete */}
                  <div className="flex items-center gap-4 mb-2">
                    {cardImages.header_url ? (
                      <img 
                        src={cardImages.header_url} 
                        alt="Header" 
                        className="w-40 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-40 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
                        No header image
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        id="header-upload"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => e.target.files?.[0] && setHeaderFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleHeaderUpload}
                          disabled={!headerFile || uploadingHeader}
                          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LuImagePlus className="w-4 h-4" />
                          {uploadingHeader ? 'Uploading...' : 'Upload Header'}
                        </button>
                        {cardImages.header_url && (
                          <button
                            onClick={handleRemoveHeaderImage}
                            disabled={uploadingHeader}
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove Header Image
                          </button>
                        )}
                      </div>
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