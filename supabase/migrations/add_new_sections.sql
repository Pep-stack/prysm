-- Add new section columns for the new features
-- This migration adds support for Gallery, Featured Video, Appointments, Publications, Newsletter, Events, and FAQ sections

-- Add new columns for the new sections
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gallery TEXT,
ADD COLUMN IF NOT EXISTS featured_video TEXT,
ADD COLUMN IF NOT EXISTS appointments TEXT,
ADD COLUMN IF NOT EXISTS publications TEXT,
ADD COLUMN IF NOT EXISTS community TEXT,
ADD COLUMN IF NOT EXISTS events TEXT,
ADD COLUMN IF NOT EXISTS faq TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.gallery IS 'Gallery images and content as JSON string';
COMMENT ON COLUMN profiles.featured_video IS 'Featured video configuration as JSON string';
COMMENT ON COLUMN profiles.appointments IS 'Appointment/Calendly configuration as JSON string';
COMMENT ON COLUMN profiles.publications IS 'Publications and blog posts as JSON string';
COMMENT ON COLUMN profiles.community IS 'Community signup configuration as JSON string';
COMMENT ON COLUMN profiles.events IS 'Events and calendar entries as JSON string';
COMMENT ON COLUMN profiles.faq IS 'FAQ entries as JSON string';

-- Create simple indexes for better performance on new columns
-- Using simple indexes instead of GIN to avoid compatibility issues
CREATE INDEX IF NOT EXISTS idx_profiles_gallery ON profiles (gallery) WHERE gallery IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_featured_video ON profiles (featured_video) WHERE featured_video IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_appointments ON profiles (appointments) WHERE appointments IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_publications ON profiles (publications) WHERE publications IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_community ON profiles (community) WHERE community IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_events ON profiles (events) WHERE events IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_faq ON profiles (faq) WHERE faq IS NOT NULL; 