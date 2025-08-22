-- =================================================================
-- AUTO DELETE AUTH USER WHEN PROFILE IS DELETED
-- =================================================================

-- This script creates a trigger that automatically deletes the auth user
-- when their profile is deleted from the profiles table

-- Step 1: Create a function that deletes the auth user
CREATE OR REPLACE FUNCTION delete_auth_user_on_profile_delete()
RETURNS TRIGGER AS $$
DECLARE
  service_role_key TEXT;
BEGIN
  -- Log the deletion attempt
  RAISE NOTICE 'Profile deleted for user: %, attempting to delete auth user', OLD.id;
  
  -- Note: We cannot directly call supabase.auth.admin.deleteUser from a trigger
  -- because it requires HTTP calls which are not available in PostgreSQL functions.
  -- 
  -- Instead, we'll create a record in a cleanup table that can be processed
  -- by a background job or webhook.
  
  -- Create a cleanup request (you'll need to create this table)
  -- INSERT INTO auth_user_cleanup_queue (user_id, created_at)
  -- VALUES (OLD.id, NOW());
  
  -- For now, just log it
  RAISE NOTICE 'Auth user cleanup needed for user: %', OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS trigger_delete_auth_user_on_profile_delete ON public.profiles;
CREATE TRIGGER trigger_delete_auth_user_on_profile_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION delete_auth_user_on_profile_delete();

-- Step 3: Create a cleanup queue table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.auth_user_cleanup_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT
);

-- Enable RLS on cleanup queue
ALTER TABLE public.auth_user_cleanup_queue ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access cleanup queue
CREATE POLICY "Only service role can access cleanup queue"
ON public.auth_user_cleanup_queue
FOR ALL
USING (current_setting('role') = 'service_role');

-- Create index for efficient processing
CREATE INDEX IF NOT EXISTS idx_auth_cleanup_status ON auth_user_cleanup_queue(status, created_at);

-- Step 4: Update the trigger to use the cleanup queue
CREATE OR REPLACE FUNCTION delete_auth_user_on_profile_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the deletion attempt
  RAISE NOTICE 'Profile deleted for user: %, queuing auth user deletion', OLD.id;
  
  -- Add to cleanup queue
  INSERT INTO public.auth_user_cleanup_queue (user_id)
  VALUES (OLD.id);
  
  RAISE NOTICE 'Auth user deletion queued for user: %', OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verification
SELECT 'Auto delete auth user trigger created successfully!' as result;
