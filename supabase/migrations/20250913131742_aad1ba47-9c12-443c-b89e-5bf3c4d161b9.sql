-- Fix insurance providers security issue
-- Drop the existing public read policy
DROP POLICY IF EXISTS "Allow public read access on insurance_providers" ON public.insurance_providers;

-- Create restricted policy for authenticated admin/editor access
CREATE POLICY "Admins and editors can view full insurance provider data" 
ON public.insurance_providers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create a public view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.insurance_providers_public AS
SELECT 
  id,
  name,
  company_name,
  logo_url,
  website_url,
  description,
  rating,
  coverage_areas,
  specializes_in,
  created_at,
  updated_at,
  NULL as contact_email,
  NULL as contact_phone
FROM public.insurance_providers;

-- Grant public access to the safe view
GRANT SELECT ON public.insurance_providers_public TO anon, authenticated;

-- Create RLS policy for the public view
ALTER VIEW public.insurance_providers_public SET (security_invoker = true);

-- Add policy for public access to the view
CREATE POLICY "Allow public read access on insurance_providers_public" 
ON public.insurance_providers 
FOR SELECT 
USING (true);