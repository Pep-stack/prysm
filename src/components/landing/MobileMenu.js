import React from 'react';
import Link from 'next/link';
import { colors } from '../../lib/landingStyles'; // Importeer alleen wat nodig is

// Ontvang stijlen en functies als props
const MobileMenu = ({ toggleMobileMenu, mobileMenuStyle, mobileLinkStyle, mobileLoginButtonStyle }) => {
  return (
    <div style={mobileMenuStyle}>
       <Link href="#about" style={mobileLinkStyle} onClick={toggleMobileMenu}>About</Link>
       <Link href="#features" style={mobileLinkStyle} onClick={toggleMobileMenu}>Features</Link>
       <Link href="#pricing" style={mobileLinkStyle} onClick={toggleMobileMenu}>Pricing</Link>
       <Link href="#support" style={mobileLinkStyle} onClick={toggleMobileMenu}>Support</Link>
       <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
       <Link href="/login" style={mobileLoginButtonStyle} onClick={toggleMobileMenu}>
           Log In
       </Link>
       {/* Optioneel: Signup hier ook als knop/link */}
       {/* <Link href="/signup" style={{...}} onClick={toggleMobileMenu}>Create Your Prysma</Link> */}
    </div>
  );
};

export default MobileMenu; 