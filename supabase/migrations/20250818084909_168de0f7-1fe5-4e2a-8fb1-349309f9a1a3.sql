-- Create videos table with comprehensive metadata
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER, -- duration in seconds
  file_size BIGINT, -- file size in bytes
  video_format TEXT DEFAULT 'mp4',
  resolution TEXT, -- e.g., '1920x1080', '1280x720'
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'processing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[]
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on videos" 
ON public.videos 
FOR SELECT 
USING (status = 'active');

-- Create policies for admin/editor management
CREATE POLICY "Admins and editors can manage videos" 
ON public.videos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create video interactions table
CREATE TABLE public.video_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'save', 'share')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, user_id, interaction_type)
);

-- Enable RLS on interactions
ALTER TABLE public.video_interactions ENABLE ROW LEVEL SECURITY;

-- Policies for interactions
CREATE POLICY "Users can manage their own interactions" 
ON public.video_interactions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access on video interactions" 
ON public.video_interactions 
FOR SELECT 
USING (true);

-- Create video tags table for better tag management
CREATE TABLE public.video_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#ff6b35',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on video tags
ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for video tags
CREATE POLICY "Allow public read access on video_tags" 
ON public.video_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and editors can manage video_tags" 
ON public.video_tags 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create function to auto-generate video slug
CREATE OR REPLACE FUNCTION public.auto_generate_video_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    -- Handle duplicate slugs by appending a number
    WHILE EXISTS (SELECT 1 FROM videos WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto slug generation
CREATE TRIGGER auto_generate_video_slug_trigger
BEFORE INSERT OR UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_video_slug();

-- Create trigger for updated_at
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX idx_videos_view_count ON public.videos(view_count DESC);
CREATE INDEX idx_videos_tags ON public.videos USING GIN(tags);
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_slug ON public.videos(slug);
CREATE INDEX idx_video_interactions_video_id ON public.video_interactions(video_id);
CREATE INDEX idx_video_interactions_user_id ON public.video_interactions(user_id);

-- Insert some sample data
INSERT INTO public.video_tags (name, slug, description, color) VALUES
('jeep', 'jeep', 'Jeep vehicles and modifications', '#ff6b35'),
('overlanding', 'overlanding', 'Overland travel and camping', '#2563eb'),
('mudlife', 'mudlife', 'Mud terrain and mudding videos', '#8b5a2b'),
('rockcarwling', 'rockcrawling', 'Rock crawling adventures', '#6b7280'),
('camping', 'camping', 'Outdoor camping content', '#059669'),
('trail', 'trail', 'Trail riding and exploration', '#7c3aed'),
('build', 'build', 'Vehicle builds and modifications', '#dc2626'),
('review', 'review', 'Vehicle and gear reviews', '#ea580c');

INSERT INTO public.videos (title, description, video_url, thumbnail_url, duration, tags, category, view_count, like_count, is_featured) VALUES
('Epic Jeep Wrangler Rubicon Trail Run', 'Join us for an incredible adventure on the famous Rubicon Trail with a modified Jeep Wrangler. Watch as we tackle challenging obstacles and showcase the capabilities of this amazing off-road machine.', '/videos/jeep-rubicon-trail.mp4', '/assets/videos/jeep-rubicon-thumb.jpg', 720, ARRAY['jeep', 'trail', 'rubicon'], 'Adventure', 15420, 287, true),
('Ultimate Overlanding Gear Setup 2024', 'Complete breakdown of our overlanding gear setup for extended adventures. From rooftop tents to recovery gear, we cover everything you need for successful overland travel.', '/videos/overlanding-gear-2024.mp4', '/assets/videos/overlanding-gear-thumb.jpg', 892, ARRAY['overlanding', 'camping', 'gear'], 'Gear Review', 8934, 156, true),
('Ford Bronco vs Jeep Wrangler Comparison', 'Head-to-head comparison between the new Ford Bronco and Jeep Wrangler Rubicon. Which one performs better off-road? Find out in this comprehensive test.', '/videos/bronco-vs-wrangler.mp4', '/assets/videos/bronco-vs-wrangler-thumb.jpg', 1024, ARRAY['ford', 'jeep', 'comparison'], 'Comparison', 22150, 445, true),
('Mudding Madness: Extreme Mud Terrain', 'Watch these beasts tackle the deepest, nastiest mud holes. Featuring lifted trucks and specialized mud tires going through extreme terrain.', '/videos/mudding-madness.mp4', '/assets/videos/mudding-madness-thumb.jpg', 645, ARRAY['mudlife', 'trucks', 'extreme'], 'Adventure', 18976, 334, false),
('DIY Suspension Lift Install Guide', 'Step-by-step guide to installing a 6-inch suspension lift kit on a Chevy Silverado. All the tips and tricks you need for a successful install.', '/videos/suspension-lift-install.mp4', '/assets/videos/suspension-lift-thumb.jpg', 1456, ARRAY['build', 'diy', 'suspension'], 'How-To', 6782, 123, false),
('Moab Rock Crawling Adventure', 'Experience the thrill of rock crawling in Moab, Utah. Navigate challenging rock formations and witness breathtaking desert landscapes.', '/videos/moab-rock-crawling.mp4', '/assets/videos/moab-rock-thumb.jpg', 534, ARRAY['rockcrawling', 'moab', 'utah'], 'Adventure', 11250, 198, false);