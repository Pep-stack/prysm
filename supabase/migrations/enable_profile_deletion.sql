-- =================================================================
-- ENABLE PROFILE DELETION RLS POLICY
-- =================================================================

-- First, check current policies on profiles table
-- You can run this in Supabase SQL Editor to see current policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create a new policy that allows users to delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Also ensure users can read and update their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- =================================================================
-- ANALYTICS TABLE POLICIES (CONDITIONAL)
-- =================================================================

-- Only create analytics policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics') THEN
    -- Enable RLS on analytics table
    ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

    -- Allow users to delete their own analytics data
    DROP POLICY IF EXISTS "Users can delete their own analytics" ON public.analytics;
    CREATE POLICY "Users can delete their own analytics" 
    ON public.analytics 
    FOR DELETE 
    USING (auth.uid() = profile_id);

    -- Allow users to view their own analytics
    DROP POLICY IF EXISTS "Users can view their own analytics" ON public.analytics;
    CREATE POLICY "Users can view their own analytics" 
    ON public.analytics 
    FOR SELECT 
    USING (auth.uid() = profile_id);

    -- Allow users to insert their own analytics
    DROP POLICY IF EXISTS "Users can insert their own analytics" ON public.analytics;
    CREATE POLICY "Users can insert their own analytics" 
    ON public.analytics 
    FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

    RAISE NOTICE 'Analytics table policies created successfully';
  ELSE
    RAISE NOTICE 'Analytics table does not exist, skipping analytics policies';
  END IF;
END $$;

-- =================================================================
-- TESTIMONIALS TABLE POLICIES (CONDITIONAL)
-- =================================================================

-- Only create testimonials policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'testimonials') THEN
    -- Enable RLS on testimonials table
    ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

    -- Allow users to delete their own testimonials (using user_id column)
    DROP POLICY IF EXISTS "Users can delete their own testimonials" ON public.testimonials;
    CREATE POLICY "Users can delete their own testimonials" 
    ON public.testimonials 
    FOR DELETE 
    USING (auth.uid() = user_id);

    -- Allow users to view their own testimonials
    DROP POLICY IF EXISTS "Users can view their own testimonials" ON public.testimonials;
    CREATE POLICY "Users can view their own testimonials" 
    ON public.testimonials 
    FOR SELECT 
    USING (auth.uid() = user_id);

    -- Allow users to insert their own testimonials
    DROP POLICY IF EXISTS "Users can insert their own testimonials" ON public.testimonials;
    CREATE POLICY "Users can insert their own testimonials" 
    ON public.testimonials 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    -- Allow users to update their own testimonials
    DROP POLICY IF EXISTS "Users can update their own testimonials" ON public.testimonials;
    CREATE POLICY "Users can update their own testimonials" 
    ON public.testimonials 
    FOR UPDATE 
    USING (auth.uid() = user_id);

    RAISE NOTICE 'Testimonials table policies created successfully';
  ELSE
    RAISE NOTICE 'Testimonials table does not exist, skipping testimonials policies';
  END IF;
END $$;

-- =================================================================
-- VERIFICATION
-- =================================================================

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- You can verify the policies were created by running:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'profiles'
-- ORDER BY tablename, policyname;

-- Check which tables exist:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('profiles', 'analytics', 'testimonials');

-- Test the delete policy by running (replace with your user ID):
-- DELETE FROM profiles WHERE id = 'your-user-id';
