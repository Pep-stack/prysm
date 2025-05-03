import React from 'react';
import Link from 'next/link';
import { colors } from '../../lib/landingStyles'; // Importeer alleen wat nodig is

// Ontvang stijlen en kleur als props
const DesktopNavLinks = ({ linkStyle, linkHoverStyle, highlightColor }) => {
  return (
    <>
      <Link href="#about" style={linkStyle}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}>
        About
      </Link>
      <Link href="#features" style={linkStyle}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}>
        Features
      </Link>
      <Link href="#pricing" style={linkStyle}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}>
        Pricing
      </Link>
      <Link href="#support" style={linkStyle}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor; e.currentTarget.style.color = linkHoverStyle.color; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = linkStyle.color; }}>
        Support
      </Link>
    </>
  );
};

export default DesktopNavLinks; 