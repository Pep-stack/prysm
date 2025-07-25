-- =================================================================
-- SETUP SKILLS FUNCTIONALITY
-- =================================================================

-- This script sets up the skills column and ensures it's properly configured
-- Run this in your Supabase SQL Editor

-- 1. Add skills column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills TEXT;

-- 2. Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.skills IS 'JSON string containing array of skill objects with name, category, proficiency, yearsOfExperience, and description fields';

-- 3. Verify the column exists and is accessible
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'skills';

-- 4. Test that RLS policies work for skills column
-- This query should work for authenticated users
SELECT id, skills FROM public.profiles WHERE id = auth.uid() LIMIT 1;

-- 5. Example of how to insert/update skills data
-- (This is handled by your application, but here's the format)
/*
UPDATE public.profiles 
SET skills = '[
  {
    "id": 1234567890,
    "name": "React",
    "category": "Frontend Development", 
    "proficiency": "advanced",
    "yearsOfExperience": "3",
    "description": "Experience with React hooks, context, and modern patterns"
  },
  {
    "id": 1234567891,
    "name": "Python",
    "category": "Programming Languages",
    "proficiency": "intermediate", 
    "yearsOfExperience": "2",
    "description": "Backend development and data analysis"
  }
]'::text
WHERE id = auth.uid();
*/

-- 6. Verify RLS policies are working
-- This should show the current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 