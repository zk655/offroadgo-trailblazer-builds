-- Create categories table for parts
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for category access
CREATE POLICY "Allow public read access on categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and editors can manage categories" 
ON public.categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Insert default categories
INSERT INTO public.categories (name) VALUES
  ('Suspension'),
  ('Bumpers & Armor'),
  ('Lighting'),
  ('Winches & Recovery'),
  ('Tires & Wheels'),
  ('Interior'),
  ('Engine & Performance'),
  ('Exhaust'),
  ('Roof Racks'),
  ('Rock Sliders'),
  ('Skid Plates'),
  ('Storage'),
  ('Electronics'),
  ('Tools'),
  ('Other');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();