/**
 * OptimizedImage Component
 * Advanced image optimization with modern formats, lazy loading, and responsive images
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/images/cars/placeholder-car.jpg',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc, width, quality) => {
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return originalSrc;
    }

    // For local images, return as-is
    if (originalSrc.startsWith('/')) {
      return originalSrc;
    }

    // For external images, you could implement image optimization service
    // Example: return `${imageOptimizationService}?url=${encodeURIComponent(originalSrc)}&w=${width}&q=${quality}&f=webp`;
    return originalSrc;
  };

  // Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  // Handle image error
  const handleError = (e) => {
    setHasError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    onError?.(e);
  };

  // Generate responsive image sources
  const generateSrcSet = (src, sizes) => {
    if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/')) {
      return undefined;
    }

    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    return breakpoints
      .map(w => `${getOptimizedSrc(src, w, quality)} ${w}w`)
      .join(', ');
  };

  const srcSet = generateSrcSet(imageSrc, sizes);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Skeleton placeholder */}
      {placeholder === 'skeleton' && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}

      {/* Actual image */}
      {(priority || isInView) && (
        <motion.img
          src={getOptimizedSrc(imageSrc, width, quality)}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
