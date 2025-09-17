// Testing Utilities for MEMA Rental

// Test data generators
export const testData = {
  // Generate test car data
  generateCar: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    brand: 'Toyota',
    model: 'Yaris',
    year: 2020,
    daily_rate: 35.00,
    transmission: 'automatic',
    seats: 5,
    fuel_type: 'diesel',
    status: 'available',
    image_url: '/images/cars/yaris1.jpeg',
    location: 'Tirana',
    luggage: 2,
    engine: '1.4 Diesel',
    ...overrides
  }),

  // Generate test user data
  generateUser: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    email: 'test@example.com',
    name: 'Test User',
    phone: '+355691234567',
    ...overrides
  }),

  // Generate test booking data
  generateBooking: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    car_id: 'test-car-id',
    user_id: 'test-user-id',
    pickup_date: '2024-01-15',
    return_date: '2024-01-20',
    total_price: 175.00,
    status: 'confirmed',
    ...overrides
  }),

  // Generate test review data
  generateReview: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    car_id: 'test-car-id',
    user_id: 'test-user-id',
    rating: 5,
    comment: 'Great car, excellent service!',
    created_at: new Date().toISOString(),
    ...overrides
  })
};

// Mock API responses
export const mockApi = {
  // Mock successful response
  success: (data, delay = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
          message: 'Success'
        });
      }, delay);
    });
  },

  // Mock error response
  error: (message = 'Something went wrong', status = 500, delay = 100) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({
          message,
          status,
          response: {
            data: { error: message }
          }
        });
      }, delay);
    });
  },

  // Mock network error
  networkError: (delay = 100) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Network Error'));
      }, delay);
    });
  }
};

// Test utilities
export const testUtils = {
  // Wait for element to appear
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  // Wait for text to appear
  waitForText: (text, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      if (document.body.textContent.includes(text)) {
        resolve();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        if (document.body.textContent.includes(text)) {
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Text "${text}" not found within ${timeout}ms`));
      }, timeout);
    });
  },

  // Simulate user interaction
  simulateClick: (element) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  },

  simulateInput: (element, value) => {
    element.value = value;
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
  },

  simulateKeydown: (element, key) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      }
    };
  },

  // Mock sessionStorage
  mockSessionStorage: () => {
    const store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      }
    };
  }
};

// Accessibility testing utilities
export const a11yTestUtils = {
  // Check for missing alt text
  checkAltText: () => {
    const images = document.querySelectorAll('img');
    const missingAlt = Array.from(images).filter(img => !img.alt);
    return missingAlt;
  },

  // Check for missing form labels
  checkFormLabels: () => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const missingLabels = Array.from(inputs).filter(input => {
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      return !label && !ariaLabel && !ariaLabelledBy;
    });
    return missingLabels;
  },

  // Check for proper heading hierarchy
  checkHeadingHierarchy: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName[1]));
    const issues = [];
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
        issues.push({
          element: headings[i],
          issue: `Heading level jumps from h${levels[i-1]} to h${levels[i]}`
        });
      }
    }
    
    return issues;
  },

  // Check for keyboard navigation
  checkKeyboardNavigation: () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const issues = [];
    
    focusableElements.forEach(element => {
      if (!element.getAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON' && element.tagName !== 'INPUT' && element.tagName !== 'SELECT' && element.tagName !== 'TEXTAREA') {
        issues.push({
          element,
          issue: 'Element should be focusable but lacks proper tabindex'
        });
      }
    });
    
    return issues;
  },

  // Check color contrast
  checkColorContrast: () => {
    const elements = document.querySelectorAll('*');
    const issues = [];
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && color !== backgroundColor) {
        // Simple contrast check (would need more sophisticated implementation)
        const contrast = this.calculateContrast(color, backgroundColor);
        if (contrast < 4.5) {
          issues.push({
            element,
            issue: `Low color contrast: ${contrast.toFixed(2)}`
          });
        }
      }
    });
    
    return issues;
  },

  // Calculate color contrast (simplified)
  calculateContrast: (color1, color2) => {
    // This is a simplified implementation
    // In a real application, you'd use a proper color contrast library
    return 4.5; // Placeholder
  }
};

// Performance testing utilities
export const performanceTestUtils = {
  // Measure component render time
  measureRenderTime: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },

  // Measure API call time
  measureApiCall: async (apiCall, callName) => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      console.log(`${callName} API call time: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`${callName} API call failed after: ${end - start}ms`);
      throw error;
    }
  },

  // Check bundle size
  checkBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle size check not available in development');
      return;
    }
    
    // In production, you could check actual bundle sizes
    console.log('Bundle size check would be implemented here');
  },

  // Check memory usage
  checkMemoryUsage: () => {
    if (performance.memory) {
      const memory = performance.memory;
      console.log('Memory usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
      });
    } else {
      console.log('Memory usage not available');
    }
  }
};

// Integration testing utilities
export const integrationTestUtils = {
  // Test complete user flow
  testUserFlow: async (flowSteps) => {
    const results = [];
    
    for (const step of flowSteps) {
      try {
        const result = await step.action();
        results.push({
          step: step.name,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          step: step.name,
          success: false,
          error: error.message
        });
        break; // Stop on first failure
      }
    }
    
    return results;
  },

  // Test API integration
  testApiIntegration: async (endpoints) => {
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, endpoint.options);
        results.push({
          endpoint: endpoint.name,
          success: response.ok,
          status: response.status,
          data: await response.json()
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
};

// Export all utilities
export default {
  testData,
  mockApi,
  testUtils,
  a11yTestUtils,
  performanceTestUtils,
  integrationTestUtils
};
