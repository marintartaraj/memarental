import { supabase } from './customSupabaseClient.js';

const carsData = [
  {
    brand: "Toyota",
    model: "Yaris",
    year: 2008,
    daily_rate: 35.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/yaris1.jpeg",
    location: "Tirana",
    luggage: 2,
    engine: "1.4 Diesel"
  },
  {
    brand: "Mercedes-Benz",
    model: "C300 4MATIC AMG Line",
    year: 2011,
    daily_rate: 65.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/c-class1.jpeg",
    location: "Tirana",
    luggage: 3,
    engine: "Petrol (LPG converted)"
  },
  {
    brand: "Mercedes-Benz",
    model: "E350 4MATIC",
    year: 2012,
    daily_rate: 75.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/e class1.jpeg",
    location: "Tirana",
    luggage: 4,
    engine: "Diesel"
  },
  {
    brand: "Volkswagen",
    model: "Jetta",
    year: 2014,
    daily_rate: 45.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/jetta1.jpeg",
    location: "Tirana",
    luggage: 3,
    engine: "1.6 Diesel"
  },
  {
    brand: "Volkswagen",
    model: "Passat",
    year: 2014,
    daily_rate: 55.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/passat1.jpeg",
    location: "Tirana",
    luggage: 4,
    engine: "2.0 Diesel"
  },
  {
    brand: "Hyundai",
    model: "Santa Fe",
    year: 2015,
    daily_rate: 70.00,
    transmission: "automatic",
    seats: 7,
    fuel_type: "diesel",
    status: "available",
    image_url: "/images/cars/santa fe1.jpeg",
    location: "Tirana",
    luggage: 5,
    engine: "2.0 Diesel"
  },
  {
    brand: "Volvo",
    model: "XC60 T6 AWD",
    year: 2016,
    daily_rate: 85.00,
    transmission: "automatic",
    seats: 5,
    fuel_type: "petrol",
    status: "available",
    image_url: "/images/cars/xc601.jpeg",
    location: "Tirana",
    luggage: 4,
    engine: "3.0 Petrol (LPG converted)"
  }
];

export async function addCarsToDatabase() {
  try {
    console.log('Starting to add cars to database...');
    
    for (const car of carsData) {
      const { data, error } = await supabase
        .from('cars')
        .insert([car])
        .select();
      
      if (error) {
        console.error(`Error adding ${car.brand} ${car.model}:`, error);
      } else {
        console.log(`Successfully added ${car.brand} ${car.model}`);
      }
    }
    
    console.log('Finished adding cars to database');
  } catch (error) {
    console.error('Error in addCarsToDatabase:', error);
  }
}

// Function to get all cars from database
export async function getAllCars() {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllCars:', error);
    return [];
  }
}

// Function to update car image URLs
export async function updateCarImageUrl(carId, imageUrl) {
  try {
    const { data, error } = await supabase
      .from('cars')
      .update({ image_url: imageUrl })
      .eq('id', carId)
      .select();
    
    if (error) {
      console.error('Error updating car image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCarImageUrl:', error);
    return false;
  }
}

// Function to get available car images for each brand
export function getAvailableCarImages() {
  return {
    'Toyota': [
      '/images/cars/yaris1.jpeg',
      '/images/cars/yaris2.jpeg'
    ],
    'Mercedes-Benz': [
      '/images/cars/c-class1.jpeg',
      '/images/cars/c-class2.jpeg',
      '/images/cars/c-class3.jpeg',
      '/images/cars/c-class4.jpeg',
      '/images/cars/c-class5.jpeg',
      '/images/cars/e class1.jpeg',
      '/images/cars/e class2.jpeg'
    ],
    'Volkswagen': [
      '/images/cars/jetta1.jpeg',
      '/images/cars/jetta2.jpeg',
      '/images/cars/jetta3.jpeg',
      '/images/cars/jetta4.jpeg',
      '/images/cars/jetta5.jpeg',
      '/images/cars/jetta6.jpeg',
      '/images/cars/passat1.jpeg',
      '/images/cars/passat2.jpeg',
      '/images/cars/passat3.jpeg',
      '/images/cars/passat4.jpeg'
    ],
    'Hyundai': [
      '/images/cars/santa fe1.jpeg',
      '/images/cars/santa fe2.jpeg',
      '/images/cars/santa fe3.jpeg',
      '/images/cars/santa fe4.jpeg',
      '/images/cars/santa fe5.jpeg',
      '/images/cars/santa fe6.jpeg',
      '/images/cars/santa fe7.jpeg'
    ],
    'Volvo': [
      '/images/cars/xc601.jpeg',
      '/images/cars/xc602.jpeg',
      '/images/cars/xc603.jpeg',
      '/images/cars/xc604.jpeg',
      '/images/cars/xc605.jpeg'
    ]
  };
}
