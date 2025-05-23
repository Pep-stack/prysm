'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { useProfileEditor } from '../../../src/hooks/useProfileEditor';
import { LuUser, LuImage, LuImagePlus, LuSave, LuArrowLeft, LuSettings, LuMonitor } from 'react-icons/lu';
import { useFileUpload } from '../../../src/hooks/useFileUpload';
import { supabase } from '../../../src/lib/supabase';

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
    handleAvatarUploadSuccess
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

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  // Sync settings with profile data
  useEffect(() => {
    if (profile) {
      setDisplayType(profile.display_type || 'avatar');
      setAvatarSize(profile.avatar_size || 'medium');
      setAvatarShape(profile.avatar_shape || 'circle');
      setAvatarPosition(profile.avatar_position || 'left');
    }
  }, [profile]);

  // Avatar upload handler
  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    
    setUploadingAvatar(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
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

  // Header upload handler
  const handleHeaderUpload = async () => {
    if (!headerFile || !user) return;
    
    setUploadingHeader(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileExt = headerFile.name.split('.').pop();
      const fileName = `${user.id}-header-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, headerFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          header_url: urlData.publicUrl,
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

  // Save display settings
  const handleSaveDisplaySettings = async () => {
    if (!user) return;

    setSavingSettings(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_type: displayType,
          avatar_size: avatarSize,
          avatar_shape: avatarShape,
          avatar_position: avatarPosition,
          updated_at: new Date().toISOString()
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

  // Remove header image function
  const handleRemoveHeaderImage = async () => {
    if (!user) return;

    setUploadingHeader(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          header_url: null,
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
                  value={profile.name || ''}
                  onChange={handleChange}
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
                  value={profile.headline || ''}
                  onChange={handleChange}
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
                  value={profile.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(profile.bio || '').length}/200 characters
                </p>
              </div>

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
                    displayType === 'avatar' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="displayType"
                      value="avatar"
                      checked={displayType === 'avatar'}
                      onChange={(e) => setDisplayType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <LuUser className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900">Avatar</h3>
                      <p className="text-xs text-gray-500 mt-1">Small circular profile photo</p>
                    </div>
                    {displayType === 'avatar' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>

                  <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    displayType === 'header' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="displayType"
                      value="header"
                      checked={displayType === 'header'}
                      onChange={(e) => setDisplayType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-16 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <LuImage className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">Header Image</h3>
                      <p className="text-xs text-gray-500 mt-1">Large banner image</p>
                    </div>
                    {displayType === 'header' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <LuSave className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Avatar Settings (only show when avatar is selected) */}
              {displayType === 'avatar' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Avatar Settings</h3>
                  
                  {/* Avatar Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div className="flex gap-3">
                      {['small', 'medium', 'large'].map(size => (
                        <label key={size} className="flex items-center">
                          <input
                            type="radio"
                            name="avatarSize"
                            value={size}
                            checked={avatarSize === size}
                            onChange={(e) => setAvatarSize(e.target.value)}
                            className="mr-2 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm capitalize">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Shape */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                    <div className="flex gap-3">
                      {['circle', 'rounded', 'square'].map(shape => (
                        <label key={shape} className="flex items-center">
                          <input
                            type="radio"
                            name="avatarShape"
                            value={shape}
                            checked={avatarShape === shape}
                            onChange={(e) => setAvatarShape(e.target.value)}
                            className="mr-2 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm capitalize">{shape}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <div className="flex gap-3">
                      {['left', 'center', 'right'].map(position => (
                        <label key={position} className="flex items-center">
                          <input
                            type="radio"
                            name="avatarPosition"
                            value={position}
                            checked={avatarPosition === position}
                            onChange={(e) => setAvatarPosition(e.target.value)}
                            className="mr-2 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm capitalize">{position}</span>
                        </label>
                      ))}
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

        {/* Photo Upload Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <LuImagePlus className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Upload Photos</h2>
            </div>
            
            <div className="space-y-6 sm:pl-8">
              {/* Avatar Upload */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Profile Avatar</h3>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={profile.avatar_url || 'https://via.placeholder.com/60x60?text=Avatar'} 
                      alt="Profile Avatar" 
                      className="w-15 h-15 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                      className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {avatarFile && (
                      <p className="text-sm text-gray-600 mb-2">
                        Selected: {avatarFile.name}
                      </p>
                    )}
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

              {/* Header Upload */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Header Image</h3>
                {profile.header_url && (
                  <div className="mb-4">
                    <img 
                      src={profile.header_url} 
                      alt="Header" 
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <div className="w-full h-24 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                      <p className="text-red-600 text-sm">Image failed to load</p>
                    </div>
                    <button
                      onClick={handleRemoveHeaderImage}
                      disabled={uploadingHeader}
                      className="mt-2 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingHeader ? 'Removing...' : 'Remove Header Image'}
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  id="header-upload"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => e.target.files?.[0] && setHeaderFile(e.target.files[0])}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {headerFile && (
                  <p className="text-sm text-gray-600 mb-2">
                    Selected: {headerFile.name}
                  </p>
                )}
                <button
                  onClick={handleHeaderUpload}
                  disabled={!headerFile || uploadingHeader}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuImagePlus className="w-4 h-4" />
                  {uploadingHeader ? 'Uploading...' : 'Upload Header'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 