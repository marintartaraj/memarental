/**
 * Performance optimization utilities
 */

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const { width = 800, height = 600, quality = 80, format = 'webp' } = options;
  
  // If using a CDN or image service, add optimization parameters
  if (src.includes('supabase') || src.includes('cdn')) {
    const url = new URL(src);
    url.searchParams.set('width', width);
    url.searchParams.set('height', height);
    url.searchParams.set('quality', quality);
    url.searchParams.set('format', format);
    return url.toString();
  }
  
  return src;
};

// Lazy loading utility
export const lazyLoadImage = (imgElement, src, options = {}) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = optimizeImage(src, options);
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
          observer.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  observer.observe(imgElement);
};

// Debounce utility for search and filters
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/images/hero-bg.jpg',
    '/images/logo.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`);
  }
  
  return result;
};

// Memory cleanup utility
export const cleanupMemory = () => {
  // Clear unused caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old-') || name.includes('temp-')) {
          caches.delete(name);
        }
      });
    });
  }
  
  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
};

// Bundle size optimization
export const loadChunk = (importFunction) => {
  return importFunction().catch(error => {
    console.error('Failed to load chunk:', error);
    // Fallback or retry logic
    return importFunction();
  });
};
