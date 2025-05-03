'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { colors, typography, commonStyles } from '../../lib/landingStyles';
import useIsMobile from '../../hooks/useIsMobile';
import DesktopNavLinks from './DesktopNavLinks';
import NavActions from './NavActions';
import MobileMenu from './MobileMenu';

export default function StickyNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const highlightColor = '#00C896';

  const linkStyle = {
    color: colors.darkGrey,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    padding: '6px 12px',
    borderRadius: '50px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };
  const linkHoverStyle = {
    backgroundColor: highlightColor,
    color: colors.white,
  };
  const mobileMenuStyle = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: '15px',
    right: '15px',
    backgroundColor: colors.white,
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    zIndex: 110,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'stretch',
  };
  const mobileLinkStyle = {
    color: colors.darkGrey,
    textDecoration: 'none',
    padding: '10px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
    display: 'block',
  };
  const mobileLoginButtonStyle = {
    ...mobileLinkStyle,
    backgroundColor: highlightColor,
    color: colors.white,
    fontWeight: 'bold',
    width: 'fit-content',
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

 return (
  <nav style={{
    position: 'sticky',
    top: '10px',
    backgroundColor: colors.white,
    zIndex: 100,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '15px 25px',
    fontFamily: typography.fontFamily,
    borderRadius: '50px',
    margin: '10px auto',
    maxWidth: '1000px',
    position: 'relative',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '25px'}}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Prysma Logo"
            width={90}
            height={90}
          />
        </Link>
        {!isMobile && (
          <DesktopNavLinks
            linkStyle={linkStyle}
            linkHoverStyle={linkHoverStyle}
            highlightColor={highlightColor}
          />
        )}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <NavActions isMobile={isMobile} highlightColor={highlightColor} />

        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              padding: '5px',
              cursor: 'pointer',
              fontSize: '28px',
              color: colors.darkGrey,
              lineHeight: '1',
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>
    </div>

    {isMobile && isMobileMenuOpen && (
      <MobileMenu
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuStyle={mobileMenuStyle}
        mobileLinkStyle={mobileLinkStyle}
        mobileLoginButtonStyle={mobileLoginButtonStyle}
      />
    )}
  </nav>
 );
}; 