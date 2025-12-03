-- =============================================
-- VOYAGE PHOTOS - Supabase Database Setup
-- =============================================
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- Make sure to do this BEFORE running the app!

-- 1. Create profiles table (stores user display names & avatars)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#4299e1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for profiles
-- Everyone can read profiles (to see names/avatars)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Create RLS policies for photos
-- Everyone can view photos
CREATE POLICY "Photos are viewable by everyone"
  ON photos FOR SELECT
  USING (true);

-- Authenticated users can upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own photos
CREATE POLICY "Users can delete own photos"
  ON photos FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX photos_user_id_idx ON photos(user_id);
CREATE INDEX photos_created_at_idx ON photos(created_at DESC);

-- =============================================
-- STORAGE BUCKET SETUP (do this in the Dashboard)
-- =============================================
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create a new bucket called "photos"
-- 3. Make it PUBLIC (toggle on)
-- 4. Add this policy for uploads:
--    - Policy name: "Allow authenticated uploads"
--    - Allowed operation: INSERT
--    - Target roles: authenticated
--    - Policy: (bucket_id = 'photos')
-- =============================================

-- Optional: Enable realtime for photos table
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
