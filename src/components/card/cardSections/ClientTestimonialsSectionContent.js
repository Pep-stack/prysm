import React, { useMemo, useEffect, useState } from "react";
import { LuHeart, LuCalendar, LuBriefcase, LuUser, LuQuote } from "react-icons/lu";
import { supabase } from "../../../lib/supabase";
import { useDesignSettings } from '../../dashboard/DesignSettingsContext';

// Parse testimonials data from profile
const parseTestimonialsData = (testimonialsData) => {
  if (Array.isArray(testimonialsData)) {
    return testimonialsData.filter(entry => entry && typeof entry === 'object');
  }
  
  if (typeof testimonialsData === 'string' && testimonialsData.trim()) {
    try {
      const parsed = JSON.parse(testimonialsData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  
  return [];
};

const ClientTestimonialsSectionContent = ({ profile, styles }) => {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  const [testimonialsFromDB, setTestimonialsFromDB] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!profile?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching testimonials:', error);
          return;
        }

        console.log('📸 Fetched testimonials from DB:', data);
        setTestimonialsFromDB(data || []);
      } catch (err) {
        console.error('❌ Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [profile?.id]);

  // Use testimonials from database if available, otherwise fall back to profile data
  const initialTestimonialsData = useMemo(() => {
    if (testimonialsFromDB.length > 0) {
      console.log('🔍 Using testimonials from DB:', testimonialsFromDB);
      return testimonialsFromDB;
    }
    
    console.log('🔍 Profile testimonials data:', profile?.testimonials);
    const parsed = parseTestimonialsData(profile?.testimonials);
    console.log('🔍 Parsed testimonials data:', parsed);
    return parsed;
  }, [testimonialsFromDB, profile?.testimonials]);

  // Render single testimonial content
  const renderTestimonialCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: '20px 0',
        borderBottom: index < initialTestimonialsData.length - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
        width: '100%'
      }}
    >
      {/* Header with client info */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: textColor,
            opacity: 0.8,
            borderRadius: '50%',
            flexShrink: 0,
            border: '3px solid rgba(255, 255, 255, 0.6)',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {(() => {
              let imageUrl = null;
              
              // Handle photo_url (from database)
              if (entry.photo_url) {
                if (typeof entry.photo_url === 'string' && entry.photo_url.trim() !== '') {
                  imageUrl = entry.photo_url;
                } else if (entry.photo_url && typeof entry.photo_url === 'object') {
                  // If it's a Supabase URL object, extract the public URL
                  if (entry.photo_url.publicUrl) {
                    imageUrl = entry.photo_url.publicUrl;
                  }
                }
              }
              
              // Handle photo (from form) if no photo_url
              if (!imageUrl && entry.photo) {
                if (typeof entry.photo === 'string' && entry.photo.trim() !== '') {
                  imageUrl = entry.photo;
                } else if (entry.photo instanceof File) {
                  imageUrl = URL.createObjectURL(entry.photo);
                }
              }
              
              // Only render img if we have a valid URL
              if (imageUrl) {
                return (
                  <img 
                    src={imageUrl}
                    alt={entry.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Find the fallback icon and show it
                      const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
                      if (fallbackIcon) {
                        fallbackIcon.style.display = 'flex';
                      }
                    }}
                  />
                );
              }
              
              return null;
            })()}
            <LuHeart 
              size={20} 
              style={{ 
                color: 'white',
                display: 'flex'
              }} 
              className="fallback-icon"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '700', 
              color: textColor,
              lineHeight: '1.3',
              marginBottom: '6px',
              letterSpacing: '-0.01em'
            }}>
              {entry.name}
            </h4>
            {entry.profession && (
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: textColor,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}>
                  <LuBriefcase size={12} style={{ color: 'white' }} />
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  color: textColor,
                  fontWeight: '500',
                  opacity: 0.9
                }}>
                  {entry.profession}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote */}
      {entry.quote && (
        <div style={{
          padding: '16px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          borderLeft: '4px solid ' + textColor,
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '15px', 
            color: textColor, 
            lineHeight: '1.7',
            fontStyle: 'italic',
            fontWeight: '500',
            opacity: 0.9
          }}>
            {entry.quote}
          </p>
        </div>
      )}

      {/* Date */}
      {entry.date && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: textColor,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <LuCalendar size={14} style={{ color: 'white' }} />
          </div>
          <span style={{
            fontSize: '13px',
            color: textColor,
            fontWeight: '600',
            opacity: 0.9
          }}>
            {new Date(entry.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      )}
    </div>
  );

  // Render display UI
  if (initialTestimonialsData.length > 0) {
    return (
      <div style={{
        ...sectionStyle,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} 
      title="Click to edit client testimonials"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      >
        {/* Titel bovenaan in de container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: textColor,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <LuHeart size={14} style={{ color: 'white' }} />
          </div>
          <h3 style={{
            ...sectionTitleStyle,
            fontSize: '18px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em',
            opacity: 0.9
          }}>
            Client Testimonials
          </h3>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          width: '100%'
        }}>
          {initialTestimonialsData.map((entry, index) => renderTestimonialCard(entry, index))}
        </div>
      </div>
    );
  } else {
    // Empty state
    return (
      <div style={placeholderStyle} title="Click to add client testimonials">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
          textAlign: 'center',
          transition: 'all 0.2s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: '#e2e8f0',
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            <LuHeart size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#475569'
          }}>
            Share Client Testimonials
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            Click to add testimonials from your satisfied clients
          </p>
        </div>
      </div>
    );
  }
};

export default ClientTestimonialsSectionContent; 