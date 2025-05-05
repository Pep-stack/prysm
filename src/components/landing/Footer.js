'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
 return (
  <footer className={styles.footer}>
     <div className={styles.container}>
        <div className={`${styles.logoContainer} ${styles.orderLogo}`}>
           <Link href="/">
             <Image
               src="/images/logo.png"
               alt="Prysma Logo"
               width={110}
               height={36}
             />
           </Link>
        </div>
        <div className={`${styles.linkColumn} ${styles.orderQuickLinks}`}>
           <h4 className={styles.columnTitle}>Quick Links</h4>
           <ul className={styles.linkList}>
              <li className={styles.linkItem}><Link href="#features" className={styles.link}>Features</Link></li>
              <li className={styles.linkItem}><Link href="#pricing" className={styles.link}>Pricing</Link></li>
              <li className={styles.linkItem}><Link href="/terms" className={styles.link}>Terms</Link></li>
              <li className={styles.linkItem}><Link href="/privacy" className={styles.link}>Privacy</Link></li>
           </ul>
        </div>
        <div className={`${styles.linkColumn} ${styles.orderStayUpdated}`}>
           <h4 className={styles.columnTitle}>Stay Updated</h4>
           <form className={styles.newsletterForm}>
             <input
               type="email"
               placeholder="Enter your email"
               className={styles.newsletterInput}
               aria-label="Email for newsletter"
             />
             <button type="submit" className={styles.newsletterButton}>
               Sign Up
             </button>
           </form>
           <div className={styles.socialLinks}>
              <a href="#" aria-label="Follow Prysma on X" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                 <Image src="/images/logo/x.png" alt="X Logo" width={22} height={30} className={styles.socialIcon} />
              </a>
              <a href="#" aria-label="Follow Prysma on Instagram" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                 <Image src="/images/logo/instagram.png" alt="Instagram Logo" width={20} height={20} className={styles.socialIcon} />
              </a>
              <a href="#" aria-label="Follow Prysma on TikTok" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                 <Image src="/images/logo/tiktok.png" alt="TikTok Logo" width={25} height={20} className={styles.socialIcon} />
              </a>
           </div>
        </div>
     </div>
     <div className={styles.copyright}>
       &copy; Prysma {new Date().getFullYear()}
     </div>
  </footer>
 );
}; 