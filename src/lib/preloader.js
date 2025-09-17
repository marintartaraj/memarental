/**
 * Advanced Preloading System
 * Intelligent resource preloading for better performance
 */

class Preloader {
  constructor() {
    this.preloadedResources = new Set();
    this.preloadQueue = [];
    this.isProcessing = false;
    this.connectionSpeed = this.detectConnectionSpeed();
    this.userPreferences = this.detectUserPreferences();
  }

  /**
   * Detect connection speed
   */
  detectConnectionSpeed() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return { effectiveType: '4g', downlink: 10, rtt: 50, saveData: false };
  }

  /**
   * Detect user preferences
   */
  detectUserPreferences() {
    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
      prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    };
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources() {
    const criticalResources = [
      // Critical fonts (only if they exist)
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      // Critical images (only if they exist)
      { href: '/images/logo.svg', as: 'image' },
      { href: '/images/hero-bg.webp', as: 'image' }
    ];

    for (const resource of criticalResources) {
      const result = await this.preloadResource(resource);
      if (result) {
        console.log(`Preloaded: ${resource.href}`);
      }
    }
  }

  /**
   * Preload route resources based on user behavior
   */
  async preloadRouteResources(route) {
    const routeResources = {
      '/cars': [
        { href: '/images/cars/placeholder-car.jpg', as: 'image' }
      ],
      '/booking': [
        // Only preload resources that actually exist
      ],
      '/admin': [
        // Only preload resources that actually exist
      ]
    };

    const resources = routeResources[route] || [];
    
    for (const resource of resources) {
      const result = await this.preloadResource(resource);
      if (result) {
        console.log(`Preloaded route resource: ${resource.href}`);
      }
    }
  }

  /**
   * Preload images based on viewport and user interaction
   */
  async preloadImages(images, options = {}) {
    const {
      priority = 'low',
      maxConcurrent = 3,
      delay = 0
    } = options;

    // Respect user preferences
    if (this.userPreferences.prefersReducedData || this.connectionSpeed.saveData) {
      return;
    }

    // Adjust based on connection speed
    const adjustedMaxConcurrent = this.connectionSpeed.effectiveType === 'slow-2g' ? 1 : maxConcurrent;

    const imagePromises = images.map((image, index) => 
      this.preloadImageWithDelay(image, delay + (index * 100))
    );

    // Process in batches
    for (let i = 0; i < imagePromises.length; i += adjustedMaxConcurrent) {
      const batch = imagePromises.slice(i, i + adjustedMaxConcurrent);
      await Promise.allSettled(batch);
    }
  }

  /**
   * Preload image with delay
   */
  preloadImageWithDelay(src, delay = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
        img.src = src;
      }, delay);
    });
  }

  /**
   * Preload resource with link preload
   */
  async preloadResource(resource) {
    if (this.preloadedResources.has(resource.href)) {
      return;
    }

    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      if (resource.media) link.media = resource.media;

      link.onload = () => {
        this.preloadedResources.add(resource.href);
        resolve(resource);
      };
      
      link.onerror = () => {
        // Silently handle 404 errors for non-existent resources
        // Don't reject the promise to avoid unhandled promise rejections
        console.warn(`Resource not found (404): ${resource.href}`);
        resolve(null);
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Preload JavaScript modules
   */
  async preloadModules(modules) {
    const modulePromises = modules.map(module => {
      return import(module).catch(error => {
        console.warn(`Failed to preload module: ${module}`, error);
      });
    });

    await Promise.allSettled(modulePromises);
  }

  /**
   * Preload API data
   */
  async preloadAPIData(endpoints) {
    const apiPromises = endpoints.map(endpoint => {
      return fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=300' // 5 minutes cache
        }
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`API preload failed: ${endpoint}`);
      }).catch(error => {
        console.warn(`Failed to preload API data: ${endpoint}`, error);
      });
    });

    await Promise.allSettled(apiPromises);
  }

  /**
   * Intelligent preloading based on user behavior
   */
  setupIntelligentPreloading() {
    // Preload on hover
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        const route = new URL(link.href).pathname;
        this.preloadRouteResources(route);
      }
    });

    // Preload on focus (keyboard navigation)
    document.addEventListener('focusin', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        const route = new URL(link.href).pathname;
        this.preloadRouteResources(route);
      }
    });

    // Preload on scroll (lazy preloading)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.preloadVisibleImages();
      }, 100);
    });
  }

  /**
   * Preload images that are about to become visible
   */
  preloadVisibleImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px' // Start preloading 100px before image comes into view
    });

    images.forEach(img => observer.observe(img));
  }

  /**
   * Preload based on time of day and user patterns
   */
  async preloadBasedOnPatterns() {
    const hour = new Date().getHours();
    
    // Preload different resources based on time
    if (hour >= 9 && hour <= 17) {
      // Business hours - preload admin resources
      await this.preloadRouteResources('/admin');
    } else {
      // After hours - preload client resources
      await this.preloadRouteResources('/cars');
    }
  }

  /**
   * Initialize preloader
   */
  init() {
    // Preload critical resources immediately
    this.preloadCriticalResources();

    // Setup intelligent preloading
    this.setupIntelligentPreloading();

    // Preload based on patterns
    this.preloadBasedOnPatterns();

    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.connectionSpeed = this.detectConnectionSpeed();
      });
    }
  }

  /**
   * Get preloading statistics
   */
  getStats() {
    return {
      preloadedResources: this.preloadedResources.size,
      connectionSpeed: this.connectionSpeed,
      userPreferences: this.userPreferences
    };
  }
}

// Create singleton instance
export const preloader = new Preloader();

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => preloader.init());
  } else {
    preloader.init();
  }
}

export default preloader;
