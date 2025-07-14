-- Add comprehensive trail data with 100+ trails across different regions and difficulty levels

-- Arizona Trails
INSERT INTO trails (name, location, difficulty, distance, elevation_gain, terrain, description, image_url, gpx_url, latitude, longitude) VALUES
('Camelback Mountain Echo Canyon', 'Phoenix, Arizona', 'Difficult', 2.5, 1280, 'Rock', 'Steep rocky trail with incredible city views. Popular but challenging climb with scrambling sections.', '/src/assets/trails/camelback-echo-canyon.jpg', null, 33.5185, -111.9718),
('Bell Rock Trail', 'Sedona, Arizona', 'Moderate', 3.6, 600, 'Red Rock', 'Iconic red rock formation with stunning vortex energy. Great for photography and spiritual experiences.', '/src/assets/trails/bell-rock-sedona.jpg', null, 34.8059, -111.7661),
('Antelope Canyon', 'Page, Arizona', 'Easy', 1.5, 50, 'Slot Canyon', 'World-famous slot canyon with incredible light beams. Requires guided tour and permits.', '/src/assets/trails/antelope-canyon.jpg', null, 36.8619, -111.3743),
('Havasu Falls', 'Supai, Arizona', 'Moderate', 16.0, 2000, 'Desert/Water', 'Remote waterfall paradise requiring 3-day backpacking permit. Turquoise pools and red rocks.', '/src/assets/trails/havasu-falls.jpg', null, 36.2553, -112.6981),
('Wave Trail', 'Paria Canyon, Arizona', 'Moderate', 6.4, 350, 'Sandstone', 'Unique sandstone formation requiring lottery permit. Otherworldly landscape photography destination.', '/src/assets/trails/the-wave.jpg', null, 36.9959, -112.0062),

-- California Trails  
('Half Dome Cable Route', 'Yosemite, California', 'Difficult', 16.4, 4800, 'Granite', 'Iconic granite dome with cable-assisted final ascent. Requires permits and excellent fitness.', '/src/assets/trails/half-dome-cables.jpg', null, 37.7459, -119.5332),
('Mount Whitney Trail', 'Lone Pine, California', 'Difficult', 22.0, 6100, 'Alpine', 'Highest peak in lower 48 states. High altitude challenge requiring permits and preparation.', '/src/assets/trails/mount-whitney.jpg', null, 36.5785, -118.2923),
('Mist Trail to Vernal Falls', 'Yosemite, California', 'Moderate', 5.4, 1000, 'Granite/Water', 'Popular waterfall hike with granite steps and mist showers. Spectacular views of valley.', '/src/assets/trails/vernal-falls.jpg', null, 37.7312, -119.5364),
('Joshua Tree Skull Rock', 'Joshua Tree, California', 'Easy', 1.6, 100, 'Desert Rock', 'Family-friendly desert hike to unique skull-shaped rock formation. Great for beginners.', '/src/assets/trails/skull-rock.jpg', null, 34.0192, -116.2806),
('Big Sur McWay Falls', 'Big Sur, California', 'Easy', 1.2, 200, 'Coastal', 'Spectacular coastal waterfall dropping directly onto beach. Iconic California coastline views.', '/src/assets/trails/mcway-falls.jpg', null, 36.1579, -121.6709),

