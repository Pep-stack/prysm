'use client';

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

 // Adjusted path

// Helper function to get editor component for section type
const getEditorComponentForSection = (sectionType) => {
  const editorComponentMap = {
    'languages': 'LanguageSelector',
    'education': 'EducationSelector',
    'experience': 'ExperienceSelector',
    'certifications': 'CertificationSelector',
    'projects': 'ProjectSelector',
    'testimonials': 'ClientTestimonialSelector',
    'skills': 'SkillsSelector',
    'services': 'ServicesSelector',
    'gallery': 'GallerySelector',
    'featured_video': 'VideoSelector',
    'appointments': 'AppointmentsEditor',
    'publications': 'PublicationSelector',
    'community': 'CommunitySelector',
    'subscribe': 'SubscribeSelector',
    'events': 'EventSelector',
    'faq': 'FAQSelector',
    'x_highlights': 'XHighlightsEditor',
    'youtube_highlights': 'YouTubeHighlightsEditor',
    'linkedin_highlights': 'LinkedInHighlightsEditor',
          'tiktok_highlights': 'TikTokHighlightsEditor',
      'github_highlights': 'GitHubHighlightsEditor'
  };
  return editorComponentMap[sectionType];
};

export function useEditSectionModal(user, initialProfileData, onProfileUpdate) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null); 
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Optional: Local error state for the modal save operation

  const openModal = useCallback((section) => {
    if (!initialProfileData) return; // Need initial data to populate
    
    // Add editorComponent based on section type
    const enhancedSection = {
      ...section,
      editorComponent: getEditorComponentForSection(section.type)
    };
    
    console.log('🔥 OPEN-MODAL: Enhanced section with editorComponent:', enhancedSection);
    console.log('🔥 OPEN-MODAL: Initial profile data keys:', Object.keys(initialProfileData || {}));
    setEditingSection(enhancedSection);
    
    // Special handling for languages section
    if (section.type === 'languages') {
      const languagesData = initialProfileData[section.type];
      
      // Safe parsing for languages data
      let languagesArray = [];
      if (typeof languagesData === 'string' && languagesData.trim()) {
        languagesArray = languagesData.split(',').map(lang => lang.trim()).filter(lang => lang);
      } else if (Array.isArray(languagesData)) {
        languagesArray = languagesData;
      }
      
      setInputValue(languagesArray);
    } else if (section.type === 'education' || section.type === 'experience' || section.type === 'certifications' || section.type === 'projects' || section.type === 'testimonials' || section.type === 'skills' || section.type === 'services' || section.type === 'gallery' || section.type === 'publications' || section.type === 'events' || section.type === 'faq' || section.type === 'x_highlights' || section.type === 'youtube_highlights' || section.type === 'linkedin_highlights' || section.type === 'tiktok_highlights' || section.type === 'github_highlights' || section.type === 'appointments') {
      // Special handling for array-based sections
      const sectionData = initialProfileData[section.type];
      
      // Safe parsing for array data
      let sectionArray = [];
      if (typeof sectionData === 'string' && sectionData.trim()) {
        try {
          sectionArray = JSON.parse(sectionData);
          if (!Array.isArray(sectionArray)) {
            sectionArray = [];
          }
        } catch (e) {
          sectionArray = [];
        }
      } else if (Array.isArray(sectionData)) {
        sectionArray = sectionData;
      }
      
      // Create a safe copy to avoid circular references
      const safeArray = sectionArray.map(item => {
        if (item && typeof item === 'object') {
          // Create a clean copy with only the properties we need
          const cleanItem = {};
          Object.keys(item).forEach(key => {
            if (typeof item[key] !== 'object' || item[key] === null) {
              cleanItem[key] = item[key];
            }
          });
          return cleanItem;
        }
        return item;
      });
      
      console.log(`🔥 OPEN-MODAL: ${section.type} data:`, {
        originalData: sectionArray,
        safeData: safeArray,
        dataType: typeof sectionArray,
        isArray: Array.isArray(sectionArray)
      });
      
      setInputValue(safeArray);
    } else if (section.type === 'featured_video' || section.type === 'appointments' || section.type === 'community' || section.type === 'subscribe') {
      // Special handling for object-based sections
      const sectionData = initialProfileData[section.type];
      
      // Safe parsing for object data
      let sectionObject = {};
      if (typeof sectionData === 'string' && sectionData.trim()) {
        try {
          sectionObject = JSON.parse(sectionData);
          if (typeof sectionObject !== 'object' || Array.isArray(sectionObject)) {
            sectionObject = {};
          }
        } catch (e) {
          sectionObject = {};
        }
      } else if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
        sectionObject = sectionData;
      }
      
      setInputValue(sectionObject);
    } else {
      // Use section.type instead of section.id for database column lookup
      // Map special cases where section.type doesn't match database column name
      const getDatabaseColumnNameForInput = (sectionType) => {
        switch (sectionType) {
          case 'github':
            return 'github_gitlab';
          case 'dribbble':
            return 'dribbble_behance';
          case 'x':
            return 'x_profile';
          case 'youtube':
            return 'youtube_channel';
          case 'snapchat':
            return 'snapchat';
          case 'reddit':
            return 'reddit';
          case 'appointments':
            return 'appointments';
          default:
            return sectionType;
        }
      };
      
      const databaseColumnName = getDatabaseColumnNameForInput(section.type);
      setInputValue(initialProfileData[databaseColumnName] || ''); 
    }
    
    setIsModalOpen(true);
    setError(null); // Clear previous errors
  }, [initialProfileData]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSection(null);
    setInputValue(''); 
    setError(null);
  }, []);

  const handleSave = useCallback(async (overrideValue) => {
    if (!editingSection || !user) return;
    // If overrideValue is provided (e.g., TikTokEditor), use it instead of current inputValue
    const currentValue = overrideValue !== undefined ? overrideValue : inputValue;
    
    console.log('🔄 Saving section:', {
      sectionType: editingSection.type,
      sectionName: editingSection.name,
      inputValue: currentValue,
      isArray: Array.isArray(currentValue),
      inputValueType: typeof currentValue,
      editingSection: editingSection
    });


    

    
    // Use section.type as the database column name instead of section.id
    // Map special cases where section.type doesn't match database column name
    const getDatabaseColumnNameForSave = (sectionType) => {
      switch (sectionType) {
        case 'github':
          return 'github_gitlab';
        case 'dribbble':
          return 'dribbble_behance';
        case 'x':
          return 'x_profile';
        case 'youtube':
          return 'youtube_channel';
        case 'snapchat':
          return 'snapchat';
        case 'reddit':
          return 'reddit';
        case 'linkedin_highlights':
          return 'linkedin_highlights';
        case 'youtube_highlights':
          return 'youtube_highlights';
        case 'x_highlights':
          return 'x_highlights';
        case 'appointments':
          return 'appointments';
        default:
          return sectionType;
      }
    };
    
    const sectionType = editingSection.type;
    const databaseColumnName = getDatabaseColumnNameForSave(sectionType);
    
    // Process value BEFORE sending to Supabase
    let valueToSave = currentValue;
    
    console.log('🔍 DEBUG: Instagram profile save process:', {
      sectionType,
      databaseColumnName,
      currentValue,
      valueToSave,
      user: user?.id
    });
    if (sectionType === 'languages' && Array.isArray(currentValue)) {
      valueToSave = currentValue.join(','); // Join array into comma-separated string
    } else if ((sectionType === 'education' || sectionType === 'experience' || sectionType === 'certifications' || sectionType === 'projects' || sectionType === 'testimonials' || sectionType === 'skills' || sectionType === 'services' || sectionType === 'gallery' || sectionType === 'publications' || sectionType === 'events' || sectionType === 'faq' || sectionType === 'x_highlights' || sectionType === 'youtube_highlights' || sectionType === 'linkedin_highlights' || sectionType === 'appointments') && Array.isArray(currentValue)) {
      try {
        // Create a safe copy without circular references
        const safeValue = currentValue.map(item => {
          if (item && typeof item === 'object') {
            // Create a clean copy with only the properties we need for events
            const cleanItem = {};
            if (sectionType === 'events') {
              // For events, only include the specific properties we need
              const allowedKeys = ['title', 'description', 'date', 'time', 'location', 'url', 'isOnline', 'isFree', 'price', 'featured'];
              allowedKeys.forEach(key => {
                if (item.hasOwnProperty(key)) {
                  cleanItem[key] = item[key];
                }
              });
            } else {
              // For other sections, copy all properties except potential circular references
              Object.keys(item).forEach(key => {
                if (typeof item[key] !== 'object' || item[key] === null) {
                  cleanItem[key] = item[key];
                }
              });
            }
            return cleanItem;
          }
          return item;
        });
        
        // Use a safer approach to avoid cyclic structures
        const seen = new WeakSet();
        
        const cleanValue = (obj) => {
          if (obj === null || typeof obj !== 'object') {
            return obj;
          }
          
          if (seen.has(obj)) {
            return undefined; // Remove circular reference
          }
          seen.add(obj);
          
          if (Array.isArray(obj)) {
            return obj.map(item => cleanValue(item)).filter(item => item !== undefined);
          }
          
          const result = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
              const cleaned = cleanValue(obj[key]);
              if (cleaned !== undefined) {
                result[key] = cleaned;
              }
            }
          }
          return result;
        };
        
        const cleaned = cleanValue(safeValue);
        valueToSave = JSON.stringify(cleaned);
        console.log(`📝 Serialized ${sectionType} data:`, valueToSave);
      } catch (serializeError) {
        console.error('❌ Error serializing data:', serializeError);
        setError(`Error serializing ${sectionType} data: ${serializeError.message}`);
        return;
      }
    } else if ((sectionType === 'featured_video' || sectionType === 'appointments' || sectionType === 'community' || sectionType === 'subscribe') && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
      try {
        // Use a safer approach to avoid cyclic structures
        const cleanObject = {};
        const seen = new WeakSet();
        
        const cleanValue = (obj) => {
          if (obj === null || typeof obj !== 'object') {
            return obj;
          }
          
          if (seen.has(obj)) {
            return undefined; // Remove circular reference
          }
          seen.add(obj);
          
          const result = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
              const cleaned = cleanValue(obj[key]);
              if (cleaned !== undefined) {
                result[key] = cleaned;
              }
            }
          }
          return result;
        };
        
        const cleaned = cleanValue(currentValue);
        valueToSave = JSON.stringify(cleaned);
        console.log(`📝 Serialized ${sectionType} data:`, valueToSave);
      } catch (serializeError) {
        console.error('❌ Error serializing data:', serializeError);
        setError(`Error serializing ${sectionType} data: ${serializeError.message}`);
        return;
      }
    }
    
    setIsLoading(true); 
    setError(null);
    try {
      console.log('💾 Attempting to save to Supabase:', {
        sectionType,
        valueToSave,
        userId: user.id,
        updateObject: { [sectionType]: valueToSave, updated_at: new Date().toISOString() }
      });
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ [databaseColumnName]: valueToSave, updated_at: new Date().toISOString() }) // Use correct database column name
        .eq('id', user.id)
        .select() // Select the updated row
        .single(); 

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
        throw updateError;
      }
      
      console.log('✅ Supabase update successful:', data);
      
      // Call the callback passed from the parent to update its profile state
      if (onProfileUpdate) {
         // IMPORTANT: Pass back the *original* input value if it was an array or object,
         // so the parent state (and selector components) get the correct format.
         // The 'data' returned from Supabase will have the string version.
         const updatedProfileData = { ...data };
         if (sectionType === 'languages' || sectionType === 'education' || sectionType === 'experience' || sectionType === 'certifications' || sectionType === 'projects' || sectionType === 'testimonials' || sectionType === 'skills' || sectionType === 'services' || sectionType === 'gallery' || sectionType === 'publications' || sectionType === 'events' || sectionType === 'faq' || sectionType === 'x_highlights' || sectionType === 'youtube_highlights' || sectionType === 'linkedin_highlights') {
            updatedProfileData[sectionType] = currentValue; // Restore the array format for local state
            console.log('🔄 Restoring array format for local state:', {
              sectionType,
              originalArray: currentValue,
              updatedProfileData: updatedProfileData[sectionType]
            });
         } else if (sectionType === 'featured_video' || sectionType === 'appointments' || sectionType === 'community' || sectionType === 'subscribe') {
            updatedProfileData[sectionType] = currentValue; // Restore the object format for local state
            console.log('🔄 Restoring object format for local state:', {
              sectionType,
              originalObject: currentValue,
              updatedProfileData: updatedProfileData[sectionType]
            });
         } else {
            // For social media sections, use the correct database column name for the update
            updatedProfileData[databaseColumnName] = currentValue;
            console.log('🔄 Restoring social media format for local state:', {
              sectionType,
              databaseColumnName,
              originalValue: currentValue,
              updatedProfileData: updatedProfileData[databaseColumnName]
            });
         }
         onProfileUpdate(updatedProfileData); 
      }
      closeModal(); // Close modal on success

    } catch (err) {
        // Log het hele error object en response indien aanwezig
        console.error('Error updating profile section:', err, err?.response?.data, err?.message);

        // Zoek een bruikbare error message
        let errorMsg = 'Unknown error';
        if (err?.response?.data?.message) {
            errorMsg = err.response.data.message;
        } else if (err?.response?.data?.error) {
            errorMsg = err.response.data.error;
        } else if (err?.message) {
            errorMsg = err.message;
        } else if (typeof err === 'string') {
            errorMsg = err;
        } else if (err?.toString) {
            errorMsg = err.toString();
        } else if (err) {
            errorMsg = String(err);
        }

        setError(`Error saving ${editingSection?.name || 'section'}: ${errorMsg}`);
        // alert might be better handled in the component using the error state
    } finally {
       setIsLoading(false);
    }
  }, [editingSection, user, inputValue, closeModal, onProfileUpdate]);

  return {
    isModalOpen,
    editingSection,
    inputValue,
    isLoading,
    error, // Return error state
    openModal,
    closeModal,
    setInputValue, // Allow direct input changes
    handleSave,
  };
} 