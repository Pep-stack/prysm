'use client';

import React, { useState, useEffect } from 'react';
import { LuCircleHelp, LuChevronDown, LuChevronRight } from 'react-icons/lu';
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';
import { supabase } from '../../../lib/supabase';

export default function FAQSectionContent({ section, profile, user, styles = {} }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [faqData, setFaqData] = useState([]);
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  
  // Load FAQ data directly from database if profile.faq is corrupted
  useEffect(() => {
    const loadFAQData = async () => {
      if (!user?.id) return;
      
      console.log('🔍 FAQ-LOAD: Starting FAQ data load for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('faq')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('❌ FAQ-LOAD: Error loading FAQ data:', error);
          return;
        }
        
        console.log('🔍 FAQ-LOAD: Raw database response:', {
          data,
          hasFAQ: !!data?.faq,
          faqType: typeof data?.faq
        });
        
        if (data?.faq) {
          try {
            const parsedFAQ = typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq;
            console.log('🔍 FAQ-LOAD: Parsed FAQ data:', {
              parsedFAQ,
              isArray: Array.isArray(parsedFAQ),
              length: Array.isArray(parsedFAQ) ? parsedFAQ.length : 'not array'
            });
            
            if (Array.isArray(parsedFAQ)) {
              const cleanFAQData = parsedFAQ.map(item => ({
                id: item.id,
                question: item.question,
                answer: item.answer
              }));
              
              console.log('✅ FAQ-LOAD: Successfully loaded FAQ data from database:', {
                cleanFAQData,
                length: cleanFAQData.length
              });
              
              setFaqData(cleanFAQData);
              return;
            }
          } catch (parseError) {
            console.error('❌ FAQ-LOAD: Error parsing FAQ data:', parseError);
          }
        }
        
        console.log('🔍 FAQ-LOAD: No FAQ data found in database');
        setFaqData([]);
      } catch (error) {
        console.error('❌ FAQ-LOAD: Unexpected error:', error);
        setFaqData([]);
      }
    };
    
    loadFAQData();
  }, [user?.id]);
  
  // Log the FAQ data for debugging
  console.log('🔍 FAQ-DATA: FAQ data for rendering:', {
    profileFAQ: profile?.faq,
    sectionValue: section?.value,
    parsedFAQData: faqData,
    faqDataLength: faqData.length
  });
  
  // Section styling
  const defaultSectionStyle = {
    padding: '32px',
    borderRadius: '20px',
    background: settings.background_color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: settings.text_color || '#ffffff',
    fontFamily: settings.font_family || 'Inter, sans-serif',
    fontSize: settings.font_size || '16px',
    fontWeight: settings.font_weight || '400',
    textAlign: settings.text_align || 'left',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: settings.border_style || 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const defaultSectionTitleStyle = {
    fontSize: settings.title_font_size || '28px',
    fontWeight: settings.title_font_weight || '700',
    marginBottom: '24px',
    color: settings.title_color || '#ffffff',
    textAlign: settings.title_align || 'left'
  };

  // Use provided styles or defaults
  const finalSectionStyle = { ...defaultSectionStyle, ...styles.sectionStyle };
  const finalSectionTitleStyle = { ...defaultSectionTitleStyle, ...styles.sectionTitleStyle };

  // Toggle FAQ item
  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // If no FAQ data, show elegant placeholder
  if (!faqData || faqData.length === 0) {
    return (
      <div style={finalSectionStyle}>
        <div style={finalSectionTitleStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LuCircleHelp size={20} style={{ color: 'white' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: 'white' }}>
              Frequently Asked Questions
            </h3>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontStyle: 'italic'
        }}>
          <LuCircleHelp size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>
            No FAQs added yet. Add frequently asked questions to help your visitors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={finalSectionStyle}>
      {/* Section Header */}
      <div style={finalSectionTitleStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LuCircleHelp size={20} style={{ color: 'white' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: 'white' }}>
            Frequently Asked Questions
          </h3>
        </div>
      </div>

      {/* FAQ Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqData.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          
          return (
            <div
              key={item.id || index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ flex: 1, marginRight: '16px' }}>
                  {item.question}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  transition: 'transform 0.3s ease'
                }}>
                  {isExpanded ? (
                    <LuChevronDown size={20} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  ) : (
                    <LuChevronRight size={20} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  )}
                </div>
              </button>

              {/* Answer Content */}
              {isExpanded && (
                <div
                  style={{
                    padding: '0 20px 16px 20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'slideDown 0.3s ease'
                  }}
                >
                  <p style={{
                    margin: '16px 0 0 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontWeight: '400'
                  }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
} 