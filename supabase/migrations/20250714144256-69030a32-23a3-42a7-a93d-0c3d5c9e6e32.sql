-- Add more 4x4 vehicle models to the database
INSERT INTO vehicles (brand, name, type, year, price, starting_price, engine, drivetrain, transmission, mpg, towing_capacity, ground_clearance, clearance, tire_size, fuel_type, seating_capacity, horsepower, torque, zero_to_sixty, top_speed, approach_angle_degrees, departure_angle_degrees, fuel_tank_capacity, cargo_capacity, safety_rating, warranty) VALUES
-- Ford Models
('Ford', 'F-150 Raptor R', 'Super Truck', 2024, 109145, 109145, '5.2L Supercharged V8', '4WD', '10-Speed Automatic', 12, 8200, 13.1, 13.1, '37x12.50R17LT', 'Gasoline', 5, 700, 640, 3.6, 118, 31, 23, 36, 52.8, 5.0, '3 Years/36,000 Miles'),
('Ford', 'Bronco Sport Badlands', 'Compact SUV', 2024, 38000, 38000, '2.0L Turbo EcoBoost', '4WD', '8-Speed Automatic', 21, 2200, 8.8, 8.8, '225/65R17', 'Gasoline', 5, 250, 277, 8.5, 100, 30.2, 33.1, 16.9, 65.2, 4.0, '3 Years/36,000 Miles'),
('Ford', 'Bronco Raptor', 'Off-Road SUV', 2024, 80000, 80000, '3.0L Twin-Turbo V6', '4WD', '10-Speed Automatic', 15, 4500, 13.1, 13.1, '37x12.50R17LT', 'Gasoline', 5, 418, 440, 5.7, 100, 43.2, 26.8, 23, 83, 5.0, '3 Years/36,000 Miles'),

-- Jeep Models  
('Jeep', 'Gladiator Rubicon', 'Pickup Truck', 2024, 56000, 56000, '3.6L Pentastar V6', '4WD', '8-Speed Automatic', 22, 7650, 11.1, 11.1, '33x12.50R17LT', 'Gasoline', 5, 285, 260, 7.1, 99, 43.6, 26, 21.5, 35.5, 4.0, '3 Years/36,000 Miles'),
('Jeep', 'Grand Cherokee Trailhawk', 'Mid-Size SUV', 2024, 45000, 45000, '3.6L Pentastar V6', '4WD', '8-Speed Automatic', 23, 6200, 10.9, 10.9, '265/60R18', 'Gasoline', 5, 293, 260, 6.6, 114, 29.9, 22.9, 24.6, 68.3, 4.0, '3 Years/36,000 Miles'),
('Jeep', 'Cherokee Trailhawk', 'Compact SUV', 2024, 38000, 38000, '3.2L Pentastar V6', '4WD', '9-Speed Automatic', 24, 4500, 8.7, 8.7, '245/65R17', 'Gasoline', 5, 271, 239, 8.1, 112, 29.9, 32.2, 15.8, 54.9, 4.0, '3 Years/36,000 Miles'),

-- Toyota Models
('Toyota', 'Tacoma TRD Pro', 'Mid-Size Pickup', 2024, 50000, 50000, '3.5L V6', '4WD', '6-Speed Manual', 20, 6800, 9.4, 9.4, '265/70R16', 'Gasoline', 5, 278, 265, 7.4, 112, 35, 26, 21.1, 42.3, 5.0, '3 Years/36,000 Miles'),
('Toyota', 'Sequoia TRD Pro', 'Full-Size SUV', 2024, 75000, 75000, '3.4L Twin-Turbo V6 Hybrid', '4WD', '10-Speed Automatic', 19, 9000, 10.0, 10.0, '275/65R18', 'Gasoline', 8, 437, 583, 6.6, 112, 28, 24, 22.5, 120.1, 5.0, '3 Years/36,000 Miles'),
('Toyota', 'Land Cruiser Heritage Edition', 'Full-Size SUV', 2024, 90000, 90000, '3.4L Twin-Turbo V6 Hybrid', '4WD', '10-Speed Automatic', 22, 8100, 8.9, 8.9, '265/70R18', 'Gasoline', 8, 409, 479, 6.1, 112, 31, 25, 17.9, 84.3, 5.0, '3 Years/36,000 Miles'),

