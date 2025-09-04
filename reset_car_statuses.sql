-- Reset Car Statuses for Date-Based Availability
-- This script resets all car statuses to 'available' since we're now using date-based availability checking

-- Update all cars to 'available' status
UPDATE cars 
SET status = 'available' 
WHERE status = 'booked';

-- Verify the update
SELECT 
    id,
    brand,
    model,
    status,
    daily_rate
FROM cars 
ORDER BY brand, model;

-- Show count of cars by status
SELECT 
    status,
    COUNT(*) as count
FROM cars 
GROUP BY status;
