'use client';

import React from 'react';

export default function SignupSuccessPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', padding: '30px', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1 style={{ color: '#4CAF50' }}>Registration Successful!</h1>
      
      <p style={{ fontSize: '18px', margin: '20px 0' }}>
        Thank you for signing up. Please check your email to verify your account.
      </p>
      
      <p style={{ marginTop: '30px' }}>
        Once verified, you can{' '}
        <a 
          href="/login" 
          style={{ 
            color: '#0070f3',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          log in to your account
        </a>.
      </p>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>Didn't receive the email? Check your spam folder or contact support.</p>
      </div>
    </div>
  );
} 