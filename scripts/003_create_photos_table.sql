-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  faces_detected JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for photos
CREATE POLICY "photos_select_own" ON public.photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "photos_insert_own" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photos_update_own" ON public.photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "photos_delete_own" ON public.photos
  FOR DELETE USING (auth.uid() = user_id);

-- Allow viewing photos from shared albums
CREATE POLICY "photos_select_shared" ON public.photos
  FOR SELECT USING (
    album_id IN (
      SELECT id FROM public.albums WHERE is_shared = TRUE
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS photos_album_id_idx ON public.photos(album_id);
CREATE INDEX IF NOT EXISTS photos_user_id_idx ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS photos_faces_detected_idx ON public.photos USING GIN(faces_detected);
