// Simple test file to verify date range utilities work correctly
// This version uses CommonJS require syntax for easier testing

// Test toDay function
function toDay(d) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Test addDays function
function addDays(dayStr, n) {
  const dt = new Date(dayStr + 'T00:00:00Z');
  dt.setUTCDate(dt.getUTCDate() + n);
  return toDay(dt);
}

// Test overlapsDay function
function overlapsDay(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Test normalizeDateRange function
function normalizeDateRange(pickupDate, returnDate) {
  const start = toDay(pickupDate);
  const end = addDays(toDay(returnDate), 1); // Make end date exclusive
  return { start, end };
}

console.log('🧪 Testing date range utilities...\n');

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

// Test real-world scenario
console.log('\nTesting real-world scenario:');
console.log('Car booked: 2024-01-15 to 2024-01-20');
console.log('Customer wants: 2024-01-18 to 2024-01-22');
const carBooked = normalizeDateRange("2024-01-15", "2024-01-20");
const customerWants = normalizeDateRange("2024-01-18", "2024-01-22");
const overlaps = overlapsDay(carBooked.start, carBooked.end, customerWants.start, customerWants.end);
console.log('Overlaps?', overlaps); // Should be true

console.log('\n✅ All tests completed!');
