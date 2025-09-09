'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './AnalyticsInsightsSection.module.css';
import { 
  LuEye, LuUsers, LuTrendingUp, LuShare2, LuMapPin, LuGlobe, 
  LuBarChart3, LuLineChart, LuPieChart, LuActivity
} from 'react-icons/lu';
import { 
  FaLinkedin, FaInstagram, FaGithub, FaYoutube, FaTiktok, 
  FaWhatsapp, FaEnvelope, FaPhone, FaDribbble, FaBehance
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const ANALYTICS_FEATURES = [
  {
    id: 'engagement',
    title: 'Real-time Engagement Tracking',
    subtitle: 'Monitor how visitors interact with your profile',
    visual: 'engagement-metrics'
  },
  {
    id: 'geographic',
    title: 'Global Reach Analytics',
    subtitle: 'See where your audience is connecting from worldwide',
    visual: 'geographic-data'
  },
  {
    id: 'social',
    title: 'Social Platform Performance',
    subtitle: 'Track which platforms drive the most engagement',
    visual: 'social-breakdown'
  }
];

const SAMPLE_METRICS = [
  { 
    label: 'Total Views', 
    value: '2,847', 
    trend: '+23%',
    icon: LuEye, 
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  { 
    label: 'Unique Visitors', 
    value: '1,205', 
    trend: '+18%',
    icon: LuUsers, 
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  { 
    label: 'Social Clicks', 
    value: '834', 
    trend: '+31%',
    icon: LuShare2, 
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  { 
    label: 'Engagement Rate', 
    value: '67%', 
    trend: '+12%',
    icon: LuTrendingUp, 
    color: '#f59e0b',
    bgColor: '#fef3c7'
  }
];

const SOCIAL_PLATFORMS = [
  { platform: 'linkedin', icon: FaLinkedin, color: '#0077B5', clicks: 245 },
  { platform: 'instagram', icon: FaInstagram, color: '#E4405F', clicks: 189 },
  { platform: 'github', icon: FaGithub, color: '#333333', clicks: 156 },
  { platform: 'youtube', icon: FaYoutube, color: '#FF0000', clicks: 134 },
  { platform: 'x', icon: FaXTwitter, color: '#000000', clicks: 110 }
];

const GEOGRAPHIC_DATA = [
  { country: 'United States', visitors: 342, flag: '🇺🇸' },
  { country: 'Netherlands', visitors: 298, flag: '🇳🇱' },
  { country: 'Germany', visitors: 187, flag: '🇩🇪' },
  { country: 'United Kingdom', visitors: 156, flag: '🇬🇧' },
  { country: 'Canada', visitors: 134, flag: '🇨🇦' }
];

export default function AnalyticsInsightsSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    // Animate counter values
    SAMPLE_METRICS.forEach((metric, index) => {
      setTimeout(() => {
        setAnimatedValues(prev => ({
          ...prev,
          [index]: metric.value
        }));
      }, index * 200);
    });
  }, []);

  const EngagementMetricsVisual = () => (
    <div className={styles.visualContainer}>
      <motion.div 
        className={styles.analyticsCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.analyticsHeader}>
          <div className={styles.headerContent}>
            <h4 className={styles.cardTitle}>Analytics Dashboard</h4>
            <div className={styles.periodSelector}>
              <button className={`${styles.periodBtn} ${styles.active}`}>7d</button>
              <button className={styles.periodBtn}>30d</button>
              <button className={styles.periodBtn}>90d</button>
            </div>
          </div>
        </div>
        
        <div className={styles.metricsGrid}>
          {SAMPLE_METRICS.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className={styles.metricCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.metricHeader}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <div 
                    className={styles.metricIcon}
                    style={{ backgroundColor: metric.bgColor, color: metric.color }}
                  >
                    <IconComponent size={16} />
                  </div>
                </div>
                <div className={styles.metricValue}>
                  {animatedValues[index] || '0'}
                </div>
                <div className={styles.metricTrend} style={{ color: metric.color }}>
                  <LuTrendingUp size={12} />
                  <span>{metric.trend}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.chartSection}>
          <h5 className={styles.chartTitle}>Daily Views</h5>
          <div className={styles.chartContainer}>
            <svg className={styles.chart} viewBox="0 0 300 120">
              <motion.polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points="20,100 50,85 80,70 110,45 140,60 170,40 200,25 230,35 260,20 290,30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              {/* Data points */}
              {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x, i) => {
                const y = [100, 85, 70, 45, 60, 40, 25, 35, 20, 30][i];
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#10b981"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const GeographicDataVisual = () => (
    <div className={styles.visualContainer}>
      <motion.div 
        className={styles.geographicCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <LuGlobe size={20} />
          </div>
          <div>
            <h4 className={styles.cardTitle}>Geographic Distribution</h4>
            <p className={styles.cardSubtitle}>Global audience insights</p>
          </div>
        </div>


        <div className={styles.countryList}>
          <h5 className={styles.listTitle}>Top Countries</h5>
          {GEOGRAPHIC_DATA.map((country, index) => (
            <motion.div
              key={country.country}
              className={styles.countryItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.countryInfo}>
                <span className={styles.countryFlag}>{country.flag}</span>
                <span className={styles.countryName}>{country.country}</span>
              </div>
              <div className={styles.countryStats}>
                <span className={styles.visitorCount}>{country.visitors}</span>
                <div className={styles.countryBar}>
                  <motion.div
                    className={styles.countryProgress}
                    initial={{ width: 0 }}
                    animate={{ width: `${(country.visitors / 342) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const SocialBreakdownVisual = () => (
    <div className={styles.visualContainer}>
      <motion.div 
        className={styles.socialCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <LuShare2 size={20} />
          </div>
          <div>
            <h4 className={styles.cardTitle}>Social Platform Performance</h4>
            <p className={styles.cardSubtitle}>Track engagement across platforms</p>
          </div>
        </div>

        <div className={styles.socialGrid}>
          {SOCIAL_PLATFORMS.map((social, index) => {
            const IconComponent = social.icon;
            const totalClicks = SOCIAL_PLATFORMS.reduce((sum, p) => sum + p.clicks, 0);
            const percentage = ((social.clicks / totalClicks) * 100).toFixed(1);
            
            return (
              <motion.div
                key={social.platform}
                className={styles.socialPlatform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.platformHeader}>
                  <div 
                    className={styles.platformIcon}
                    style={{ backgroundColor: social.color }}
                  >
                    <IconComponent size={16} color="white" />
                  </div>
                  <div className={styles.platformInfo}>
                    <span className={styles.platformName}>
                      {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    </span>
                    <span className={styles.platformClicks}>{social.clicks} clicks</span>
                  </div>
                </div>
                
                <div className={styles.platformProgress}>
                  <motion.div
                    className={styles.progressBar}
                    style={{ backgroundColor: social.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                
                <div className={styles.platformStats}>
                  <span className={styles.clickCount}>{social.clicks}</span>
                  <div className={styles.trendIndicator}>
                    <LuTrendingUp size={12} style={{ color: social.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>
            <LuActivity size={16} />
          </div>
          <div className={styles.insightContent}>
            <h6 className={styles.insightTitle}>Performance Insight</h6>
            <p className={styles.insightText}>
              LinkedIn generates 29% of your social engagement - consider posting more professional content there.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderVisual = () => {
    switch (ANALYTICS_FEATURES[activeFeature].visual) {
      case 'engagement-metrics':
        return <EngagementMetricsVisual />;
      case 'geographic-data':
        return <GeographicDataVisual />;
      case 'social-breakdown':
        return <SocialBreakdownVisual />;
      default:
        return <EngagementMetricsVisual />;
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
              Understand your professional impact
            </h2>
            <p className={styles.subheading}>
              Get detailed insights into how your profile performs, who's viewing your content, 
              and which platforms drive the most engagement. Make data-driven decisions to grow your professional presence.
            </p>
            
            <div className={styles.features}>
              {ANALYTICS_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className={`${styles.feature} ${activeFeature === index ? styles.activeFeature : ''}`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.featureNumber}>{index + 1}</div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureSubtitle}>{feature.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className={styles.visualContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
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
