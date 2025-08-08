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
            } else if (key === 'mediaItems' && Array.isArray(item[key])) {
              // Special handling for mediaItems array in projects when loading
              cleanItem[key] = item[key].map(mediaItem => {
                if (mediaItem && typeof mediaItem === 'object') {
                  return {
                    url: mediaItem.url || '',
                    type: mediaItem.type || 'image'
                  };
                }
                return mediaItem;
              });
            } else if (Array.isArray(item[key])) {
              // Handle other arrays by copying them safely
              cleanItem[key] = [...item[key]];
            }
          });
          return cleanItem;
        }
        return item;
      });
      
      // Extra safety for FAQ data - ensure only id, question, answer
      if (section.type === 'faq') {
        const safeFAQArray = safeArray.map(item => ({
          id: item.id || Date.now(),
          question: item.question || '',
          answer: item.answer || ''
        }));
        setInputValue(safeFAQArray);
        console.log(`🔥 OPEN-MODAL: FAQ data:`, {
          originalData: sectionArray,
          safeData: safeFAQArray,
          dataType: typeof sectionArray,
          isArray: Array.isArray(sectionArray)
        });
      } else {
        setInputValue(safeArray);
        console.log(`🔥 OPEN-MODAL: ${section.type} data:`, {
          originalData: sectionArray,
          safeData: safeArray,
          dataType: typeof sectionArray,
          isArray: Array.isArray(sectionArray)
        });
      }
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
    
    // Extra debug for FAQ data
    if (editingSection.type === 'faq') {
      console.log('🔍 FAQ-DEBUG: Current value details:', {
        currentValue,
        currentValueType: typeof currentValue,
        isArray: Array.isArray(currentValue),
        isObject: typeof currentValue === 'object',
        keys: currentValue && typeof currentValue === 'object' ? Object.keys(currentValue) : 'not object'
      });
    }
    
    // Extra debug for FAQ data
    if (editingSection.type === 'faq' && Array.isArray(currentValue)) {
      console.log('🔍 FAQ-DEBUG: Current value details:', {
        items: currentValue.map((item, index) => ({
          index,
          id: item.id,
          question: item.question,
          answer: item.answer,
          hasCircularRef: item === currentValue || item === item.question || item === item.answer
        }))
      });
    }


    

    
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
    
    console.log('🔍 DEBUG: Save process:', {
      sectionType,
      databaseColumnName,
      currentValue,
      valueToSave,
      user: user?.id
    });
    if (sectionType === 'languages' && Array.isArray(currentValue)) {
      valueToSave = currentValue.join(','); // Join array into comma-separated string
    } else if ((sectionType === 'education' || sectionType === 'experience' || sectionType === 'certifications' || sectionType === 'projects' || sectionType === 'testimonials' || sectionType === 'skills' || sectionType === 'services' || sectionType === 'gallery' || sectionType === 'publications' || sectionType === 'events' || sectionType === 'x_highlights' || sectionType === 'youtube_highlights' || sectionType === 'linkedin_highlights' || sectionType === 'appointments') && Array.isArray(currentValue)) {
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
            } else if (sectionType === 'faq') {
              // Skip FAQ items in the general cleaning - we handle them separately
              return null;
            } else {
              // For other sections, copy all properties except potential circular references
              Object.keys(item).forEach(key => {
                if (typeof item[key] !== 'object' || item[key] === null) {
                  cleanItem[key] = item[key];
                } else if (key === 'mediaItems' && Array.isArray(item[key])) {
                  // Special handling for mediaItems array in projects
                  cleanItem[key] = item[key].map(mediaItem => {
                    if (mediaItem && typeof mediaItem === 'object') {
                      return {
                        url: mediaItem.url || '',
                        type: mediaItem.type || 'image'
                      };
                    }
                    return mediaItem;
                  });
                } else if (Array.isArray(item[key])) {
                  // Handle other arrays by copying them safely
                  cleanItem[key] = [...item[key]];
                }
              });
            }
            return cleanItem;
          }
          return item;
        });
        
        // Filter out null items (invalid FAQ items)
        const filteredSafeValue = safeValue.filter(item => item !== null);
        
        // Special handling for FAQ data to prevent cyclic structures
        if (sectionType === 'faq') {
          console.log('🔧 FAQ-SPECIAL: Using FAQ-specific cleaning');
          
          // Create a completely clean FAQ array with direct approach
          const cleanFAQArray = [];
          
          // Log the input data
          console.log('🔧 FAQ-SPECIAL: Input data:', {
            currentValue,
            filteredSafeValue,
            currentValueType: typeof currentValue,
            isArray: Array.isArray(currentValue)
          });
          
          // Use currentValue directly if it's an array
          const sourceArray = Array.isArray(currentValue) ? currentValue : [];
          
          for (let i = 0; i < sourceArray.length; i++) {
            const item = sourceArray[i];
            console.log(`🔧 FAQ-SPECIAL: Processing item ${i}:`, item);
            
            if (item && typeof item === 'object') {
              const cleanItem = {
                id: item.id || Date.now() + i,
                question: String(item.question || ''),
                answer: String(item.answer || '')
              };
              
              // Only add if it has content
              if (cleanItem.question.trim() || cleanItem.answer.trim()) {
                cleanFAQArray.push(cleanItem);
                console.log(`🔧 FAQ-SPECIAL: Added clean item:`, cleanItem);
              }
            }
          }
          
          console.log('🔧 FAQ-SPECIAL: Final clean array:', cleanFAQArray);
          
          // Test serialization before proceeding
          try {
            valueToSave = JSON.stringify(cleanFAQArray);
            console.log(`📝 Serialized FAQ data:`, valueToSave);
          } catch (serializeError) {
            console.error('❌ FAQ-SERIALIZE: Error serializing FAQ data:', serializeError);
            // Use empty array as fallback
            valueToSave = JSON.stringify([]);
            console.log('🔧 FAQ-SERIALIZE: Using empty array fallback');
          }
        } else {
          // Use a safer approach to avoid cyclic structures for other array types
          const seen = new WeakSet();
          
          const cleanValue = (obj) => {
            if (obj === null || typeof obj !== 'object') {
              return obj;
            }
            
            if (seen.has(obj)) {
              return null; // Return null instead of undefined for circular reference
            }
            seen.add(obj);
            
            if (Array.isArray(obj)) {
              return obj.map(item => cleanValue(item)).filter(item => item !== null);
            }
            
            const result = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
                const cleaned = cleanValue(obj[key]);
                if (cleaned !== null) {
                  result[key] = cleaned;
                }
              }
            }
            return result;
          };
          
          const cleaned = cleanValue(safeValue);
          valueToSave = JSON.stringify(cleaned);
          console.log(`📝 Serialized ${sectionType} data:`, valueToSave);
        }
      } catch (serializeError) {
        console.error('❌ Error serializing data:', serializeError);
        setError(`Error serializing ${sectionType} data: ${serializeError.message}`);
        return;
      }
    } else if (sectionType === 'faq' && (Array.isArray(currentValue) || (typeof currentValue === 'object' && currentValue !== null))) {
      // Special handling for FAQ data to prevent cyclic structures
      console.log('🔧 FAQ-SPECIAL: Using FAQ-specific cleaning');
      
      // Create a completely clean FAQ array with direct approach
      const cleanFAQArray = [];
      
      // Log the input data
      console.log('🔧 FAQ-SPECIAL: Input data:', {
        currentValue,
        currentValueType: typeof currentValue,
        isArray: Array.isArray(currentValue),
        currentValueLength: Array.isArray(currentValue) ? currentValue.length : 'not array',
        currentValueKeys: Array.isArray(currentValue) && currentValue.length > 0 ? Object.keys(currentValue[0]) : 'no items'
      });
      
      // Use currentValue directly if it's an array, or convert object to array
      let sourceArray = [];
      if (Array.isArray(currentValue)) {
        sourceArray = currentValue;
      } else if (typeof currentValue === 'object' && currentValue !== null) {
        // Convert object to array if needed
        sourceArray = Object.values(currentValue).filter(item => item && typeof item === 'object');
      }
      
      for (let i = 0; i < sourceArray.length; i++) {
        const item = sourceArray[i];
        console.log(`🔧 FAQ-SPECIAL: Processing item ${i}:`, item);
        
        if (item && typeof item === 'object') {
          const cleanItem = {
            id: item.id || Date.now() + i,
            question: String(item.question || ''),
            answer: String(item.answer || '')
          };
          
          // Only add if it has content
          if (cleanItem.question.trim() || cleanItem.answer.trim()) {
            cleanFAQArray.push(cleanItem);
            console.log(`🔧 FAQ-SPECIAL: Added clean item:`, cleanItem);
          }
        }
      }
      
      console.log('🔧 FAQ-SPECIAL: Final clean array:', cleanFAQArray);
      
      // Test serialization before proceeding
      try {
        valueToSave = JSON.stringify(cleanFAQArray);
        console.log(`📝 Serialized FAQ data:`, valueToSave);
      } catch (serializeError) {
        console.error('❌ FAQ-SERIALIZE: Error serializing FAQ data:', serializeError);
        // Use empty array as fallback
        valueToSave = JSON.stringify([]);
        console.log('🔧 FAQ-SERIALIZE: Using empty array fallback');
      }
    } else if ((sectionType === 'featured_video' || sectionType === 'appointments' || sectionType === 'community' || sectionType === 'subscribe') && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
      try {
        // Use a safer approach to avoid cyclic structures
        const seen = new WeakSet();
        
        const cleanValue = (obj) => {
          if (obj === null || typeof obj !== 'object') {
            return obj;
          }
          
          if (seen.has(obj)) {
            return null; // Return null instead of undefined for circular reference
          }
          seen.add(obj);
          
          const result = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
              const cleaned = cleanValue(obj[key]);
              if (cleaned !== null) {
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
      // Extra safety check before Supabase update
      let finalValueToSave = valueToSave;
      if (sectionType === 'faq') {
        console.log('🔍 FAQ-SUPABASE: About to test valueToSave:', {
          valueToSave,
          valueToSaveType: typeof valueToSave,
          valueToSaveLength: valueToSave?.length
        });
        try {
          // Check if valueToSave is actually a string
          if (typeof valueToSave !== 'string') {
            console.error('❌ FAQ-SUPABASE: valueToSave is not a string:', typeof valueToSave);
            finalValueToSave = JSON.stringify([]);
            return;
          }
          
          // Since valueToSave is already a JSON string, just verify it's valid
          const parsed = JSON.parse(valueToSave);
          console.log('✅ FAQ-SUPABASE: Value can be safely serialized, parsed result:', parsed);
          
          // Extra check: verify the parsed data is actually FAQ data
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('✅ FAQ-SUPABASE: Valid FAQ data found:', {
              length: parsed.length,
              firstItem: parsed[0]
            });
          } else {
            console.warn('⚠️ FAQ-SUPABASE: Parsed data is not valid FAQ array:', parsed);
          }
        } catch (testError) {
          console.error('❌ FAQ-SUPABASE: Value cannot be safely serialized, using fallback');
          console.error('❌ FAQ-SUPABASE: Test error:', testError);
          console.error('❌ FAQ-SUPABASE: Original valueToSave:', valueToSave);
          // Create a completely clean fallback
          const fallbackValue = JSON.stringify([]);
          finalValueToSave = fallbackValue;
        }
      }
      
      console.log('💾 Attempting to save to Supabase:', {
        sectionType,
        databaseColumnName,
        valueToSave: finalValueToSave,
        userId: user.id,
        updateObject: { [databaseColumnName]: finalValueToSave, updated_at: new Date().toISOString() }
      });
      
      // Extra check for FAQ column existence
      if (sectionType === 'faq') {
        console.log('🔍 FAQ-DATABASE: Checking if faq column exists...');
        try {
          // Try to get the current profile to see if faq column exists
          const { data: currentProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('faq')
            .eq('id', user.id)
            .single();
          
          if (fetchError) {
            console.error('❌ FAQ-DATABASE: Error fetching current profile:', fetchError);
          } else {
            console.log('✅ FAQ-DATABASE: FAQ column exists, current value:', currentProfile?.faq);
          }
        } catch (checkError) {
          console.error('❌ FAQ-DATABASE: Error checking FAQ column:', checkError);
        }
      }
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ [databaseColumnName]: finalValueToSave, updated_at: new Date().toISOString() }) // Use correct database column name
        .eq('id', user.id)
        .select() // Select the updated row
        .single(); 

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
        throw updateError;
      }
      
      console.log('✅ Supabase update successful:', data);
      
      // Extra debug for FAQ data
      if (sectionType === 'faq') {
        console.log('🔍 FAQ-SAVE: Database update result:', {
          data,
          faqColumn: data?.faq,
          parsedFAQ: data?.faq ? JSON.parse(data.faq) : null,
          currentValue,
          valueToSave,
          finalValueToSave,
          databaseColumnName,
          sectionType
        });
        
        // Also check if the FAQ data was actually saved
        if (data?.faq) {
          try {
            const savedFAQ = JSON.parse(data.faq);
            console.log('✅ FAQ-SAVE: FAQ data successfully saved to database:', {
              savedFAQ,
              length: Array.isArray(savedFAQ) ? savedFAQ.length : 'not array'
            });
          } catch (error) {
            console.error('❌ FAQ-SAVE: Error parsing saved FAQ data:', error);
          }
        } else {
          console.error('❌ FAQ-SAVE: No FAQ data found in database response');
        }
      }
      
      // Call the callback passed from the parent to update its profile state
      if (onProfileUpdate) {
         // IMPORTANT: Pass back the *original* input value if it was an array or object,
         // so the parent state (and selector components) get the correct format.
         // The 'data' returned from Supabase will have the string version.
         const updatedProfileData = { ...data };
         if (sectionType === 'languages' || sectionType === 'education' || sectionType === 'experience' || sectionType === 'certifications' || sectionType === 'projects' || sectionType === 'testimonials' || sectionType === 'skills' || sectionType === 'services' || sectionType === 'gallery' || sectionType === 'publications' || sectionType === 'events' || sectionType === 'x_highlights' || sectionType === 'youtube_highlights' || sectionType === 'linkedin_highlights') {
            updatedProfileData[sectionType] = currentValue; // Restore the array format for local state
            console.log('🔄 Restoring array format for local state:', {
              sectionType,
              originalArray: currentValue,
              updatedProfileData: updatedProfileData[sectionType]
            });
         } else if (sectionType === 'faq') {
            // Special handling for FAQ - ensure it's stored as an array in local state
            updatedProfileData[sectionType] = currentValue; // Restore the array format for local state
            console.log('🔄 FAQ: Restoring array format for local state:', {
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
         
         // Special handling for FAQ - also update the card_sections array
         if (sectionType === 'faq' && Array.isArray(currentValue)) {
           console.log('🔧 FAQ: Updating card_sections with FAQ data');
           // Update the FAQ section in card_sections with the data
           try {
             // Find the FAQ section in card_sections and update its value
             // This will be handled by the parent component's auto-save mechanism
             console.log('🔧 FAQ: FAQ data saved to profile.faq, will be loaded by FAQSectionContent');
             
             // Also update the section value for immediate display
             if (editingSection && editingSection.id) {
               console.log('🔧 FAQ: Updating section value for immediate display');
               // The section value will be updated by the parent component
             }
           } catch (error) {
             console.error('❌ FAQ: Error updating card_sections:', error);
           }
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

  // Safe setInputValue function that prevents circular references
  const safeSetInputValue = useCallback((newValue) => {
    console.log('🔄 SAFE-SET-INPUT: Received new value:', {
      newValue,
      newValueType: typeof newValue,
      isArray: Array.isArray(newValue),
      sectionType: editingSection?.type
    });
    
    // Extra safety check for FAQ data
    if (editingSection?.type === 'faq' && Array.isArray(newValue)) {
      const safeFAQValue = newValue.map(item => ({
        id: item.id || Date.now(),
        question: item.question || '',
        answer: item.answer || ''
      }));
      console.log('🔄 SAFE-SET-INPUT: FAQ safety check - cleaned value:', safeFAQValue);
      setInputValue(safeFAQValue);
    } else {
      setInputValue(newValue);
    }
  }, [editingSection?.type, setInputValue]);

  return {
    isModalOpen,
    editingSection,
    inputValue,
    isLoading,
    error, // Return error state
    openModal,
    closeModal,
    setInputValue: safeSetInputValue, // Use safe version
    handleSave,
  };
} 