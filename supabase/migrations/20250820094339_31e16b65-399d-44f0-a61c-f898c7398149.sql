-- Create video processing and thumbnail generation edge function
CREATE OR REPLACE FUNCTION process_video_metadata(
  video_id UUID,
  video_url TEXT,
  original_filename TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This function will be enhanced by the edge function
  -- For now, return basic structure
  result := jsonb_build_object(
    'video_id', video_id,
    'status', 'processing',
    'thumbnail_generated', false,
    'metadata_extracted', false
  );
  
  RETURN result;
END;
$$;

-- Add indexes for better video query performance
CREATE INDEX IF NOT EXISTS idx_videos_status_published ON videos(status, published_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_videos_trending ON videos(is_trending, view_count DESC) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured, created_at DESC) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_videos_search ON videos USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Add video processing status column
ALTER TABLE videos ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_generated BOOLEAN DEFAULT false;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS metadata_extracted BOOLEAN DEFAULT false;