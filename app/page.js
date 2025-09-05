'use client';

import React from 'react';

// Import landing page sections
import StickyNavBar from '../src/components/landing/StickyNavBar';
import HeroSection from '../src/components/landing/HeroSection';
import FeaturesSection from '../src/components/landing/FeaturesSection';
import UseCaseSection from '../src/components/landing/UseCaseSection';
import HowItWorksSection from '../src/components/landing/HowItWorksSection';
import PricingSection from '../src/components/landing/PricingSection';
import TestimonialsSection from '../src/components/landing/TestimonialsSection';
import CreatorStorySection from '../src/components/landing/CreatorStorySection';
import Footer from '../src/components/landing/Footer';

// Removed style helpers and section definitions from here

// Main Landing Page Component - Now imports sections
export default function HomePage() {
  return (
    // Consider moving common background/text colors to layout.js or globals.css
    <div className="min-h-screen text-gray-800 font-sans" style={{ backgroundColor: 'transparent' }}>
      <StickyNavBar />
      <HeroSection />
      <FeaturesSection />
      <UseCaseSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CreatorStorySection /> 
      <Footer />
    </div>
  );
}
