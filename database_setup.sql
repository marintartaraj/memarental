-- MEMA Rental Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  daily_rate DECIMAL(10,2) NOT NULL,
  transmission TEXT,
  seats INTEGER,
  fuel_type TEXT,
  status TEXT DEFAULT 'available',
  image_url TEXT,
  luggage INTEGER,
  engine TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing bookings table if it exists to recreate with new schema
DROP TABLE IF EXISTS bookings CASCADE;

-- Create bookings table with comprehensive fields
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_time TIME,
  return_time TIME,
  pickup_location TEXT,
  return_location TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  extras JSONB DEFAULT '[]',
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed',
  booking_reference TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  reference TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    reference := 'MEMA-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Check if reference already exists
    IF NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = reference) THEN
      RETURN reference;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Set up RLS policies for cars table
DROP POLICY IF EXISTS "Cars are viewable by everyone" ON cars;
CREATE POLICY "Cars are viewable by everyone" ON cars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cars are insertable by authenticated users" ON cars;
CREATE POLICY "Cars are insertable by authenticated users" ON cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Cars are updatable by authenticated users" ON cars;
CREATE POLICY "Cars are updatable by authenticated users" ON cars
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Cars are deletable by authenticated users" ON cars;
CREATE POLICY "Cars are deletable by authenticated users" ON cars
  FOR DELETE USING (auth.role() = 'authenticated');

-- Set up RLS policies for bookings table
DROP POLICY IF EXISTS "Bookings are viewable by owner and admins" ON bookings;
CREATE POLICY "Bookings are viewable by owner and admins" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
CREATE POLICY "Bookings are insertable by everyone" ON bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Bookings are updatable by owner and admins" ON bookings;
CREATE POLICY "Bookings are updatable by owner and admins" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Bookings are deletable by owner and admins" ON bookings;
CREATE POLICY "Bookings are deletable by owner and admins" ON bookings
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

-- Set up RLS policies for profiles table
DROP POLICY IF EXISTS "Profiles are viewable by owner and admins" ON profiles;
CREATE POLICY "Profiles are viewable by owner and admins" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Profiles are insertable by owner" ON profiles;
CREATE POLICY "Profiles are insertable by owner" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are updatable by owner" ON profiles;
CREATE POLICY "Profiles are updatable by owner" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert sample cars data (if cars table is empty)
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
) 
SELECT * FROM (VALUES 
  ('Toyota', 'Yaris', 2008, 35.00, 'automatic', 5, 'diesel', 'available', '/images/cars/yaris1.jpeg', 2, '1.4 Diesel'),
  ('Mercedes-Benz', 'C300 4MATIC AMG Line', 2011, 65.00, 'automatic', 5, 'petrol', 'available', '/images/cars/c-class1.jpeg', 3, 'Petrol (LPG converted)'),
  ('Mercedes-Benz', 'E350 4MATIC', 2012, 75.00, 'automatic', 5, 'diesel', 'available', '/images/cars/e class1.jpeg', 4, 'Diesel'),
  ('Volkswagen', 'Jetta', 2014, 45.00, 'automatic', 5, 'diesel', 'available', '/images/cars/jetta1.jpeg', 3, '1.6 Diesel'),
  ('Volkswagen', 'Passat', 2014, 55.00, 'automatic', 5, 'diesel', 'available', '/images/cars/passat1.jpeg', 4, '2.0 Diesel'),
  ('Hyundai', 'Santa Fe', 2015, 70.00, 'automatic', 7, 'diesel', 'available', '/images/cars/santa fe1.jpeg', 5, '2.0 Diesel'),
  ('Volvo', 'XC60 T6 AWD', 2016, 85.00, 'automatic', 5, 'petrol', 'available', '/images/cars/xc601.jpeg', 4, '3.0 Petrol (LPG converted)')
) AS v(brand, model, year, daily_rate, transmission, seats, fuel_type, status, image_url, luggage, engine)
WHERE NOT EXISTS (SELECT 1 FROM cars LIMIT 1);

-- Create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify tables were created successfully
SELECT 'Tables created successfully' as status;

-- Show table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('cars', 'bookings', 'profiles')
ORDER BY table_name, ordinal_position;
