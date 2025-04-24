'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../src/components/SessionProvider';

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    bio: '',
    skills: '',
    location: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          // Set default values for fields that might be null
          setProfile({
            name: data.name || '',
            headline: data.headline || '',
            bio: data.bio || '',
            skills: data.skills || '',
            location: data.location || '',
            website: data.website || '',
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          skills: profile.skills,
          location: profile.location,
          website: profile.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Redirect to login if no user is found
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [sessionLoading, user, router]);

  // Show loading state while checking session
  if (sessionLoading || loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Profile Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="headline" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            value={profile.headline}
            onChange={handleChange}
            placeholder="e.g., Full Stack Developer"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="skills" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Skills
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Separate skills with commas
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
            placeholder="e.g., Amsterdam, Netherlands"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="website" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={profile.website}
            onChange={handleChange}
            placeholder="e.g., https://yourwebsite.com"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {updating ? 'Saving...' : 'Save Profile'}
        </button>

        {message && <p style={{ color: 'green', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}
      </form>

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