import React from 'react';
import { colors } from '../../lib/landingStyles'; // Importeer alleen wat nodig is

// Ontvang stijlen en kleur als props
const DesktopNavLinks = ({ linkStyle, linkHoverStyle, highlightColor }) => {
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
  };

  return (
    <>
      <button 
        onClick={() => scrollToSection('home')} 
        style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}
      >
        Home
      </button>
      <button 
        onClick={() => scrollToSection('features')} 
        style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}
      >
        Features
      </button>
      <button 
        onClick={() => scrollToSection('pricing')} 
        style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}
      >
        Pricing
      </button>
      <button 
        onClick={() => scrollToSection('testimonials')} 
        style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}
      >
        Reviews
      </button>
    </>
  );
};

export default DesktopNavLinks; 