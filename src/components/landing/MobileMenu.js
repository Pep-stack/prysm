import React from 'react';
import Link from 'next/link';
import { colors } from '../../lib/landingStyles'; // Importeer alleen wat nodig is

// Ontvang stijlen en functies als props
const MobileMenu = ({ toggleMobileMenu, mobileMenuStyle, mobileLinkStyle, mobileLoginButtonStyle }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 100; // Account for sticky navbar
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    toggleMobileMenu(); // Close menu after navigation
  };

  return (
    <div style={mobileMenuStyle}>
       <button 
         onClick={() => scrollToSection('home')} 
         style={{...mobileLinkStyle, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'}}
       >
         Home
       </button>
       <button 
         onClick={() => scrollToSection('features')} 
         style={{...mobileLinkStyle, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'}}
       >
         Features
       </button>
       <button 
         onClick={() => scrollToSection('pricing')} 
         style={{...mobileLinkStyle, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'}}
       >
         Pricing
       </button>
       <button 
         onClick={() => scrollToSection('testimonials')} 
         style={{...mobileLinkStyle, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'}}
       >
         Reviews
       </button>
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