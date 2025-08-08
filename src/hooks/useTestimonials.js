import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useTestimonials(userId) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('📸 Fetched testimonials:', data);
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add testimonial
  const addTestimonial = async (testimonial) => {
    console.log('🎯 ADD-TESTIMONIAL: Starting with', {
      userId,
      testimonial,
      hasUserId: !!userId,
      testimonialKeys: Object.keys(testimonial || {})
    });

    if (!userId) {
      console.error('❌ ADD-TESTIMONIAL: No userId provided');
      throw new Error('No userId provided to addTestimonial');
    }

    try {
      // Handle photo upload if it's a File
      let photoUrl = testimonial.photo;
      if (testimonial.photo instanceof File) {
        console.log('📸 ADD-TESTIMONIAL: Uploading photo file');
        const fileExt = testimonial.photo.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars') // Using existing bucket
          .upload(filePath, testimonial.photo);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        if (urlData && urlData.publicUrl) {
          photoUrl = urlData.publicUrl;
          console.log('📤 Uploaded photo URL (add):', photoUrl, 'urlData:', urlData);
        } else {
          console.error('❌ Failed to get public URL:', urlData);
          throw new Error('Failed to get public URL for uploaded photo');
        }
      }

      const insertData = {
        user_id: userId,
        name: testimonial.name,
        profession: testimonial.profession,
        quote: testimonial.quote,
        date: testimonial.date && testimonial.date.trim() !== '' ? testimonial.date : null,
        photo_url: photoUrl
      };

      console.log('💾 ADD-TESTIMONIAL: Saving to database with data:', insertData);
      
      // First check if table exists by trying a simple query
      try {
        const { count } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        console.log('✅ ADD-TESTIMONIAL: Table accessible, current count:', count);
      } catch (tableError) {
        console.error('❌ ADD-TESTIMONIAL: Table access error:', tableError);
        throw new Error('Testimonials table not accessible. Please check database setup.');
      }
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert([insertData])
        .select();

      console.log('💾 ADD-TESTIMONIAL: Database response:', { data, error });

      if (error) {
        console.error('❌ ADD-TESTIMONIAL: Database error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('❌ ADD-TESTIMONIAL: No data returned from insert');
        throw new Error('No data returned from testimonial insert');
      }
      
      console.log('✅ ADD-TESTIMONIAL: Successfully saved:', data[0]);
      setTestimonials(prev => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      console.error('❌ ADD-TESTIMONIAL: Error occurred:');
      console.error('❌ Error object:', err);
      console.error('❌ Error message:', err?.message || 'No message');
      console.error('❌ Error stack:', err?.stack || 'No stack');
      console.error('❌ UserId:', userId);
      console.error('❌ Testimonial data:', testimonial);
      
      // Also try to stringify the error
      try {
        console.error('❌ Error JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      } catch (jsonErr) {
        console.error('❌ Could not stringify error:', jsonErr);
      }
      
      setError(err?.message || err?.toString() || 'Unknown error occurred');
      throw err;
    }
  };

  // Update testimonial
  const updateTestimonial = async (id, testimonial) => {
    if (!userId) return;

    try {
      // Handle photo upload if it's a File
      let photoUrl = testimonial.photo;
      if (testimonial.photo instanceof File) {
        const fileExt = testimonial.photo.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, testimonial.photo);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        if (urlData && urlData.publicUrl) {
          photoUrl = urlData.publicUrl;
          console.log('📤 Uploaded photo URL (update):', photoUrl, 'urlData:', urlData);
        } else {
          console.error('❌ Failed to get public URL:', urlData);
          throw new Error('Failed to get public URL for uploaded photo');
        }
      }

      const { data, error } = await supabase
        .from('testimonials')
        .update({
          name: testimonial.name,
          profession: testimonial.profession,
          quote: testimonial.quote,
          date: testimonial.date && testimonial.date.trim() !== '' ? testimonial.date : null,
          photo_url: photoUrl
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      
      setTestimonials(prev => 
        prev.map(t => t.id === id ? data[0] : t)
      );
      return data[0];
    } catch (err) {
      console.error('Error updating testimonial:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [userId, fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials
  };
} 