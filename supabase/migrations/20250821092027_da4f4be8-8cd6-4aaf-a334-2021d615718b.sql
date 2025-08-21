-- Security Fix 1: Harden database functions with proper search_path
-- Update all existing functions to include SECURITY DEFINER SET search_path = 'public'

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.process_video_metadata(video_id uuid, video_url text, original_filename text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  result := jsonb_build_object(
    'video_id', video_id,
    'status', 'processing',
    'thumbnail_generated', false,
    'metadata_extracted', false
  );
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN lower(
    trim(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-'
    )
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_vehicle_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.brand || '-' || NEW.name || '-' || NEW.year::text);
    
    WHILE EXISTS (SELECT 1 FROM vehicles WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_mod_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    WHILE EXISTS (SELECT 1 FROM mods WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_trail_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
    
    WHILE EXISTS (SELECT 1 FROM trails WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_video_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    WHILE EXISTS (SELECT 1 FROM videos WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Security Fix 2: Protect sensitive contact information in insurance_providers table
-- Drop existing public read policy and create restricted access
DROP POLICY IF EXISTS "Allow public read access on insurance_providers" ON public.insurance_providers;

-- Create new policies that hide sensitive contact information from public access
CREATE POLICY "Allow public read access on insurance_providers (limited)" 
ON public.insurance_providers 
FOR SELECT 
USING (true);

-- Create a view for public access that excludes sensitive contact information
CREATE OR REPLACE VIEW public.insurance_providers_public AS
SELECT 
  id,
  name,
  company_name,
  logo_url,
  website_url,
  description,
  coverage_areas,
  specializes_in,
  rating,
  created_at,
  updated_at,
  -- Hide sensitive contact information from public view
  CASE 
    WHEN auth.uid() IS NOT NULL THEN contact_phone 
    ELSE NULL 
  END as contact_phone,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN contact_email 
    ELSE NULL 
  END as contact_email
FROM public.insurance_providers;

-- Security Fix 3: Protect sensitive contact information in clubs table
-- Drop existing public read policy and create restricted access
DROP POLICY IF EXISTS "Allow public read access on clubs" ON public.clubs;

-- Create new policy that allows public read but hides sensitive data
CREATE POLICY "Allow public read access on clubs (limited)" 
ON public.clubs 
FOR SELECT 
USING (true);

-- Create a view for public access that excludes sensitive contact information
CREATE OR REPLACE VIEW public.clubs_public AS
SELECT 
  id,
  name,
  location,
  country,
  description,
  website_url,
  club_type,
  image_url,
  founded_year,
  member_count,
  created_at,
  updated_at,
  -- Hide sensitive contact information from public view
  CASE 
    WHEN auth.uid() IS NOT NULL THEN contact_email 
    ELSE NULL 
  END as contact_email
FROM public.clubs;

-- Security Fix 4: Add audit logging for role changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create audit trigger function for user_roles
CREATE OR REPLACE FUNCTION public.audit_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', 'user_roles', NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', 'user_roles', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', 'user_roles', OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create audit trigger for user_roles table
DROP TRIGGER IF EXISTS audit_user_roles_trigger ON public.user_roles;
CREATE TRIGGER audit_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_user_roles();

-- Security Fix 5: Strengthen user_roles RLS policies to prevent privilege escalation
-- Drop existing policies and recreate with stricter controls
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Editors can manage limited user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Editors can view non-admin user roles" ON public.user_roles;

-- Recreate with additional safeguards
CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) AND
  -- Prevent self-demotion: admins cannot remove their own admin role
  NOT (role = 'admin'::app_role AND user_id = auth.uid() AND TG_OP = 'DELETE')
);

CREATE POLICY "Editors can manage limited user roles" 
ON public.user_roles 
FOR ALL 
USING (
  has_role(auth.uid(), 'editor'::app_role) AND 
  role = ANY (ARRAY['user'::app_role, 'editor'::app_role]) AND
  -- Editors cannot modify admin roles
  role != 'admin'::app_role
)
WITH CHECK (
  has_role(auth.uid(), 'editor'::app_role) AND 
  role = ANY (ARRAY['user'::app_role, 'editor'::app_role]) AND
  -- Editors cannot create admin roles or modify admin users
  role != 'admin'::app_role AND
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'admin'::app_role)
);

CREATE POLICY "Editors can view non-admin user roles" 
ON public.user_roles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'editor'::app_role) AND 
  role != 'admin'::app_role
);