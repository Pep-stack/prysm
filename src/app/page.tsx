import React from 'react';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>
        <a href="/login" style={{ 
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Go to Login</a>
      </p>
    </div>
  )
} 