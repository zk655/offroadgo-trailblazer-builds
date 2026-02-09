
-- Fix: Restrict clubs table SELECT to admin/editor, and create a public view that hides contact info
DROP POLICY IF EXISTS "Clubs are viewable by everyone" ON public.clubs;
CREATE POLICY "Clubs managed by admins and editors select"
ON public.clubs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create a public view for clubs that hides contact info from unauthenticated users
CREATE OR REPLACE VIEW public.clubs_public AS
SELECT
  id, name, description, type, location, member_count, image_url, website_url,
  created_at, updated_at,
  CASE
    WHEN auth.uid() IS NOT NULL AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
    THEN contact_email ELSE NULL
  END AS contact_email,
  CASE
    WHEN auth.uid() IS NOT NULL AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
    THEN contact_phone ELSE NULL
  END AS contact_phone
FROM public.clubs;