-- Chevrolet Models
('Chevrolet', 'Silverado ZR2', 'Full-Size Pickup', 2024, 70000, 70000, '6.2L V8', '4WD', '10-Speed Automatic', 16, 8900, 11.2, 11.2, '33x12.50R18LT', 'Gasoline', 6, 420, 460, 5.9, 112, 31.8, 23.4, 24, 71.7, 5.0, '3 Years/36,000 Miles'),
('Chevrolet', 'Tahoe Z71', 'Full-Size SUV', 2024, 60000, 60000, '5.3L V8', '4WD', '10-Speed Automatic', 16, 8400, 8.9, 8.9, '275/65R18', 'Gasoline', 8, 355, 383, 6.9, 112, 28, 23, 24, 122.9, 5.0, '3 Years/36,000 Miles'),
('Chevrolet', 'Suburban Z71', 'Full-Size SUV', 2024, 65000, 65000, '5.3L V8', '4WD', '10-Speed Automatic', 16, 8300, 8.0, 8.0, '275/65R18', 'Gasoline', 9, 355, 383, 7.1, 112, 28, 23, 28, 144.7, 5.0, '3 Years/36,000 Miles'),

-- GMC Models
('GMC', 'Canyon AT4X', 'Mid-Size Pickup', 2024, 55000, 55000, '2.7L Turbo I4', '4WD', '8-Speed Automatic', 19, 7700, 10.7, 10.7, '285/70R17', 'Gasoline', 5, 310, 430, 7.0, 112, 36.9, 26.3, 21, 41.3, 5.0, '3 Years/36,000 Miles'),
('GMC', 'Yukon AT4', 'Full-Size SUV', 2024, 70000, 70000, '6.2L V8', '4WD', '10-Speed Automatic', 16, 8500, 9.6, 9.6, '275/65R20', 'Gasoline', 8, 420, 460, 6.1, 112, 28, 23, 24, 122.9, 5.0, '3 Years/36,000 Miles'),

-- Ram Models
('Ram', '2500 Power Wagon', 'Heavy-Duty Pickup', 2024, 75000, 75000, '6.4L HEMI V8', '4WD', '8-Speed Automatic', 12, 10340, 10.9, 10.9, '33x12.50R17LT', 'Gasoline', 6, 410, 429, 7.0, 99, 34, 23, 32, 74.3, 5.0, '5 Years/60,000 Miles'),
('Ram', '3500 Power Wagon', 'Heavy-Duty Pickup', 2024, 85000, 85000, '6.7L Cummins Turbo Diesel', '4WD', '6-Speed Manual', 15, 31210, 10.9, 10.9, '285/70R17LT', 'Diesel', 6, 370, 850, 8.5, 99, 34, 23, 32, 74.3, 5.0, '5 Years/60,000 Miles'),

-- Nissan Models
('Nissan', 'Titan Pro-4X', 'Full-Size Pickup', 2024, 48000, 48000, '5.6L V8', '4WD', '9-Speed Automatic', 16, 9080, 9.8, 9.8, '275/70R18', 'Gasoline', 5, 400, 413, 5.9, 112, 28, 25, 26, 61.4, 5.0, '5 Years/60,000 Miles'),
('Nissan', 'Armada Platinum', 'Full-Size SUV', 2024, 65000, 65000, '5.6L V8', '4WD', '9-Speed Automatic', 14, 8500, 9.1, 9.1, '275/60R20', 'Gasoline', 8, 400, 413, 5.7, 112, 25.9, 21.4, 26, 95.4, 5.0, '5 Years/60,000 Miles'),

-- Honda Models
('Honda', 'Ridgeline RTL-E', 'Mid-Size Pickup', 2024, 40000, 40000, '3.5L V6', 'AWD', '9-Speed Automatic', 21, 5000, 7.6, 7.6, '245/60R18', 'Gasoline', 5, 280, 262, 7.3, 112, 21, 21, 19.5, 33.9, 5.0, '3 Years/36,000 Miles'),
('Honda', 'Passport TrailSport', 'Mid-Size SUV', 2024, 42000, 42000, '3.5L V6', 'AWD', '9-Speed Automatic', 22, 5000, 8.6, 8.6, '245/60R18', 'Gasoline', 5, 280, 262, 6.8, 112, 20.5, 23.5, 19.5, 84.0, 5.0, '3 Years/36,000 Miles'),

-- Subaru Models
('Subaru', 'Forester Wilderness', 'Compact SUV', 2024, 35000, 35000, '2.5L Boxer-4', 'AWD', 'CVT', 26, 1500, 9.2, 9.2, '225/60R17', 'Gasoline', 5, 182, 176, 9.3, 112, 20, 21, 16.6, 76.1, 5.0, '5 Years/60,000 Miles'),
('Subaru', 'Ascent Wilderness', 'Mid-Size SUV', 2024, 45000, 45000, '2.4L Turbo Boxer-4', 'AWD', 'CVT', 22, 5000, 8.7, 8.7, '245/60R18', 'Gasoline', 8, 260, 277, 7.8, 112, 19, 21, 19.3, 86.5, 5.0, '5 Years/60,000 Miles');