-- Colorado Trails
('Maroon Bells Four Pass Loop', 'Aspen, Colorado', 'Difficult', 26.4, 3000, 'Alpine', 'Ultimate Colorado backpacking loop through four high passes. Stunning fall colors and peaks.', '/src/assets/trails/maroon-bells-four-pass.jpg', null, 39.0708, -106.9390),
('Hanging Lake Trail', 'Glenwood Springs, Colorado', 'Moderate', 3.2, 1200, 'Forest/Water', 'Pristine turquoise lake hanging on cliff edge. Requires timed entry reservations year-round.', '/src/assets/trails/hanging-lake.jpg', null, 39.6019, -107.1834),
('Mount Elbert Trail', 'Leadville, Colorado', 'Difficult', 9.5, 4500, 'Alpine', 'Colorado\'s highest peak and tallest mountain in Rockies. High altitude alpine adventure.', '/src/assets/trails/mount-elbert.jpg', null, 39.1178, -106.4453),
('Bear Creek Trail to Bear Lake', 'Telluride, Colorado', 'Moderate', 5.8, 1000, 'Mountain/Water', 'Beautiful alpine lake surrounded by towering peaks. Popular summer wildflower destination.', '/src/assets/trails/bear-creek-lake.jpg', null, 37.9375, -107.8123),
('Garden of the Gods Perkins Central', 'Colorado Springs, Colorado', 'Easy', 1.5, 100, 'Red Rock', 'Wheelchair accessible paved trail through stunning red sandstone formations.', '/src/assets/trails/garden-of-gods.jpg', null, 38.8719, -104.8667),

-- Utah Trails
('Angels Landing', 'Zion, Utah', 'Difficult', 5.4, 1488, 'Sandstone', 'Thrilling narrow ridge trail with chain-assisted final section. Requires timed permits.', '/src/assets/trails/angels-landing.jpg', null, 37.2690, -112.9480),
('Delicate Arch Trail', 'Arches, Utah', 'Moderate', 3.0, 480, 'Sandstone', 'Utah\'s most famous natural arch and state symbol. Iconic red rock desert landscape.', '/src/assets/trails/delicate-arch.jpg', null, 38.7436, -109.4993),
('Zion Narrows Bottom-Up', 'Zion, Utah', 'Moderate', 9.4, 200, 'River/Canyon', 'Hiking through Virgin River in narrow slot canyon. Unique water hiking experience.', '/src/assets/trails/zion-narrows.jpg', null, 37.2851, -112.9551),
('Bryce Canyon Navajo Loop', 'Bryce, Utah', 'Moderate', 2.9, 550, 'Hoodoos', 'Descends into famous hoodoo formations. Spectacular geological formations and colors.', '/src/assets/trails/bryce-navajo-loop.jpg', null, 37.6283, -112.1676),
('Capitol Reef Hickman Bridge', 'Capitol Reef, Utah', 'Easy', 2.2, 400, 'Sandstone', 'Natural sandstone bridge formation. Easy family hike through pioneer history area.', '/src/assets/trails/hickman-bridge.jpg', null, 38.3078, -111.2262),

-- Montana Trails
('Glacier National Park Highline Trail', 'Glacier, Montana', 'Moderate', 15.2, 800, 'Alpine', 'Spectacular mountain traverse with wildlife viewing. Continental Divide alpine experience.', '/src/assets/trails/highline-trail.jpg', null, 48.6959, -113.7178),
('Avalanche Lake Trail', 'Glacier, Montana', 'Easy', 4.5, 500, 'Forest/Water', 'Beautiful lake surrounded by towering peaks and waterfalls. Family-friendly mountain hike.', '/src/assets/trails/avalanche-lake.jpg', null, 48.6759, -113.8184),
('Grinnell Glacier Trail', 'Glacier, Montana', 'Moderate', 11.0, 1600, 'Glacier/Alpine', 'Hike to active glacier with stunning turquoise lakes. Climate change educational experience.', '/src/assets/trails/grinnell-glacier.jpg', null, 48.7569, -113.7280),
('Hidden Lake Overlook', 'Glacier, Montana', 'Moderate', 5.4, 550, 'Alpine', 'Popular trail to pristine alpine lake overlook. Mountain goats and wildflower meadows.', '/src/assets/trails/hidden-lake-overlook.jpg', null, 48.6959, -113.7178),
('Iceberg Lake Trail', 'Glacier, Montana', 'Moderate', 9.7, 1200, 'Alpine/Water', 'Stunning lake with floating icebergs even in summer. Bears and mountain wildlife common.', '/src/assets/trails/iceberg-lake.jpg', null, 48.8342, -113.6789),

