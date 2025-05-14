'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import ProfileAvatarUploader from '../../../src/components/profile/ProfileAvatarUploader';
import ProfileHeaderUploader from '../../../src/components/profile/ProfileHeaderUploader';
import { useProfileEditor } from '../../../src/hooks/useProfileEditor';

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
    handleHeaderUploadSuccess
  } = useProfileEditor(user);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2">
      <form
        className="bg-white rounded-2xl shadow-xl w-full max-w-md pb-8"
        style={{ overflow: 'hidden', position: 'relative' }}
        onSubmit={e => { e.preventDefault(); saveProfileDetails(); }}
      >
        {/* Header/banner */}
        <div className="relative w-full h-32 bg-gray-200">
          <ProfileHeaderUploader
            user={user}
            currentHeaderUrl={profile.header_url}
            onUploadSuccess={handleHeaderUploadSuccess}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Profielfoto overlapt header */}
          <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2">
            <ProfileAvatarUploader
              user={user}
              currentAvatarUrl={profile.avatar_url}
              onUploadSuccess={handleAvatarUploadSuccess}
              size={80}
              className="ring-4 ring-white rounded-full shadow"
            />
          </div>
        </div>
        {/* Spacer voor overlappende avatar */}
        <div style={{ height: 40 }} />
        {/* Naam, headline, bio */}
        <div className="px-6 flex flex-col items-center gap-2">
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            placeholder="Naam"
            className="text-xl font-bold text-center border-none bg-transparent focus:ring-0 focus:outline-none w-full"
            maxLength={40}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="headline"
            value={profile.headline || ''}
            onChange={handleChange}
            placeholder="Headline (optioneel)"
            className="text-base text-gray-500 text-center border-none bg-transparent focus:ring-0 focus:outline-none w-full"
            maxLength={60}
            autoComplete="off"
          />
          <textarea
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
            placeholder="Bio (optioneel)"
            className="mt-2 text-sm text-gray-700 text-center border-none bg-transparent focus:ring-0 focus:outline-none w-full resize-none"
            rows={3}
            maxLength={200}
            style={{ minHeight: 48 }}
          />
        </div>
        {/* Save button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={updating}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full px-6 py-2 shadow transition disabled:opacity-50"
          >
            {updating ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
        {/* Feedback */}
        {message && <p className="text-green-600 text-center mt-2">{message}</p>}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        {/* Terug-link */}
        <div className="flex justify-center mt-8">
          <a
            href="/dashboard"
            className="text-emerald-600 hover:underline text-sm"
          >
            ← Terug naar dashboard
          </a>
        </div>
      </form>
    </div>
  );
} 