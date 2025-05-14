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
  background_color TEXT DEFAULT '#f8f9fa'
);

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