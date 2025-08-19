'use client';

import React from 'react';
import LanguageSelector from '../shared/LanguageSelector';
import EducationSelector from '../shared/EducationSelector';
import ExperienceSelector from '../shared/ExperienceSelector';
import CertificationSelector from '../shared/CertificationSelector';
import ProjectSelector from '../shared/ProjectSelector';
import ClientTestimonialSelector from '../shared/ClientTestimonialSelector';
import SkillsSelector from '../shared/SkillsSelector';
import ServicesSelector from '../shared/ServicesSelector';
import GallerySelector from '../shared/GallerySelector';
import VideoEditor from '../shared/VideoSelector';
import AppointmentsEditor from '../shared/AppointmentsEditor';
import PublicationSelector from '../shared/PublicationSelector';
import CommunitySelector from '../shared/CommunitySelector';
import SubscribeSelector from '../shared/SubscribeSelector';
import FAQSelector from '../shared/FAQSelector';
import TikTokEditor from '../shared/TikTokEditor';
import InstagramEditor from '../shared/InstagramEditor';
import LinkedInEditor from '../shared/LinkedInEditor';
import GitHubEditor from '../shared/GitHubEditor';
import XEditor from '../shared/XEditor';
import SpotifyEditor from '../shared/SpotifyEditor';
import YouTubeEditor from '../shared/YouTubeEditor';
import EmailEditor from '../shared/EmailEditor';
import WhatsAppEditor from '../shared/WhatsAppEditor';
import FacebookEditor from '../shared/FacebookEditor';
import DribbbleEditor from '../shared/DribbbleEditor';
import SnapchatEditor from '../shared/SnapchatEditor';
import RedditEditor from '../shared/RedditEditor';
import PhoneEditor from '../shared/PhoneEditor';
import XHighlightsEditor from '../shared/XHighlightsEditor';
import YouTubeHighlightsEditor from '../shared/YouTubeHighlightsEditor';
import LinkedInHighlightsEditor from '../shared/LinkedInHighlightsEditor';
import TikTokHighlightsEditor from '../shared/TikTokHighlightsEditor';
import InstagramProfileEditor from '../shared/InstagramProfileEditor';
import LinkedInProfileEditor from '../shared/LinkedInProfileEditor';
import XProfileEditor from '../shared/XProfileEditor';
import SpotifyProfileEditor from '../shared/SpotifyProfileEditor';
import SnapchatProfileEditor from '../shared/SnapchatProfileEditor';
import TikTokProfileEditor from '../shared/TikTokProfileEditor';
import BehanceProfileEditor from '../shared/BehanceProfileEditor';
import DribbbleProfileEditor from '../shared/DribbbleProfileEditor';
import GitHubHighlightsEditor from '../shared/GitHubHighlightsEditor';
import SpotifyHighlightsEditor from '../shared/SpotifyHighlightsEditor';
import VimeoHighlightsEditor from '../shared/VimeoHighlightsEditor';
import WebsitePreviewEditor from '../shared/WebsitePreviewEditor';
import CustomProfileEditor from '../shared/CustomProfileEditor';

