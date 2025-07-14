-- Update existing vehicles with detailed specifications
UPDATE vehicles SET 
  drivetrain = '4WD',
  transmission = '10-Speed Automatic',
  fuel_tank_capacity = 23.8,
  seating_capacity = 4,
  cargo_capacity = 35.6,
  approach_angle_degrees = 43,
  departure_angle_degrees = 26,
  breakover_angle = 25,
  wading_depth = 33.5,
  horsepower = 418,
  torque = 440,
  zero_to_sixty = 5.8,
  top_speed = 118,
  fuel_type = 'Gasoline',
  safety_rating = 4.5,
  warranty = '3 Year/36,000 Mile Basic',
  starting_price = price,
  max_payload = 1000
WHERE name = 'Bronco Raptor';

UPDATE vehicles SET 
  drivetrain = '4WD',
  transmission = '10-Speed Automatic', 
  fuel_tank_capacity = 36.0,
  seating_capacity = 5,
  cargo_capacity = 52.8,
  approach_angle_degrees = 36,
  departure_angle_degrees = 23,
  breakover_angle = 22,
  wading_depth = 33.1,
  horsepower = 450,
  torque = 510,
  zero_to_sixty = 5.1,
  top_speed = 107,
  fuel_type = 'Gasoline',
  safety_rating = 5.0,
  warranty = '3 Year/36,000 Mile Basic',
  starting_price = price,
  max_payload = 1400
WHERE name = 'F-150 Raptor';

UPDATE vehicles SET 
  drivetrain = '4WD',
  transmission = '8-Speed Automatic',
  fuel_tank_capacity = 33.0,
  seating_capacity = 5,
  cargo_capacity = 71.0,
  approach_angle_degrees = 30,
  departure_angle_degrees = 21,
  breakover_angle = 22,
  wading_depth = 32.0,
  horsepower = 702,
  torque = 650,
  zero_to_sixty = 4.5,
  top_speed = 118,
  fuel_type = 'Gasoline',
  safety_rating = 4.0,
  warranty = '3 Year/36,000 Mile Basic',
  starting_price = price,
  max_payload = 1310
WHERE name = '1500 TRX';

UPDATE vehicles SET 
  drivetrain = '4WD',
  transmission = '8-Speed Automatic',
  fuel_tank_capacity = 22.5,
  seating_capacity = 4,
  cargo_capacity = 31.7,
  approach_angle_degrees = 44,
  departure_angle_degrees = 37,
  breakover_angle = 22,
  wading_depth = 30.0,
  horsepower = 285,
  torque = 260,
  zero_to_sixty = 8.1,
  top_speed = 99,
  fuel_type = 'Gasoline',
  safety_rating = 3.0,
  warranty = '3 Year/36,000 Mile Basic',
  starting_price = price,
  max_payload = 1000
WHERE name = 'Wrangler Rubicon';