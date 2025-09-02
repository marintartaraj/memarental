-- Complete Database Fix for MEMA Rental
-- Run this in your Supabase SQL Editor

-- Drop and recreate the bookings table with correct schema
DROP TABLE IF EXISTS bookings CASCADE;

-- Create the complete bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
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
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies - More permissive for development
DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON bookings;
CREATE POLICY "Bookings are viewable by everyone" ON bookings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
CREATE POLICY "Bookings are insertable by everyone" ON bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Bookings are updatable by everyone" ON bookings;
CREATE POLICY "Bookings are updatable by everyone" ON bookings
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Bookings are deletable by everyone" ON bookings;
CREATE POLICY "Bookings are deletable by everyone" ON bookings
  FOR DELETE USING (true);

-- Verify the table was created correctly
SELECT 'Bookings table created successfully!' as status;

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'bookings'
ORDER BY ordinal_position;