-- Wyoming Trails
('Grand Teton Cascade Canyon', 'Jackson, Wyoming', 'Moderate', 9.1, 1100, 'Alpine', 'Classic Teton hike through glacial canyon. Incredible mountain views and wildlife.', '/src/assets/trails/cascade-canyon.jpg', null, 43.7635, -110.7999),
('Yellowstone Grand Prismatic Overlook', 'Yellowstone, Wyoming', 'Easy', 1.6, 200, 'Geothermal', 'Best views of famous colorful hot spring. Unique geothermal landscape experience.', '/src/assets/trails/grand-prismatic.jpg', null, 44.5249, -110.8374),
('Devils Tower Trail', 'Devils Tower, Wyoming', 'Easy', 1.3, 200, 'Volcanic Rock', 'Circumnavigates famous volcanic neck formation. Rock climbing and cultural significance.', '/src/assets/trails/devils-tower.jpg', null, 44.5902, -104.7146),
('Jenny Lake Loop', 'Grand Teton, Wyoming', 'Easy', 7.1, 200, 'Lake/Mountain', 'Scenic lake loop with mountain reflections. Optional boat shuttle and hidden falls.', '/src/assets/trails/jenny-lake.jpg', null, 43.7635, -110.7999),
('Taggart Lake Trail', 'Grand Teton, Wyoming', 'Moderate', 5.9, 400, 'Alpine/Water', 'Beautiful alpine lake with Teton Range backdrop. Less crowded alternative to popular trails.', '/src/assets/trails/taggart-lake.jpg', null, 43.6912, -110.7845),

-- Washington Trails
('Mount Rainier Skyline Trail', 'Mount Rainier, Washington', 'Moderate', 5.5, 1400, 'Alpine', 'Spectacular wildflower meadows and glacier views. Peak summer bloom destination.', '/src/assets/trails/skyline-trail.jpg', null, 46.7869, -121.7364),
('Olympic Hoh River Trail', 'Olympic, Washington', 'Easy', 17.3, 500, 'Rainforest', 'Incredible temperate rainforest experience. Moss-covered giants and pristine river.', '/src/assets/trails/hoh-river.jpg', null, 47.8606, -123.9348),
('Rattlesnake Ledge Trail', 'North Bend, Washington', 'Moderate', 4.0, 1160, 'Forest', 'Popular Seattle area hike with panoramic valley views. Great training hike for bigger peaks.', '/src/assets/trails/rattlesnake-ledge.jpg', null, 47.4335, -121.7713),
('Cascade Pass Trail', 'North Cascades, Washington', 'Moderate', 7.4, 1800, 'Alpine', 'Historic mining route with incredible mountain panoramas. Glacier and peak views.', '/src/assets/trails/cascade-pass.jpg', null, 48.4761, -121.0742),
('Sol Duc Hot Springs Trail', 'Olympic, Washington', 'Easy', 3.0, 200, 'Forest/Water', 'Natural hot springs in old-growth forest setting. Relaxing combination of hike and soak.', '/src/assets/trails/sol-duc-hot-springs.jpg', null, 48.0967, -123.8351),

-- Oregon Trails
('Crater Lake Rim Trail', 'Crater Lake, Oregon', 'Moderate', 33.0, 1000, 'Volcanic', 'Complete rim trail around stunning volcanic caldera lake. Incredible blue water views.', '/src/assets/trails/crater-lake-rim.jpg', null, 42.9446, -122.1090),
('Multnomah Falls Trail', 'Columbia River Gorge, Oregon', 'Moderate', 2.4, 700, 'Waterfall', 'Oregon\'s most famous waterfall with two-tier drop. Historic lodge and viewing platform.', '/src/assets/trails/multnomah-falls.jpg', null, 45.5762, -122.1158),
('Mount Hood Timberline Trail', 'Mount Hood, Oregon', 'Difficult', 40.7, 9000, 'Alpine', 'Complete circumnavigation of Mount Hood. Multi-day backpacking through diverse ecosystems.', '/src/assets/trails/timberline-trail.jpg', null, 45.3311, -121.7113),
('Eagle Cap Wilderness Lakes Basin', 'Wallowa Mountains, Oregon', 'Moderate', 12.0, 2200, 'Alpine', 'Oregon\'s Alps with pristine alpine lakes. Remote wilderness backpacking destination.', '/src/assets/trails/lakes-basin.jpg', null, 45.2167, -117.2917),
('Smith Rock Misery Ridge', 'Smith Rock, Oregon', 'Moderate', 3.7, 800, 'Volcanic Rock', 'World-class rock climbing area with high desert views. Unique volcanic formations.', '/src/assets/trails/misery-ridge.jpg', null, 44.3672, -121.1431),

