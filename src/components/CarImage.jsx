import React, { useState } from 'react';
import { Car } from 'lucide-react';

const CarImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/images/cars/placeholder-car.jpg",
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <Car className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">{alt}</p>
          <p className="text-xs text-gray-400 mt-1">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {/* Main image */}
      <img
        src={src || fallbackSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        {...props}
      />
    </div>
  );
};

export default CarImage;

