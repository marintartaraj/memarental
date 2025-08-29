import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvailableCarImages } from '@/lib/addCarsToDatabase';

const CarImageSelector = ({ car, onImageChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get available images for this car's brand
  const availableImages = getAvailableCarImages()[car.brand] || [];
  
  if (availableImages.length <= 1) {
    return null; // Don't show selector if only one image
  }

  const handlePrevious = () => {
    const newIndex = currentImageIndex === 0 ? availableImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    onImageChange(availableImages[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex === availableImages.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    onImageChange(availableImages[newIndex]);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm text-gray-600">
        {currentImageIndex + 1} / {availableImages.length}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CarImageSelector;

