-- Add thumbnailUrl field to videos table
ALTER TABLE public.videos 
ADD COLUMN thumbnail_url text;