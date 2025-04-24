'use client'; // Assuming client-side interactions might be added later

import React from 'react';

// --- Helper Styles (based on guidelines) ---
const colors = {
  white: '#FFFFFF',
  lightGrey: '#F3F4F6',
  darkGrey: '#1F2937',
  bluePrimary: '#3B82F6',
  lightBlueHover: '#60A5FA',
};

const typography = {
  fontFamily: 'Poppins, sans-serif', // Add Poppins to your global styles/layout for this to work
};

const commonStyles = {
  sectionPadding: { padding: '60px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: typography.fontFamily,
    transition: 'background-color 0.2s ease',
  },
  primaryButton: {
    backgroundColor: colors.bluePrimary,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    color: colors.bluePrimary,
    border: `1px solid ${colors.bluePrimary}`,
  },
  h1: {
    fontSize: '48px', 
    fontWeight: 'bold', 
    color: colors.darkGrey, 
    marginBottom: '15px',
    fontFamily: typography.fontFamily,
  },
  h2: {
     fontSize: '36px', 
     fontWeight: 'bold', 
     color: colors.darkGrey, 
     marginBottom: '40px', 
     textAlign: 'center',
     fontFamily: typography.fontFamily,
  },
   h3: {
     fontSize: '24px', 
     fontWeight: 'bold', 
     color: colors.darkGrey, 
     marginBottom: '15px',
     fontFamily: typography.fontFamily,
  },
  subheadline: {
    fontSize: '20px', 
    color: colors.darkGrey, 
    opacity: 0.8, 
    marginBottom: '30px',
    lineHeight: 1.6,
    fontFamily: typography.fontFamily,
  },
  paragraph: {
    fontSize: '16px', 
    color: colors.darkGrey, 
    opacity: 0.9, 
    lineHeight: 1.7,
    marginBottom: '20px',
    fontFamily: typography.fontFamily,
  },
  splitLayout: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '40px', 
    flexWrap: 'wrap' // Basic responsiveness
  },
  splitText: {
    flex: 1, 
    minWidth: '300px'
  },
  splitVisual: {
    flex: 1, 
    minWidth: '300px', 
    backgroundColor: colors.lightGrey, 
    height: '400px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '8px', 
    color: colors.darkGrey 
  },
   grid3Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive grid
    gap: '30px',
  },
};

// --- Mock Components for Structure ---

