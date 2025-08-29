-- Clear existing cars
DELETE FROM cars;

-- Insert cars with actual photos from your images/cars folder
INSERT INTO cars (
  brand, 
  model, 
  year, 
  daily_rate, 
  transmission, 
  seats, 
  fuel_type, 
  status, 
  image_url, 
  luggage, 
  engine
) VALUES 
-- Toyota Yaris (using yaris1.jpeg)
(
  'Toyota',
  'Yaris',
  2008,
  35.00,
  'automatic',
  5,
  'diesel',
  'available',
  '/images/cars/yaris1.jpeg',
  2,
  '1.4 Diesel'
),

-- Mercedes-Benz C300 4MATIC AMG Line (using c-class1.jpeg)
(
  'Mercedes-Benz',
  'C300 4MATIC AMG Line',
  2011,
  65.00,
  'automatic',
  5,
  'petrol',
  'available',
  '/images/cars/c-class1.jpeg',
  3,
  'Petrol (LPG converted)'
),

-- Mercedes-Benz E350 4MATIC (using e class1.jpeg)
(
  'Mercedes-Benz',
  'E350 4MATIC',
  2012,
  75.00,
  'automatic',
  5,
  'diesel',
  'available',
  '/images/cars/e class1.jpeg',
  4,
  'Diesel'
),

-- Volkswagen Jetta (using jetta1.jpeg)
(
  'Volkswagen',
  'Jetta',
  2014,
  45.00,
  'automatic',
  5,
  'diesel',
  'available',
  '/images/cars/jetta1.jpeg',
  3,
  '1.6 Diesel'
),

-- Volkswagen Passat (using passat1.jpeg)
(
  'Volkswagen',
  'Passat',
  2014,
  55.00,
  'automatic',
  5,
  'diesel',
  'available',
  '/images/cars/passat1.jpeg',
  4,
  '2.0 Diesel'
),

-- Hyundai Santa Fe (using santa fe1.jpeg)
(
  'Hyundai',
  'Santa Fe',
  2015,
  70.00,
  'automatic',
  7,
  'diesel',
  'available',
  '/images/cars/santa fe1.jpeg',
  5,
  '2.0 Diesel'
),

-- Volvo XC60 T6 AWD (using xc601.jpeg)
(
  'Volvo',
  'XC60 T6 AWD',
  2016,
  85.00,
  'automatic',
  5,
  'petrol',
  'available',
  '/images/cars/xc601.jpeg',
  4,
  '3.0 Petrol (LPG converted)'
);

-- Verify the cars were added successfully
SELECT 
  brand, 
  model, 
  year, 
  daily_rate, 
  image_url,
  status
FROM cars 
ORDER BY daily_rate ASC;

