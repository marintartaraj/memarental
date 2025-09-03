-- MEMA Rental Database Fix Script
-- This script will fix the missing table relationships and create the proper schema

-- Drop existing tables if they exist (WARNING: This will delete all data)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS cars CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_number TEXT,
    license_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table
CREATE TABLE cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    transmission TEXT DEFAULT 'automatic',
    fuel_type TEXT DEFAULT 'petrol',
    seats INTEGER DEFAULT 5,
    luggage INTEGER DEFAULT 2,
    engine TEXT,
    features TEXT[],
    image_url TEXT,
    status TEXT DEFAULT 'available',
    location TEXT DEFAULT 'Tirana',
    reviews INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table with proper relationships
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
    profiles_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_time TIME NOT NULL,
    pickup_location TEXT NOT NULL,
    return_location TEXT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    extras TEXT[],
    special_requests TEXT,
    status TEXT DEFAULT 'confirmed',
    booking_reference TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_profiles_id ON bookings(profiles_id);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for cars
CREATE POLICY "Anyone can view available cars" ON cars
    FOR SELECT USING (status = 'available');

CREATE POLICY "Admin can view all cars" ON cars
    FOR SELECT USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Admin can insert cars" ON cars
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Admin can update cars" ON cars
    FOR UPDATE USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Admin can delete cars" ON cars
    FOR DELETE USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

-- Create RLS policies for bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = profiles_id);

CREATE POLICY "Admin can view all bookings" ON bookings
    FOR SELECT USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = profiles_id);

CREATE POLICY "Admin can insert bookings" ON bookings
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Admin can update all bookings" ON bookings
    FOR UPDATE USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

CREATE POLICY "Admin can delete all bookings" ON bookings
    FOR DELETE USING (auth.jwt() ->> 'email' IN ('admin@memarental.com', 'prov@gmail.com'));

-- Insert sample car data
INSERT INTO cars (brand, model, year, daily_rate, transmission, fuel_type, seats, luggage, features, image_url) VALUES
('Mercedes-Benz', 'C-Class', 2022, 65.00, 'automatic', 'petrol', 5, 3, ARRAY['Bluetooth', 'Air Conditioning', 'GPS'], '/images/cars/c-class1.jpeg'),
('Mercedes-Benz', 'E-Class', 2021, 85.00, 'automatic', 'petrol', 5, 4, ARRAY['Bluetooth', 'Air Conditioning', 'GPS', 'Leather Seats'], '/images/cars/e class1.jpeg'),
('Volkswagen', 'Jetta', 2022, 45.00, 'automatic', 'petrol', 5, 3, ARRAY['Bluetooth', 'Air Conditioning'], '/images/cars/jetta1.jpeg'),
('Volkswagen', 'Passat', 2021, 55.00, 'automatic', 'petrol', 5, 4, ARRAY['Bluetooth', 'Air Conditioning', 'GPS'], '/images/cars/passat1.jpeg'),
('Toyota', 'Yaris', 2022, 35.00, 'automatic', 'petrol', 5, 2, ARRAY['Bluetooth', 'Air Conditioning'], '/images/cars/yaris1.jpeg'),
('Hyundai', 'Santa Fe', 2021, 75.00, 'automatic', 'petrol', 7, 5, ARRAY['Bluetooth', 'Air Conditioning', 'GPS', 'Third Row'], '/images/cars/santa fe1.jpeg'),
('Volvo', 'XC60', 2021, 80.00, 'automatic', 'petrol', 5, 4, ARRAY['Bluetooth', 'Air Conditioning', 'GPS', 'Safety Features'], '/images/cars/xc601.jpeg');

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'MEMA-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.id::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking reference
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_booking_reference();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database schema created successfully! All tables and relationships are now properly configured.' as message;
