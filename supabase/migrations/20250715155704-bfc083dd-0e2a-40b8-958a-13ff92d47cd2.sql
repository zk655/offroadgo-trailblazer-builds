-- Update product images with actual product images from assets folder
UPDATE mods 
SET image_url = '/src/assets/products/led-lightbar-50.jpg'
WHERE category = 'Lighting' AND title LIKE '%LED%';

UPDATE mods 
SET image_url = '/src/assets/products/bull-bar-bumper.jpg'
WHERE category = 'Protection' AND title LIKE '%Bull Bar%';

UPDATE mods 
SET image_url = '/src/assets/products/rock-sliders.jpg'
WHERE category = 'Protection' AND title LIKE '%Rock Sliders%';

UPDATE mods 
SET image_url = '/src/assets/products/suspension-lift-kit.jpg'
WHERE category = 'Suspension';

UPDATE mods 
SET image_url = '/src/assets/products/mud-terrain-tires.jpg'
WHERE category = 'Tires';

UPDATE mods 
SET image_url = '/src/assets/products/winch-12000lb.jpg'
WHERE title LIKE '%Winch%' OR title LIKE '%Recovery%';

UPDATE mods 
SET image_url = '/src/assets/products/air-compressor.jpg'
WHERE title LIKE '%Air%' OR title LIKE '%Compressor%';

UPDATE mods 
SET image_url = '/src/assets/products/roof-rack-system.jpg'
WHERE title LIKE '%Roof%' OR title LIKE '%Rack%';

UPDATE mods 
SET image_url = '/src/assets/products/recovery-tracks.jpg'
WHERE title LIKE '%Recovery%' OR title LIKE '%Track%';

-- Update any remaining protection items
UPDATE mods 
SET image_url = '/src/assets/products/bull-bar-bumper.jpg'
WHERE category = 'Protection' AND image_url LIKE '%unsplash%';

-- Update any remaining lighting items
UPDATE mods 
SET image_url = '/src/assets/products/led-lightbar-50.jpg'
WHERE category = 'Lighting' AND image_url LIKE '%unsplash%';

-- Update performance items with a generic performance image
UPDATE mods 
SET image_url = '/src/assets/products/air-compressor.jpg'
WHERE category = 'Performance' AND image_url LIKE '%unsplash%';

-- Update wheels category
UPDATE mods 
SET image_url = '/src/assets/products/mud-terrain-tires.jpg'
WHERE category = 'Wheels' AND image_url LIKE '%unsplash%';