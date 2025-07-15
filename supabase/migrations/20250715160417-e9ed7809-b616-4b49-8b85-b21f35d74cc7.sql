-- Add more comprehensive product categories and items
INSERT INTO mods (title, category, price, brand, rating, image_url, amazon_link, description) VALUES

-- Audio/Electronics Category
('Uniden PRO401HH CB Radio', 'Audio/Electronics', 89.99, 'Uniden', 4.4, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B001WMDF8K', 'Compact handheld CB radio with 4 watts of power. Perfect for trail communication and emergency situations.'),
('Garmin Montana 700i GPS', 'Audio/Electronics', 699.99, 'Garmin', 4.6, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B08RJQZB6J', 'Rugged GPS handheld with inReach satellite communication. Ideal for remote off-road adventures.'),
('Rexing V1 Dash Cam', 'Audio/Electronics', 99.99, 'Rexing', 4.3, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B01EX8ATKK', 'Full HD 1080p dash camera with 170° wide angle lens. Records your off-road adventures in crystal clear quality.'),
('Midland GXT1000VP4 Walkie Talkies', 'Audio/Electronics', 79.99, 'Midland', 4.2, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B001WMCD6Y', 'Long-range two-way radios with 36-mile range. Essential for group off-road trips and trail spotting.'),

-- Storage/Organization Category
('Thule Force XT Roof Box', 'Storage/Organization', 549.99, 'Thule', 4.7, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B01MYMK2CQ', 'Aerodynamic roof cargo box with 16 cubic feet capacity. Weather-resistant and easy to install.'),
('Decked Truck Bed Organizer', 'Storage/Organization', 1299.99, 'Decked', 4.8, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B01N4QJ9XL', 'Heavy-duty truck bed storage system with weatherproof drawers. Maximizes bed space organization.'),
('Pelican 1510 Case', 'Storage/Organization', 219.99, 'Pelican', 4.9, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B000P3WPHI', 'Waterproof, crushproof, and dustproof case. Perfect for protecting valuable gear on rough trails.'),
('Front Runner Wolf Pack Box', 'Storage/Organization', 189.99, 'Front Runner', 4.5, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B075QTXM8J', 'Modular storage box system for roof racks. Stackable and weatherproof design.'),

-- Exterior/Styling Category
('Bushwacker Fender Flares', 'Exterior/Styling', 329.99, 'Bushwacker', 4.6, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B000BQXPVU', 'Durable fender flares that accommodate larger tires. Adds aggressive styling and tire protection.'),
('Westin Pro Traxx Running Boards', 'Exterior/Styling', 449.99, 'Westin', 4.4, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B01LWTS7XG', 'Heavy-duty running boards with aggressive tread pattern. Provides secure footing and side protection.'),
('Putco Luminix LED Grille', 'Exterior/Styling', 199.99, 'Putco', 4.3, '/src/assets/products/led-lightbar-50.jpg', 'https://amazon.com/dp/B07TXQJ5M6', 'LED-lit grille insert for distinctive nighttime appearance. Easy installation with OEM fitment.'),
('Rough Country Mud Flaps', 'Exterior/Styling', 79.99, 'Rough Country', 4.2, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B01N7QVRXZ', 'Heavy-duty rubber mud flaps with stainless steel hardware. Protects paint from road debris.'),

-- Recovery/Towing Category
('Warn Epic Recovery Strap', 'Recovery/Towing', 149.99, 'Warn', 4.8, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B00KXF9J7M', '30-foot recovery strap with 30,000 lb capacity. Essential for getting unstuck on challenging terrain.'),
('Factor 55 FlatLink Shackle', 'Recovery/Towing', 89.99, 'Factor 55', 4.9, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B01MXDQ7VG', 'Ultra-strong recovery shackle with 38,000 lb capacity. Innovative flat design prevents binding.'),
('Curt Class 3 Trailer Hitch', 'Recovery/Towing', 189.99, 'Curt', 4.5, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B00KWIXM4C', 'Heavy-duty trailer hitch with 5,000 lb towing capacity. Easy bolt-on installation.'),
('ARB Snatch Block', 'Recovery/Towing', 199.99, 'ARB', 4.7, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B01LWTS7XG', 'High-quality snatch block for winch operations. Doubles pulling power and changes direction.'),

-- Camping/Outdoor Category
('Tepui Roof Top Tent', 'Camping/Outdoor', 1899.99, 'Tepui', 4.6, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B01N4QJ9XL', 'Spacious 3-person roof tent with built-in mattress. Sets up in minutes for comfortable camping anywhere.'),
('ARB Touring Awning', 'Camping/Outdoor', 449.99, 'ARB', 4.5, '/src/assets/products/roof-rack-system.jpg', 'https://amazon.com/dp/B075QTXM8J', 'Retractable awning provides 98 sq ft of shade. Perfect for base camp or lunch stops.'),
('Dometic CFX3 Portable Fridge', 'Camping/Outdoor', 899.99, 'Dometic', 4.8, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B07TXQJ5M6', '45L portable fridge/freezer with WiFi control. Keeps food fresh during extended off-road trips.'),
('Goal Zero Yeti 400 Power Station', 'Camping/Outdoor', 449.99, 'Goal Zero', 4.4, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B01N7QVRXZ', 'Portable power station with 400Wh capacity. Powers lights, phones, and small appliances off-grid.'),

-- Interior Category
('Weathertech Floor Mats', 'Interior', 179.99, 'WeatherTech', 4.7, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B000BQXPVU', 'Custom-fit all-weather floor mats. Protects interior from mud, water, and trail debris.'),
('Coverking Seat Covers', 'Interior', 299.99, 'Coverking', 4.4, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B01LWTS7XG', 'Durable neoprene seat covers with custom fit. Protects seats from dirt and wear.'),
('Rugged Ridge Center Console', 'Interior', 149.99, 'Rugged Ridge', 4.3, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B07TXQJ5M6', 'Heavy-duty center console with locking storage. Keeps valuables secure on the trail.'),
('Bestop Window Nets', 'Interior', 89.99, 'Bestop', 4.5, '/src/assets/products/bull-bar-bumper.jpg', 'https://amazon.com/dp/B01N7QVRXZ', 'Mesh window nets for doorless driving. Keeps debris out while maintaining airflow.'),

-- Maintenance/Fluids Category
('Mobil 1 Synthetic Oil', 'Maintenance/Fluids', 34.99, 'Mobil 1', 4.6, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B000KWIXM4C', 'High-performance synthetic motor oil. Provides superior protection under extreme conditions.'),
('K&N Air Filter Cleaning Kit', 'Maintenance/Fluids', 19.99, 'K&N', 4.5, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B01LWTS7XG', 'Complete cleaning kit for washable air filters. Restores filter performance and extends life.'),
('Chemical Guys Wash Kit', 'Maintenance/Fluids', 79.99, 'Chemical Guys', 4.4, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B075QTXM8J', 'Professional car wash kit with premium soaps and microfiber towels. Keeps your rig looking fresh.'),
('Lucas Oil Stabilizer', 'Maintenance/Fluids', 12.99, 'Lucas Oil', 4.3, '/src/assets/products/air-compressor.jpg', 'https://amazon.com/dp/B07TXQJ5M6', 'Engine oil stabilizer reduces friction and wear. Extends engine life in harsh conditions.'),

-- Safety/Emergency Category
('First Aid Only Kit', 'Safety/Emergency', 49.99, 'First Aid Only', 4.5, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B01N7QVRXZ', 'Comprehensive 299-piece first aid kit. Essential for remote trail adventures and emergencies.'),
('Fire Gone Extinguisher', 'Safety/Emergency', 29.99, 'Fire Gone', 4.4, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B000KWIXM4C', 'Compact fire extinguisher safe for electrical fires. Mandatory for many racing events.'),
('ACR ResQLink Beacon', 'Safety/Emergency', 299.99, 'ACR Electronics', 4.8, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B01LWTS7XG', 'Personal locator beacon for emergency rescue. GPS and 406 MHz technology for worldwide coverage.'),
('LifeStraw Water Filter', 'Safety/Emergency', 19.99, 'LifeStraw', 4.6, '/src/assets/products/recovery-tracks.jpg', 'https://amazon.com/dp/B075QTXM8J', 'Personal water filter removes 99.9% of bacteria and parasites. Essential for backcountry hydration.');