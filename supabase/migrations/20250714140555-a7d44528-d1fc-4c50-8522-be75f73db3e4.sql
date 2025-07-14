-- Add Arizona trails with proper escaping
INSERT INTO trails (name, location, difficulty, distance, elevation_gain, terrain, description, image_url, gpx_url, latitude, longitude) VALUES
('Camelback Mountain Echo Canyon', 'Phoenix, Arizona', 'Difficult', 2.5, 1280, 'Rock', 'Steep rocky trail with incredible city views. Popular but challenging climb with scrambling sections.', '/src/assets/trails/camelback-echo-canyon.jpg', null, 33.5185, -111.9718),
('Bell Rock Trail', 'Sedona, Arizona', 'Moderate', 3.6, 600, 'Red Rock', 'Iconic red rock formation with stunning vortex energy. Great for photography and spiritual experiences.', '/src/assets/trails/bell-rock-sedona.jpg', null, 34.8059, -111.7661),
('Antelope Canyon', 'Page, Arizona', 'Easy', 1.5, 50, 'Slot Canyon', 'World-famous slot canyon with incredible light beams. Requires guided tour and permits.', '/src/assets/trails/antelope-canyon.jpg', null, 36.8619, -111.3743),
('Havasu Falls', 'Supai, Arizona', 'Moderate', 16.0, 2000, 'Desert/Water', 'Remote waterfall paradise requiring 3-day backpacking permit. Turquoise pools and red rocks.', '/src/assets/trails/havasu-falls.jpg', null, 36.2553, -112.6981),
('Wave Trail', 'Paria Canyon, Arizona', 'Moderate', 6.4, 350, 'Sandstone', 'Unique sandstone formation requiring lottery permit. Otherworldly landscape photography destination.', '/src/assets/trails/the-wave.jpg', null, 36.9959, -112.0062),

-- California trails
('Half Dome Cable Route', 'Yosemite, California', 'Difficult', 16.4, 4800, 'Granite', 'Iconic granite dome with cable-assisted final ascent. Requires permits and excellent fitness.', '/src/assets/trails/half-dome-cables.jpg', null, 37.7459, -119.5332),
('Mount Whitney Trail', 'Lone Pine, California', 'Difficult', 22.0, 6100, 'Alpine', 'Highest peak in lower 48 states. High altitude challenge requiring permits and preparation.', '/src/assets/trails/mount-whitney.jpg', null, 36.5785, -118.2923),
('Mist Trail to Vernal Falls', 'Yosemite, California', 'Moderate', 5.4, 1000, 'Granite/Water', 'Popular waterfall hike with granite steps and mist showers. Spectacular views of valley.', '/src/assets/trails/vernal-falls.jpg', null, 37.7312, -119.5364),
('Joshua Tree Skull Rock', 'Joshua Tree, California', 'Easy', 1.6, 100, 'Desert Rock', 'Family-friendly desert hike to unique skull-shaped rock formation. Great for beginners.', '/src/assets/trails/skull-rock.jpg', null, 34.0192, -116.2806),
('Big Sur McWay Falls', 'Big Sur, California', 'Easy', 1.2, 200, 'Coastal', 'Spectacular coastal waterfall dropping directly onto beach. Iconic California coastline views.', '/src/assets/trails/mcway-falls.jpg', null, 36.1579, -121.6709),

-- Colorado trails (fixed apostrophes)
('Maroon Bells Four Pass Loop', 'Aspen, Colorado', 'Difficult', 26.4, 3000, 'Alpine', 'Ultimate Colorado backpacking loop through four high passes. Stunning fall colors and peaks.', '/src/assets/trails/maroon-bells-four-pass.jpg', null, 39.0708, -106.9390),
('Hanging Lake Trail', 'Glenwood Springs, Colorado', 'Moderate', 3.2, 1200, 'Forest/Water', 'Pristine turquoise lake hanging on cliff edge. Requires timed entry reservations year-round.', '/src/assets/trails/hanging-lake.jpg', null, 39.6019, -107.1834),
('Mount Elbert Trail', 'Leadville, Colorado', 'Difficult', 9.5, 4500, 'Alpine', 'Colorado highest peak and tallest mountain in Rockies. High altitude alpine adventure.', '/src/assets/trails/mount-elbert.jpg', null, 39.1178, -106.4453),
('Bear Creek Trail to Bear Lake', 'Telluride, Colorado', 'Moderate', 5.8, 1000, 'Mountain/Water', 'Beautiful alpine lake surrounded by towering peaks. Popular summer wildflower destination.', '/src/assets/trails/bear-creek-lake.jpg', null, 37.9375, -107.8123),
('Garden of the Gods Perkins Central', 'Colorado Springs, Colorado', 'Easy', 1.5, 100, 'Red Rock', 'Wheelchair accessible paved trail through stunning red sandstone formations.', '/src/assets/trails/garden-of-gods.jpg', null, 38.8719, -104.8667);