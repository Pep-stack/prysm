-- =================================================================
-- PROFILES TABLE SETUP
-- =================================================================

-- Create a table for public profiles if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  button_color TEXT DEFAULT '#00C48C',
  button_shape TEXT DEFAULT 'rounded-full',
  font_family TEXT DEFAULT 'Inter, sans-serif',
  icon_pack TEXT DEFAULT 'lucide',
  updated_at TIMESTAMP WITH TIME ZONE,
  avatar_size TEXT DEFAULT 'medium',
  avatar_position TEXT DEFAULT 'left',
  avatar_shape TEXT DEFAULT 'circle',
  card_color TEXT DEFAULT '#ffffff',
  background_color TEXT DEFAULT '#f8f9fa',
  text_color TEXT DEFAULT '#000000',
  icon_size TEXT DEFAULT '24px',
  icon_color TEXT DEFAULT 'auto',
  -- Social media columns
  linkedin TEXT,
  x_profile TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube_channel TEXT,
  tiktok TEXT,
  github_gitlab TEXT,
  dribbble_behance TEXT,
  stackoverflow TEXT,
  -- Additional profile columns  
  card_sections JSONB DEFAULT '[]'::jsonb,
  card_type TEXT DEFAULT 'pro',
  languages TEXT,
  contact TEXT,
  experience TEXT,
  education TEXT,
  certifications TEXT,
  projects TEXT,
  publications TEXT,
  events TEXT,
  awards TEXT,
  testimonials TEXT,
  services TEXT
);

-- Add the new columns if they don't exist (for existing tables)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS icon_size TEXT DEFAULT '24px',
ADD COLUMN IF NOT EXISTS icon_color TEXT DEFAULT 'auto',
-- Social media columns
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS x_profile TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS github_gitlab TEXT,
ADD COLUMN IF NOT EXISTS dribbble_behance TEXT,
ADD COLUMN IF NOT EXISTS stackoverflow TEXT,
-- Additional profile columns
ADD COLUMN IF NOT EXISTS card_sections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS card_type TEXT DEFAULT 'pro',
ADD COLUMN IF NOT EXISTS languages TEXT,
ADD COLUMN IF NOT EXISTS contact TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT,
ADD COLUMN IF NOT EXISTS projects TEXT,
ADD COLUMN IF NOT EXISTS publications TEXT,
ADD COLUMN IF NOT EXISTS events TEXT,
ADD COLUMN IF NOT EXISTS awards TEXT,
ADD COLUMN IF NOT EXISTS testimonials TEXT,
ADD COLUMN IF NOT EXISTS services TEXT;

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist) to prevent errors on re-run
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Create policies
-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Users can update own profile
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- =================================================================
-- TRIGGERS
-- =================================================================

-- Create a trigger function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name,  -- Initialize name as username part of email
    button_color,
    button_shape,
    font_family,
    icon_pack,
    text_color,
    icon_size,
    icon_color,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    SPLIT_PART(NEW.email, '@', 1),
    '#00C48C',
    'rounded-full',
    'Inter, sans-serif',
    'lucide',
    '#000000',
    '24px',
    'auto',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =================================================================
-- STORAGE SETUP (if you add avatar uploads later)
-- =================================================================

-- Set up storage
-- UNCOMMENT THIS SECTION WHEN ADDING AVATAR UPLOADS
/*
-- Drop existing storage policies first
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- Create new storage policies
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );
*/ 