export default function EditSectionModal({ isOpen, onClose, section, value, onChange, onSave, user }) {
  // Note: Removed the console.log from here during cleanup
  if (!isOpen || !section) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  const modalContentStyle = {
    backgroundColor: 'transparent',
    padding: '0',
    borderRadius: '0',
    boxShadow: 'none',
    width: '100%',
    maxWidth: (section?.editorComponent === 'EducationSelector' || section?.editorComponent === 'ExperienceSelector' || section?.editorComponent === 'CertificationSelector' || section?.editorComponent === 'ProjectSelector' || section?.editorComponent === 'SkillsSelector' || section?.editorComponent === 'ServicesSelector') ? '800px' : '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };
  
  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  };

  const renderInput = () => {
    console.log('🔍 EDIT-MODAL: Rendering input for section:', {
      sectionType: section.type,
      sectionName: section.name,
      editorComponent: section.editorComponent,
      value: value,
      valueType: typeof value,
      isArray: Array.isArray(value)
    });
    
    // Check if a custom editor component is specified
    if (section.editorComponent === 'LanguageSelector') {
      // Ensure 'value' passed to LanguageSelector is an array of selected language codes
      const selectedLanguageCodes = Array.isArray(value) ? value : (value ? value.split(',').map(c => c.trim()) : []);
      return (
        <LanguageSelector 
          value={selectedLanguageCodes} // Pass current codes
          onChange={onChange} // onChange should expect an array of codes
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'EducationSelector') {
      // Ensure 'value' passed to EducationSelector is an array of education objects
      const selectedEducationEntries = Array.isArray(value) ? value : [];
      return (
        <EducationSelector 
          value={selectedEducationEntries} // Pass current education entries
          onChange={onChange} // onChange should expect an array of education objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'ExperienceSelector') {
      // Ensure 'value' passed to ExperienceSelector is an array of experience objects
      const selectedExperienceEntries = Array.isArray(value) ? value : [];
      return (
        <ExperienceSelector 
          value={selectedExperienceEntries} // Pass current experience entries
          onChange={onChange} // onChange should expect an array of experience objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'CertificationSelector') {
      // Ensure 'value' passed to CertificationSelector is an array of certification objects
      const selectedCertificationEntries = Array.isArray(value) ? value : [];
      return (
        <CertificationSelector 
          value={selectedCertificationEntries} // Pass current certification entries
          onChange={onChange} // onChange should expect an array of certification objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'ProjectSelector') {
      // Ensure 'value' passed to ProjectSelector is an array of project objects
      const selectedProjectEntries = Array.isArray(value) ? value : [];
      return (
        <ProjectSelector 
          value={selectedProjectEntries} // Pass current project entries
          onChange={onChange} // onChange should expect an array of project objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'ClientTestimonialSelector') {
      // Ensure 'value' passed to ClientTestimonialSelector is an array of testimonial objects
      const selectedTestimonialEntries = Array.isArray(value) ? value : [];
      
      // Get userId with fallback mechanism
      const userId = user?.id;
      
      console.log('🔍 EDIT-MODAL: ClientTestimonialSelector props', {
        user,
        userId,
        value: selectedTestimonialEntries,
        hasOnChange: !!onChange,
        sectionTitle: section?.title
      });
      
      if (!userId) {
        console.error('❌ EDIT-MODAL: No userId available for ClientTestimonialSelector');
        return (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <p>Error: User not authenticated. Please refresh the page and try again.</p>
          </div>
        );
      }
      
      return (
        <ClientTestimonialSelector 
          value={selectedTestimonialEntries} // Pass current testimonial entries
          onChange={onChange} // onChange should expect an array of testimonial objects
          userId={userId} // Pass user ID for Supabase integration
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'SkillsSelector') {
      console.log('🎯 SKILLS-SELECTOR: Rendering SkillsSelector component');
      // Ensure 'value' passed to SkillsSelector is an array of skill objects
      const selectedSkillEntries = Array.isArray(value) ? value : [];
      return (
        <SkillsSelector 
          value={selectedSkillEntries} // Pass current skill entries
          onChange={onChange} // onChange should expect an array of skill objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'ServicesSelector') {
      console.log('🎯 SERVICES-SELECTOR: Rendering ServicesSelector component');
      // Ensure 'value' passed to ServicesSelector is an array of service objects
      const selectedServiceEntries = Array.isArray(value) ? value : [];
      return (
        <ServicesSelector 
          value={selectedServiceEntries} // Pass current service entries
          onChange={onChange} // onChange should expect an array of service objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'GallerySelector') {
      console.log('🎯 GALLERY-EDITOR: Rendering GalleryEditor component');
      // Ensure 'value' passed to GalleryEditor is an array of gallery objects
      const selectedGalleryEntries = Array.isArray(value) ? value : [];
      return (
        <GallerySelector 
          value={selectedGalleryEntries} // Pass current gallery entries
          onChange={onChange} // onChange should expect an array of gallery objects
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    if (section.editorComponent === 'VideoSelector') {
      console.log('🎯 VIDEO-EDITOR: Rendering VideoEditor component');
      // Ensure 'value' passed to VideoEditor is a video object
      const selectedVideoData = value || {};
      return (
        <VideoEditor 
          value={selectedVideoData} // Pass current video data
          onChange={onChange} // onChange should expect a video object
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    if (section.editorComponent === 'AppointmentsEditor') {
      console.log('🎯 APPOINTMENTS-EDITOR: Rendering AppointmentsEditor component');
      // Ensure 'value' passed to AppointmentsEditor is an appointment object
      const selectedAppointmentData = value || {};
      return (
        <AppointmentsEditor 
          value={selectedAppointmentData} // Pass current appointment data
          onChange={onChange} // onChange should expect an appointment object
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'PublicationSelector') {
      console.log('🎯 PUBLICATION-SELECTOR: Rendering PublicationSelector component');
      // Ensure 'value' passed to PublicationSelector is an array of publication objects
      const selectedPublicationEntries = Array.isArray(value) ? value : [];
      return (
        <PublicationSelector 
          value={selectedPublicationEntries} // Pass current publication entries
          onChange={onChange} // onChange should expect an array of publication objects
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    if (section.editorComponent === 'CommunitySelector') {
      console.log('🎯 COMMUNITY-SELECTOR: Rendering CommunitySelector component');
      // Ensure 'value' passed to CommunitySelector is a community object
      const selectedCommunityData = value || {};
      return (
        <CommunitySelector 
          value={selectedCommunityData} // Pass current community data
          onChange={onChange} // onChange should expect a community object
        />
      );
    }

    if (section.editorComponent === 'SubscribeSelector') {
      console.log('🎯 SUBSCRIBE-SELECTOR: Rendering SubscribeSelector component');
      // Ensure 'value' passed to SubscribeSelector is a subscribe object
      const selectedSubscribeData = value || {};
      return (
        <SubscribeSelector 
          value={selectedSubscribeData} // Pass current subscribe data
          onChange={onChange} // onChange should expect a subscribe object
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    if (section.editorComponent === 'FAQSelector') {
      console.log('🎯 FAQ-SELECTOR: Rendering FAQSelector component');
      // Ensure 'value' passed to FAQSelector is an array of FAQ objects
      const selectedFAQEntries = Array.isArray(value) ? value : [];
      return (
        <FAQSelector 
          value={selectedFAQEntries} // Pass current FAQ entries
          onChange={onChange} // onChange should expect an array of FAQ objects
          onSave={onSave} // Pass save function
          onCancel={onClose} // Pass close function for cancel
        />
      );
    }

    // TikTok-specific editor
    if (section.type === 'tiktok') {
      return (
        <TikTokEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Instagram-specific editor
    if (section.type === 'instagram') {
      return (
        <InstagramEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // LinkedIn-specific editor
    if (section.type === 'linkedin') {
      return (
        <LinkedInEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // GitHub-specific editor
    if (section.type === 'github') {
      return (
        <GitHubEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // X-specific editor
    if (section.type === 'x') {
      return (
        <XEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Spotify-specific editor
    if (section.type === 'spotify') {
      return (
        <SpotifyEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // YouTube-specific editor
    if (section.type === 'youtube') {
      return (
        <YouTubeEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Email-specific editor
    if (section.type === 'email') {
      return (
        <EmailEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // WhatsApp-specific editor
    if (section.type === 'whatsapp') {
      return (
        <WhatsAppEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Facebook-specific editor
    if (section.type === 'facebook') {
      return (
        <FacebookEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Dribbble-specific editor
    if (section.type === 'dribbble') {
      return (
        <DribbbleEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Snapchat-specific editor
    if (section.type === 'snapchat') {
      return (
        <SnapchatEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Reddit-specific editor
    if (section.type === 'reddit') {
      return (
        <RedditEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Phone-specific editor
    if (section.type === 'phone') {
      return (
        <PhoneEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // X Highlights-specific editor
    if (section.type === 'x_highlights') {
      return (
        <XHighlightsEditor 
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

        // YouTube Highlights-specific editor
    if (section.type === 'youtube_highlights') {
      return (
        <YouTubeHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // LinkedIn Highlights-specific editor
    if (section.type === 'linkedin_highlights') {
      return (
        <LinkedInHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // TikTok Highlights-specific editor
    if (section.type === 'tiktok_highlights') {
      return (
        <TikTokHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Instagram Profile-specific editor
    if (section.type === 'instagram_profile') {
      return (
        <InstagramProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // LinkedIn Profile-specific editor
    if (section.type === 'linkedin_profile') {
      return (
        <LinkedInProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // X Profile-specific editor
    if (section.type === 'x_profile') {
      return (
        <XProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Spotify Profile-specific editor
    if (section.type === 'spotify_profile') {
      return (
        <SpotifyProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Snapchat Profile-specific editor
    if (section.type === 'snapchat_profile') {
      return (
        <SnapchatProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // TikTok Profile-specific editor
    if (section.type === 'tiktok_profile') {
      return (
        <TikTokProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Behance Profile-specific editor
    if (section.type === 'behance_profile') {
      return (
        <BehanceProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Dribbble Profile-specific editor
    if (section.type === 'dribbble_profile') {
      return (
        <DribbbleProfileEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // GitHub Highlights-specific editor
    if (section.type === 'github_highlights') {
      return (
        <GitHubHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Spotify Highlights-specific editor
    if (section.type === 'spotify_highlights') {
      return (
        <SpotifyHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Vimeo Highlights-specific editor
    if (section.type === 'vimeo_highlights') {
      return (
        <VimeoHighlightsEditor
          value={value || ''}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Website Preview-specific editor
    if (section.type === 'website_preview') {
      return (
        <WebsitePreviewEditor
          value={value || []}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Custom Profile-specific editor
    if (section.type === 'custom_profile') {
      return (
        <CustomProfileEditor
          value={value || []}
          onChange={onChange}
          onSave={onSave}
          onCancel={onClose}
        />
      );
    }

    // Default rendering based on inputType
    console.log('⚠️ EDIT-MODAL: No custom editor component found, using default input');
    if (section.inputType === 'textarea') {
      return (
        <textarea
          style={textareaStyle}
          value={value || ''} // Ensure value is not null/undefined for textarea
          onChange={(e) => { if (onChange) onChange(e.target.value); }}
          placeholder={`Enter your ${section.id}...`}
          rows={5}
        />
      );
    } else {
      return (
        <input
          type={section.inputType || 'text'}
          style={inputStyle}
          value={value || ''} // Ensure value is not null/undefined for input
          onChange={(e) => { if (onChange) onChange(e.target.value); }}
          placeholder={section.placeholder || `Enter your ${section.id}...`}
        />
      );
    }
  };



  // For TikTok, Instagram, LinkedIn, GitHub, X, YouTube, Email, WhatsApp, Facebook, Dribbble, Snapchat, Reddit, Phone, X Highlights, YouTube Highlights, Vimeo Highlights, Spotify Highlights, LinkedIn Highlights, TikTok Highlights, Instagram Profile, LinkedIn Profile, X Profile, Spotify Profile, Snapchat Profile, TikTok Profile, GitHub Highlights, Gallery, Featured Video, Appointments, and Publications, render the custom editor directly without the standard modal wrapper
  if (section.type === 'tiktok' || section.type === 'instagram' || section.type === 'linkedin' || section.type === 'github' || section.type === 'x' || section.type === 'spotify' || section.type === 'youtube' || section.type === 'email' || section.type === 'whatsapp' || section.type === 'facebook' || section.type === 'dribbble' || section.type === 'snapchat' || section.type === 'reddit' || section.type === 'phone' || section.type === 'x_highlights' || section.type === 'youtube_highlights' || section.type === 'vimeo_highlights' || section.type === 'spotify_highlights' || section.type === 'linkedin_highlights' || section.type === 'tiktok_highlights' || section.type === 'instagram_profile' || section.type === 'linkedin_profile' || section.type === 'x_profile' || section.type === 'spotify_profile' || section.type === 'snapchat_profile' || section.type === 'tiktok_profile' || section.type === 'behance_profile' || section.type === 'dribbble_profile' || section.type === 'github_highlights' || section.type === 'gallery' || section.type === 'featured_video' || section.type === 'appointments' || section.type === 'publications' || section.type === 'website_preview' || section.type === 'custom_profile') {
    return (
      <div style={modalOverlayStyle} onClick={onClose}> 
        <div style={{...modalContentStyle, maxWidth: '500px', backgroundColor: 'transparent', padding: 0, boxShadow: 'none'}} onClick={(e) => e.stopPropagation()}> 
          {/* Render custom editor directly without extra white background */}
          <div style={{ padding: 0, backgroundColor: 'transparent' }}>
            {renderInput()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}> 
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> 
        {/* Only show title and buttons for sections that don't have internal save/cancel */}
        {section.editorComponent !== 'ProjectSelector' && 
         section.editorComponent !== 'ServicesSelector' && 
         section.editorComponent !== 'ClientTestimonialSelector' && 
         section.editorComponent !== 'SkillsSelector' &&
         section.editorComponent !== 'ExperienceSelector' &&
         section.editorComponent !== 'EducationSelector' &&
         section.editorComponent !== 'CertificationSelector' &&
         section.editorComponent !== 'LanguageSelector' &&
         section.editorComponent !== 'SubscribeSelector' &&
         section.editorComponent !== 'FAQSelector' &&
         section.editorComponent !== 'AppointmentsEditor' &&
         section.editorComponent !== 'WebsitePreviewEditor' &&
         section.editorComponent !== 'CustomProfileEditor' && (
          <h3>Edit {section.name}</h3>
        )}
        
        {renderInput()} {/* Render the correct input or custom component */}

        {/* Only show save/cancel buttons for sections that don't have internal save/cancel */}
        {section.editorComponent !== 'ProjectSelector' && 
         section.editorComponent !== 'ServicesSelector' && 
         section.editorComponent !== 'ClientTestimonialSelector' && 
         section.editorComponent !== 'SkillsSelector' &&
         section.editorComponent !== 'ExperienceSelector' &&
         section.editorComponent !== 'EducationSelector' &&
         section.editorComponent !== 'CertificationSelector' &&
         section.editorComponent !== 'LanguageSelector' &&
         section.editorComponent !== 'SubscribeSelector' &&
         section.editorComponent !== 'FAQSelector' &&
         section.editorComponent !== 'AppointmentsEditor' &&
         section.editorComponent !== 'WebsitePreviewEditor' &&
         section.editorComponent !== 'CustomProfileEditor' && (
          <div style={buttonContainerStyle}>
            <button 
              onClick={onClose} 
              style={{ 
                padding: '8px 16px',
                backgroundColor: 'transparent',
                borderColor: '#e2e8f0',
                color: '#64748b',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={onSave} 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#00C48C', 
                color: 'white', 
                border: 'none', 
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)'
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 