import React from 'react';

export default function PrysmaIcon({ size = 16, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 3D Tetrahedron/Pyramid */}
      <defs>
        <linearGradient id="prysmaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#374151', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Main pyramid shape */}
      <path 
        d="M12 2L22 18H2L12 2Z" 
        fill="url(#prysmaGradient)"
        stroke="#6b7280"
        strokeWidth="0.5"
      />
      
      {/* Highlight for 3D effect */}
      <path 
        d="M12 2L8 14H16L12 2Z" 
        fill="rgba(255,255,255,0.1)"
        stroke="none"
      />
      
      {/* Edge highlights */}
      <path 
        d="M12 2L22 18" 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="0.5"
        fill="none"
      />
      <path 
        d="M12 2L2 18" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
} 