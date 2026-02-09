
-- Fix security definer views by setting security_invoker = true
ALTER VIEW public.clubs_public SET (security_invoker = true);
ALTER VIEW public.insurance_providers_public SET (security_invoker = true);
