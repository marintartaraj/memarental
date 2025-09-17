import React from 'react';
import { motion } from 'framer-motion';

// Base skeleton component
const SkeletonBase = ({ className = '', children, ...props }) => (
  <motion.div
    className={`bg-gray-200 rounded ${className}`}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Car card skeleton
export const CarCardSkeleton = () => (
  <div className="group">
    <div className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
      {/* Image skeleton */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
        <SkeletonBase className="w-full h-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <SkeletonBase className="h-6 w-3/4 mb-2" />
            <SkeletonBase className="h-4 w-1/2" />
          </div>
          <SkeletonBase className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Features skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <SkeletonBase className="h-4 w-16" />
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-4 w-12" />
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <SkeletonBase className="h-8 w-24 mb-1" />
            <SkeletonBase className="h-4 w-16" />
          </div>
          <SkeletonBase className="h-10 w-32 rounded" />
        </div>
        
        {/* Availability skeleton */}
        <SkeletonBase className="h-4 w-32" />
      </div>
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <SkeletonBase className="h-16 w-full" />
      </motion.div>
    ))}
  </div>
);

// Text skeleton
export const TextSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

// Button skeleton
export const ButtonSkeleton = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };
  
  return (
    <SkeletonBase className={`${sizeClasses[size]} ${className}`} />
  );
};

// Card skeleton
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg border p-6 ${className}`}>
    <div className="space-y-4">
      <SkeletonBase className="h-6 w-1/2" />
      <TextSkeleton lines={3} />
      <div className="flex gap-2">
        <ButtonSkeleton size="sm" />
        <ButtonSkeleton size="sm" />
      </div>
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
    {/* Header */}
    <div className="border-b bg-gray-50 p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBase key={index} className="h-4 w-20" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonBase key={colIndex} className="h-4 w-16" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Image skeleton
export const ImageSkeleton = ({ aspectRatio = '16/9', className = '' }) => (
  <div 
    className={`bg-gray-200 rounded ${className}`}
    style={{ aspectRatio }}
  >
    <SkeletonBase className="w-full h-full" />
  </div>
);

// Form skeleton
export const FormSkeleton = ({ fields = 4, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-10 w-full" />
      </div>
    ))}
    <div className="flex gap-4">
      <ButtonSkeleton size="md" />
      <ButtonSkeleton size="md" />
    </div>
  </div>
);

// Page skeleton
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <SkeletonBase className="h-8 w-32" />
          <div className="flex gap-4">
            <SkeletonBase className="h-8 w-20" />
            <SkeletonBase className="h-8 w-20" />
            <SkeletonBase className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <SkeletonBase className="h-12 w-96 mx-auto" />
          <SkeletonBase className="h-6 w-64 mx-auto" />
          <div className="flex justify-center gap-4">
            <ButtonSkeleton size="lg" />
            <ButtonSkeleton size="lg" />
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Loading states
export const LoadingStates = {
  // Spinner
  Spinner: ({ size = 'md', className = '' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    
    return (
      <motion.div
        className={`border-2 border-gray-300 border-t-yellow-500 rounded-full ${sizeClasses[size]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  },
  
  // Dots
  Dots: ({ className = '' }) => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-yellow-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  ),
  
  // Pulse
  Pulse: ({ className = '' }) => (
    <motion.div
      className={`bg-yellow-500 rounded ${className}`}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
};

export default {
  CarCardSkeleton,
  ListSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  TableSkeleton,
  ImageSkeleton,
  FormSkeleton,
  PageSkeleton,
  LoadingStates
};
