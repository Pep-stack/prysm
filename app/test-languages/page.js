'use client';

import React from 'react';
import LanguagesSectionContent from '../../src/components/card/cardSections/LanguagesSectionContent';

// Test data to simulate profiles with different language combinations
const testProfile1 = {
  languages: 'en,nl,de,fr,ja,zh' // All should have flags
};

const testProfile2 = {
  languages: 'es,it,pt,ko,ru,ar' // All should have flags
};

const testProfile3 = {
  languages: 'sv,no,da,fi,pl,cs' // All should have flags (Northern/Eastern European)
};

const testProfile4 = {
  languages: 'hi,th,vi,id,tr,he' // All should have flags (Asian/Middle Eastern)
};

const testStyles = {
  sectionStyle: {
    padding: '20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    marginBottom: '20px'
  },
  sectionTitleStyle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  placeholderStyle: {
    color: '#666',
    fontStyle: 'italic'
  }
};

export default function TestLanguagesPage() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>Language Section Test - With Flags</h1>
      <p style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>All languages shown should now have corresponding flag icons and transparent backgrounds.</p>
      
      <h2 style={{ color: 'white', marginTop: '30px' }}>Test 1: Western European + Asian Languages</h2>
      <LanguagesSectionContent 
        profile={testProfile1}
        styles={testStyles}
        isEditing={false}
      />
      
      <h2 style={{ color: 'white', marginTop: '30px' }}>Test 2: Southern European + Middle Eastern Languages</h2>
      <LanguagesSectionContent 
        profile={testProfile2}
        styles={testStyles}
        isEditing={false}
      />
      
      <h2 style={{ color: 'white', marginTop: '30px' }}>Test 3: Northern/Eastern European Languages</h2>
      <LanguagesSectionContent 
        profile={testProfile3}
        styles={testStyles}
        isEditing={false}
      />
      
      <h2 style={{ color: 'white', marginTop: '30px' }}>Test 4: Asian/Middle Eastern Languages</h2>
      <LanguagesSectionContent 
        profile={testProfile4}
        styles={testStyles}
        isEditing={false}
      />
      
      <h2 style={{ color: 'white', marginTop: '30px' }}>Test 5: Empty Languages</h2>
      <LanguagesSectionContent 
        profile={{}}
        styles={testStyles}
        isEditing={false}
      />
    </div>
  );
} 