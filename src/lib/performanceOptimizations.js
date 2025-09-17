// Performance Optimization Utilities for MEMA Rental

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sources
  generateResponsiveImages: (baseSrc, sizes = [320, 640, 1024, 1280]) => {
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');
    const extension = baseSrc.split('.').pop();
    
    return sizes.map(size => ({
      src: `${baseName}-${size}w.${extension}`,
      width: size,
      descriptor: `${size}w`
    }));
  },

  // Lazy load images with intersection observer
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },

  // Preload critical images
  preloadCriticalImages: (imageUrls) => {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
};

// Bundle optimization utilities
export const bundleOptimization = {
  // Dynamic imports for heavy components
  loadHeavyComponent: async (componentPath) => {
    try {
      const module = await import(componentPath);
      return module.default;
    } catch (error) {
      console.error('Failed to load component:', error);
      return null;
    }
  },

  // Preload routes on hover
  preloadRoute: (routePath) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  },

  // Service worker optimization
  optimizeServiceWorker: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      }).then(registration => {
        console.log('Service Worker registered:', registration);
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }
};

// Memory optimization utilities
export const memoryOptimization = {
  // Clean up event listeners
  cleanupEventListeners: (element, events = []) => {
    events.forEach(event => {
      element.removeEventListener(event.type, event.listener);
    });
  },

  // Debounce function calls
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function calls
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Network optimization utilities
export const networkOptimization = {
  // Request caching
  cacheRequest: async (url, options = {}) => {
    const cacheKey = `cache_${url}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  },

  // Batch API requests
  batchRequests: async (requests) => {
    try {
      const responses = await Promise.all(requests);
      return responses;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  },

  // Retry failed requests
  retryRequest: async (url, options = {}, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};

// Rendering optimization utilities
export const renderingOptimization = {
  // Virtual scrolling for large lists
  virtualScroll: (container, items, itemHeight, renderItem) => {
    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2;
    const scrollTop = container.scrollTop;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItems, items.length);

    return items.slice(startIndex, endIndex).map((item, index) => 
      renderItem(item, startIndex + index)
    );
  },

  // Intersection observer for animations
  observeElements: (selector, callback, options = {}) => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    });

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });

    return observer;
  },

  // Request animation frame optimization
  rafThrottle: (callback) => {
    let rafId;
    return function(...args) {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        callback.apply(this, args);
      });
    };
  }
};

// Performance monitoring utilities
export const performanceMonitoring = {
  // Measure component render time
  measureRenderTime: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },

  // Monitor Core Web Vitals (simplified implementation)
  monitorWebVitals: () => {
    // Basic performance monitoring without web-vitals dependency
    if ('PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  },

  // Track user interactions
  trackUserInteractions: () => {
    const interactions = [];
    
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        interactions.push({
          type: eventType,
          timestamp: performance.now(),
          target: e.target.tagName
        });
      });
    });

    return interactions;
  }
};

// Export all utilities
export default {
  imageOptimization,
  bundleOptimization,
  memoryOptimization,
  networkOptimization,
  renderingOptimization,
  performanceMonitoring
};
