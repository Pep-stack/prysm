-- =================================================================
-- TEST PROFILE DELETION POLICY
-- =================================================================

-- This script tests if profile deletion works
-- Run this in Supabase SQL Editor while logged in as a user

-- Step 1: Check current user
SELECT 
  'Current user ID' as info,
  auth.uid() as user_id,
  auth.email() as email;

-- Step 2: Check if we can see our profile
SELECT 
  'Profile exists' as info,
  count(*) as count,
  id,
  email,
  name
FROM profiles 
WHERE id = auth.uid()
GROUP BY id, email, name;

-- Step 3: Check current policies
SELECT 
  'Current policies' as info,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;

-- Step 4: Test delete permission (dry run)
-- This explains the query plan without actually deleting
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
DELETE FROM profiles 
WHERE id = auth.uid() 
AND 1=0; -- Prevents actual deletion

-- Step 5: Check if there are any foreign key constraints
SELECT 
  'Foreign key constraints' as info,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND (tc.table_name='profiles' OR ccu.table_name='profiles');
