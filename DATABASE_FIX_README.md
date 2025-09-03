# Database Fix for MEMA Rental

## Problem
The car booking system was failing with the error:
```
Could not find the 'customer_email' column of 'bookings' in the schema cache
```

This happened because:
1. The database schema was missing customer detail columns that the booking service expected
2. The profiles table wasn't being populated when users registered
3. The foreign key relationships weren't properly established

## Solution
The `fix_database_relationships.sql` file contains a complete database schema fix that:

1. **Recreates all tables** with proper structure
2. **Adds missing customer columns** to the bookings table:
   - `customer_name`
   - `customer_email` 
   - `customer_phone`
   - `license_number`
   - `license_expiry`
3. **Fixes foreign key relationships** between tables
4. **Creates automatic profile creation** when users sign up
5. **Sets up proper Row Level Security (RLS)** policies
6. **Inserts sample car data**

## How to Apply the Fix

### Option 1: Supabase Dashboard (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your MEMA Rental project
3. Navigate to **SQL Editor**
4. Copy the entire contents of `fix_database_relationships.sql`
5. Paste and run the SQL script

### Option 2: Supabase CLI
If you have the Supabase CLI installed:
```bash
supabase db reset --linked
```

## What This Fix Does

### Tables Created/Modified:
- **profiles**: User profile information linked to auth.users
- **cars**: Car inventory with proper structure
- **bookings**: Booking records with customer details and proper relationships

### Key Features:
- ✅ Customer details stored directly in bookings table
- ✅ Optional user authentication linking
- ✅ Automatic profile creation on signup
- ✅ Proper foreign key constraints
- ✅ Row Level Security policies
- ✅ Sample car data included
- ✅ Booking reference generation

### RLS Policies:
- Users can view/edit their own profiles and bookings
- Admins can manage all data
- Cars are publicly viewable when available

## After Running the Fix

1. **Car booking should work** without the 406/400 errors
2. **Admin panel** should display bookings correctly
3. **User profiles** will be automatically created on signup
4. **Sample cars** will be available for testing

## Important Notes

⚠️ **WARNING**: This script will DELETE ALL EXISTING DATA in the affected tables!
- Make backups if you need to preserve any data
- Only run this if you're sure you want to reset the database

## Testing the Fix

1. Try to book a car from the booking page
2. Check that the admin panel shows bookings correctly
3. Verify that user profiles are created when signing up
4. Test the car availability system

## If Issues Persist

Check the browser console for any new error messages. The most common remaining issues might be:
- RLS policy conflicts
- Missing environment variables
- Supabase project configuration issues

## Support

If you continue to have issues after applying this fix, check:
1. Supabase project settings
2. Environment variables in your `.env` file
3. Browser console for specific error messages
