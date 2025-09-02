-- Fix Database Schema for MEMA Rental
-- Run this in your Supabase SQL Editor to fix the missing columns

-- Check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add customer_email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customer_email'
    ) THEN
        ALTER TABLE bookings ADD COLUMN customer_email TEXT;
        RAISE NOTICE 'Added customer_email column to bookings table';
    END IF;

    -- Add customer_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customer_name'
    ) THEN
        ALTER TABLE bookings ADD COLUMN customer_name TEXT;
        RAISE NOTICE 'Added customer_name column to bookings table';
    END IF;

    -- Add customer_phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE bookings ADD COLUMN customer_phone TEXT;
        RAISE NOTICE 'Added customer_phone column to bookings table';
    END IF;

    -- Add license_number column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'license_number'
    ) THEN
        ALTER TABLE bookings ADD COLUMN license_number TEXT;
        RAISE NOTICE 'Added license_number column to bookings table';
    END IF;

    -- Add license_expiry column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'license_expiry'
    ) THEN
        ALTER TABLE bookings ADD COLUMN license_expiry DATE;
        RAISE NOTICE 'Added license_expiry column to bookings table';
    END IF;

    -- Add extras column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'extras'
    ) THEN
        ALTER TABLE bookings ADD COLUMN extras JSONB DEFAULT '[]';
        RAISE NOTICE 'Added extras column to bookings table';
    END IF;

    -- Add special_requests column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'special_requests'
    ) THEN
        ALTER TABLE bookings ADD COLUMN special_requests TEXT;
        RAISE NOTICE 'Added special_requests column to bookings table';
    END IF;

    -- Add pickup_time column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'pickup_time'
    ) THEN
        ALTER TABLE bookings ADD COLUMN pickup_time TIME;
        RAISE NOTICE 'Added pickup_time column to bookings table';
    END IF;

    -- Add return_time column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'return_time'
    ) THEN
        ALTER TABLE bookings ADD COLUMN return_time TIME;
        RAISE NOTICE 'Added return_time column to bookings table';
    END IF;

    -- Add pickup_location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'pickup_location'
    ) THEN
        ALTER TABLE bookings ADD COLUMN pickup_location TEXT;
        RAISE NOTICE 'Added pickup_location column to bookings table';
    END IF;

    -- Add return_location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'return_location'
    ) THEN
        ALTER TABLE bookings ADD COLUMN return_location TEXT;
        RAISE NOTICE 'Added return_location column to bookings table';
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'status'
    ) THEN
        ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'confirmed';
        RAISE NOTICE 'Added status column to bookings table';
    END IF;

    -- Add booking_reference column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'booking_reference'
    ) THEN
        ALTER TABLE bookings ADD COLUMN booking_reference TEXT UNIQUE;
        RAISE NOTICE 'Added booking_reference column to bookings table';
    END IF;

    -- Add notes column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'notes'
    ) THEN
        ALTER TABLE bookings ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to bookings table';
    END IF;

    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id column to bookings table';
    END IF;

    RAISE NOTICE 'Database schema fix completed successfully!';
END $$;

-- Show current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'bookings'
ORDER BY ordinal_position;
