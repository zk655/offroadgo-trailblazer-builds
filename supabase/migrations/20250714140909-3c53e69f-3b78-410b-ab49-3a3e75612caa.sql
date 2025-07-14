-- Add Utah, Montana, Wyoming trails
INSERT INTO trails (name, location, difficulty, distance, elevation_gain, terrain, description, image_url, gpx_url, latitude, longitude) VALUES
-- Utah trails
('Angels Landing', 'Zion, Utah', 'Difficult', 5.4, 1488, 'Sandstone', 'Thrilling narrow ridge trail with chain-assisted final section. Requires timed permits.', '/src/assets/trails/angels-landing.jpg', null, 37.2690, -112.9480),
('Delicate Arch Trail', 'Arches, Utah', 'Moderate', 3.0, 480, 'Sandstone', 'Utah most famous natural arch and state symbol. Iconic red rock desert landscape.', '/src/assets/trails/delicate-arch.jpg', null, 38.7436, -109.4993),
('Zion Narrows Bottom-Up', 'Zion, Utah', 'Moderate', 9.4, 200, 'River/Canyon', 'Hiking through Virgin River in narrow slot canyon. Unique water hiking experience.', '/src/assets/trails/zion-narrows.jpg', null, 37.2851, -112.9551),
('Bryce Canyon Navajo Loop', 'Bryce, Utah', 'Moderate', 2.9, 550, 'Hoodoos', 'Descends into famous hoodoo formations. Spectacular geological formations and colors.', '/src/assets/trails/bryce-navajo-loop.jpg', null, 37.6283, -112.1676),
('Capitol Reef Hickman Bridge', 'Capitol Reef, Utah', 'Easy', 2.2, 400, 'Sandstone', 'Natural sandstone bridge formation. Easy family hike through pioneer history area.', '/src/assets/trails/hickman-bridge.jpg', null, 38.3078, -111.2262),

-- Montana trails
('Glacier National Park Highline Trail', 'Glacier, Montana', 'Moderate', 15.2, 800, 'Alpine', 'Spectacular mountain traverse with wildlife viewing. Continental Divide alpine experience.', '/src/assets/trails/highline-trail.jpg', null, 48.6959, -113.7178),
('Avalanche Lake Trail', 'Glacier, Montana', 'Easy', 4.5, 500, 'Forest/Water', 'Beautiful lake surrounded by towering peaks and waterfalls. Family-friendly mountain hike.', '/src/assets/trails/avalanche-lake.jpg', null, 48.6759, -113.8184),
('Grinnell Glacier Trail', 'Glacier, Montana', 'Moderate', 11.0, 1600, 'Glacier/Alpine', 'Hike to active glacier with stunning turquoise lakes. Climate change educational experience.', '/src/assets/trails/grinnell-glacier.jpg', null, 48.7569, -113.7280),
('Hidden Lake Overlook', 'Glacier, Montana', 'Moderate', 5.4, 550, 'Alpine', 'Popular trail to pristine alpine lake overlook. Mountain goats and wildflower meadows.', '/src/assets/trails/hidden-lake-overlook.jpg', null, 48.6959, -113.7178),
('Iceberg Lake Trail', 'Glacier, Montana', 'Moderate', 9.7, 1200, 'Alpine/Water', 'Stunning lake with floating icebergs even in summer. Bears and mountain wildlife common.', '/src/assets/trails/iceberg-lake.jpg', null, 48.8342, -113.6789),

-- Wyoming trails
('Grand Teton Cascade Canyon', 'Jackson, Wyoming', 'Moderate', 9.1, 1100, 'Alpine', 'Classic Teton hike through glacial canyon. Incredible mountain views and wildlife.', '/src/assets/trails/cascade-canyon.jpg', null, 43.7635, -110.7999),
('Yellowstone Grand Prismatic Overlook', 'Yellowstone, Wyoming', 'Easy', 1.6, 200, 'Geothermal', 'Best views of famous colorful hot spring. Unique geothermal landscape experience.', '/src/assets/trails/grand-prismatic.jpg', null, 44.5249, -110.8374),
('Devils Tower Trail', 'Devils Tower, Wyoming', 'Easy', 1.3, 200, 'Volcanic Rock', 'Circumnavigates famous volcanic neck formation. Rock climbing and cultural significance.', '/src/assets/trails/devils-tower.jpg', null, 44.5902, -104.7146),
('Jenny Lake Loop', 'Grand Teton, Wyoming', 'Easy', 7.1, 200, 'Lake/Mountain', 'Scenic lake loop with mountain reflections. Optional boat shuttle and hidden falls.', '/src/assets/trails/jenny-lake.jpg', null, 43.7635, -110.7999),
('Taggart Lake Trail', 'Grand Teton, Wyoming', 'Moderate', 5.9, 400, 'Alpine/Water', 'Beautiful alpine lake with Teton Range backdrop. Less crowded alternative to popular trails.', '/src/assets/trails/taggart-lake.jpg', null, 43.6912, -110.7845);