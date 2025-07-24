-- Add images column to blogs table
ALTER TABLE public.blogs 
ADD COLUMN images TEXT[];