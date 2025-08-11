-- Fix security warnings for functions by setting search_path
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION auto_generate_vehicle_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.brand || '-' || NEW.name || '-' || NEW.year::text);
    
    -- Handle duplicate slugs by appending a number
    WHILE EXISTS (SELECT 1 FROM vehicles WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION auto_generate_mod_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    -- Handle duplicate slugs by appending a number
    WHILE EXISTS (SELECT 1 FROM mods WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION auto_generate_trail_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
    
    -- Handle duplicate slugs by appending a number
    WHILE EXISTS (SELECT 1 FROM trails WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';