'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors, commonStyles, fadeInUp } from '../../lib/landingStyles';

export default function UseCaseSection() {
  const [selectedCategory, setSelectedCategory] = useState('Professional');
  
  // Define the Prysma highlight color (matching Hero section)
  const highlightColor = '#00C896';

  const categories = [
    { id: 'Professional', label: 'Professional' },
    { id: 'Creative', label: 'Creative' },
    { id: 'Entrepreneur', label: 'Entrepreneur' },
    { id: 'Freelancer', label: 'Freelancer' },
    { id: 'Student', label: 'Student' }
  ];

  const profileExamples = {
    Professional: {
      name: 'Sarah Chen - Marketing Director',
      details: 'Today 2:05 PM • LinkedIn, Email, Phone',
      sections: [
        { title: 'About', content: '• 8+ years in digital marketing\n• Specialized in B2B growth strategies' },
        { title: 'Experience', content: '• Marketing Director at TechCorp\n• Led campaigns with 300% ROI increase' },
        { title: 'Skills', content: '• Digital Marketing\n• Team Leadership\n• Data Analytics' },
        { title: 'Contact', content: '• sarah@prysma.com\n• +1 (555) 123-4567' },
        { title: 'Social Links', content: '• LinkedIn Profile\n• Portfolio Website' }
      ]
    },
    Creative: {
      name: 'Alex Rivera - Graphic Designer',
      details: 'Today 2:05 PM • Portfolio, Instagram, Dribbble',
      sections: [
        { title: 'Portfolio', content: '• Award-winning brand designs\n• Featured in Design Magazine' },
        { title: 'Services', content: '• Brand Identity Design\n• Logo Creation\n• Print Design' },
        { title: 'Tools', content: '• Adobe Creative Suite\n• Figma\n• Procreate' },
        { title: 'Contact', content: '• alex@prysma.com\n• Available for projects' },
        { title: 'Social Links', content: '• Instagram Portfolio\n• Dribbble Profile' }
      ]
    },
    Entrepreneur: {
      name: 'Marcus Johnson - Startup Founder',
      details: 'Today 2:05 PM • Company, AngelList, Twitter',
      sections: [
        { title: 'Company', content: '• Founder of InnovateTech\n• Raised $2M Series A' },
        { title: 'Mission', content: '• Revolutionizing fintech\n• Building the future of payments' },
        { title: 'Achievements', content: '• Forbes 30 Under 30\n• 50+ team members' },
        { title: 'Contact', content: '• marcus@prysma.com\n• Speaking opportunities' },
        { title: 'Social Links', content: '• Company Website\n• AngelList Profile' }
      ]
    },
    Freelancer: {
      name: 'Emma Wilson - Content Writer',
      details: 'Today 2:05 PM • Website, Medium, Twitter',
      sections: [
        { title: 'Services', content: '• Blog Writing\n• Copywriting\n• Content Strategy' },
        { title: 'Specialties', content: '• SaaS & Tech\n• E-commerce\n• B2B Marketing' },
        { title: 'Clients', content: '• 50+ satisfied clients\n• 5-star average rating' },
        { title: 'Contact', content: '• emma@prysma.com\n• Available for projects' },
        { title: 'Social Links', content: '• Writing Portfolio\n• Medium Articles' }
      ]
    },
    Student: {
      name: 'Jordan Kim - Computer Science Student',
      details: 'Today 2:05 PM • GitHub, LinkedIn, Resume',
      sections: [
        { title: 'Education', content: '• CS Major at Stanford\n• Expected graduation 2025' },
        { title: 'Projects', content: '• Mobile app with 10K downloads\n• Open source contributor' },
        { title: 'Skills', content: '• React, Python, Java\n• Machine Learning' },
        { title: 'Contact', content: '• jordan@prysma.com\n• Seeking internships' },
        { title: 'Social Links', content: '• GitHub Profile\n• LinkedIn Network' }
      ]
    }
  };

  const currentExample = profileExamples[selectedCategory];

  return (
    <section style={{ 
      padding: '60px 20px',
      background: `
        linear-gradient(to bottom, transparent 0%, rgba(248, 249, 250, 0.1) 20%, rgba(248, 249, 250, 0.3) 40%, transparent 60%),
        ${colors.white}
      `,
      marginTop: '-50px',
      paddingTop: '80px',
      backgroundColor: 'transparent'
    }}>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Left Section - Content */}
        <motion.div
          className="flex-1 lg:max-w-lg relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Blurred background effect - positioned lower and more distributed */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, rgba(0, 200, 150, 0.08) 0%, rgba(0, 200, 150, 0.15) 50%, rgba(0, 200, 150, 0.12) 100%)`,
              filter: 'blur(40px)',
              transform: 'translateY(20px) scale(1.1)',
              opacity: 0.7
            }}
          />
          
          {/* Additional subtle background layer */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{ 
              background: `radial-gradient(ellipse at center bottom, rgba(0, 200, 150, 0.1) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              transform: 'translateY(40px) scale(1.2)',
              opacity: 0.5
            }}
          />
          
          <div className="relative z-10 p-8 lg:p-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#1a1a1a' }}>
              Customizable profiles for your professional identity
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Get your digital presence in the exact format your network needs.
            </p>
            
            {/* Category buttons */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? highlightColor : 'white'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Section - Profile Card */}
        <motion.div
          className="flex-1 lg:max-w-md"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Profile header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentExample.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {currentExample.details}
              </div>
            </div>

            {/* Profile sections */}
            <div className="space-y-4">
              {currentExample.sections.map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 