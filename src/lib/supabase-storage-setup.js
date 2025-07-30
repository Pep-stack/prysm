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
        fileSizeLimit: 104857600 // 100MB limit for videos
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

// Check and create storage policies
export async function ensureStoragePolicies() {
  try {
    // These policies should already exist for the project-media bucket
    // but we'll log them for reference
    console.log('Storage policies should allow:');
    console.log('- INSERT: Users can upload to their own folder');
    console.log('- SELECT: Anyone can view files');
    console.log('- UPDATE: Users can update their own files');
    console.log('- DELETE: Users can delete their own files');
    
    return true;
  } catch (error) {
    console.error('Error checking storage policies:', error);
    return false;
  }
}

// Alternative bucket names to try if project-media fails
export const FALLBACK_BUCKETS = ['uploads', 'media', 'files'];

export async function getAvailableBucket() {
  try {
    // First try to list all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return null;
    }

    console.log('Available buckets:', buckets?.map(b => b.name) || []);

    // First try the preferred bucket
    const projectMediaBucket = buckets?.find(bucket => bucket.name === 'project-media');
    if (projectMediaBucket) {
      console.log('✅ Using project-media bucket');
      return 'project-media';
    }

    // Try to create project-media bucket if it doesn't exist
    const bucketExists = await ensureProjectMediaBucket();
    if (bucketExists) {
      return 'project-media';
    }

    // Try fallback buckets
    if (buckets) {
      for (const fallbackName of FALLBACK_BUCKETS) {
        const bucket = buckets.find(b => b.name === fallbackName);
        if (bucket) {
          console.log(`✅ Using fallback bucket: ${fallbackName}`);
          return fallbackName;
        }
      }
    }

    // If no buckets exist, try to create project-media
    console.log('No suitable storage bucket found. Attempting to create project-media bucket...');
    const created = await ensureProjectMediaBucket();
    if (created) {
      return 'project-media';
    }

    // Last resort - return project-media and let the upload fail with a clear error
    console.warn('No storage bucket available. Please create project-media bucket manually in Supabase Dashboard.');
    return 'project-media';
  } catch (error) {
    console.error('Error in getAvailableBucket:', error);
    return null;
  }
} 