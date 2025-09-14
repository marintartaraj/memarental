/**
 * Mobile Optimization Service
 * Comprehensive mobile experience optimization
 */

class MobileOptimizationService {
  constructor() {
    this.isMobile = false;
    this.isTablet = false;
    this.isTouchDevice = false;
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.orientation = this.getOrientation();
    this.touchTargets = new Set();
    this.swipeGestures = new Map();
    
    this.setupMobileDetection();
    this.setupTouchOptimizations();
    this.setupResponsiveFeatures();
    this.setupPerformanceOptimizations();
  }

  /**
   * Setup mobile device detection
   */
  setupMobileDetection() {
    // Detect mobile device
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detect tablet
    this.isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    
    // Detect touch device
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Update viewport dimensions
    this.updateViewportDimensions();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateViewportDimensions();
        this.handleOrientationChange();
      }, 100);
    });
    
    // Listen for resize events
    window.addEventListener('resize', () => {
      this.updateViewportDimensions();
    });
  }

  /**
   * Update viewport dimensions
   */
  updateViewportDimensions() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.orientation = this.getOrientation();
  }

  /**
   * Get current orientation
   * @returns {string} - Orientation (portrait/landscape)
   */
  getOrientation() {
    return this.viewportWidth > this.viewportHeight ? 'landscape' : 'portrait';
  }

  /**
   * Handle orientation change
   */
  handleOrientationChange() {
    // Adjust layout for new orientation
    this.adjustLayoutForOrientation();
    
    // Recalculate touch targets
    this.recalculateTouchTargets();
    
    // Update swipe gesture handlers
    this.updateSwipeGestures();
  }

  /**
   * Setup touch optimizations
   */
  setupTouchOptimizations() {
    if (this.isTouchDevice) {
      // Add touch-friendly CSS classes
      document.documentElement.classList.add('touch-device');
      
      // Optimize touch targets
      this.optimizeTouchTargets();
      
      // Setup swipe gestures
      this.setupSwipeGestures();
      
      // Prevent zoom on input focus
      this.preventZoomOnInputFocus();
      
      // Add touch feedback
      this.addTouchFeedback();
    }
  }

  /**
   * Optimize touch targets
   */
  optimizeTouchTargets() {
    const minTouchTargetSize = 44; // 44px minimum touch target size
    
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex]'
    );
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      // Check if element meets minimum touch target size
      if (rect.width < minTouchTargetSize || rect.height < minTouchTargetSize) {
        element.classList.add('touch-target-small');
        
        // Add padding to make touch target larger
        const padding = Math.max(0, (minTouchTargetSize - Math.min(rect.width, rect.height)) / 2);
        element.style.padding = `${padding}px`;
      }
      
      // Add touch-friendly hover states
      element.classList.add('touch-friendly');
      
      this.touchTargets.add(element);
    });
  }

  /**
   * Recalculate touch targets
   */
  recalculateTouchTargets() {
    this.touchTargets.forEach(element => {
      if (document.contains(element)) {
        const rect = element.getBoundingClientRect();
        const minTouchTargetSize = 44;
        
        if (rect.width < minTouchTargetSize || rect.height < minTouchTargetSize) {
          element.classList.add('touch-target-small');
        } else {
          element.classList.remove('touch-target-small');
        }
      }
    });
  }

  /**
   * Setup swipe gestures
   */
  setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 300) {
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.handleSwipe('right', deltaX, deltaTime);
          } else {
            this.handleSwipe('left', deltaX, deltaTime);
          }
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 300) {
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            this.handleSwipe('down', deltaY, deltaTime);
          } else {
            this.handleSwipe('up', deltaY, deltaTime);
          }
        }
      }
    }, { passive: true });
  }

  /**
   * Handle swipe gesture
   * @param {string} direction - Swipe direction
   * @param {number} distance - Swipe distance
   * @param {number} duration - Swipe duration
   */
  handleSwipe(direction, distance, duration) {
    const swipeEvent = new CustomEvent('swipe', {
      detail: { direction, distance, duration }
    });
    
    document.dispatchEvent(swipeEvent);
    
    // Handle specific swipe actions
    if (this.swipeGestures.has(direction)) {
      this.swipeGestures.get(direction)(distance, duration);
    }
  }

  /**
   * Add swipe gesture handler
   * @param {string} direction - Swipe direction
   * @param {Function} handler - Handler function
   */
  addSwipeGesture(direction, handler) {
    this.swipeGestures.set(direction, handler);
  }

  /**
   * Remove swipe gesture handler
   * @param {string} direction - Swipe direction
   */
  removeSwipeGesture(direction) {
    this.swipeGestures.delete(direction);
  }

  /**
   * Prevent zoom on input focus
   */
  preventZoomOnInputFocus() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (this.isMobile) {
          // Set viewport meta tag to prevent zoom
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
          }
        }
      });
      
      input.addEventListener('blur', () => {
        if (this.isMobile) {
          // Restore viewport meta tag
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1');
          }
        }
      });
    });
  }

  /**
   * Add touch feedback
   */
  addTouchFeedback() {
    document.addEventListener('touchstart', (e) => {
      const element = e.target.closest('.touch-friendly');
      if (element) {
        element.classList.add('touch-active');
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const element = e.target.closest('.touch-friendly');
      if (element) {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }
    }, { passive: true });
  }

  /**
   * Setup responsive features
   */
  setupResponsiveFeatures() {
    // Add responsive CSS classes
    this.addResponsiveClasses();
    
    // Setup responsive images
    this.setupResponsiveImages();
    
    // Setup responsive tables
    this.setupResponsiveTables();
    
    // Setup responsive forms
    this.setupResponsiveForms();
  }

  /**
   * Add responsive CSS classes
   */
  addResponsiveClasses() {
    const updateClasses = () => {
      document.documentElement.classList.remove('mobile', 'tablet', 'desktop');
      
      if (this.isMobile && !this.isTablet) {
        document.documentElement.classList.add('mobile');
      } else if (this.isTablet) {
        document.documentElement.classList.add('tablet');
      } else {
        document.documentElement.classList.add('desktop');
      }
      
      // Add orientation class
      document.documentElement.classList.remove('portrait', 'landscape');
      document.documentElement.classList.add(this.orientation);
    };
    
    updateClasses();
    window.addEventListener('resize', updateClasses);
  }

  /**
   * Setup responsive images
   */
  setupResponsiveImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  /**
   * Setup responsive tables
   */
  setupResponsiveTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      if (!table.closest('.table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.overflowX = 'auto';
        wrapper.style.webkitOverflowScrolling = 'touch';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }

  /**
   * Setup responsive forms
   */
  setupResponsiveForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add mobile-friendly form styling
      form.classList.add('mobile-form');
      
      // Optimize form inputs for mobile
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        this.optimizeFormInput(input);
      });
    });
  }

  /**
   * Optimize form input for mobile
   * @param {HTMLElement} input - Input element
   */
  optimizeFormInput(input) {
    // Set appropriate input type for mobile keyboards
    if (input.type === 'text') {
      if (input.name.includes('email')) {
        input.type = 'email';
      } else if (input.name.includes('phone') || input.name.includes('tel')) {
        input.type = 'tel';
      } else if (input.name.includes('url')) {
        input.type = 'url';
      }
    }
    
    // Add mobile-friendly attributes
    if (input.type === 'number') {
      input.setAttribute('inputmode', 'numeric');
    }
    
    // Add autocomplete attributes
    if (input.name.includes('email')) {
      input.setAttribute('autocomplete', 'email');
    } else if (input.name.includes('password')) {
      input.setAttribute('autocomplete', 'current-password');
    }
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
    
    // Reduce animations on low-end devices
    this.optimizeAnimations();
  }

  /**
   * Setup lazy loading
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Optimize scroll performance
   */
  optimizeScrollPerformance() {
    let ticking = false;
    
    const updateScrollPosition = () => {
      // Add scroll-based optimizations here
      ticking = false;
    };
    
    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }

  /**
   * Optimize animations
   */
  optimizeAnimations() {
    // Check if device is low-end
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                          navigator.deviceMemory < 4;
    
    if (isLowEndDevice) {
      document.documentElement.classList.add('reduced-animations');
    }
  }

  /**
   * Adjust layout for orientation
   */
  adjustLayoutForOrientation() {
    // Adjust navigation for orientation
    const nav = document.querySelector('nav');
    if (nav) {
      if (this.orientation === 'landscape' && this.isMobile) {
        nav.classList.add('landscape-nav');
      } else {
        nav.classList.remove('landscape-nav');
      }
    }
    
    // Adjust modal positioning
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      if (this.orientation === 'landscape' && this.isMobile) {
        modal.classList.add('landscape-modal');
      } else {
        modal.classList.remove('landscape-modal');
      }
    });
  }

  /**
   * Update swipe gestures
   */
  updateSwipeGestures() {
    // Update swipe gesture handlers based on orientation
    if (this.orientation === 'landscape') {
      // Enable horizontal swipes for navigation
      this.addSwipeGesture('left', () => {
        // Navigate to next page
        const nextButton = document.querySelector('[aria-label*="next"], .next-button');
        if (nextButton) nextButton.click();
      });
      
      this.addSwipeGesture('right', () => {
        // Navigate to previous page
        const prevButton = document.querySelector('[aria-label*="previous"], .prev-button');
        if (prevButton) prevButton.click();
      });
    } else {
      // Enable vertical swipes for mobile navigation
      this.addSwipeGesture('up', () => {
        // Open mobile menu
        const menuButton = document.querySelector('[aria-label*="menu"], .menu-button');
        if (menuButton) menuButton.click();
      });
    }
  }

  /**
   * Get device information
   * @returns {Object} - Device information
   */
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isTouchDevice: this.isTouchDevice,
      viewportWidth: this.viewportWidth,
      viewportHeight: this.viewportHeight,
      orientation: this.orientation,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory
    };
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} - Whether element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= this.viewportHeight &&
      rect.right <= this.viewportWidth
    );
  }

  /**
   * Scroll element into view
   * @param {HTMLElement} element - Element to scroll to
   * @param {Object} options - Scroll options
   */
  scrollIntoView(element, options = {}) {
    const defaultOptions = {
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
  }
}

// Create singleton instance
export const mobileOptimizationService = new MobileOptimizationService();

// Export for use in components
export default mobileOptimizationService;

