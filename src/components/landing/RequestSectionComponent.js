'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './RequestSectionComponent.module.css';
import { 
  FaLightbulb, 
  FaPaperPlane, 
  FaCheck, 
  FaStar,
  FaUsers,
  FaRocket,
  FaHeart,
  FaCode,
  FaPalette,
  FaChartLine
} from 'react-icons/fa';

const INSPIRATION_IDEAS = [
  { icon: FaCode, text: "Code Portfolio", category: "Developer" },
  { icon: FaPalette, text: "Design Showcase", category: "Creative" },
  { icon: FaChartLine, text: "Analytics Dashboard", category: "Business" },
  { icon: FaHeart, text: "Personal Blog", category: "Content" },
  { icon: FaUsers, text: "Team Members", category: "Company" },
  { icon: FaRocket, text: "Product Launch", category: "Startup" }
];

export default function RequestSectionComponent() {
  const [formData, setFormData] = useState({
    sectionName: '',
    description: '',
    useCase: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInspirationClick = (idea) => {
    setSelectedInspiration(idea);
    setFormData(prev => ({
      ...prev,
      sectionName: idea.text,
      useCase: idea.category
    }));
    setIsFormVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Section request submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setIsFormVisible(false);
      setFormData({
        sectionName: '',
        description: '',
        useCase: '',
        email: ''
      });
      setSelectedInspiration(null);
    }, 3000);
  };

  const isFormValid = formData.sectionName && formData.description && formData.email;

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
          {/* Header */}
          <div className={styles.header}>
            <motion.div 
              className={styles.iconContainer}
              variants={fadeInUp}
            >
              <FaLightbulb className={styles.headerIcon} />
            </motion.div>
            <motion.h2 
              className={styles.heading}
              variants={fadeInUp}
            >
              Have an Idea for a New Section?
            </motion.h2>
            <motion.p 
              className={styles.subheading}
              variants={fadeInUp}
            >
              Help us build the perfect professional platform. Share your section idea and we&apos;ll consider adding it to Prysma.
            </motion.p>
          </div>

          {/* Inspiration Ideas */}
          <motion.div 
            className={styles.inspirationGrid}
            variants={fadeInUp}
          >
            <h3 className={styles.inspirationTitle}>Need inspiration? Try these popular requests:</h3>
            <div className={styles.ideaCards}>
              {INSPIRATION_IDEAS.map((idea, index) => (
                <motion.button
                  key={index}
                  className={`${styles.ideaCard} ${selectedInspiration?.text === idea.text ? styles.selected : ''}`}
                  onClick={() => handleInspirationClick(idea)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <idea.icon className={styles.ideaIcon} />
                  <span className={styles.ideaText}>{idea.text}</span>
                  <span className={styles.ideaCategory}>{idea.category}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Custom Request Button */}
          {!isFormVisible && (
            <motion.div 
              className={styles.customRequestContainer}
              variants={fadeInUp}
            >
              <button
                className={styles.customRequestButton}
                onClick={() => setIsFormVisible(true)}
              >
                <FaRocket className={styles.buttonIcon} />
                Have a Different Idea? Create Custom Request
              </button>
            </motion.div>
          )}

          {/* Request Form */}
          <AnimatePresence>
            {isFormVisible && !isSubmitted && (
              <motion.div
                className={styles.formContainer}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <FaStar className={styles.formIcon} />
                    <h3 className={styles.formTitle}>Tell us about your section idea</h3>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Section Name *</label>
                        <input
                          type="text"
                          name="sectionName"
                          value={formData.sectionName}
                          onChange={handleInputChange}
                          placeholder="e.g., Music Portfolio, Recipe Collection"
                          className={styles.input}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Use Case</label>
                      <input
                        type="text"
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleInputChange}
                        placeholder="e.g., Creative Professional, Small Business"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe what this section would display and how it would help professionals showcase their work..."
                        className={styles.textarea}
                        rows={4}
                        required
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        onClick={() => setIsFormVisible(false)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`${styles.submitButton} ${!isFormValid ? styles.disabled : ''}`}
                      >
                        <FaPaperPlane className={styles.submitIcon} />
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                className={styles.successContainer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.successCard}>
                  <FaCheck className={styles.successIcon} />
                  <h3 className={styles.successTitle}>Request Submitted!</h3>
                  <p className={styles.successMessage}>
                    Thank you for your suggestion. We&apos;ll review your idea and get back to you soon.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
