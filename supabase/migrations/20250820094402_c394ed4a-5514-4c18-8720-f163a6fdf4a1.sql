-- Fix function search path security issues
CREATE OR REPLACE FUNCTION process_video_metadata(
  video_id UUID,
  video_url TEXT,
  original_filename TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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