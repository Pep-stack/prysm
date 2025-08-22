-- =================================================================
-- SIMPLE FIX: ENABLE PROFILE DELETION
-- =================================================================

-- This is a minimal migration to enable profile deletion
-- Run this in Supabase SQL Editor

-- Check current policies first (optional)
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create the missing DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Verify the policy was created
SELECT 
  policyname, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'profiles' 
AND cmd = 'DELETE';

-- Test message
SELECT 'Profile deletion policy created successfully!' as result;
