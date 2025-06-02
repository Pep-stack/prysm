'use client';

import React, { useState, useEffect } from 'react';
import { LuGraduationCap, LuCalendar, LuMapPin, LuClock, LuChevronLeft, LuChevronRight, LuList, LuGrid3X3 } from 'react-icons/lu';
import EducationSelector from '../../shared/EducationSelector';

export default function EducationSectionContent({ profile, styles, isEditing, onSave, onCancel }) {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  
  // State to hold the selected education during editing
  const [currentSelection, setCurrentSelection] = useState([]);
  // New state for view mode (list or carousel)
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'carousel'
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse initial education data from profile
  const parseEducationData = (educationData) => {
    console.log('🔍 Parsing education data:', {
      type: typeof educationData,
      data: educationData,
      isArray: Array.isArray(educationData)
    });
    
    // Handle different data types safely
    if (Array.isArray(educationData)) {
      console.log('✅ Education data is already an array');
      return educationData.filter(entry => entry && typeof entry === 'object');
    }
    
    if (typeof educationData === 'string' && educationData.trim()) {
      try {
        const parsed = JSON.parse(educationData);
        console.log('✅ Successfully parsed education JSON:', parsed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('❌ Failed to parse education JSON:', e);
        return [];
      }
    }
    
    // Handle null, undefined, or other types
    console.log('ℹ️ Education data is null/undefined or other type');
    return [];
  };

  const initialEducationData = parseEducationData(profile?.education);
  
  // Initialize local state when editing starts
  useEffect(() => {
    console.log('🔄 EducationSectionContent useEffect triggered:', {
      isEditing,
      initialEducationData,
      currentSelection
    });
    
    if (isEditing) {
      setCurrentSelection(initialEducationData);
      console.log('📝 Set currentSelection to:', initialEducationData);
    }
  }, [isEditing]);

  // Reset carousel index when data changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialEducationData]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection); // Pass the array of education entries
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % initialEducationData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + initialEducationData.length) % initialEducationData.length);
  };

  // Render single education card (reusable for both views)
  const renderEducationCard = (entry, index, isCarousel = false) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        ...(isCarousel && {
          minHeight: '200px',
          width: '100%'
        })
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Current Education Badge */}
      {entry.current && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: '#10b981',
          color: 'white',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <LuClock size={10} />
          Current
        </div>
      )}
      
      {/* Header with degree and institution */}
      <div style={{ marginBottom: '16px', paddingRight: entry.current ? '70px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            flexShrink: 0
          }}>
            <LuGraduationCap size={20} style={{ color: '#64748b' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b',
              lineHeight: '1.4',
              marginBottom: '4px'
            }}>
              {entry.degree}{entry.field ? ` in ${entry.field}` : ''}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: '15px', 
              color: '#475569',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <LuMapPin size={14} style={{ color: '#64748b', flexShrink: 0 }} />
              {entry.institution}
            </p>
          </div>
        </div>
      </div>

      {/* Date range */}
      {(entry.startDate || entry.endDate || entry.current) && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: entry.description ? '12px' : '0',
          padding: '8px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <LuCalendar size={14} style={{ color: '#64748b', flexShrink: 0 }} />
          <span style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {entry.startDate && formatDate(entry.startDate)}
            {entry.startDate && (entry.endDate || entry.current) && ' — '}
            {entry.current ? 'Present' : (entry.endDate && formatDate(entry.endDate))}
          </span>
        </div>
      )}

      {/* Description */}
      {entry.description && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          borderLeft: '3px solid #e2e8f0'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#475569', 
            lineHeight: '1.6',
            fontStyle: 'normal'
          }}>
            {entry.description}
          </p>
        </div>
      )}
    </div>
  );

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Education</h3>
        <EducationSelector 
          value={currentSelection}
          onChange={setCurrentSelection} // Update local state
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Save Education
          </button>
        </div>
      </div>
    );
  }

  // Render display UI (education entries)
  if (initialEducationData.length > 0) {
    return (
      <div style={sectionStyle} title="Click to edit education">
        {/* Header with title and view toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={sectionTitleStyle}>Education</h3>
          {initialEducationData.length > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  backgroundColor: viewMode === 'list' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'list' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LuList size={14} />
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  backgroundColor: viewMode === 'carousel' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'carousel' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LuGrid3X3 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {initialEducationData.map((entry, index) => renderEducationCard(entry, index))}
          </div>
        )}

        {/* Carousel View */}
        {viewMode === 'carousel' && (
          <div style={{ position: 'relative' }}>
            {/* Navigation buttons */}
            {initialEducationData.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <LuChevronLeft size={16} style={{ color: '#64748b' }} />
                </button>

                <button
                  onClick={nextSlide}
                  style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <LuChevronRight size={16} style={{ color: '#64748b' }} />
                </button>
              </>
            )}

            {/* Carousel content */}
            <div style={{ padding: '0 16px' }}>
              {renderEducationCard(initialEducationData[currentIndex], currentIndex, true)}
            </div>

            {/* Carousel indicators */}
            {initialEducationData.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '16px'
              }}>
                {initialEducationData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === currentIndex ? '#3b82f6' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    // Show placeholder if no education entries
    return (
      <div style={placeholderStyle} title="Click to edit education">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <LuGraduationCap size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Click to add your education history
          </p>
        </div>
      </div>
    );
  }
} 