-- Insert additional modern 4x4 vehicles
INSERT INTO public.vehicles (
  name, brand, type, engine, ground_clearance, tire_size, image_url, year, price, mpg, 
  towing_capacity, approach_angle, departure_angle
) VALUES
-- Ford 4x4s
('Bronco Raptor', 'Ford', 'SUV', '3.0L V6 Twin-Turbo', 13.1, '37x12.50R17', '/src/assets/vehicles/ford-bronco-raptor.jpg', 2024, 69995, 15, 4500, 47, 40),
('F-150 Raptor R', 'Ford', 'Truck', '5.2L Supercharged V8', 13.0, '37x13.50R17', '/src/assets/vehicles/ford-f150-raptor-r.jpg', 2024, 109145, 12, 8200, 31, 23),
('Ranger Raptor', 'Ford', 'Truck', '3.0L V6 Twin-Turbo', 11.1, '33x10.50R17', '/src/assets/vehicles/ford-ranger-raptor.jpg', 2024, 56960, 18, 7500, 32.5, 24),

-- Ram 4x4s  
('Power Wagon', 'Ram', 'Truck', '6.4L HEMI V8', 14.9, '33x12.50R17', '/src/assets/vehicles/ram-power-wagon.jpg', 2024, 67040, 12, 10330, 34, 23),
('2500 Laramie Off-Road', 'Ram', 'Truck', '6.7L Cummins Turbo Diesel', 12.1, '33x12.50R18', '/src/assets/vehicles/ram-2500-laramie.jpg', 2024, 73995, 22, 19780, 28, 23),

-- Toyota 4x4s
('Tacoma TRD Pro', 'Toyota', 'Truck', '3.5L V6', 11.3, '33x11.50R16', '/src/assets/vehicles/toyota-tacoma-trd-pro.jpg', 2024, 51395, 19, 6800, 36, 26),
('Sequoia TRD Pro', 'Toyota', 'SUV', '3.5L Twin-Turbo V6 Hybrid', 10.0, '33x12.50R18', '/src/assets/vehicles/toyota-sequoia-trd-pro.jpg', 2024, 77215, 19, 9520, 24, 20),
('Tundra TRD Pro', 'Toyota', 'Truck', '3.5L Twin-Turbo V6', 11.3, '33x12.50R18', '/src/assets/vehicles/toyota-tundra-trd-pro.jpg', 2024, 69995, 18, 12000, 29, 22),

-- Chevrolet 4x4s
('Silverado ZR2', 'Chevrolet', 'Truck', '6.2L V8', 11.2, '33x12.50R18', '/src/assets/vehicles/chevy-silverado-zr2.jpg', 2024, 71200, 16, 8900, 31.8, 23.4),
('Colorado ZR2 Bison', 'Chevrolet', 'Truck', '2.7L Turbo I-4', 10.7, '33x10.50R17', '/src/assets/vehicles/chevy-colorado-zr2-bison.jpg', 2024, 48195, 19, 7700, 36, 26),
('Tahoe Z71', 'Chevrolet', 'SUV', '5.3L V8', 10.0, '33x12.50R18', '/src/assets/vehicles/chevy-tahoe-z71.jpg', 2024, 59200, 16, 8600, 28, 23),

-- Jeep 4x4s
('Gladiator Mojave', 'Jeep', 'Truck', '3.6L V6', 11.1, '33x12.50R17', '/src/assets/vehicles/jeep-gladiator-mojave.jpg', 2024, 52395, 17, 7650, 43, 26),
('Wrangler 392', 'Jeep', 'SUV', '6.4L HEMI V8', 10.8, '33x12.50R17', '/src/assets/vehicles/jeep-wrangler-392.jpg', 2024, 79995, 13, 3500, 44, 37),
('Grand Cherokee Trailhawk', 'Jeep', 'SUV', '5.7L HEMI V8', 10.9, '31.5x10.50R18', '/src/assets/vehicles/jeep-grand-cherokee-trailhawk.jpg', 2024, 58995, 14, 7200, 29.9, 23.6),

-- GMC 4x4s
('Sierra AT4X', 'GMC', 'Truck', '6.2L V8', 11.2, '33x12.50R18', '/src/assets/vehicles/gmc-sierra-at4x.jpg', 2024, 75395, 16, 9500, 31.8, 23.4),
('Canyon AT4X', 'GMC', 'Truck', '2.7L Turbo I-4', 10.7, '33x10.50R17', '/src/assets/vehicles/gmc-canyon-at4x.jpg', 2024, 47195, 19, 7700, 36, 26),

-- Land Rover 4x4s
('Defender 110', 'Land Rover', 'SUV', '3.0L Mild Hybrid I6', 11.5, '32x11.50R18', '/src/assets/vehicles/land-rover-defender-110.jpg', 2024, 59300, 19, 8200, 38, 40),
('Discovery', 'Land Rover', 'SUV', '3.0L Supercharged V6', 11.1, '32x11.50R19', '/src/assets/vehicles/land-rover-discovery.jpg', 2024, 62700, 17, 8200, 34, 30);

-- Update some existing vehicles that might not be true 4x4s
UPDATE public.vehicles 
SET 
  type = 'SUV',
  ground_clearance = 8.7,
  approach_angle = 25,
  departure_angle = 22
WHERE name LIKE '%Outback Wilderness%';

-- Remove any non-4x4 vehicles that might have been added
DELETE FROM public.vehicles 
WHERE ground_clearance < 8.0 
   OR type NOT IN ('SUV', 'Truck', 'Pickup')
   OR brand IN ('Bugatti', 'Ferrari', 'Lamborghini', 'McLaren');