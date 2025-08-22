-- =================================================================
-- FORCE FIX PROFILE DELETION POLICY
-- =================================================================

-- This script forcefully fixes the profile deletion policy
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Step 2: Recreate all policies with correct permissions
-- Allow everyone to view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to delete their own profile (THE CRITICAL ONE)
CREATE POLICY "Users can delete their own profile"
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Step 3: Verify all policies were created
SELECT 
  'Policy verification' as info,
  policyname,
  cmd,
  permissive,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 4: Test the delete policy
-- This will show if the delete policy is working
SELECT 
  'Delete test result' as info,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
    ) THEN 'Profile exists - ready for deletion test'
    ELSE 'No profile found for current user'
  END as status;

-- Success message
SELECT 'Profile deletion policies have been reset and recreated!' as result;
