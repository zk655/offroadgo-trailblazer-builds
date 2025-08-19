-- Create videos storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for videos bucket
CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Admins and editors can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'videos' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'editor'::app_role)
  )
);

CREATE POLICY "Admins and editors can update videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'videos' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'editor'::app_role)
  )
);

CREATE POLICY "Admins and editors can delete videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'videos' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'editor'::app_role)
  )
);