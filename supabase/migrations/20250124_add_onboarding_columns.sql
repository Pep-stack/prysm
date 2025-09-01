-- Add onboarding tracking columns to profiles table
-- This migration adds columns to track user onboarding progress

-- Add onboarding_completed column (tracks if user finished onboarding)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add onboarding_step column (tracks current step if onboarding was interrupted)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Add first_login_at column (tracks when user first accessed dashboard)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMP WITH TIME ZONE;

-- Add onboarding_started_at column (tracks when onboarding flow was initiated)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMP WITH TIME ZONE;

-- Update existing profiles to mark them as completed (they've already used the dashboard)
-- Use updated_at as a proxy for existing users, or check for existing data
UPDATE profiles 
SET onboarding_completed = TRUE 
WHERE (updated_at < NOW() OR card_sections IS NOT NULL) AND onboarding_completed IS NULL;

-- Create index for faster onboarding queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed, first_login_at);

-- Add comment for documentation
COMMENT ON COLUMN profiles.onboarding_completed IS 'Indicates if user has completed the dashboard onboarding flow';
COMMENT ON COLUMN profiles.onboarding_step IS 'Current step in onboarding flow (0-10), used for resuming interrupted onboarding';
COMMENT ON COLUMN profiles.first_login_at IS 'Timestamp of first dashboard access, used to detect new users';
COMMENT ON COLUMN profiles.onboarding_started_at IS 'Timestamp when onboarding flow was first initiated';
