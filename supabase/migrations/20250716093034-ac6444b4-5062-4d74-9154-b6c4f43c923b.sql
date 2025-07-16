-- Create clubs table for rally clubs and events
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  country TEXT,
  description TEXT,
  website_url TEXT,
  contact_email TEXT,
  club_type TEXT DEFAULT 'rally', -- rally, motorsport, etc
  founded_year INTEGER,
  member_count INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table for rally competitions and events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'rally', -- rally, competition, meetup
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  country TEXT,
  venue TEXT,
  entry_fee DECIMAL(10,2),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  club_id UUID REFERENCES clubs(id),
  external_url TEXT,
  image_url TEXT,
  difficulty_level TEXT, -- beginner, intermediate, advanced, professional
  terrain_type TEXT, -- gravel, tarmac, mixed, snow
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance_providers table
CREATE TABLE public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  description TEXT,
  rating DECIMAL(3,2), -- 0.00 to 5.00
  coverage_areas TEXT[], -- array of states/countries
  specializes_in TEXT[], -- trucks, SUVs, commercial, personal
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance_quotes table
CREATE TABLE public.insurance_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES insurance_providers(id),
  vehicle_type TEXT NOT NULL, -- truck, SUV, commercial_truck, pickup
  coverage_type TEXT NOT NULL, -- liability, comprehensive, collision, full
  monthly_premium DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  deductible DECIMAL(10,2),
  coverage_limit DECIMAL(12,2),
  min_age INTEGER,
  max_age INTEGER,
  min_experience_years INTEGER,
  state_code TEXT, -- US state or country code
  effective_date DATE,
  expiry_date DATE,
  features TEXT[], -- roadside_assistance, rental_coverage, etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on clubs" 
ON public.clubs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on insurance_providers" 
ON public.insurance_providers 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on insurance_quotes" 
ON public.insurance_quotes 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_providers_updated_at
BEFORE UPDATE ON public.insurance_providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_quotes_updated_at
BEFORE UPDATE ON public.insurance_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_club_id ON public.events(club_id);
CREATE INDEX idx_events_country ON public.events(country);
CREATE INDEX idx_clubs_country ON public.clubs(country);
CREATE INDEX idx_insurance_quotes_provider_id ON public.insurance_quotes(provider_id);
CREATE INDEX idx_insurance_quotes_vehicle_type ON public.insurance_quotes(vehicle_type);
CREATE INDEX idx_insurance_quotes_state_code ON public.insurance_quotes(state_code);