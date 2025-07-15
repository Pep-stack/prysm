import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTestimonials(userId) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials
  const fetchTestimonials = async () => {
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
  };

  // Add testimonial
  const addTestimonial = async (testimonial) => {
    if (!userId) return;

    try {
      // Handle photo upload if it's a File
      let photoUrl = testimonial.photo;
      if (testimonial.photo instanceof File) {
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
        
        photoUrl = urlData.publicUrl;
        console.log('📤 Uploaded photo URL (add):', photoUrl, 'urlData:', urlData);
      }

      console.log('💾 Saving testimonial with photo_url:', photoUrl);
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: userId,
          name: testimonial.name,
          profession: testimonial.profession,
          quote: testimonial.quote,
          date: testimonial.date,
          photo_url: photoUrl
        }])
        .select();

      if (error) throw error;
      
      setTestimonials(prev => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      console.error('Error adding testimonial:', err);
      setError(err.message);
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
        
        photoUrl = urlData.publicUrl;
        console.log('📤 Uploaded photo URL (update):', photoUrl, 'urlData:', urlData);
      }

      const { data, error } = await supabase
        .from('testimonials')
        .update({
          name: testimonial.name,
          profession: testimonial.profession,
          quote: testimonial.quote,
          date: testimonial.date,
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
  }, [userId]);

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