-- Update RLS policies to allow editors to manage users alongside admins

-- Drop existing policies for profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policy allowing both admins and editors to view all profiles
CREATE POLICY "Admins and editors can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Update user_roles policies to allow editors to manage roles (except admin role assignment)
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;

-- Admins can manage all roles
CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Editors can manage user and editor roles, but not admin roles
CREATE POLICY "Editors can manage limited user roles" 
ON public.user_roles 
FOR ALL 
USING (
  has_role(auth.uid(), 'editor'::app_role) 
  AND role IN ('user'::app_role, 'editor'::app_role)
);

-- Allow editors to delete users (except admins)
CREATE POLICY "Editors can view non-admin user roles" 
ON public.user_roles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'editor'::app_role) 
  AND role != 'admin'::app_role
);