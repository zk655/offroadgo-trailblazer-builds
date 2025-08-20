-- Fix the videos status check constraint to allow all valid statuses
ALTER TABLE videos DROP CONSTRAINT IF EXISTS videos_status_check;

-- Add proper status check constraint
ALTER TABLE videos ADD CONSTRAINT videos_status_check 
  CHECK (status IN ('active', 'inactive', 'draft', 'pending', 'processing', 'published'));

-- Also fix processing_status constraint if it exists
ALTER TABLE videos DROP CONSTRAINT IF EXISTS videos_processing_status_check;

-- Add proper processing_status check constraint  
ALTER TABLE videos ADD CONSTRAINT videos_processing_status_check
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));