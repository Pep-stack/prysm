import React, { useMemo, useEffect, useState } from "react";
import { LuHeart, LuCalendar, LuBriefcase, LuUser, LuQuote, LuChevronLeft, LuChevronRight } from "react-icons/lu";
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

  // Render single testimonial content
  const renderTestimonialCard = (entry, index, isCarousel = false) => {
    return (
      <div 
        key={entry.id || index} 
        style={{
          position: 'relative',
          padding: isCarousel ? '0' : '20px 0',
          borderBottom: (!isCarousel && index < initialTestimonialsData.length - 1) ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
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
              backgroundColor: '#374151',
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
              <LuUser 
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
                  padding: '4px 8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                  }}>
                    <LuBriefcase size={10} style={{ color: 'white' }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: textColor,
                    fontWeight: '600',
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
            position: 'relative',
            padding: '16px 20px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
            marginBottom: '12px'
          }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              width: '20px',
              height: '20px',
              backgroundColor: '#374151',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}>
              <LuQuote size={12} style={{ color: 'white' }} />
            </div>
            <p style={{
              margin: 0,
              marginLeft: '32px',
              fontSize: '14px',
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
              backgroundColor: '#374151',
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
            backgroundColor: '#374151',
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
        
        {/* Carousel content - Always show carousel for better UX */}
        <div style={{ position: 'relative' }}>
          {/* Current testimonial */}
          <div style={{ 
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderTestimonialCard(initialTestimonialsData[currentIndex], currentIndex, true)}
          </div>



          {/* Dots indicator - Only show if more than 1 testimonial */}
          {initialTestimonialsData.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {initialTestimonialsData.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentIndex ? textColor : 'rgba(255, 255, 255, 0.4)',
                    opacity: index === currentIndex ? 0.8 : 0.4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Empty state with standardized preview UI
    return (
      <div style={{
        ...placeholderStyle,
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
      }} title="Click to add client testimonials">
        {/* Title at the top of the container */}
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
            backgroundColor: '#374151',
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          textAlign: 'center'
        }}>
          <LuHeart size={48} style={{ color: textColor, opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ 
            margin: 0, 
            fontSize: '16px',
            color: textColor,
            opacity: 0.7,
            fontWeight: '500'
          }}>
            Click to add testimonials from your satisfied clients
          </p>
        </div>
      </div>
    );
  }
};

export default ClientTestimonialsSectionContent; 