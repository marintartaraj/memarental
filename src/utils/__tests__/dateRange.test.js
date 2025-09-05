// Simple test file to verify date range utilities work correctly
import { toDay, addDays, overlapsDay, normalizeDateRange } from '../dateRange.js';

// Test toDay function
console.log('Testing toDay function:');
console.log('toDay("2024-01-15"):', toDay("2024-01-15"));
console.log('toDay(new Date("2024-01-15T10:30:00Z")):', toDay(new Date("2024-01-15T10:30:00Z")));

// Test addDays function
console.log('\nTesting addDays function:');
console.log('addDays("2024-01-15", 1):', addDays("2024-01-15", 1));
console.log('addDays("2024-01-15", 7):', addDays("2024-01-15", 7));

// Test overlapsDay function
console.log('\nTesting overlapsDay function:');
console.log('overlapsDay("2024-01-15", "2024-01-20", "2024-01-18", "2024-01-25"):', 
  overlapsDay("2024-01-15", "2024-01-20", "2024-01-18", "2024-01-25")); // Should be true (overlaps)
console.log('overlapsDay("2024-01-15", "2024-01-20", "2024-01-21", "2024-01-25"):', 
  overlapsDay("2024-01-15", "2024-01-20", "2024-01-21", "2024-01-25")); // Should be false (no overlap)
console.log('overlapsDay("2024-01-15", "2024-01-20", "2024-01-20", "2024-01-25"):', 
  overlapsDay("2024-01-15", "2024-01-20", "2024-01-20", "2024-01-25")); // Should be false (touching, no overlap)

// Test normalizeDateRange function
console.log('\nTesting normalizeDateRange function:');
const range1 = normalizeDateRange("2024-01-15", "2024-01-20");
console.log('normalizeDateRange("2024-01-15", "2024-01-20"):', range1);

// Test edge case: same day booking
console.log('\nTesting same day booking:');
const sameDay = overlapsDay("2024-01-15", "2024-01-16", "2024-01-15", "2024-01-16");
console.log('Same day overlap:', sameDay); // Should be false (exclusive end dates)

console.log('\n✅ All tests completed!');
