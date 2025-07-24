-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog images bucket
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- Create blog_images table to track uploaded images
CREATE TABLE public.blog_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_images
ALTER TABLE public.blog_images ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_images table
CREATE POLICY "Allow public read access on blog_images" 
ON public.blog_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and editors can manage blog images" 
ON public.blog_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_blog_images_updated_at
BEFORE UPDATE ON public.blog_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();