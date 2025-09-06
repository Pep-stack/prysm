'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../lib/landingStyles';
import styles from './FAQSection.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ_DATA = [
  {
    id: 1,
    question: "Why choose Prysma over other professional platforms?",
    answer: "Unlike traditional platforms, Prysma gives you complete control over your professional presence. Create a stunning, personalized profile that showcases everything about you in one place - your work, skills, portfolio, and personality. No ads, no distractions, just your professional story beautifully told."
  },
  {
    id: 2,
    question: "How quickly can I start getting results with Prysma?",
    answer: "You can have your professional profile live in under 10 minutes! Simply choose your sections, add your content, and start sharing your link immediately. Many users see increased professional inquiries within their first week of using Prysma."
  },
  {
    id: 3,
    question: "What makes Prysma profiles more effective than traditional resumes?",
    answer: "Prysma profiles are interactive, always up-to-date, and mobile-optimized. While resumes are static documents, your Prysma profile can include live portfolio pieces, social proof, testimonials, and direct contact options. Plus, you can track who&apos;s viewing your profile and when."
  },
  {
    id: 4,
    question: "Can Prysma help me stand out in my industry?",
    answer: "Absolutely! With 25+ professional sections, custom themes, and advanced design options, you can create a unique professional presence that reflects your personal brand. Showcase your work, achievements, and personality in ways that traditional platforms simply can&apos;t match."
  },
  {
    id: 5,
    question: "Is Prysma worth the investment for my career?",
    answer: "Many professionals see a return on investment within weeks. With detailed analytics, you&apos;ll know exactly who&apos;s interested in your work. Plus, our free plan includes all essential features, so you can start building your professional presence at no cost and upgrade when you&apos;re ready for advanced features."
  }
];

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
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
          {/* Header */}
          <div className={styles.header}>
            <motion.h2 
              className={styles.heading}
              variants={fadeInUp}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p 
              className={styles.subheading}
              variants={fadeInUp}
            >
              Everything you need to know about Prysma and how it works
            </motion.p>
          </div>

          {/* FAQ List */}
          <div className={styles.faqList}>
            {FAQ_DATA.map((faq, index) => (
              <motion.div
                key={faq.id}
                className={styles.faqItem}
                variants={fadeInUp}
                custom={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className={`${styles.faqQuestion} ${openFAQ === faq.id ? styles.active : ''}`}
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={openFAQ === faq.id}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.chevron}>
                    {openFAQ === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className={styles.answerContent}>
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
