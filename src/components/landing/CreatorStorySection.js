'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './CreatorStorySection.module.css';

export default function CreatorStorySection() {
 return (
  <section className={styles.section}>
    <motion.div
      className={styles.container}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
       <div className={styles.mainLogo}>
         <Image
           src="/images/logo.png"
           alt="Prysma Logo"
           width={100}
           height={33}
         />
       </div>

       <h2 className={styles.heading}>Why I Built Prysma</h2>

       <p className={styles.paragraph}>
         Prysma was born from a simple insight: in a world full of noise, professionals need clarity. As a founder, I kept seeing how hard it was for ambitious individuals to present themselves online without relying on scattered tools or generic platforms. So I built Prysma — a smart, streamlined hub where your digital presence actually works for you. Whether you&apos;re a freelancer, coach, or creative entrepreneur, Prysma helps you showcase your value, connect with the right people, and grow your business with confidence.
       </p>

       <a
         href="#"
         target="_blank"
         rel="noopener noreferrer"
         className={styles.followButton}
       >
         <span>Follow the build on&nbsp;</span>
         <Image
           src="/images/logo/x.png"
           alt="X logo"
           width={40}
           height={40}
           className={styles.xLogo}
           style={{ display: 'inline-block', verticalAlign: 'middle' }}
         />
       </a>
    </motion.div>
  </section>
 );
}; 