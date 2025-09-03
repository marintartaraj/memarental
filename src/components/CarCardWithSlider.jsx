import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Calendar, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InstagramPhotoSlider from './InstagramPhotoSlider';
import { getAvailableCarImages } from '@/lib/addCarsToDatabase';

const CarCardWithSlider = ({ car, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  // Get all available images for this car
  const carImages = useMemo(() => {
    const brandImages = getAvailableCarImages()[car.brand] || [];
    // If no brand-specific images, use the main image
    return brandImages.length > 0 ? brandImages : [car.image_url];
  }, [car.brand, car.image_url]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  const openSlider = () => {
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const openSliderAtIndex = (index) => {
    setCurrentImageIndex(index);
    setIsSliderOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
          {/* Image Section with Slider Controls */}
          <div className="relative overflow-hidden">
            {/* Main Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={carImages[currentImageIndex]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={openSlider}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Click to View Text */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Click to view photos
                </div>
              </div>

              {/* Navigation Arrows (if multiple images) */}
              {carImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {carImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {carImages.length}
                </div>
              )}

              {/* Dots for Multiple Images */}
              {carImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                  {carImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick View Thumbnails */}
            {carImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2 justify-center">
                  {carImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        openSliderAtIndex(idx);
                      }}
                      className="w-12 h-8 rounded border-2 border-white/50 hover:border-white transition-colors overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {carImages.length > 4 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSlider();
                      }}
                      className="w-12 h-8 rounded border-2 border-white/50 hover:border-white transition-colors bg-black/50 text-white text-xs flex items-center justify-center"
                    >
                      +{carImages.length - 4}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card Content */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                  {car.brand} {car.model}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{car.year}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">{car.rating}</span>
                <span className="text-xs text-gray-500">({car.reviews})</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{car.seats} seats</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Fuel className="w-4 h-4" />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-4 h-4">📦</span>
                <span>{car.luggage} bags</span>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">€{car.price}</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Link to={`/cars/${car.id}`}>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  car.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {car.available ? 'Available Now' : 'Currently Booked'}
                </span>
                {car.available && (
                  <Link to={`/booking/${car.id}`}>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                      Book Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Instagram Style Photo Slider Modal */}
      <InstagramPhotoSlider
        images={carImages}
        isOpen={isSliderOpen}
        onClose={closeSlider}
        initialIndex={currentImageIndex}
        showCloseButton={true}
        showNavigation={true}
        showDots={true}
        autoPlay={false}
      />
    </>
  );
};

export default CarCardWithSlider;
