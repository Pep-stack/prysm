import React, { useMemo, useEffect, useState } from "react";
import Image from 'next/image';
import { LuHeart, LuCalendar, LuBriefcase, LuUser, LuQuote, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { supabase } from "../../../lib/supabase";
import ClientTestimonialSelector from '../../shared/ClientTestimonialSelector';
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

const ClientTestimonialsSectionContent = ({ profile, styles, isEditing, onSave, onCancel, user }) => {
  const { sectionStyle, sectionTitleStyle, placeholderStyle } = styles || {};
  const { settings } = useDesignSettings();
  
  // Get text color from design settings
  const textColor = settings.text_color || '#000000';
  const [testimonialsFromDB, setTestimonialsFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState([]);
  
  // Debug logging for profile data
  console.log('🔍 CARD-TESTIMONIALS: Component received profile:', {
    profileId: profile?.id,
    profileKeys: profile ? Object.keys(profile) : [],
    hasProfile: !!profile,
    profileType: typeof profile
  });
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      console.log('🔍 CARD-TESTIMONIALS: Starting fetch with profile:', {
        profileId: profile?.id,
        hasProfile: !!profile,
        profileKeys: profile ? Object.keys(profile) : []
      });
      
      if (!profile?.id) {
        console.log('❌ CARD-TESTIMONIALS: No profile ID, skipping fetch');
        return;
      }
      
      try {
        setLoading(true);
        console.log('🔍 CARD-TESTIMONIALS: Fetching from database for user:', profile.id);
        
        // First check if table exists and we can access it
        console.log('🔍 CARD-TESTIMONIALS: Checking table access...');
        const { count: tableCheck } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        console.log('🔍 CARD-TESTIMONIALS: Table accessible, total count:', tableCheck);
        
        // Also check all testimonials to see if there are any
        const { data: allTestimonials } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        console.log('🔍 CARD-TESTIMONIALS: All testimonials in DB:', allTestimonials);
        
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        console.log('🔍 CARD-TESTIMONIALS: Database response:', { data, error });

        if (error) {
          console.error('❌ CARD-TESTIMONIALS: Error fetching testimonials:', error);
          return;
        }

        console.log('📸 CARD-TESTIMONIALS: Successfully fetched testimonials from DB:', data);
        setTestimonialsFromDB(data || []);
      } catch (err) {
        console.error('❌ CARD-TESTIMONIALS: Error fetching testimonials:', err);
      } finally {
        setLoading(false);
        console.log('🔍 CARD-TESTIMONIALS: Fetch completed, loading:', false);
      }
    };

    fetchTestimonials();
    
    // Set up real-time subscription to testimonials changes
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials',
          filter: `user_id=eq.${profile?.id}`
        },
        (payload) => {
          console.log('🔄 CARD-TESTIMONIALS: Real-time update received:', payload);
          // Refetch testimonials when there are changes
          fetchTestimonials();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 CARD-TESTIMONIALS: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  // Use testimonials from database if available, otherwise fall back to profile data
  const initialTestimonialsData = useMemo(() => {
    console.log('🔍 CARD-TESTIMONIALS: Computing initial data with:', {
      testimonialsFromDBLength: testimonialsFromDB.length,
      testimonialsFromDB,
      profileTestimonials: profile?.testimonials,
      loading
    });
    
    if (testimonialsFromDB.length > 0) {
      console.log('🔍 CARD-TESTIMONIALS: Using testimonials from DB:', testimonialsFromDB);
      return testimonialsFromDB;
    }
    
    console.log('🔍 CARD-TESTIMONIALS: Profile testimonials data:', profile?.testimonials);
    const parsed = parseTestimonialsData(profile?.testimonials);
    console.log('🔍 CARD-TESTIMONIALS: Parsed testimonials data:', parsed);
    return parsed;
  }, [testimonialsFromDB, profile?.testimonials, loading]);

  // Reset carousel index when testimonials change
  useEffect(() => {
    setCurrentIndex(0);
  }, [initialTestimonialsData]);

  // Refresh testimonials when window gains focus (fallback for real-time)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 CARD-TESTIMONIALS: Window focused, refreshing testimonials');
      // Trigger a refetch by updating the dependency
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Touch handling for swipe gestures
  const [touchStartX, setTouchStartX] = useState(0);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % initialTestimonialsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + initialTestimonialsData.length) % initialTestimonialsData.length);
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

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Initialize selection state for editing
  useEffect(() => {
    if (isEditing) {
      setCurrentSelection(initialTestimonialsData);
    }
  }, [isEditing, initialTestimonialsData]);

  const handleSave = () => {
    if (onSave) {
      onSave(currentSelection);
    }
  };

  // Render editing UI
  if (isEditing) {
    return (
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Edit Client Testimonials</h3>
        <ClientTestimonialSelector 
          value={currentSelection}
          onChange={setCurrentSelection}
          userId={user?.id}
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
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // Render single testimonial content - compact style like other sections
  const renderTestimonialCard = (entry, index, isCarousel = false) => {
    const getImageUrl = () => {
      let imageUrl = null;
      
      // Handle photo_url (from database)
      if (entry.photo_url) {
        if (typeof entry.photo_url === 'string' && entry.photo_url.trim() !== '') {
          imageUrl = entry.photo_url;
        } else if (entry.photo_url && typeof entry.photo_url === 'object') {
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
      
      return imageUrl;
    };

    return (
      <div 
        key={entry.id || index} 
        style={{
          marginBottom: '12px',
          padding: '12px 0',
          borderBottom: (!isCarousel && index < initialTestimonialsData.length - 1) ? `1px solid ${textColor}15` : 'none'
        }}
      >
        {/* Header with client info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            {/* Compact avatar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              backgroundColor: '#ec4899',
              borderRadius: '50%',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {getImageUrl() ? (
                <Image 
                  src={getImageUrl()}
                  alt={entry.name} 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackIcon = e.target.nextSibling;
                    if (fallbackIcon) {
                      fallbackIcon.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <LuUser 
                size={24} 
                style={{ 
                  color: 'white',
                  display: getImageUrl() ? 'none' : 'flex'
                }} 
              />
            </div>
            
            {/* Client info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{
                margin: '0 0 2px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: textColor,
                lineHeight: '1.3'
              }}>
                {entry.name}
              </h4>
              {entry.profession && (
                <p style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  color: textColor,
                  opacity: 0.7,
                  fontWeight: '500'
                }}>
                  {entry.profession}
                </p>
              )}
            </div>
          </div>
          
          {/* Date badge */}
          {entry.date && (
            <div style={{
              padding: '2px 6px',
              backgroundColor: `${textColor}15`,
              borderRadius: '4px',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '11px',
                color: textColor,
                fontWeight: '500',
                opacity: 0.8
              }}>
                {new Date(entry.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Compact quote */}
        {entry.quote && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: textColor,
              lineHeight: '1.4',
              opacity: 0.7,
              fontStyle: 'italic',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              &ldquo;{entry.quote}&rdquo;
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render display UI
  console.log('🔍 CARD-TESTIMONIALS: Rendering with data:', {
    initialTestimonialsDataLength: initialTestimonialsData.length,
    initialTestimonialsData,
    loading,
    hasProfile: !!profile
  });
  
  if (initialTestimonialsData.length > 0) {
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
            <LuHeart style={{ color: 'white', fontSize: '11px' }} />
          </div>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: '16px',
            fontWeight: '600',
            color: textColor,
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Client Testimonials
          </h2>
        </div>
        
        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current testimonial */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderTestimonialCard(initialTestimonialsData[currentIndex], currentIndex, true)}
          </div>

          {/* Navigation dots - Only show if more than 1 testimonial */}
          {initialTestimonialsData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              {initialTestimonialsData.map((_, index) => (
                <button
                  key={index}
                  style={{
                    width: index === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: index === currentIndex 
                      ? textColor
                      : `${textColor}30`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)'
                  }}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          )}
        </div>
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
        <LuHeart size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: textColor,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          No testimonials added yet. Add client feedback and reviews.
        </p>
      </div>
    );
  }
};

export default ClientTestimonialsSectionContent; 