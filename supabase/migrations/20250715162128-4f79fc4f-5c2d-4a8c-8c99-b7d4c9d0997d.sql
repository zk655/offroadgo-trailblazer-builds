-- Fix image repetition for Safety/Emergency, Interior, and Audio/Electronics categories

-- Safety/Emergency category - use winch and recovery equipment images
UPDATE mods 
SET image_url = '/src/assets/products/winch-12000lb.jpg'
WHERE category = 'Safety/Emergency' AND (title LIKE '%Beacon%' OR title LIKE '%Kit%');

UPDATE mods 
SET image_url = '/src/assets/products/recovery-tracks.jpg'
WHERE category = 'Safety/Emergency' AND (title LIKE '%Extinguisher%' OR title LIKE '%Filter%');

-- Interior category - use appropriate interior-related images
UPDATE mods 
SET image_url = '/src/assets/products/rock-sliders.jpg'
WHERE category = 'Interior' AND (title LIKE '%Seat%' OR title LIKE '%Console%');

UPDATE mods 
SET image_url = '/src/assets/products/air-compressor.jpg'
WHERE category = 'Interior' AND (title LIKE '%Floor%' OR title LIKE '%Window%');

-- Audio/Electronics category - use electronics-related images
UPDATE mods 
SET image_url = '/src/assets/products/led-lightbar-50.jpg'
WHERE category = 'Audio/Electronics' AND (title LIKE '%GPS%' OR title LIKE '%Dash Cam%');

UPDATE mods 
SET image_url = '/src/assets/products/suspension-lift-kit.jpg'
WHERE category = 'Audio/Electronics' AND (title LIKE '%Radio%' OR title LIKE '%Walkie%');