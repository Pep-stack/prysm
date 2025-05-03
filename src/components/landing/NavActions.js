import React from 'react';
import Link from 'next/link';
import { colors } from '../../lib/landingStyles'; // Importeer alleen wat nodig is

// Ontvang isMobile en highlightColor als props
const NavActions = ({ isMobile, highlightColor }) => {
  return (
    <>
      {/* Login Knop: Alleen tonen als NIET mobiel */}
      {!isMobile && (
         <Link href="/login">
            <button style={{
              backgroundColor: highlightColor,
              color: colors.white,
              borderRadius: '10px',
              padding: '8px 16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, filter 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              Log In
            </button>
         </Link>
      )}
      {/* Signup Knop: Altijd zichtbaar */}
      <Link href="/signup">
        <button style={{
          backgroundColor: 'transparent',
          color: colors.black || '#000',
          border: `1px solid ${colors.black || '#000'}`,
          borderRadius: '25px',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = colors.black || '#000'; e.currentTarget.style.color = colors.white; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.black || '#000'; }}
        >
          Create Your Prysma
        </button>
      </Link>
    </>
  );
};

export default NavActions; 