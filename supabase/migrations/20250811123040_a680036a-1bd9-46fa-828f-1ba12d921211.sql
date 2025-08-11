-- Add slug columns to tables for SEO-friendly URLs
ALTER TABLE vehicles ADD COLUMN slug text;
ALTER TABLE mods ADD COLUMN slug text;
ALTER TABLE trails ADD COLUMN slug text;

-- Create unique indexes for slugs
CREATE UNIQUE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE UNIQUE INDEX idx_mods_slug ON mods(slug);
CREATE UNIQUE INDEX idx_trails_slug ON trails(slug);

-- Function to generate slug from text
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Populate existing vehicle slugs
UPDATE vehicles 
SET slug = generate_slug(brand || '-' || name)
WHERE slug IS NULL;

-- Populate existing mod slugs
UPDATE mods 
SET slug = generate_slug(title)
WHERE slug IS NULL;

-- Populate existing trail slugs  
UPDATE trails
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Create triggers to auto-generate slugs for new records
CREATE OR REPLACE FUNCTION auto_generate_vehicle_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.brand || '-' || NEW.name);
    
    -- Handle duplicate slugs by appending a number
    WHILE EXISTS (SELECT 1 FROM vehicles WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER vehicle_slug_trigger
  BEFORE INSERT OR UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_vehicle_slug();

CREATE TRIGGER mod_slug_trigger
  BEFORE INSERT OR UPDATE ON mods
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_mod_slug();

CREATE TRIGGER trail_slug_trigger
  BEFORE INSERT OR UPDATE ON trails
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_trail_slug();