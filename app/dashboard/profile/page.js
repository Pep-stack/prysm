'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/auth/SessionProvider';
import ProfileAvatarUploader from '../../../src/components/profile/ProfileAvatarUploader';
import ProfileHeaderUploader from '../../../src/components/profile/ProfileHeaderUploader';
import ProfileDetailsForm from '../../../src/components/profile/ProfileDetailsForm';
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
      <div className="w-full max-w-[380px] mx-auto px-4 sm:max-w-lg">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] mx-auto px-4 sm:max-w-lg">
      <h1>Profile Settings</h1>
      
      <ProfileHeaderUploader
         user={user}
         currentHeaderUrl={profile.header_url}
         onUploadSuccess={handleHeaderUploadSuccess}
      />

      <ProfileAvatarUploader 
         user={user}
         currentAvatarUrl={profile.avatar_url}
         onUploadSuccess={handleAvatarUploadSuccess}
      />
      
      <h2>Profile Details</h2>
      <ProfileDetailsForm 
         profile={profile}
         onChange={handleChange}
         onSubmit={(e) => {
             e.preventDefault(); 
             saveProfileDetails();
         }}
         updating={updating}
         message={message}
         error={error}
      />

      <div style={{ marginTop: '40px' }}>
        <a
          href="/dashboard"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            color: '#0070f3',
            textDecoration: 'none',
          }}
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
} 