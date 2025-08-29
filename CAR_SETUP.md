# 🚗 Car Rental System Setup Guide

## 📋 Overview
This guide explains how to set up your car rental website with real car data and images.

## 🗂️ Folder Structure
```
public/images/cars/
├── toyota-yaris-2008.jpg
├── mercedes-c300-2011.jpg
├── mercedes-e350-2012.jpg
├── volkswagen-jetta-2014.jpg
├── volkswagen-passat-2014.jpg
├── hyundai-santafe-2015.jpg
└── volvo-xc60-2016.jpg
```

## 🚀 Quick Setup

### 1. Add Car Images
1. **Save your car photos** to your computer
2. **Rename them** using the format: `brand-model-year.jpg`
3. **Copy them** to the `public/images/cars/` folder

### 2. Add Cars to Database
1. **Go to Admin Dashboard** (`/admin`)
2. **Click "Add Cars to Database"** button
3. **Wait for confirmation** that cars were added successfully

### 3. Verify Setup
1. **Visit Cars Page** (`/cars`)
2. **Check that cars display** with images and information
3. **Test filtering and search** functionality

## 📊 Car Data Structure

### Database Fields
- `brand` - Car manufacturer (e.g., "Toyota", "Mercedes-Benz")
- `model` - Car model (e.g., "Yaris", "C300 4MATIC AMG Line")
- `year` - Manufacturing year
- `daily_rate` - Price per day in EUR
- `transmission` - "automatic" or "manual"
- `seats` - Number of seats
- `fuel_type` - "petrol", "diesel", or "electric"
- `status` - "available", "booked", or "maintenance"
- `image_url` - Path to car image
- `features` - Array of features
- `location` - Pickup location (default: "Tirana")
- `engine` - Engine description
- `luggage` - Luggage capacity

### Sample Car Data
```javascript
{
  brand: "Toyota",
  model: "Yaris",
  year: 2008,
  daily_rate: 35.00,
  transmission: "automatic",
  seats: 5,
  fuel_type: "diesel",
  status: "available",
  image_url: "/images/cars/toyota-yaris-2008.jpg",
  features: ["Air Conditioning", "Bluetooth", "Fuel Efficient", "Easy Parking"],
  location: "Tirana",
  engine: "1.4 Diesel",
  luggage: 2
}
```

## 🎨 Image Requirements

### File Format
- **Format**: JPG or PNG
- **Size**: Recommended 1200x800 pixels
- **Quality**: Optimized for web (under 500KB per image)

### Naming Convention
- **Format**: `brand-model-year.jpg`
- **Examples**:
  - `toyota-yaris-2008.jpg`
  - `mercedes-c300-2011.jpg`
  - `volkswagen-passat-2014.jpg`

## 🔧 Admin Features

### Add Sample Cars
- **Button**: "Add Cars to Database"
- **Location**: Admin Dashboard → Cars Management
- **Function**: Adds all 7 sample cars with placeholder images

### Manage Individual Cars
- **Add Car**: Create new car records
- **Edit Car**: Modify existing car information
- **Delete Car**: Remove cars from database

## 📱 Responsive Design

### Mobile Optimization
- **Touch-friendly** car cards
- **Responsive images** that scale properly
- **Optimized loading** with lazy loading
- **Fallback images** for missing photos

### Desktop Features
- **Grid and list views**
- **Advanced filtering**
- **Search functionality**
- **Sorting options**

## 🛠️ Troubleshooting

### Images Not Loading
1. **Check file names** match the database records
2. **Verify file location** in `public/images/cars/`
3. **Check file permissions** and format

### Database Issues
1. **Check Supabase connection** in browser console
2. **Verify table structure** matches expected fields
3. **Check admin permissions** for database access

### Performance Issues
1. **Optimize image sizes** (compress if needed)
2. **Check network tab** for slow loading images
3. **Verify lazy loading** is working properly

## 🎯 Next Steps

1. **Add real car photos** to the images folder
2. **Update car information** in the database
3. **Test booking functionality** with real cars
4. **Customize pricing** based on your rates
5. **Add more cars** as your fleet grows

## 📞 Support

If you encounter any issues:
1. **Check browser console** for error messages
2. **Verify Supabase connection** is working
3. **Test with sample data** first
4. **Contact support** if problems persist

---

**Happy renting! 🚗✨**

