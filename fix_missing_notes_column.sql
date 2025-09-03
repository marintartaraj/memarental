-- Fix Missing Notes Column for MEMA Rental
-- This script adds the missing 'notes' column to the bookings table

-- Add the missing notes column to the bookings table
ALTER TABLE IF EXISTS bookings 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN bookings.notes IS 'Additional notes or comments for the booking';

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name = 'notes';

-- Show the current table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
