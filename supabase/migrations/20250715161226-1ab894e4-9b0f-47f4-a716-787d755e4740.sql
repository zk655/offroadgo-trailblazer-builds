-- Fix image mapping for specific categories
UPDATE mods 
SET image_url = '/src/assets/products/air-compressor.jpg'
WHERE category = 'Audio/Electronics' AND title LIKE '%Compressor%';

UPDATE mods 
SET image_url = '/src/assets/products/recovery-tracks.jpg'
WHERE category = 'Audio/Electronics' AND (title LIKE '%GPS%' OR title LIKE '%Radio%' OR title LIKE '%Walkie%' OR title LIKE '%Dash Cam%');

UPDATE mods 
SET image_url = '/src/assets/products/roof-rack-system.jpg'
WHERE category = 'Camping/Outdoor' AND (title LIKE '%Tent%' OR title LIKE '%Awning%' OR title LIKE '%Rack%');

UPDATE mods 
SET image_url = '/src/assets/products/air-compressor.jpg'
WHERE category = 'Camping/Outdoor' AND (title LIKE '%Fridge%' OR title LIKE '%Power%' OR title LIKE '%Generator%');

UPDATE mods 
SET image_url = '/src/assets/products/recovery-tracks.jpg'
WHERE category = 'Interior' AND (title LIKE '%Seat%' OR title LIKE '%Floor%' OR title LIKE '%Console%' OR title LIKE '%Window%');

UPDATE mods 
SET image_url = '/src/assets/products/bull-bar-bumper.jpg'
WHERE category = 'Exterior/Styling' AND (title LIKE '%Fender%' OR title LIKE '%Mud Flaps%' OR title LIKE '%Running%');

UPDATE mods 
SET image_url = '/src/assets/products/led-lightbar-50.jpg'
WHERE category = 'Exterior/Styling' AND title LIKE '%LED%';