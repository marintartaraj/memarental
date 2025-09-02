-- Fix RLS Policies for MEMA Rental Database
-- Run this in your Supabase SQL Editor to fix the car update issues

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'cars';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Cars are viewable by everyone" ON cars;
DROP POLICY IF EXISTS "Cars are insertable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are updatable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are deletable by authenticated users" ON cars;

-- Create more permissive policies for admin operations
-- Allow everyone to view cars (for public display)
CREATE POLICY "Cars are viewable by everyone" ON cars
  FOR SELECT USING (true);

-- Allow authenticated users to insert cars (for admin adding new cars)
CREATE POLICY "Cars are insertable by authenticated users" ON cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update cars (for admin editing cars)
-- This is the key policy that was causing issues
CREATE POLICY "Cars are updatable by authenticated users" ON cars
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete cars (for admin removing cars)
CREATE POLICY "Cars are deletable by authenticated users" ON cars
  FOR DELETE USING (auth.role() = 'authenticated');

-- Alternative: If you want to be more specific about admin access, use this instead:
-- CREATE POLICY "Cars are updatable by admins only" ON cars
--   FOR UPDATE USING (
--     auth.role() = 'authenticated' AND 
--     (auth.jwt() ->> 'email') IN ('admin@memarental.com', 'prov@gmail.com')
--   );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'cars';

-- Test if RLS is working by checking the current user context
SELECT 
  current_user,
  session_user,
  auth.role() as auth_role,
  auth.uid() as auth_uid,
  auth.jwt() as auth_jwt;

-- If you're still having issues, you can temporarily disable RLS for testing:
-- ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
-- (Remember to re-enable it after testing: ALTER TABLE cars ENABLE ROW LEVEL SECURITY;)

-- Check if there are any other constraints or triggers that might be blocking updates
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'cars'::regclass;

-- Check for any triggers that might interfere
SELECT 
  tgname as trigger_name,
  tgtype,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'cars'::regclass;
