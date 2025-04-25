'use client';

import React from 'react';
import Link from 'next/link';
import { colors, typography, commonStyles } from '../../lib/landingStyles';

export default function StickyNavBar() {
 return (
  <nav style={{
    position: 'sticky', 
    top: 0, 
    backgroundColor: colors.white, 
    zIndex: 100, 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
    padding: '15px 20px',
    fontFamily: typography.fontFamily,
  }}>
    <div style={{...commonStyles.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontWeight: 'bold', color: colors.darkGrey}}>Prysma Logo</div> {/* Placeholder Logo */} 
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <Link href="#about" style={{color: colors.darkGrey, textDecoration: 'none'}}>About</Link>
        <Link href="#features" style={{color: colors.darkGrey, textDecoration: 'none'}}>Features</Link>
        <Link href="#pricing" style={{color: colors.darkGrey, textDecoration: 'none'}}>Pricing</Link>
        <Link href="#support" style={{color: colors.darkGrey, textDecoration: 'none'}}>Support</Link>
        <Link href="/signup"> {/* Link to signup page */} 
          <button style={{...commonStyles.button, ...commonStyles.primaryButton}}>Create Your Card</button>
        </Link>
      </div>
    </div>
  </nav>
 );
}; 