import React from 'react';
import { motion } from 'framer-motion';

// Linear progress bar
export const LinearProgress = ({ 
  progress = 0, 
  height = 4, 
  color = 'bg-yellow-500',
  backgroundColor = 'bg-gray-200',
  className = '',
  animated = true,
  showPercentage = false
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`w-full ${backgroundColor} rounded-full overflow-hidden`}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

// Circular progress indicator
export const CircularProgress = ({ 
  progress = 0, 
  size = 40, 
  strokeWidth = 4,
  color = '#eab308',
  backgroundColor = '#e5e7eb',
  className = '',
  animated = true,
  showPercentage = false,
  children
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-xs font-medium text-gray-700">
            {Math.round(clampedProgress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

// Step progress indicator
export const StepProgress = ({ 
  steps = [], 
  currentStep = 0, 
  className = '',
  orientation = 'horizontal' // 'horizontal' or 'vertical'
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`${isHorizontal ? 'flex items-center' : 'flex flex-col'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step */}
            <div className={`flex items-center ${isHorizontal ? 'flex-col' : 'flex-row'}`}>
              {/* Step circle */}
              <motion.div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isCompleted ? 'bg-yellow-500 border-yellow-500 text-white' : ''}
                  ${isCurrent ? 'bg-white border-yellow-500 text-yellow-500' : ''}
                  ${isUpcoming ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <motion.svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>
              
              {/* Step label */}
              <div className={`${isHorizontal ? 'mt-2 text-center' : 'ml-3'} min-w-0`}>
                <p className={`text-sm font-medium ${isCurrent ? 'text-yellow-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`
                  ${isHorizontal ? 'w-16 h-0.5 mx-2' : 'w-0.5 h-8 mx-4'}
                  ${isCompleted ? 'bg-yellow-500' : 'bg-gray-300'}
                `}
                initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
                animate={{ scaleX: 1, scaleY: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Loading spinner
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'text-yellow-500',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${color} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
};

// Pulse loader
export const PulseLoader = ({ 
  size = 'md', 
  color = 'bg-yellow-500',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${color} rounded-full`}
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
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animated = true
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 rounded"
          animate={animated ? {
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1
          }}
          style={{
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

export default {
  LinearProgress,
  CircularProgress,
  StepProgress,
  LoadingSpinner,
  PulseLoader,
  SkeletonLoader
};