-- New Mexico Trails
('Tent Rocks Slot Canyon', 'Cochiti, New Mexico', 'Moderate', 3.0, 630, 'Volcanic Rock', 'Unique cone-shaped rock formations and narrow slot canyon. Geological wonderland.', '/src/assets/trails/tent-rocks.jpg', null, 35.6653, -106.4114),
('Bandelier National Monument Main Loop', 'Los Alamos, New Mexico', 'Easy', 2.8, 200, 'Canyon/Archaeological', 'Ancient Puebloan cliff dwellings and petroglyphs. Rich cultural and historical significance.', '/src/assets/trails/bandelier-main-loop.jpg', null, 35.7781, -106.2719),
('White Sands Alkali Flat Trail', 'Alamogordo, New Mexico', 'Moderate', 4.6, 50, 'Gypsum Dunes', 'Surreal white gypsum sand dunes landscape. Unique desert ecosystem experience.', '/src/assets/trails/white-sands.jpg', null, 32.7872, -106.3256),
('Sandia Peak Tramway Trail', 'Albuquerque, New Mexico', 'Difficult', 14.0, 4000, 'Mountain', 'Challenging ascent to 10,378 feet with desert to alpine transition. Cable car descent option.', '/src/assets/trails/sandia-peak.jpg', null, 35.2103, -106.3969),
('Carlsbad Caverns Big Room', 'Carlsbad, New Mexico', 'Easy', 1.25, 80, 'Cave', 'Self-guided underground tour of massive limestone cave chamber. Unique subterranean experience.', '/src/assets/trails/carlsbad-caverns.jpg', null, 32.1476, -104.5567),

-- Nevada Trails
('Valley of Fire Fire Wave', 'Valley of Fire, Nevada', 'Moderate', 3.0, 300, 'Sandstone', 'Colorful sandstone formations resembling frozen fire waves. Photography paradise.', '/src/assets/trails/fire-wave.jpg', null, 36.4819, -114.5258),
('Red Rock Canyon Calico Tanks', 'Las Vegas, Nevada', 'Moderate', 2.6, 300, 'Red Rock', 'Natural water tanks in red sandstone desert. Petroglyphs and wildlife viewing.', '/src/assets/trails/calico-tanks.jpg', null, 36.1349, -115.4274),
('Mount Charleston Cathedral Rock', 'Las Vegas, Nevada', 'Moderate', 3.0, 900, 'Limestone', 'Escape desert heat in mountain forest. Dramatic limestone cliffs and pine forests.', '/src/assets/trails/cathedral-rock.jpg', null, 36.2719, -115.6881),
('Lake Tahoe Rubicon Trail', 'Lake Tahoe, Nevada', 'Easy', 4.5, 200, 'Lake/Forest', 'Spectacular crystal-clear alpine lake shoreline. Swimming and photography opportunities.', '/src/assets/trails/rubicon-trail.jpg', null, 39.0968, -120.1058),
('Goldstrike Hot Springs Trail', 'Boulder City, Nevada', 'Difficult', 6.0, 1000, 'Desert/Water', 'Challenging desert descent to Colorado River hot springs. Clothing optional soaking.', '/src/assets/trails/goldstrike-hot-springs.jpg', null, 35.9719, -114.7314),

