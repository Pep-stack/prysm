'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { useProfileEditor } from '../../../src/hooks/useProfileEditor';
import { LuUser, LuImage, LuImagePlus, LuSave, LuArrowLeft, LuSettings, LuMonitor, LuBriefcase, LuBuilding2 } from 'react-icons/lu';
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
  const [savingSettings, setSavingSettings] = useState(false);

  // Card type settings
  const [cardType, setCardType] = useState('pro');
  const [savingCardType, setSavingCardType] = useState(false);

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
  };

  // Sync cardDisplaySettings bij cardType of profile change
  useEffect(() => {
    setCardDisplaySettings(getCardDisplaySettings(cardType));
  }, [cardType, profile]);

  // Sync cardImages bij cardType of profile change
  useEffect(() => {
    setCardImages(getCardImages(cardType));
  }, [cardType, profile]);

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

  // Card type alleen bij eerste load/profile.card_type change uit profiel halen
  useEffect(() => {
    if (profile && profile.card_type) {
      setCardType(profile.card_type);
    }
  }, [profile?.card_type]);

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
      setUploadSuccess('Avatar updated successfully!');
      setAvatarFile(null);
      
      setTimeout(() => setUploadSuccess(null), 3000);
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

      setUploadSuccess('Header image updated successfully!');
      setHeaderFile(null);
      
      setTimeout(() => setUploadSuccess(null), 3000);
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

      setUploadSuccess('Header image removed successfully!');
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setUploadError(err.message || 'Failed to remove header image');
    } finally {
      setUploadingHeader(false);
    }
  };

  // Save display settings per card type
  const handleSaveDisplaySettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    setUploadError(null);
    setUploadSuccess(null);
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
      setUploadSuccess('Display settings updated successfully!');
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setUploadError(err.message || 'Failed to update display settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Save card type settings
  const handleSaveCardType = async () => {
    if (!user) return;

    setSavingCardType(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          card_type: cardType,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local profile state to reflect the change
      updateProfileField('card_type', cardType);

      setUploadSuccess('Card type updated successfully!');
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setUploadError(err.message || 'Failed to update card type');
    } finally {
      setSavingCardType(false);
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

        {/* Global Messages */}
        {(uploadSuccess || message) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">{uploadSuccess || message}</p>
          </div>
        )}
        
        {(uploadError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{uploadError || error}</p>
          </div>
        )}

        {/* Card Type Selection Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <LuSettings className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Card Type</h2>
            </div>
            
            <div className="space-y-6 sm:pl-8">
              {/* Card Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Your Card Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    cardType === 'pro' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="cardType"
                      value="pro"
                      checked={cardType === 'pro'}
                      onChange={(e) => setCardType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                        cardType === 'pro' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                          : 'bg-gray-100'
                      }`}>
                        <LuUser className={`w-8 h-8 ${
                          cardType === 'pro' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className="font-medium text-gray-900">Prysma Pro</h3>
                      <p className="text-xs text-gray-500 mt-1">Freelancers, creators, consultants</p>
                    </div>
                    {cardType === 'pro' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>

                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    cardType === 'career' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="cardType"
                      value="career"
                      checked={cardType === 'career'}
                      onChange={(e) => setCardType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                        cardType === 'career' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                          : 'bg-gray-100'
                      }`}>
                        <LuBriefcase className={`w-8 h-8 ${
                          cardType === 'career' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className="font-medium text-gray-900">Prysma Career</h3>
                      <p className="text-xs text-gray-500 mt-1">Job seekers, career changers, graduates</p>
                    </div>
                    {cardType === 'career' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>

                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    cardType === 'business' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="cardType"
                      value="business"
                      checked={cardType === 'business'}
                      onChange={(e) => setCardType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                        cardType === 'business' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                          : 'bg-gray-100'
                      }`}>
                        <LuBuilding2 className={`w-8 h-8 ${
                          cardType === 'business' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className="font-medium text-gray-900">Prysma Business</h3>
                      <p className="text-xs text-gray-500 mt-1">Companies, agencies, stores</p>
                    </div>
                    {cardType === 'business' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveCardType}
                  disabled={savingCardType}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuSave className="w-4 h-4" />
                  {savingCardType ? 'Saving...' : 'Save Card Type'}
                </button>
              </div>
            </div>
          </div>
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

              {/* Extra profielvelden per card type */}
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

              {(cardType === 'pro' || cardType === 'business') && (
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
              )}

              {cardType === 'career' && (
                <div>
                  <label htmlFor="desired_role" className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Role
                  </label>
                  <input
                    type="text"
                    id="desired_role"
                    name="desired_role"
                    value={cardProfile.desired_role || ''}
                    onChange={handleCardProfileChange}
                    placeholder="e.g., Frontend Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={60}
                  />
                </div>
              )}

              {cardType === 'business' && (
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={cardProfile.industry || ''}
                    onChange={handleCardProfileChange}
                    placeholder="e.g., Marketing, SaaS, Retail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={60}
                  />
                </div>
              )}

              {cardType === 'business' && (
                <div>
                  <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size
                  </label>
                  <input
                    type="text"
                    id="company_size"
                    name="company_size"
                    value={cardProfile.company_size || ''}
                    onChange={handleCardProfileChange}
                    placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={30}
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => saveProfileDetails()}
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuSave className="w-4 h-4" />
                  {updating ? 'Saving...' : 'Save Profile'}
                </button>
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
              <div className="pt-2">
                <button
                  onClick={handleSaveDisplaySettings}
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuSave className="w-4 h-4" />
                  {savingSettings ? 'Saving...' : 'Save Display Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 