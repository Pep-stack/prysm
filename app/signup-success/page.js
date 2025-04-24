'use client';

import React from 'react';

export default function SignupSuccessPage() {
  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h1 style={{ color: '#4CAF50', marginBottom: '15px' }}>Signup Successful!</h1>
      <p style={{ fontSize: '18px', marginBottom: '25px' }}>
        We&apos;ve sent a verification link to your email address. Please check your inbox (and spam folder!) and click the link to activate your account.
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