const StickyNavBar = () => (
  <nav style={{
    position: 'sticky', 
    top: 0, 
    backgroundColor: colors.white, 
    zIndex: 100, 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
    padding: '15px 20px',
    fontFamily: typography.fontFamily,
  }}>
    <div style={{...commonStyles.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontWeight: 'bold', color: colors.darkGrey}}>Prysma Logo</div>
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <a href="#" style={{color: colors.darkGrey, textDecoration: 'none'}}>About</a>
        <a href="#" style={{color: colors.darkGrey, textDecoration: 'none'}}>Features</a>
        <a href="#" style={{color: colors.darkGrey, textDecoration: 'none'}}>Pricing</a>
        <a href="#" style={{color: colors.darkGrey, textDecoration: 'none'}}>Support</a>
        <button style={{...commonStyles.button, ...commonStyles.primaryButton}}>Create Your Card</button>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}>
    <div style={{...commonStyles.container, ...commonStyles.splitLayout}}>
      <div style={commonStyles.splitText}>
        {/* Optional Badge */} 
        <span style={{ display: 'inline-block', background: colors.lightGrey, color: colors.darkGrey, padding: '5px 10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>
          Built by creators, for professionals.
        </span>
        <h1 style={commonStyles.h1}>Your career. One clear link.</h1>
        <p style={commonStyles.subheadline}>Prysma helps you build a digital card that puts your best work, projects, and socials in one professional place.</p>
        <div style={{display: 'flex', gap: '15px'}}>
          <button style={{...commonStyles.button, ...commonStyles.primaryButton}}>Start Free</button>
          <button style={{...commonStyles.button, ...commonStyles.secondaryButton}}>Watch Demo</button>
        </div>
      </div>
      <div style={commonStyles.splitVisual}>
        [App Mockup Placeholder - Digital Card]
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <div style={commonStyles.container}>
      <h2 style={commonStyles.h2}>What You Can Do with Prysma</h2>
      <div style={commonStyles.grid3Col}>
        {/* Feature 1 */} 
        <div style={{background: colors.white, padding: '25px', borderRadius: '8px', textAlign: 'center'}}>
           <div style={{fontSize: '40px', marginBottom: '15px'}}>💡</div> {/* Placeholder Icon */} 
           <h3 style={{...commonStyles.h3, textAlign: 'center'}}>Smart Profile</h3>
           <p style={commonStyles.paragraph}>One place for your bio, links, resume, and more.</p>
        </div>
        {/* Feature 2 */} 
        <div style={{background: colors.white, padding: '25px', borderRadius: '8px', textAlign: 'center'}}>
           <div style={{fontSize: '40px', marginBottom: '15px'}}>✨</div> {/* Placeholder Icon */} 
           <h3 style={{...commonStyles.h3, textAlign: 'center'}}>Professional Look</h3>
           <p style={commonStyles.paragraph}>Modern design that builds trust and clarity.</p>
        </div>
        {/* Feature 3 */} 
        <div style={{background: colors.white, padding: '25px', borderRadius: '8px', textAlign: 'center'}}>
          <div style={{fontSize: '40px', marginBottom: '15px'}}>📊</div> {/* Placeholder Icon */} 
           <h3 style={{...commonStyles.h3, textAlign: 'center'}}>Insights & Control</h3>
           <p style={commonStyles.paragraph}>See who's viewing your card and optimize.</p>
        </div>
      </div>
    </div>
  </section>
);

const UseCaseSection = () => (
   <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}>
    <div style={{...commonStyles.container, ...commonStyles.splitLayout, flexDirection: 'row-reverse' /* Visual on left */}}>
      <div style={commonStyles.splitText}>
        <h3 style={commonStyles.h3}>For creators, freelancers, job seekers and founders</h3>
        <p style={commonStyles.paragraph}>Whether you're sharing a portfolio, centralizing your online presence, or applying for your next role — Prysma keeps your professional identity clear and in control.</p>
        {/* Maybe add bullet points or specific examples */} 
      </div>
      <div style={commonStyles.splitVisual}>
        [Mockups Placeholder - Different User Cards]
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <div style={commonStyles.container}>
      <h2 style={commonStyles.h2}>Start Free. Upgrade for More.</h2>
      {/* Simplified pricing display - could use cards */} 
      <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
        <p style={commonStyles.paragraph}><strong>Free Plan:</strong> 1 card, core features, basic customization.</p>
        <p style={commonStyles.paragraph}><strong>Pro Plan (€4.99/mo):</strong> Unlimited cards, advanced analytics, custom domain support, and more.</p>
        <button style={{...commonStyles.button, ...commonStyles.primaryButton, marginTop: '20px'}}>See Plans</button>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.white}}>
    <div style={{...commonStyles.container, ...commonStyles.splitLayout}}>
       {/* Large Testimonial */} 
      <div style={{...commonStyles.splitText, background: colors.lightGrey, padding: '30px', borderRadius: '8px'}}>
         <p style={{...commonStyles.paragraph, fontSize: '20px', fontStyle: 'italic', marginBottom: '20px'}}>"This made my resume click-ready and finally gave me one link to share everywhere. Simple, fast, and professional."</p>
         <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{width: '50px', height: '50px', borderRadius: '50%', background: colors.bluePrimary, color: colors.white, display:'flex', alignItems:'center', justifyContent:'center'}}>AV</div> {/* Avatar Placeholder */} 
            <div>
              <div style={{fontWeight: 'bold', color: colors.darkGrey}}>User Name</div>
              <div style={{fontSize: '14px', color: colors.darkGrey, opacity: 0.8}}>Title, Company</div>
            </div>
         </div>
      </div>
       {/* Smaller Testimonials Grid (Simplified) */} 
      <div style={{...commonStyles.splitVisual, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: 'none', height: 'auto'}}>
         <div style={{background: colors.lightGrey, padding: '15px', borderRadius: '8px', fontSize: '14px'}}>
            <p>"Finally a profile that looks like me."</p>
            <small>- Designer</small>
         </div>
          <div style={{background: colors.lightGrey, padding: '15px', borderRadius: '8px', fontSize: '14px'}}>
            <p>"Simple, fast, and professional."</p>
            <small>- Freelancer</small>
         </div>
          <div style={{background: colors.lightGrey, padding: '15px', borderRadius: '8px', fontSize: '14px'}}>
            <p>"Great for sharing my portfolio."</p>
            <small>- Developer</small>
         </div>
          <div style={{background: colors.lightGrey, padding: '15px', borderRadius: '8px', fontSize: '14px'}}>
            <p>"So much cleaner than Linktree."</p>
            <small>- Coach</small>
         </div>
      </div>
    </div>
  </section>
);