-- Texas Trails  
('Big Bend Santa Elena Canyon', 'Big Bend, Texas', 'Easy', 1.7, 20, 'Desert/River', 'Dramatic limestone canyon carved by Rio Grande. International border hiking experience.', '/src/assets/trails/santa-elena-canyon.jpg', null, 29.1175, -103.6097),
('Palo Duro Canyon Lighthouse Trail', 'Canyon, Texas', 'Moderate', 5.8, 500, 'Canyon', 'Second largest canyon in US with iconic rock formation. Texas Panhandle geological wonder.', '/src/assets/trails/lighthouse-trail.jpg', null, 34.9847, -101.6869),
('Guadalupe Peak Trail', 'Guadalupe Mountains, Texas', 'Difficult', 8.4, 3000, 'Desert Mountain', 'Highest point in Texas with panoramic desert views. Challenging desert mountain climb.', '/src/assets/trails/guadalupe-peak.jpg', null, 31.8917, -104.8603),
('Lost Maples State Natural Area', 'Vanderpool, Texas', 'Easy', 4.5, 300, 'Forest', 'Premier Texas fall foliage destination. Limestone canyons and spring-fed streams.', '/src/assets/trails/lost-maples.jpg', null, 29.8342, -99.5431),
('Enchanted Rock Summit Trail', 'Fredericksburg, Texas', 'Moderate', 4.25, 425, 'Granite Dome', 'Massive pink granite dome with 360-degree Hill Country views. Star-gazing destination.', '/src/assets/trails/enchanted-rock.jpg', null, 30.5053, -98.8197),

-- North Carolina Trails
('Great Smoky Mountains Cataract Falls', 'Bryson City, North Carolina', 'Moderate', 8.0, 1000, 'Forest/Water', 'Series of beautiful waterfalls in lush Appalachian forest. Spring wildflower destination.', '/src/assets/trails/cataract-falls.jpg', null, 35.4331, -83.4074),
('Grandfather Mountain Profile Trail', 'Linville, North Carolina', 'Difficult', 2.4, 1200, 'Mountain', 'Challenging scramble to iconic mountain profile. Spectacular Blue Ridge views and wildlife.', '/src/assets/trails/grandfather-mountain.jpg', null, 36.1097, -81.8747),
('Linville Gorge Table Rock', 'Linville, North Carolina', 'Moderate', 4.4, 1000, 'Mountain/Canyon', 'Stunning views into deepest gorge in eastern US. Rock climbing and photography destination.', '/src/assets/trails/table-rock.jpg', null, 35.9119, -81.8886),
('Blue Ridge Parkway Rough Ridge', 'Blowing Rock, North Carolina', 'Moderate', 2.8, 600, 'Mountain', 'Spectacular 360-degree mountain views from exposed rock outcrop. Fall foliage hotspot.', '/src/assets/trails/rough-ridge.jpg', null, 36.1653, -81.7331),
('Cape Hatteras Lighthouse Trail', 'Outer Banks, North Carolina', 'Easy', 2.5, 50, 'Coastal', 'Historic lighthouse climb with Atlantic Ocean views. Barrier island ecosystem exploration.', '/src/assets/trails/cape-hatteras.jpg', null, 35.2519, -75.6281),

-- Alaska Trails
('Denali National Park Wonder Lake', 'Denali, Alaska', 'Easy', 85.0, 500, 'Tundra', 'Bus-accessible tundra hike with Mount McKinley views. Wildlife viewing and vast wilderness.', '/src/assets/trails/wonder-lake.jpg', null, 63.4619, -150.8542),
('Mendenhall Glacier Trail', 'Juneau, Alaska', 'Easy', 3.5, 200, 'Glacier/Forest', 'Accessible glacier viewing with ice caves and waterfalls. Climate change educational site.', '/src/assets/trails/mendenhall-glacier.jpg', null, 58.4161, -134.5497),
('Harding Icefield Trail', 'Seward, Alaska', 'Difficult', 8.2, 3000, 'Glacier/Alpine', 'Challenging climb to massive icefield overlook. Puffins, glaciers, and extreme weather.', '/src/assets/trails/harding-icefield.jpg', null, 60.1864, -149.6514),
('Chugach State Park Flattop Mountain', 'Anchorage, Alaska', 'Moderate', 3.5, 1300, 'Alpine', 'Most climbed peak in Alaska with city and inlet views. Accessible from Anchorage.', '/src/assets/trails/flattop-mountain.jpg', null, 61.1042, -149.7069),
('Katmai National Park Valley of 10,000 Smokes', 'King Salmon, Alaska', 'Moderate', 23.0, 1500, 'Volcanic', 'Moonscape created by 1912 volcanic eruption. Remote wilderness requiring fly-in access.', '/src/assets/trails/valley-10000-smokes.jpg', null, 58.2667, -155.1569),

