'use client'; // Might be needed if styles are used in client components

// --- Helper Styles (based on guidelines) ---
export const colors = {
  white: '#FFFFFF',
  lightGrey: '#F3F4F6',
  darkGrey: '#1F2937',
  bluePrimary: '#3B82F6',
  lightBlueHover: '#60A5FA',
};

export const typography = {
  fontFamily: 'Poppins, sans-serif', // Add Poppins to your global styles/layout for this to work
};

export const commonStyles = {
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

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}; 