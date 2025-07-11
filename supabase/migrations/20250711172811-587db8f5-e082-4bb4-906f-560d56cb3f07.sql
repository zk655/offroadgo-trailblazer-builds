-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  engine TEXT,
  clearance FLOAT,
  tire_size TEXT,
  image_url TEXT,
  year INTEGER,
  price FLOAT,
  mpg FLOAT,
  towing_capacity INTEGER,
  ground_clearance FLOAT,
  approach_angle INTEGER,
  departure_angle INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mods table
CREATE TABLE public.mods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price FLOAT,
  brand TEXT,
  rating FLOAT DEFAULT 0,
  image_url TEXT,
  amazon_link TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create builds table
CREATE TABLE public.builds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mod_ids TEXT[],
  total_cost FLOAT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trails table
CREATE TABLE public.trails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  terrain TEXT,
  difficulty TEXT,
  distance FLOAT,
  gpx_url TEXT,
  image_url TEXT,
  location TEXT,
  description TEXT,
  latitude FLOAT,
  longitude FLOAT,
  elevation_gain INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table for cached blog posts
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required)
CREATE POLICY "Allow public read access on vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on mods" ON public.mods FOR SELECT USING (true);
CREATE POLICY "Allow public read access on builds" ON public.builds FOR SELECT USING (true);
CREATE POLICY "Allow public read access on trails" ON public.trails FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX idx_vehicles_type ON public.vehicles(type);
CREATE INDEX idx_mods_category ON public.mods(category);
CREATE INDEX idx_trails_difficulty ON public.trails(difficulty);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);

-- Insert sample data for vehicles
INSERT INTO public.vehicles (name, brand, type, engine, clearance, tire_size, image_url, year, price, mpg, towing_capacity, ground_clearance, approach_angle, departure_angle) VALUES
('Wrangler Unlimited Rubicon', 'Jeep', 'SUV', '3.6L V6', 10.8, '33"', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 2024, 45000, 22, 3500, 10.8, 44, 37),
('Bronco Wildtrak', 'Ford', 'SUV', '2.7L EcoBoost V6', 11.6, '35"', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', 2024, 55000, 20, 3500, 11.6, 43, 26),
('Tacoma TRD Pro', 'Toyota', 'Pickup', '3.5L V6', 9.6, '31.5"', 'https://images.unsplash.com/photo-1571033375761-2f3c4cfbfaa0?w=800', 2024, 50000, 24, 6800, 9.6, 36, 26),
('Raptor', 'Ford', 'Pickup', '3.5L EcoBoost V6', 13.1, '35"', 'https://images.unsplash.com/photo-1594736797933-d0a9ba076fb9?w=800', 2024, 75000, 15, 8200, 13.1, 31, 23),
('4Runner TRD Pro', 'Toyota', 'SUV', '4.0L V6', 9.6, '31.5"', 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800', 2024, 52000, 17, 5000, 9.6, 33, 26);

-- Insert sample data for mods
INSERT INTO public.mods (title, category, price, brand, rating, image_url, description) VALUES
('BFGoodrich All-Terrain T/A KO2', 'Tires', 1200, 'BFGoodrich', 4.5, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', '35" All-terrain tire set'),
('ARB Bull Bar', 'Protection', 800, 'ARB', 4.8, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Heavy-duty front protection'),
('Rigid LED Light Bar', 'Lighting', 400, 'Rigid Industries', 4.7, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400', '50" LED light bar'),
('Bilstein 5100 Shocks', 'Suspension', 600, 'Bilstein', 4.6, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 'Performance shock absorbers'),
('Teraflex Lift Kit', 'Suspension', 1500, 'Teraflex', 4.4, 'https://images.unsplash.com/photo-1571033375761-2f3c4cfbfaa0?w=400', '3.5" suspension lift kit');

-- Insert sample data for trails
INSERT INTO public.trails (name, terrain, difficulty, distance, image_url, location, description, latitude, longitude, elevation_gain) VALUES
('Moab Slickrock Trail', 'Rock', 'Intermediate', 10.5, 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800', 'Moab, Utah', 'Famous sandstone trail with challenging climbs', 38.5816, -109.5498, 1200),
('Rubicon Trail', 'Rock', 'Expert', 22.0, 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800', 'California', 'Legendary 4x4 trail through Sierra Nevada', 38.9607, -120.1435, 2500),
('Black Bear Pass', 'Mountain', 'Expert', 7.5, 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800', 'Colorado', 'Steep mountain pass with breathtaking views', 37.8814, -107.6903, 3000),
('Hell''s Revenge', 'Rock', 'Intermediate', 6.5, 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800', 'Moab, Utah', 'Slickrock trail with steep climbs and descents', 38.5738, -109.5654, 800),
('Alpine Loop', 'Mountain', 'Beginner', 15.2, 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800', 'Colorado', 'Scenic mountain loop through historic mining towns', 37.8697, -107.5611, 1500);

-- Insert sample blog posts
INSERT INTO public.blogs (title, slug, content, excerpt, cover_image, author, published_at, tags) VALUES
('Top 10 Off-Road Modifications for Beginners', 'top-10-offroad-mods-beginners', 'When starting your off-road journey, choosing the right modifications can make all the difference...', 'Essential modifications every off-road enthusiast should consider', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'Mike Johnson', now() - interval '2 days', ARRAY['modifications', 'beginners', 'gear']),
('Exploring the Rubicon Trail: A Complete Guide', 'rubicon-trail-complete-guide', 'The Rubicon Trail is considered the crown jewel of off-road adventures...', 'Everything you need to know about tackling the legendary Rubicon Trail', 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800', 'Sarah Wilson', now() - interval '5 days', ARRAY['trails', 'california', 'adventure']),
('Best Tires for Rock Crawling in 2024', 'best-tires-rock-crawling-2024', 'Choosing the right tires for rock crawling is crucial for both performance and safety...', 'Our comprehensive review of the top rock crawling tires', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'Dave Rodriguez', now() - interval '1 week', ARRAY['tires', 'gear', 'reviews']);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mods_updated_at BEFORE UPDATE ON public.mods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_builds_updated_at BEFORE UPDATE ON public.builds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trails_updated_at BEFORE UPDATE ON public.trails FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();