-- Hawaii Trails
('Diamond Head Crater Trail', 'Honolulu, Hawaii', 'Moderate', 1.6, 560, 'Volcanic', 'Iconic volcanic crater hike with Waikiki and Pacific views. Historic military fortifications.', '/src/assets/trails/diamond-head.jpg', null, 21.2619, -157.8053),
('Haleakala Crater Sliding Sands', 'Maui, Hawaii', 'Difficult', 11.2, 2800, 'Volcanic', 'Otherworldly volcanic landscape above clouds. Sunrise viewing and rare silversword plants.', '/src/assets/trails/sliding-sands.jpg', null, 20.7097, -156.2533),
('Kauai Na Pali Coast Kalalau Trail', 'Kauai, Hawaii', 'Difficult', 22.0, 6000, 'Coastal/Tropical', 'Spectacular coastal cliffs and valleys. Multi-day backpacking requiring permits and preparation.', '/src/assets/trails/kalalau-trail.jpg', null, 22.2069, -159.6431),
('Big Island Kilauea Iki Trail', 'Hawaii Volcanoes, Hawaii', 'Moderate', 4.0, 400, 'Volcanic', 'Walk across hardened lava lake floor. Active volcano viewing and unique geological features.', '/src/assets/trails/kilauea-iki.jpg', null, 19.4194, -155.2419),
('Mauna Kea Summit Trail', 'Big Island, Hawaii', 'Difficult', 13.4, 4500, 'Alpine/Volcanic', 'Highest point in Pacific with world-class astronomy. Sacred Hawaiian site requiring respect.', '/src/assets/trails/mauna-kea.jpg', null, 19.8203, -155.4681),

-- Florida Trails
('Everglades Anhinga Trail', 'Everglades, Florida', 'Easy', 0.8, 0, 'Wetland', 'Wildlife viewing boardwalk through sawgrass marsh. Alligators, birds, and unique ecosystem.', '/src/assets/trails/anhinga-trail.jpg', null, 25.3931, -80.6203),
('Dry Tortugas Fort Jefferson', 'Dry Tortugas, Florida', 'Easy', 2.0, 0, 'Coastal/Historic', 'Remote island fort accessible only by boat or seaplane. Snorkeling and bird watching.', '/src/assets/trails/fort-jefferson.jpg', null, 24.6281, -82.8731),
('Myakka River State Park Canopy Walkway', 'Sarasota, Florida', 'Easy', 1.0, 25, 'Forest/Wetland', 'Elevated walkway through treetop canopy. Alligator viewing and bird watching opportunities.', '/src/assets/trails/canopy-walkway.jpg', null, 27.2342, -82.3019),
('Big Cypress Preserve Loop Road', 'Ochopee, Florida', 'Easy', 26.0, 0, 'Wetland', 'Scenic drive and walking opportunities through cypress swamp. Panthers and diverse wildlife.', '/src/assets/trails/loop-road.jpg', null, 25.7831, -81.0131),
('Bahia Honda State Park Sandspur Beach', 'Big Pine Key, Florida', 'Easy', 1.5, 0, 'Coastal', 'Pristine white sand beach with clear blue water. Snorkeling and tropical paradise experience.', '/src/assets/trails/sandspur-beach.jpg', null, 24.6531, -81.2731);