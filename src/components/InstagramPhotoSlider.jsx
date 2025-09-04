import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const InstagramPhotoSlider = ({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0,
  showCloseButton = true,
  showNavigation = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isOpen, autoPlayInterval, images.length]);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Hide/show navbar when modal opens/closes
  useEffect(() => {
    const navbar = document.querySelector('header');
    if (navbar) {
      if (isOpen) {
        navbar.style.display = 'none';
      } else {
        navbar.style.display = '';
      }
    }
    
    // Cleanup function to restore navbar when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    // In framer-motion v10, info.offset.x is available directly
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // Pause auto-play when dragging
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleDragEndWithAutoPlay = (event, info) => {
    handleDragEnd(event, info);
    // Resume auto-play after dragging
    if (autoPlay && isOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close Button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEndWithAutoPlay}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
              disabled={isDragging}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
              disabled={isDragging}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {showDots && images.length > 1 && (
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white/70 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Swipe Hint */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-sm">
          Swipe or use arrow keys to navigate
        </div>
      )}
    </motion.div>
  );
};

export default InstagramPhotoSlider;
