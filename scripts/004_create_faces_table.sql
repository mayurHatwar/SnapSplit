-- Create faces table for storing face detection results
CREATE TABLE IF NOT EXISTS faces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  confidence FLOAT NOT NULL,
  landmarks JSONB,
  descriptor FLOAT[],
  person_id UUID, -- For grouping faces of the same person
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS faces_photo_id_idx ON faces(photo_id);
CREATE INDEX IF NOT EXISTS faces_user_id_idx ON faces(user_id);
CREATE INDEX IF NOT EXISTS faces_person_id_idx ON faces(person_id);

-- Add RLS policies
ALTER TABLE faces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own faces" ON faces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own faces" ON faces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own faces" ON faces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own faces" ON faces
  FOR DELETE USING (auth.uid() = user_id);

-- Update photos table to include face analysis metadata
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS face_count INTEGER DEFAULT 0;
