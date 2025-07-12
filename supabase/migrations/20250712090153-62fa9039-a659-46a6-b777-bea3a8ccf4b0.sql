-- Add sample vehicle data
INSERT INTO vehicles (brand, name, type, year, price, mpg, towing_capacity, ground_clearance, approach_angle, departure_angle, engine, tire_size, image_url) VALUES
('Jeep', 'Wrangler Rubicon', 'SUV', 2024, 45000, 22, 3500, 10.8, 44, 37, '3.6L V6', '285/70R17', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'),
('Ford', 'Bronco Wildtrak', 'SUV', 2024, 52000, 20, 3500, 11.6, 43, 26, '2.7L EcoBoost V6', '315/70R17', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop'),
('Toyota', '4Runner TRD Pro', 'SUV', 2024, 48000, 17, 5000, 9.6, 33, 26, '4.0L V6', '265/70R17', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'),
('Chevrolet', 'Colorado ZR2', 'Truck', 2024, 42000, 19, 7700, 10.7, 30, 21, '3.6L V6', '265/65R17', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop'),
('GMC', 'Sierra AT4X', 'Truck', 2024, 67000, 16, 9500, 11.2, 32, 23, '6.2L V8', '285/65R20', 'https://images.unsplash.com/photo-1594736797933-d0f31954d3a2?w=800&h=600&fit=crop'),
('Ram', '1500 TRX', 'Truck', 2024, 75000, 12, 8100, 11.8, 30, 23, '6.2L Supercharged V8', '325/65R18', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop');

-- Add sample mod/parts data with better categories and Amazon affiliate links
INSERT INTO mods (title, category, brand, price, rating, description, image_url, amazon_link) VALUES
-- Lighting
('Rigid Industries 20" LED Light Bar', 'Lighting', 'Rigid Industries', 489.99, 4.8, 'High-output LED light bar with spot and flood combo beam pattern. Perfect for night trail riding.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00ABC123'),
('KC HiLiTES Flex LED Rock Light Kit', 'Lighting', 'KC HiLiTES', 299.99, 4.6, 'RGB rock light kit with smartphone app control. 8 lights included with wiring harness.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00DEF456'),
('Baja Designs Squadron Sport LED', 'Lighting', 'Baja Designs', 189.99, 4.7, 'Compact LED driving/combo light. Great for bumper or A-pillar mounting.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00GHI789'),

-- Protection
('ARB Front Bumper Deluxe', 'Protection', 'ARB', 1899.99, 4.9, 'Heavy-duty steel front bumper with integrated winch mount and fog light provisions.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00JKL012'),
('Skid Row Engine Skid Plate', 'Protection', 'Skid Row', 349.99, 4.5, '3/16" aluminum skid plate providing maximum engine protection on the trails.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00MNO345'),
('Poison Spyder Rock Sliders', 'Protection', 'Poison Spyder', 599.99, 4.7, 'Heavy-duty steel rock sliders with step integration for protection and utility.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00PQR678'),

-- Suspension  
('Fox Racing 2.5 Reservoir Shocks', 'Suspension', 'Fox Racing', 1299.99, 4.8, 'Remote reservoir shocks with internal floating piston for superior damping control.', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00STU901'),
('Rough Country 4" Lift Kit', 'Suspension', 'Rough Country', 899.99, 4.4, 'Complete 4-inch suspension lift kit with N3 shocks and premium coil springs.', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00VWX234'),
('Old Man Emu Heavy Duty Springs', 'Suspension', 'Old Man Emu', 449.99, 4.6, 'Progressive rate coil springs designed for heavy loads and aggressive terrain.', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00YZA567'),

-- Performance
('K&N High-Flow Air Filter', 'Performance', 'K&N', 79.99, 4.5, 'Washable and reusable high-flow air filter for increased horsepower and torque.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00BCD890'),
('Borla ATAK Exhaust System', 'Performance', 'Borla', 1199.99, 4.7, 'Cat-back exhaust system with aggressive ATAK sound and improved performance.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00EFG123'),
('Diablo Sport inTune Programmer', 'Performance', 'Diablo Sport', 399.99, 4.3, 'Handheld tuning device for optimizing engine performance and fuel economy.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00HIJ456'),

-- Tires & Wheels
('BFGoodrich All-Terrain T/A KO2', 'Tires', 'BFGoodrich', 289.99, 4.6, 'Premium all-terrain tire with enhanced toughness and longer tread life.', 'https://images.unsplash.com/photo-1594736797933-d0f31954d3a2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00KLM789'),
('Method Race Wheels 105 Beadlock', 'Wheels', 'Method Race Wheels', 449.99, 4.8, 'True beadlock wheel for ultimate tire security in extreme off-road conditions.', 'https://images.unsplash.com/photo-1594736797933-d0f31954d3a2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00NOP012'),
('Nitto Ridge Grappler Hybrid', 'Tires', 'Nitto', 319.99, 4.5, 'Hybrid terrain tire combining all-terrain and mud-terrain capabilities.', 'https://images.unsplash.com/photo-1594736797933-d0f31954d3a2?w=400&h=300&fit=crop', 'https://amazon.com/dp/B00QRS345');

-- Add sample trail data
INSERT INTO trails (name, location, difficulty, distance, elevation_gain, terrain, description, image_url, gpx_url, latitude, longitude) VALUES
('Moab Slickrock Trail', 'Moab, Utah', 'Difficult', 10.5, 1200, 'Sandstone', 'World-famous slickrock trail offering challenging climbs and stunning red rock scenery.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://example.com/gpx/moab-slickrock.gpx', 38.5816, -109.5498),
('Rubicon Trail', 'Lake Tahoe, California', 'Expert', 22.0, 2800, 'Granite', 'The most famous 4x4 trail in America. Extreme technical challenges through granite boulders.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', 'https://example.com/gpx/rubicon.gpx', 39.0968, -120.2094),
('Black Bear Pass', 'Telluride, Colorado', 'Expert', 12.8, 3100, 'Alpine', 'Dangerous high-altitude trail with narrow shelves and spectacular mountain views.', 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop', 'https://example.com/gpx/black-bear.gpx', 37.8814, -107.7043),
('Hell''s Revenge', 'Moab, Utah', 'Difficult', 6.5, 800, 'Sandstone', 'Steep slickrock domes and challenging obstacles with amazing views of the Colorado River.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://example.com/gpx/hells-revenge.gpx', 38.5533, -109.4969),
('Imogene Pass', 'Ouray to Telluride, Colorado', 'Moderate', 17.5, 2200, 'Alpine', 'Historic mining road connecting two mountain towns with beautiful alpine scenery.', 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop', 'https://example.com/gpx/imogene-pass.gpx', 37.9092, -107.7664),
('Fins and Things', 'Moab, Utah', 'Moderate', 4.2, 400, 'Sandstone', 'Fun slickrock trail perfect for beginners with dramatic fin formations.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://example.com/gpx/fins-things.gpx', 38.6139, -109.5581);

-- Add sample blog posts
INSERT INTO blogs (title, slug, excerpt, content, author, cover_image, tags, published_at, external_url) VALUES
('Ultimate Guide to Off-Road Tires', 'ultimate-guide-off-road-tires', 'Everything you need to know about choosing the right tires for your off-road adventures.', 'When it comes to off-road performance, your tires are one of the most critical components of your vehicle...', 'OffRoadGo Team', 'https://images.unsplash.com/photo-1594736797933-d0f31954d3a2?w=800&h=600&fit=crop', ARRAY['tires', 'guide', 'off-road'], NOW(), NULL),
('Top 10 Must-Visit Off-Road Trails', 'top-10-must-visit-trails', 'Discover the most incredible off-road trails across America that every enthusiast should experience.', 'From the red rocks of Moab to the alpine passes of Colorado, these trails offer unforgettable adventures...', 'Trail Explorer', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', ARRAY['trails', 'adventure', 'travel'], NOW(), NULL),
('Building Your First Rock Crawler', 'building-first-rock-crawler', 'A comprehensive guide to building a capable rock crawler on any budget.', 'Building a rock crawler can seem overwhelming, but with the right approach and knowledge...', 'Build Master', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop', ARRAY['build', 'rock crawler', 'diy'], NOW(), NULL);