import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import CarCardWithSlider from './CarCardWithSlider';

const VirtualizedCarList = ({ 
  cars, 
  selectedDates, 
  isLoading = false,
  className = '' 
}) => {
  const [visibleCount, setVisibleCount] = useState(20); // Start with 20 items
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Calculate how many items to show based on screen size
  useEffect(() => {
    const calculateVisibleCount = () => {
      const screenHeight = window.innerHeight;
      const itemsPerRow = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      const itemHeight = 400; // Approximate height of each car card
      const rowsVisible = Math.ceil(screenHeight / itemHeight) + 2; // +2 for buffer
      const totalItems = rowsVisible * itemsPerRow;
      
      setVisibleCount(Math.min(totalItems, cars.length));
    };

    calculateVisibleCount();
    window.addEventListener('resize', calculateVisibleCount);
    return () => window.removeEventListener('resize', calculateVisibleCount);
  }, [cars.length]);

  // Load more items when scrolling near bottom
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200; // 200px threshold
    
    if (isNearBottom && visibleCount < cars.length && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, cars.length));
        setIsLoadingMore(false);
      }, 300);
    }
  }, [visibleCount, cars.length, isLoadingMore]);

  // Get visible cars
  const visibleCars = useMemo(() => {
    return cars.slice(0, visibleCount);
  }, [cars, visibleCount]);

  // Memoize the list to prevent unnecessary re-renders
  const MemoizedList = useMemo(() => {
    if (cars.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🚗</div>
            <p>No cars found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <motion.div
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 }
          }}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8"
          onScroll={handleScroll}
        >
          {visibleCars.map((car, index) => (
            <CarCardWithSlider
              key={car.id}
              car={car}
              index={index}
              selectedDates={selectedDates}
              isLoading={isLoading}
            />
          ))}
        </motion.div>
        
        {/* Loading more indicator */}
        {visibleCount < cars.length && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
              <span>Loading more cars...</span>
            </div>
          </div>
        )}
        
        {/* Show remaining count */}
        {visibleCount < cars.length && (
          <div className="text-center text-sm text-gray-500">
            Showing {visibleCount} of {cars.length} cars
          </div>
        )}
      </div>
    );
  }, [cars.length, visibleCars, selectedDates, isLoading, handleScroll, visibleCount]);

  return (
    <div className={`virtual-car-list ${className}`}>
      {MemoizedList}
    </div>
  );
};

export default VirtualizedCarList;
