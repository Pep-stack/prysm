'use client';

import React from 'react';

export default function ProfileDetailsForm({ 
  profile, 
  onChange, 
  onSubmit, 
  updating, 
  message, 
  error 
}) {
  return (
    <form onSubmit={onSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={profile.name}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          opacity: updating ? 0.5 : 1,
        }}
      >
        {updating ? 'Saving...' : 'Save Profile Details'}
      </button>

      {message && <p style={{ color: 'green', marginTop: '20px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}
    </form>
  );
} 