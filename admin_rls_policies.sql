-- Comprehensive RLS Policies for Admin Users
-- This file provides more secure and specific policies for admin operations

-- Step 1: Check current authentication context
-- Run this first to see what user context we're working with
SELECT 
  current_user,
  session_user,
  auth.role() as auth_role,
  auth.uid() as auth_uid,
  CASE 
    WHEN auth.jwt() IS NOT NULL THEN 'JWT present'
    ELSE 'No JWT'
  END as jwt_status;

-- Step 2: Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user email is in admin list
  IF (auth.jwt() ->> 'email') IN ('admin@memarental.com', 'prov@gmail.com') THEN
    RETURN TRUE;
  END IF;
  
  -- Check user metadata for admin role
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Drop existing policies
DROP POLICY IF EXISTS "Cars are viewable by everyone" ON cars;
DROP POLICY IF EXISTS "Cars are insertable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are updatable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are deletable by authenticated users" ON cars;

-- Step 4: Create new, more specific policies
-- Public read access
CREATE POLICY "Public car viewing" ON cars
  FOR SELECT USING (true);

-- Admin-only insert
CREATE POLICY "Admin car insertion" ON cars
  FOR INSERT WITH CHECK (is_admin_user());

-- Admin-only update
CREATE POLICY "Admin car updates" ON cars
  FOR UPDATE USING (is_admin_user());

-- Admin-only delete
CREATE POLICY "Admin car deletion" ON cars
  FOR DELETE USING (is_admin_user());

-- Step 5: Apply similar policies to other tables if needed
-- For bookings table
DROP POLICY IF EXISTS "Bookings are viewable by owner and admins" ON bookings;
DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
DROP POLICY IF EXISTS "Bookings are updatable by owner and admins" ON bookings;
DROP POLICY IF EXISTS "Bookings are deletable by owner and admins" ON bookings;

CREATE POLICY "Public booking viewing" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "User booking creation" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "User booking updates" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR is_admin_user()
  );

CREATE POLICY "User booking deletion" ON bookings
  FOR DELETE USING (
    auth.uid() = user_id OR is_admin_user()
  );

-- Step 6: Test the policies
-- This should return the policies we just created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('cars', 'bookings')
ORDER BY tablename, cmd;

-- Step 7: Test admin function
SELECT is_admin_user() as is_admin;

-- Step 8: If you need to debug further, you can check the JWT contents
SELECT 
  auth.jwt() as full_jwt,
  auth.jwt() ->> 'email' as user_email,
  auth.jwt() -> 'user_metadata' as user_metadata,
  auth.jwt() ->> 'sub' as user_id;

-- Step 9: Emergency override (use only for testing)
-- If nothing else works, you can temporarily disable RLS:
-- ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable after testing:
-- ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
