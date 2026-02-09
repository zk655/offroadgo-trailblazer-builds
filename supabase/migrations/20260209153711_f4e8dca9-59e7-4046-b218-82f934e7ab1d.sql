
-- Fix 1: Restrict insurance_providers SELECT to admin/editor only (public view already exists)
DROP POLICY IF EXISTS "Insurance providers are viewable by everyone" ON public.insurance_providers;
CREATE POLICY "Insurance providers managed by admins and editors"
ON public.insurance_providers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Fix 2: Restrict audit_logs INSERT to authenticated users only
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
