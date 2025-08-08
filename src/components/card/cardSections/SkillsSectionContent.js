'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LuCode, LuStar, LuClock, LuAward } from 'react-icons/lu';
import SkillsSelector from '../../shared/SkillsSelector';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

export default function SkillsSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // Parse and memoize skills data
  const parseSkillsData = (skillsData) => {
    console.log('🔍 Parsing skills data:', {
      skillsData,
      type: typeof skillsData,
      isArray: Array.isArray(skillsData)
    });
    
    if (Array.isArray(skillsData)) {
      const filtered = skillsData.filter(entry => entry && typeof entry === 'object');
      console.log('✅ Parsed as array, filtered entries:', filtered.length);
      return filtered;
    }
    
    if (typeof skillsData === 'string' && skillsData.trim()) {
      try {
        const parsed = JSON.parse(skillsData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(entry => entry && typeof entry === 'object');
          console.log('✅ Parsed JSON string as array, filtered entries:', filtered.length);
          return filtered;
        } else {
          console.log('⚠️ Parsed JSON but not an array:', parsed);
          return [];
        }
      } catch (e) {
        console.error('❌ Error parsing skills JSON:', e);
        return [];
      }
    }
    
    console.log('ℹ️ No valid skills data found');
    return [];
  };

  const initialSkillsData = useMemo(() => {
    return parseSkillsData(profile?.skills);
  }, [profile?.skills]);
  
  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialSkillsData);
    }
  }, [isEditing, initialSkillsData]);

  // Reset carousel index when data length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialSkillsData.length]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Carousel navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialSkillsData.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialSkillsData.length) % initialSkillsData.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch handling for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNext(); // Swipe left = next
      } else {
        goToPrev(); // Swipe right = previous
      }
    }
  };

  // Get proficiency color and icon
  const getProficiencyDisplay = (proficiency) => {
    const proficiencyConfig = {
      'beginner': { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)', icon: '⭐', label: 'Beginner' },
      'intermediate': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)', icon: '⭐⭐', label: 'Intermediate' },
      'advanced': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', icon: '⭐⭐⭐', label: 'Advanced' },
      'expert': { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)', icon: '⭐⭐⭐⭐', label: 'Expert' }
    };
    return proficiencyConfig[proficiency] || proficiencyConfig['intermediate'];
  };

  // Render single skill card - compact style like other sections
  const renderSkillCard = (entry, index, isCarousel = false) => {
    const proficiencyDisplay = getProficiencyDisplay(entry.proficiency);
    
    return (
      <div 
        key={entry.id || index} 
        style={{
          marginBottom: '12px',
          padding: '12px 0',
          borderBottom: (!isCarousel && index < initialSkillsData.length - 1) ? `1px solid ${textColor}15` : 'none'
        }}
      >
        {/* Header with skill name and proficiency */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{
              margin: '0 0 2px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: textColor,
              lineHeight: '1.3'
            }}>
              {entry.name || 'Untitled Skill'}
            </h4>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '14px',
              color: textColor,
              opacity: 0.7,
              fontWeight: '500'
            }}>
              {entry.category}
            </p>
          </div>
          
          {/* Proficiency Badge */}
          <div style={{
            padding: '2px 6px',
            backgroundColor: proficiencyDisplay.color,
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            {proficiencyDisplay.label}
          </div>
        </div>

        {/* Compact meta info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Years of Experience */}
          {entry.yearsOfExperience && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              backgroundColor: `${textColor}15`,
              borderRadius: '4px'
            }}>
              <LuClock size={10} style={{ color: textColor, opacity: 0.6 }} />
              <span style={{
                fontSize: '11px',
                color: textColor,
                fontWeight: '500',
                opacity: 0.8
              }}>
                {entry.yearsOfExperience}
              </span>
            </div>
          )}
        </div>

        {/* Compact description (optional, truncated) */}
        {entry.description && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: textColor,
              lineHeight: '1.4',
              opacity: 0.7,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {entry.description}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Skills & Technologies</h3>
        <SkillsSelector 
          value={currentSelection}
          onChange={setCurrentSelection}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Save Skills
          </button>
        </div>
      </div>
    );
  }

  // Display UI
  if (initialSkillsData.length > 0) {
    return (
      <div 
        style={{
          ...sectionStyle,
          padding: '16px',
          margin: '0 0 42px 0',
          background: 'rgba(255, 255, 255, 0.05)',
          border: 'none',
          borderRadius: '12px',
          boxShadow: 'none',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          width: '100%',
          fontFamily: settings.font_family || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Clean section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: settings.icon_color || '#6B7280',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LuCode style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Skills & Technologies
          </h2>
        </div>
        
        {/* Simple list view like other sections */}
        {initialSkillsData.map((skill, index) => 
          renderSkillCard(skill, index, false)
        )}
      </div>
    );
  } else {
    // Empty state
    return (
      <div style={{
        ...sectionStyle,
        textAlign: 'center',
        padding: '40px 20px',
        color: textColor,
        opacity: 0.7
      }}>
        <LuCode size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No skills added yet. Add your technical skills and proficiency levels.
        </p>
      </div>
    );
  }
} 