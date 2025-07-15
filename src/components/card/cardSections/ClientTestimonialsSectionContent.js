import React, { useMemo, useEffect, useState } from "react";
import { LuHeart, LuCalendar, LuBriefcase } from "react-icons/lu";
import { supabase } from "../../../lib/supabase";

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

  // Render single testimonial card
  const renderTestimonialCard = (entry, index) => (
    <div 
      key={entry.id || index} 
      style={{
        position: 'relative',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        minHeight: '180px',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
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
            background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.9) 100%)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            flexShrink: 0,
            border: '3px solid rgba(255, 255, 255, 0.6)',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {(() => {
              // Debug logging
              console.log('🔍 Photo data:', {
                photo_url: entry.photo_url,
                photo: entry.photo,
                photo_url_type: typeof entry.photo_url,
                photo_type: typeof entry.photo
              });
              
              let imageUrl = null;
              
              // Handle photo_url (from database)
              if (entry.photo_url) {
                if (typeof entry.photo_url === 'string' && entry.photo_url.trim() !== '') {
                  imageUrl = entry.photo_url;
                } else if (entry.photo_url && typeof entry.photo_url === 'object') {
                  // If it's a Supabase URL object, extract the public URL
                  if (entry.photo_url.publicUrl) {
                    imageUrl = entry.photo_url.publicUrl;
                  } else {
                    // If it's a different object format, log it
                    console.log('⚠️ photo_url is object:', entry.photo_url);
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
                      console.log('❌ Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                      // Find the fallback icon and show it
                      const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
                      if (fallbackIcon) {
                        fallbackIcon.style.display = 'flex';
                      }
                    }}
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', e.target.src);
                    }}
                  />
                );
              }
              
              return null;
            })()}
            <LuHeart 
              size={20} 
              style={{ 
                color: '#475569',
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
              color: '#0f172a',
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
                background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
                backdropFilter: 'blur(6px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                <LuBriefcase size={12} style={{ color: '#64748b', flexShrink: 0 }} />
                <span style={{ 
                  fontSize: '13px', 
                  color: '#475569',
                  fontWeight: '500'
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
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          borderLeft: '4px solid #00C48C',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '15px', 
            color: '#374151', 
            lineHeight: '1.7',
            fontStyle: 'italic',
            fontWeight: '500'
          }}>
            "{entry.quote}"
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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(6px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          <LuCalendar size={14} style={{ color: '#64748b', flexShrink: 0 }} />
          <span style={{
            fontSize: '13px',
            color: '#475569',
            fontWeight: '600'
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
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }} title="Click to edit client testimonials">
        <h3 style={{
          ...sectionTitleStyle,
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '20px',
          letterSpacing: '-0.02em'
        }}>
          Client Testimonials
        </h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
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