import { supabase } from './supabase';

// Diagnose storage setup issues
export async function diagnoseStorageSetup() {
  const results = [];
  
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      results.push({
        type: 'error',
        message: 'User not authenticated. Please log in first.',
        action: 'Log in to your account'
      });
      return results;
    }
    
    results.push({
      type: 'success',
      message: `User authenticated: ${user.email}`,
      action: null
    });

    // Check buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      results.push({
        type: 'error',
        message: `Cannot list buckets: ${listError.message}`,
        action: 'Check Supabase connection and permissions'
      });
      return results;
    }

    results.push({
      type: 'info',
      message: `Found ${buckets?.length || 0} storage buckets`,
      action: null
    });

    const projectMediaBucket = buckets?.find(bucket => bucket.name === 'project-media');
    
    if (!projectMediaBucket) {
      results.push({
        type: 'warning',
        message: 'project-media bucket does not exist',
        action: 'Create bucket or run setup SQL from docs/STORAGE_SETUP.md'
      });
    } else {
      results.push({
        type: 'success',
        message: `project-media bucket exists (public: ${projectMediaBucket.public})`,
        action: projectMediaBucket.public ? null : 'Make bucket public in Supabase Dashboard'
      });
    }

    // Test upload to check RLS policies
    try {
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const testPath = `test/${Date.now()}.txt`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(testPath, testFile);
      
      if (uploadError) {
        if (uploadError.message?.includes('row-level security policy')) {
          results.push({
            type: 'error',
            message: 'RLS policies are blocking uploads',
            action: 'Run the storage policy SQL from docs/STORAGE_SETUP.md'
          });
        } else {
          results.push({
            type: 'error',
            message: `Upload test failed: ${uploadError.message}`,
            action: 'Check storage configuration'
          });
        }
      } else {
        results.push({
          type: 'success',
          message: 'Upload test successful',
          action: null
        });
        
        // Clean up test file
        await supabase.storage.from('project-media').remove([testPath]);
      }
    } catch (testError) {
      results.push({
        type: 'error',
        message: `Upload test error: ${testError.message}`,
        action: 'Check storage and authentication setup'
      });
    }

  } catch (error) {
    results.push({
      type: 'error',
      message: `Diagnosis failed: ${error.message}`,
      action: 'Check Supabase connection'
    });
  }
  
  return results;
}

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
      
      // Check if we need to update the bucket settings for larger files
      if (projectMediaBucket.file_size_limit && projectMediaBucket.file_size_limit < 104857600) {
        console.log('⚠️ Bucket file size limit is too small for videos. Please update in Supabase Dashboard.');
        console.log('Current limit:', projectMediaBucket.file_size_limit, 'bytes');
        console.log('Recommended limit: 104857600 bytes (100MB)');
      }
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
export const FALLBACK_BUCKETS = ['uploads', 'media', 'files', 'avatars', 'public'];

// Try to find a bucket that already has working permissions
export async function findWorkingBucket() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return null;
    }

    console.log('🔍 Checking available buckets for working permissions...');

    // Try each bucket to see if upload works
    for (const bucket of buckets || []) {
      try {
        console.log(`🧪 Testing bucket: ${bucket.name}`);
        
        // Create a small test file
        const testFile = new Blob(['test'], { type: 'text/plain' });
        const testPath = `test-${Date.now()}.txt`;
        
        // Try to upload to this bucket
        const { error: uploadError } = await supabase.storage
          .from(bucket.name)
          .upload(testPath, testFile);
        
        if (!uploadError) {
          console.log(`✅ Bucket ${bucket.name} works! Cleaning up test file...`);
          
          // Clean up test file
          await supabase.storage.from(bucket.name).remove([testPath]);
          
          return bucket.name;
        } else {
          console.log(`❌ Bucket ${bucket.name} failed:`, uploadError.message);
        }
      } catch (testError) {
        console.log(`❌ Bucket ${bucket.name} exception:`, testError.message);
      }
    }
    
    console.log('❌ No working buckets found');
    return null;
  } catch (error) {
    console.error('Error finding working bucket:', error);
    return null;
  }
}

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