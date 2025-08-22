-- =================================================================
-- DEBUG PROFILE POLICIES
-- =================================================================

-- Check all current policies on profiles table
SELECT 
  policyname, 
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Test if we can see our own profile
SELECT 
  'Can read own profile' as test,
  count(*) as result
FROM profiles 
WHERE id = auth.uid();

-- Test if we can update our own profile (this should work)
-- UPDATE profiles SET updated_at = NOW() WHERE id = auth.uid();

-- Check what auth.uid() returns
SELECT 
  'Current auth.uid()' as test,
  auth.uid() as result;

-- Test delete with a safe query (this will show if delete would work)
EXPLAIN (ANALYZE, BUFFERS) 
DELETE FROM profiles 
WHERE id = auth.uid() 
AND false; -- This prevents actual deletion but tests the policy
