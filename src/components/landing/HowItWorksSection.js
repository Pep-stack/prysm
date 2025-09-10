'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './HowItWorksSection.module.css';
import { 
  LuBriefcase, LuBookOpen, LuAward, LuLanguages, LuCode,
  LuImage, LuVideo, LuFileText, LuFolderOpen,
  LuWrench, LuHeart, LuCalendar, LuMail, LuCircleHelp, LuGlobe,
  LuChevronDown, LuChevronRight, LuPlus
} from 'react-icons/lu';
import { 
  FaXTwitter, FaYoutube, FaSpotify, FaLinkedin, FaTiktok, FaGithub,
  FaInstagram, FaVimeo, FaBehance, FaDribbble, FaSnapchat
} from 'react-icons/fa6';

const STEPS = [
  {
    id: 'create',
    title: 'Add sections to build your profile',
    subtitle: 'Choose from professional sections including work experience, skills, portfolio, social profiles, and business services to create your perfect professional presence',
    visual: 'profile-creation',
    categories: {
      'Career': [
        { type: 'experience', name: 'Work Experience', icon: LuBriefcase },
        { type: 'education', name: 'Education', icon: LuBookOpen },
        { type: 'certifications', name: 'Certifications', icon: LuAward },
        { type: 'languages', name: 'Languages', icon: LuLanguages },
        { type: 'skills', name: 'Skills & Technologies', icon: LuCode }
      ],
      'Content': [
        { type: 'gallery', name: 'Gallery', icon: LuImage },
        { type: 'featured_video', name: 'Featured Video', icon: LuVideo },
        { type: 'publications', name: 'Publications', icon: LuFileText },
        { type: 'projects', name: 'Portfolio', icon: LuFolderOpen }
      ],
      'Business': [
        { type: 'services', name: 'Services Offered', icon: LuWrench },
        { type: 'testimonials', name: 'Client Testimonials', icon: LuHeart },
        { type: 'appointments', name: 'Book an Appointment', icon: LuCalendar },
        { type: 'subscribe', name: 'Subscribe', icon: LuMail },
        { type: 'faq', name: 'FAQ', icon: LuCircleHelp },
        { type: 'website_preview', name: 'Website Preview', icon: LuGlobe }
      ],
      'Social Highlights': [
        { type: 'x_highlights', name: 'X Highlights', icon: FaXTwitter },
        { type: 'youtube_highlights', name: 'YouTube Highlights', icon: FaYoutube },
        { type: 'spotify_highlights', name: 'Spotify Highlights', icon: FaSpotify },
        { type: 'linkedin_highlights', name: 'LinkedIn Highlights', icon: FaLinkedin },
        { type: 'tiktok_highlights', name: 'TikTok Highlights', icon: FaTiktok },
        { type: 'github_highlights', name: 'GitHub Highlights', icon: FaGithub }
      ],
      'Social Profiles': [
        { type: 'instagram_profile', name: 'Instagram Profile', icon: FaInstagram },
        { type: 'linkedin_profile', name: 'LinkedIn Profile', icon: FaLinkedin },
        { type: 'x_profile', name: 'X Profile', icon: FaXTwitter },
        { type: 'spotify_profile', name: 'Spotify Profile', icon: FaSpotify },
        { type: 'tiktok_profile', name: 'TikTok Profile', icon: FaTiktok },
        { type: 'behance_profile', name: 'Behance Profile', icon: FaBehance },
        { type: 'dribbble_profile', name: 'Dribbble Profile', icon: FaDribbble },
        { type: 'snapchat_profile', name: 'Snapchat Profile', icon: FaSnapchat }
      ]
    }
  },
  {
    id: 'share',
    title: 'Get your personalized link',
    subtitle: 'Create a memorable, professional URL that you can share anywhere - business cards, email signatures, or social media',
    visual: 'link-and-qr'
  },
  {
    id: 'analytics',
    title: 'Track your professional impact',
    subtitle: 'See who visits your profile, which projects get the most attention, and how your network grows over time',
    visual: 'analytics',
    metrics: [
      { 
        label: 'Total Views', 
        value: '2,847', 
        icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>, 
        iconBg: '#dbeafe', 
        iconColor: '#3b82f6' 
      },
      { 
        label: 'Unique Visitors', 
        value: '1,205', 
        icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/></svg>, 
        iconBg: '#dcfce7', 
        iconColor: '#16a34a' 
      },
      { 
        label: 'Social Clicks', 
        value: '834', 
        icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>, 
        iconBg: '#f3e8ff', 
        iconColor: '#9333ea' 
      },
      { 
        label: 'Engagement Rate', 
        value: '67%', 
        icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>, 
        iconBg: '#fed7d7', 
        iconColor: '#dc2626' 
      }
    ]
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ProfileCreationVisual = () => {
    const [expandedCategories, setExpandedCategories] = useState({
      'Career': true,
      'Content': false,
      'Business': false,
      'Social Highlights': false,
      'Social Profiles': false
    });
    const [addedSections, setAddedSections] = useState([]);

    const toggleCategory = (category) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    const addSection = (section) => {
      if (!addedSections.find(s => s.type === section.type)) {
        setAddedSections(prev => [...prev, section]);
      }
    };

    const removeSection = (sectionType) => {
      setAddedSections(prev => prev.filter(s => s.type !== sectionType));
    };

    const getTotalSections = () => {
      return Object.values(STEPS[0].categories).reduce((total, sections) => total + sections.length, 0);
    };

    return (
      <div className={styles.visualContainer}>
        <motion.div 
          className={styles.dashboardCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Dashboard Header */}
          <div className={styles.dashboardHeader}>
            <h4>Add Sections</h4>
            <span className={styles.sectionCount}>{getTotalSections() - addedSections.length} available</span>
          </div>
          
          <div className={styles.dashboardContent}>
            {/* Categories */}
            {Object.entries(STEPS[0].categories).map(([categoryName, sections], categoryIndex) => {
              const isExpanded = expandedCategories[categoryName];
              const categoryIcons = {
                'Career': LuBriefcase,
                'Content': LuImage,
                'Business': LuWrench,
                'Social Highlights': LuHeart,
                'Social Profiles': FaInstagram
              };
              const CategoryIcon = categoryIcons[categoryName];
              
              return (
                <div key={categoryName} className={styles.categorySection}>
                  <motion.div 
                    className={styles.categoryHeader}
                    onClick={() => toggleCategory(categoryName)}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CategoryIcon className={styles.categoryIcon} size={16} />
                    <span className={styles.categoryName}>{categoryName}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LuChevronDown className={styles.categoryChevron} size={14} />
                    </motion.div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: isMobile ? 0.15 : 0.3 }}
                        className={styles.sectionsContainer}
                      >
                        <div className={styles.sectionsGrid}>
                          {sections.map((section, index) => {
                            const isAdded = addedSections.find(s => s.type === section.type);
                            const SectionIcon = section.icon;
                            
                            return (
                              <motion.div
                                key={section.type}
                                className={`${styles.sectionOption} ${isAdded ? styles.sectionAdded : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: isMobile ? 0.15 : 0.3, delay: isMobile ? index * 0.02 : index * 0.05 }}
                                whileHover={{ scale: isAdded ? 1 : 1.02 }}
                                onClick={() => isAdded ? removeSection(section.type) : addSection(section)}
                              >
                                <SectionIcon className={styles.sectionIcon} size={18} />
                                <span className={styles.sectionName}>{section.name}</span>
                                {isAdded && (
                                  <motion.div 
                                    className={styles.addedIndicator}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: isMobile ? 0.1 : 0.2 }}
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Added Sections Preview */}
            {addedSections.length > 0 && (
              <motion.div 
                className={styles.addedSectionsArea}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.2 : 0.4 }}
              >
                <div className={styles.addedSectionsHeader}>
                  <h5>Added to Profile ({addedSections.length})</h5>
                </div>
                <div className={styles.addedSectionsList}>
                  {addedSections.map((section, index) => {
                    const SectionIcon = section.icon;
                    return (
                      <motion.div
                        key={section.type}
                        className={styles.addedSectionItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: isMobile ? 0.15 : 0.3, delay: isMobile ? index * 0.05 : index * 0.1 }}
                        onClick={() => removeSection(section.type)}
                      >
                        <SectionIcon size={14} />
                        <span>{section.name}</span>
                        <span className={styles.removeIcon}>×</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const IntegrationsVisual = () => (
    <div className={styles.visualContainer}>
      <div className={styles.integrationsHub}>
        <motion.div 
          className={styles.centralNode}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.prysmaLogo}>P</div>
        </motion.div>
        
        {STEPS[1].platforms.map((platform, index) => {
          const angle = (index / STEPS[1].platforms.length) * 2 * Math.PI;
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={platform.name}
              className={styles.platformNode}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                backgroundColor: platform.color + '15',
                borderColor: platform.color + '40'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <span className={styles.platformIcon}>{platform.icon}</span>
              <span className={styles.platformName}>{platform.name}</span>
              
              <motion.div
                className={styles.connectionLine}
                style={{
                  width: `${radius}px`,
                  transform: `rotate(${angle + Math.PI}rad)`,
                  transformOrigin: 'right center'
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const LinkCreationVisual = () => (
    <div className={styles.visualContainer}>
      <motion.div 
        className={styles.linkCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.linkHeader}>
          <div className={styles.linkIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className={styles.linkInfo}>
            <h4>Your Prysma Link</h4>
            <p>Share your professional profile</p>
          </div>
        </div>
        
        <div className={styles.linkSection}>
          <label>Your public link</label>
          <div className={styles.linkInput}>
            <span className={styles.linkUrl}>https://useprysma.com/pk-pk</span>
            <div className={styles.linkActions}>
              <button className={styles.editButton}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button className={styles.copyButton}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.linkCustomize}>
          <h5>Customize your link</h5>
          <ul>
            <li>Use only lowercase letters, numbers, and hyphens</li>
            <li>Minimum 3 characters required</li>
            <li>Choose something memorable and professional</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );

  const QRCodeVisual = () => (
    <div className={styles.visualContainer}>
      <motion.div 
        className={styles.qrCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className={styles.qrTitle}>Your QR Code</h4>
        <p className={styles.qrSubtitle}>
          Scan this code or download it to share your Prysma profile visually.
        </p>
        
        <div className={styles.qrCodeContainer}>
          <motion.div 
            className={styles.qrCode}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* QR Code Pattern */}
            <div className={styles.qrPattern}>
              <div className={styles.qrCorner}></div>
              <div className={styles.qrCorner}></div>
              <div className={styles.qrCorner}></div>
              <div className={styles.qrData}>
                {Array.from({length: 100}).map((_, i) => (
                  <div 
                    key={i} 
                    className={styles.qrPixel}
                    style={{ 
                      opacity: Math.random() > 0.5 ? 1 : 0,
                      animationDelay: `${i * 0.01}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.button 
          className={styles.downloadButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download QR Code
        </motion.button>
      </motion.div>
    </div>
  );

  const LinkAndQRVisual = () => (
    <div className={styles.visualContainer}>
      <div className={styles.linkOnlyContainer}>
        <motion.div 
          className={styles.linkCardSingle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.linkHeader}>
            <div className={styles.linkIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </div>
            <div className={styles.linkInfo}>
              <h4>Your Prysma Link</h4>
              <p>Share your professional profile</p>
            </div>
          </div>
          
          <div className={styles.linkSection}>
            <label>Your public link</label>
            <div className={styles.linkInput}>
              <span className={styles.linkUrl}>https://useprysma.com/yourname</span>
              <div className={styles.linkActions}>
                <button className={styles.editButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button className={styles.copyButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.linkCustomize}>
            <h5>Customize your link</h5>
            <ul>
              <li>Use only lowercase letters, numbers, and hyphens</li>
              <li>Minimum 3 characters required</li>
              <li>Choose something memorable and professional</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const AnalyticsVisual = () => (
    <div className={styles.visualContainer}>
      <div className={styles.analyticsGrid}>
        {STEPS[2].metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className={styles.metricCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>{metric.label}</span>
            </div>
            <div className={styles.metricValue}>
              {metric.value}
            </div>
            <div 
              className={styles.metricIcon}
              style={{ 
                backgroundColor: metric.iconBg,
                color: metric.iconColor 
              }}
            >
              {metric.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderVisual = () => {
    switch (STEPS[activeStep].visual) {
      case 'profile-creation':
        return <ProfileCreationVisual />;
      case 'link-and-qr':
        return <LinkAndQRVisual />;
      case 'analytics':
        return <AnalyticsVisual />;
      default:
        return <ProfileCreationVisual />;
    }
  };

  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.container}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.heading}>
              How Prysma works
            </h2>
            
            <div className={styles.steps}>
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`${styles.step} ${activeStep === index ? styles.activeStep : ''}`}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepSubtitle}>{step.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className={styles.visualContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: isMobile ? 0.25 : 0.5 }}
              >
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
