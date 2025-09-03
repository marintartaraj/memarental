-- Fix Foreign Key Constraint Issue for MEMA Rental
-- This script fixes the foreign key constraint that's preventing anonymous bookings

-- Drop the problematic foreign key constraint
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS fk_bookings_user;

-- Update RLS policies to handle anonymous bookings properly
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (
        (user_id IS NOT NULL AND auth.uid() = user_id) OR 
        (customer_email = auth.jwt() ->> 'email') OR
        (user_id IS NULL AND customer_email IS NOT NULL) -- Allow viewing anonymous bookings
    );

DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (
        (user_id IS NOT NULL AND auth.uid() = user_id) OR 
        (customer_email = auth.jwt() ->> 'email') OR
        (user_id IS NULL) -- Allow anonymous bookings
    );

-- Success message
SELECT 'Foreign key constraint fixed successfully! Anonymous bookings should now work.' as message;
