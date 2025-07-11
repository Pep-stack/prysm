'use client';

import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { LuTrash2, LuUpload } from 'react-icons/lu';

export default function ProfileAvatarUploader({ user, currentAvatarUrl, onUploadSuccess, onRemove }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState(null);
  const { isUploading, error, uploadFile, reset } = useFileUpload();
  const [hover, setHover] = useState(false);

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setMessage(null);
    }
  };

  // Function to handle the upload process
  const handleUpload = async () => {
    if (!avatarFile || !user) return;
    setMessage(null);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      await uploadFile(avatarFile, filePath);
      const { data: urlData } = await import('../../lib/supabase').then(m => m.supabase.storage.from('avatars').getPublicUrl(filePath));
      if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL for avatar.');
      const newAvatarUrl = urlData.publicUrl;
      const { error: updateError } = await import('../../lib/supabase').then(m => m.supabase.from('profiles').update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id));
      if (updateError) {
        await import('../../lib/supabase').then(m => m.supabase.storage.from('avatars').remove([filePath]));
        throw updateError;
      }
      onUploadSuccess(newAvatarUrl);
      setMessage('Avatar updated!');
      setAvatarFile(null);
    } catch (err) {
      setMessage(null);
    }
  };

  // Function to handle avatar removal
  const handleRemove = () => {
    if (onRemove) onRemove();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ width: 110, height: 110 }}
      >
        <img
          src={currentAvatarUrl || 'https://via.placeholder.com/150'}
          alt="Profile Avatar"
          className="w-[110px] h-[110px] rounded-full object-cover border-2 border-gray-200 shadow-sm"
        />
        {currentAvatarUrl && hover && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
            title="Remove avatar"
          >
            <LuTrash2 className="text-red-500" size={20} />
          </button>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-full">
            <LuUpload className="animate-spin text-[#00C896]" size={28} />
          </div>
        )}
      </div>
      <label className="text-xs text-[#00C896] hover:underline cursor-pointer mt-1">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        Choose new photo
      </label>
      {avatarFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-1 px-4 py-1.5 rounded-md bg-[#00C896] text-white text-sm font-medium shadow hover:bg-[#00A078] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      {message && <span className="text-xs text-green-600 mt-1">{message}</span>}
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
} 