import { supabase } from '../src/lib/customSupabaseClient.js';

// Sample car data for MEMA Rental in Tirana, Albania
const sampleCars = [
  {
    brand: "BMW",
    model: "X5",
    year: 2023,
    daily_rate: 85.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/bmw-x5-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats", "Backup Camera", "Parking Sensors"],
    location: "Tirana",
    reviews: 12,
    discount: 0
  },
  {
    brand: "Mercedes",
    model: "C-Class",
    year: 2022,
    daily_rate: 75.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/mercedes-c-class-2022.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats", "Backup Camera"],
    location: "Tirana",
    reviews: 8,
    discount: 10
  },
  {
    brand: "Audi",
    model: "A4",
    year: 2023,
    daily_rate: 70.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/audi-a4-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats"],
    location: "Tirana",
    reviews: 15,
    discount: 0
  },
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    daily_rate: 45.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/toyota-corolla-2022.jpg",
    features: ["Bluetooth", "Air Conditioning", "Backup Camera"],
    location: "Tirana",
    reviews: 22,
    discount: 0
  },
  {
    brand: "Volkswagen",
    model: "Golf",
    year: 2023,
    daily_rate: 50.00,
    transmission: "manual",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/volkswagen-golf-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "Backup Camera"],
    location: "Tirana",
    reviews: 18,
    discount: 5
  },
  {
    brand: "Ford",
    model: "Focus",
    year: 2022,
    daily_rate: 40.00,
    transmission: "manual",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/ford-focus-2022.jpg",
    features: ["Bluetooth", "Air Conditioning"],
    location: "Tirana",
    reviews: 14,
    discount: 0
  },
  {
    brand: "BMW",
    model: "3 Series",
    year: 2023,
    daily_rate: 65.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/bmw-3-series-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats", "Backup Camera"],
    location: "Tirana",
    reviews: 9,
    discount: 0
  },
  {
    brand: "Mercedes",
    model: "E-Class",
    year: 2022,
    daily_rate: 90.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/mercedes-e-class-2022.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats", "Backup Camera", "Parking Sensors", "Heated Seats"],
    location: "Tirana",
    reviews: 6,
    discount: 0
  },
  {
    brand: "Audi",
    model: "Q5",
    year: 2023,
    daily_rate: 80.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/audi-q5-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Leather Seats", "Backup Camera", "All-Wheel Drive"],
    location: "Tirana",
    reviews: 11,
    discount: 0
  },
  {
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    daily_rate: 55.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/toyota-rav4-2022.jpg",
    features: ["Bluetooth", "Air Conditioning", "Backup Camera", "All-Wheel Drive"],
    location: "Tirana",
    reviews: 16,
    discount: 0
  },
  {
    brand: "Volkswagen",
    model: "Tiguan",
    year: 2023,
    daily_rate: 60.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/volkswagen-tiguan-2023.jpg",
    features: ["Bluetooth", "Air Conditioning", "Backup Camera", "All-Wheel Drive"],
    location: "Tirana",
    reviews: 13,
    discount: 0
  },
  {
    brand: "Ford",
    model: "Kuga",
    year: 2022,
    daily_rate: 50.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/ford-kuga-2022.jpg",
    features: ["Bluetooth", "Air Conditioning", "Backup Camera"],
    location: "Tirana",
    reviews: 10,
    discount: 0
  }
];

async function populateCarsData() {
  console.log('🚗 Starting to populate cars data...');
  
  try {
    // First, let's check if we have any existing cars
    const { data: existingCars, error: fetchError } = await supabase
      .from('cars')
      .select('id');
    
    if (fetchError) {
      console.error('❌ Error fetching existing cars:', fetchError);
      return;
    }
    
    if (existingCars && existingCars.length > 0) {
      console.log(`⚠️  Found ${existingCars.length} existing cars. Skipping population to avoid duplicates.`);
      console.log('💡 To re-populate, first delete existing cars from the database.');
      return;
    }
    
    // Insert all sample cars
    const { data: insertedCars, error: insertError } = await supabase
      .from('cars')
      .insert(sampleCars)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting cars:', insertError);
      return;
    }
    
    console.log(`✅ Successfully inserted ${insertedCars.length} cars!`);
    console.log('📊 Cars added:');
    
    insertedCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.brand} ${car.model} (${car.year}) - €${car.daily_rate}/day`);
    });
    
    console.log('\n🎉 Database population completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Add car images to public/images/cars/ folder');
    console.log('2. Update image_url paths if needed');
    console.log('3. Test the cars page to see the new data');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the population script
populateCarsData();

