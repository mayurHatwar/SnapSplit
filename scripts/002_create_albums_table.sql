-- Create albums table
CREATE TABLE IF NOT EXISTS public.albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_shared BOOLEAN DEFAULT FALSE,
  share_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for albums
CREATE POLICY "albums_select_own" ON public.albums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "albums_insert_own" ON public.albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "albums_update_own" ON public.albums
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "albums_delete_own" ON public.albums
  FOR DELETE USING (auth.uid() = user_id);

-- Allow viewing shared albums
CREATE POLICY "albums_select_shared" ON public.albums
  FOR SELECT USING (is_shared = TRUE);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS albums_user_id_idx ON public.albums(user_id);
CREATE INDEX IF NOT EXISTS albums_share_code_idx ON public.albums(share_code);
