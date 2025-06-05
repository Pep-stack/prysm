import { supabase } from './supabase';

export async function ensureProjectMediaBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const projectMediaBucket = buckets.find(bucket => bucket.name === 'project-media');
    
    if (!projectMediaBucket) {
      // Create bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('project-media', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 52428800 // 50MB limit
      });

      if (error) {
        console.error('Error creating project-media bucket:', error);
        return false;
      }

      console.log('✅ project-media bucket created successfully');
    } else {
      console.log('✅ project-media bucket already exists');
    }

    return true;
  } catch (error) {
    console.error('Error ensuring project-media bucket:', error);
    return false;
  }
}

// Alternative bucket names to try if project-media fails
export const FALLBACK_BUCKETS = ['uploads', 'media', 'files'];

export async function getAvailableBucket() {
  // First try the preferred bucket
  const bucketExists = await ensureProjectMediaBucket();
  if (bucketExists) {
    return 'project-media';
  }

  // Try fallback buckets
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets) {
    for (const fallbackName of FALLBACK_BUCKETS) {
      const bucket = buckets.find(b => b.name === fallbackName);
      if (bucket) {
        console.log(`Using fallback bucket: ${fallbackName}`);
        return fallbackName;
      }
    }
  }

  // If no buckets exist, return null and handle manually
  console.warn('No suitable storage bucket found. Please create one manually in Supabase Dashboard.');
  return null;
} 