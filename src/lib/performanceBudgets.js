/**
 * Performance Budgets Configuration
 * Define performance thresholds and budgets for monitoring
 */

export const performanceBudgets = {
  // Core Web Vitals thresholds (in milliseconds)
  coreWebVitals: {
    LCP: 2500,    // Largest Contentful Paint - Good: ≤2.5s, Needs Improvement: ≤4s, Poor: >4s
    FID: 100,      // First Input Delay - Good: ≤100ms, Needs Improvement: ≤300ms, Poor: >300ms
    CLS: 0.1,      // Cumulative Layout Shift - Good: ≤0.1, Needs Improvement: ≤0.25, Poor: >0.25
    FCP: 1800,     // First Contentful Paint - Good: ≤1.8s, Needs Improvement: ≤3s, Poor: >3s
    TTFB: 800      // Time to First Byte - Good: ≤800ms, Needs Improvement: ≤1.8s, Poor: >1.8s
  },

  // Bundle size budgets (in KB)
  bundleSize: {
    total: 500,        // Total JavaScript bundle
    vendor: 200,        // Vendor libraries
    app: 150,          // Application code
    css: 50,           // CSS files
    images: 1000,      // Images
    fonts: 100,        // Fonts
    perRoute: 100      // Per-route bundle
  },

  // Resource loading budgets
  resourceLoading: {
    maxResourceSize: 1000,     // Max individual resource size (KB)
    maxResourceCount: 50,      // Max number of resources per page
    maxResourceDuration: 3000, // Max resource loading time (ms)
    maxImageSize: 500,         // Max image size (KB)
    maxFontSize: 100           // Max font size (KB)
  },

  // Memory usage budgets
  memory: {
    maxMemoryUsage: 80,        // Max memory usage percentage
    maxMemoryLeak: 10,         // Max memory increase per minute (MB)
    maxHeapSize: 100           // Max heap size (MB)
  },

  // Network budgets
  network: {
    maxTotalSize: 2000,        // Max total page size (KB)
    maxRequests: 30,           // Max number of requests
    maxConcurrentRequests: 6,   // Max concurrent requests
    maxLatency: 2000           // Max network latency (ms)
  },

  // Performance score budgets
  performanceScore: {
    lighthouse: 90,             // Lighthouse performance score
    pageSpeed: 85,             // PageSpeed Insights score
    webPageTest: 80            // WebPageTest score
  }
};

/**
 * Get budget for a specific metric
 */
export const getBudget = (category, metric) => {
  return performanceBudgets[category]?.[metric];
};

/**
 * Check if value exceeds budget
 */
export const exceedsBudget = (category, metric, value) => {
  const budget = getBudget(category, metric);
  return budget ? value > budget : false;
};

/**
 * Get budget status (good, warning, critical)
 */
export const getBudgetStatus = (category, metric, value) => {
  const budget = getBudget(category, metric);
  if (!budget) return 'unknown';

  const ratio = value / budget;
  if (ratio <= 1) return 'good';
  if (ratio <= 1.5) return 'warning';
  return 'critical';
};

/**
 * Get budget recommendations
 */
export const getBudgetRecommendations = (category, metric, value) => {
  const budget = getBudget(category, metric);
  if (!budget) return [];

  const recommendations = [];
  const ratio = value / budget;

  if (ratio > 1) {
    switch (category) {
      case 'coreWebVitals':
        recommendations.push(`Optimize ${metric} performance`);
        if (metric === 'LCP') {
          recommendations.push('Optimize images and critical resources');
          recommendations.push('Implement resource preloading');
        } else if (metric === 'FID') {
          recommendations.push('Reduce JavaScript execution time');
          recommendations.push('Implement code splitting');
        } else if (metric === 'CLS') {
          recommendations.push('Add size attributes to images');
          recommendations.push('Avoid dynamic content insertion');
        }
        break;
      case 'bundleSize':
        recommendations.push(`Reduce ${metric} bundle size`);
        if (metric === 'total' || metric === 'app') {
          recommendations.push('Implement tree shaking');
          recommendations.push('Remove unused code');
          recommendations.push('Use dynamic imports');
        } else if (metric === 'vendor') {
          recommendations.push('Audit vendor dependencies');
          recommendations.push('Consider lighter alternatives');
        } else if (metric === 'images') {
          recommendations.push('Optimize images (WebP, compression)');
          recommendations.push('Implement lazy loading');
        }
        break;
      case 'resourceLoading':
        recommendations.push(`Optimize ${metric} loading`);
        if (metric === 'maxResourceSize') {
          recommendations.push('Compress resources');
          recommendations.push('Use CDN for large assets');
        } else if (metric === 'maxResourceCount') {
          recommendations.push('Bundle resources together');
          recommendations.push('Remove unused resources');
        }
        break;
    }
  }

  return recommendations;
};

/**
 * Get all budget violations
 */
export const getBudgetViolations = (metrics) => {
  const violations = [];

  Object.entries(metrics).forEach(([category, categoryMetrics]) => {
    Object.entries(categoryMetrics).forEach(([metric, value]) => {
      if (exceedsBudget(category, metric, value)) {
        violations.push({
          category,
          metric,
          value,
          budget: getBudget(category, metric),
          status: getBudgetStatus(category, metric, value),
          recommendations: getBudgetRecommendations(category, metric, value)
        });
      }
    });
  });

  return violations;
};

/**
 * Performance budget configuration for different environments
 */
export const environmentBudgets = {
  development: {
    ...performanceBudgets,
    coreWebVitals: {
      ...performanceBudgets.coreWebVitals,
      LCP: 4000,  // More lenient in development
      FCP: 3000
    }
  },
  production: performanceBudgets,
  staging: {
    ...performanceBudgets,
    coreWebVitals: {
      ...performanceBudgets.coreWebVitals,
      LCP: 3000,  // Stricter than development
      FCP: 2000
    }
  }
};

/**
 * Get budgets for current environment
 */
export const getEnvironmentBudgets = () => {
  const env = process.env.NODE_ENV || 'development';
  return environmentBudgets[env] || environmentBudgets.development;
};

export default performanceBudgets;
