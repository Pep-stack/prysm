'use client';

import React from 'react';
import Link from 'next/link';
import { colors, commonStyles } from '../../lib/landingStyles';

export default function Footer() {
 return (
  <footer style={{backgroundColor: colors.darkGrey, color: colors.white, padding: '40px 20px', marginTop: '60px'}}>
     <div style={{...commonStyles.container, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px'}}>
        {/* Left Side */} 
        <div>
           <div style={{fontWeight: 'bold', fontSize: '24px', marginBottom: '10px'}}>Prysma Logo</div> {/* Placeholder */} 
           <p style={{fontSize: '14px', opacity: 0.8, marginBottom: '15px'}}>Made with structure and clarity</p>
           {/* Add link */} 
        </div>
        {/* Right Side */} 
        <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
           <div>
              <h4 style={{marginBottom: '10px', fontWeight: 'bold'}}>Quick Links</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', opacity: 0.9}}>
                 <li style={{marginBottom: '8px'}}><Link href="#features" style={{color: colors.white, textDecoration: 'none'}}>Features</Link></li>
                 <li style={{marginBottom: '8px'}}><Link href="#pricing" style={{color: colors.white, textDecoration: 'none'}}>Pricing</Link></li>
                 <li style={{marginBottom: '8px'}}><Link href="#support" style={{color: colors.white, textDecoration: 'none'}}>Support</Link></li>
                 <li style={{marginBottom: '8px'}}><Link href="/terms" style={{color: colors.white, textDecoration: 'none'}}>Terms</Link></li>
                 <li><Link href="/privacy" style={{color: colors.white, textDecoration: 'none'}}>Privacy</Link></li>
              </ul>
           </div>
           <div>
              <h4 style={{marginBottom: '10px', fontWeight: 'bold'}}>Stay Updated</h4>
              {/* Basic form - consider a proper form component */} 
              <input type="email" placeholder="Enter your email" style={{padding: '8px', borderRadius: '4px', border: 'none', marginRight: '5px'}}/>
              <button style={{...commonStyles.button, ...commonStyles.primaryButton, padding: '8px 15px', fontSize: '14px'}}>Sign Up</button>
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                 {/* Social Icons Placeholders - Replace with actual icons/links */} 
                 <a href="#" aria-label="Twitter" style={{color: colors.white}}>X</a> 
                 <a href="#" aria-label="YouTube" style={{color: colors.white}}>YT</a> 
                 <a href="mailto:info@prysma.com" aria-label="Email" style={{color: colors.white}}>Email</a> 
              </div>
           </div>
        </div>
     </div>
     <div style={{textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${colors.lightGrey}33`, fontSize: '12px', opacity: 0.7}}>
       &copy; Prysma {new Date().getFullYear()}
     </div>
  </footer>
 );
}; 