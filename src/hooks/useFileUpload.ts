import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const { data, error: uploadError } = await supabase.storage
        .from('avatars') // Pas eventueel de bucketnaam aan
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      if (!data?.path) throw new Error('No file path returned from upload.');
      return data.path;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const resetError = () => setError(null);
  const reset = () => {
    setError(null);
    setIsUploading(false);
  };

  return { isUploading, error, uploadFile, resetError, reset };
} 