const CreatorStorySection = () => (
  <section style={{...commonStyles.sectionPadding, backgroundColor: colors.lightGrey}}>
    <div style={{...commonStyles.container, textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
       <h2 style={commonStyles.h2}>Why I Built Prysma</h2>
       <p style={commonStyles.paragraph}>[Founder's story placeholder - explain the motivation behind creating Prysma, focusing on the problem of fragmented professional links and the need for clarity.]</p>
       <button style={{...commonStyles.button, ...commonStyles.secondaryButton}}>Follow the build on X</button>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{backgroundColor: colors.darkGrey, color: colors.white, padding: '40px 20px'}}>
     <div style={{...commonStyles.container, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px'}}>
        {/* Left Side */} 
        <div>
           <div style={{fontWeight: 'bold', fontSize: '24px', marginBottom: '10px'}}>Prysma Logo</div>
           <p style={{fontSize: '14px', opacity: 0.8, marginBottom: '15px'}}>Made with structure and clarity</p>
           {/* Add link */} 
        </div>
        {/* Right Side */} 
        <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
           <div>
              <h4 style={{marginBottom: '10px', fontWeight: 'bold'}}>Quick Links</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', opacity: 0.9}}>
                 <li style={{marginBottom: '8px'}}><a href="#" style={{color: colors.white, textDecoration: 'none'}}>Features</a></li>
                 <li style={{marginBottom: '8px'}}><a href="#" style={{color: colors.white, textDecoration: 'none'}}>Pricing</a></li>
                 <li style={{marginBottom: '8px'}}><a href="#" style={{color: colors.white, textDecoration: 'none'}}>Support</a></li>
                 <li style={{marginBottom: '8px'}}><a href="#" style={{color: colors.white, textDecoration: 'none'}}>Terms</a></li>
                 <li><a href="#" style={{color: colors.white, textDecoration: 'none'}}>Privacy</a></li>
              </ul>
           </div>
           <div>
              <h4 style={{marginBottom: '10px', fontWeight: 'bold'}}>Stay Updated</h4>
              <input type="email" placeholder="Enter your email" style={{padding: '8px', borderRadius: '4px', border: 'none', marginRight: '5px'}}/>
              <button style={{...commonStyles.button, ...commonStyles.primaryButton, padding: '8px 15px', fontSize: '14px'}}>Sign Up</button>
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                 {/* Social Icons Placeholders */} 
                 <span>X</span> <span>YT</span> <span>Email</span>
              </div>
           </div>
        </div>
     </div>
     <div style={{textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${colors.lightGrey}33`, fontSize: '12px', opacity: 0.7}}>
       © Prysma {new Date().getFullYear()}
     </div>
  </footer>
);

// --- Main Page Component ---
export default function LandingSketchPage() {
  return (
    <div style={{backgroundColor: colors.white, color: colors.darkGrey}}>
      <StickyNavBar />
      <HeroSection />
      <FeaturesSection />
      <UseCaseSection />
      <PricingSection />
      <TestimonialsSection />
      <CreatorStorySection />
      <Footer />
    </div>
  );
} 