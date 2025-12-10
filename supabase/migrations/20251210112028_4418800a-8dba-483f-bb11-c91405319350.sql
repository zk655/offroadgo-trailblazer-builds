
-- Drop the security definer view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.insurance_providers_public;

-- Recreate as a regular view (SECURITY INVOKER is default)
CREATE VIEW public.insurance_providers_public 
WITH (security_invoker = true)
AS
SELECT 
    id, name, description, logo_url, website_url, rating, created_at, updated_at,
    CASE WHEN auth.uid() IS NOT NULL AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
        THEN contact_email ELSE NULL END as contact_email,
    CASE WHEN auth.uid() IS NOT NULL AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
        THEN contact_phone ELSE NULL END as contact_phone
FROM public.insurance_providers;
