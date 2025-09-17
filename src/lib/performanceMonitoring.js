/**
 * Performance Monitoring Utilities
 * Real-time Core Web Vitals tracking and performance monitoring
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = {
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      FCP: 1800, // First Contentful Paint
      TTFB: 800  // Time to First Byte
    };
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.setupCoreWebVitals();
    this.setupResourceTiming();
    this.setupNavigationTiming();
    this.setupLongTaskDetection();
    this.setupMemoryMonitoring();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  setupCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric('LCP', lastEntry.startTime, {
        element: lastEntry.element?.tagName,
        url: lastEntry.url,
        size: lastEntry.size
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('LCP', observer);
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime, {
          target: entry.target?.tagName,
          eventType: entry.name
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('FID', observer);
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.recordMetric('CLS', clsValue, {
        sources: entries.map(entry => ({
          element: entry.sources?.[0]?.element?.tagName,
          previousRect: entry.sources?.[0]?.previousRect,
          currentRect: entry.sources?.[0]?.currentRect
        }))
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        this.recordMetric('FCP', fcpEntry.startTime, {
          url: fcpEntry.url
        });
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('FCP', observer);
  }

  /**
   * Setup Resource Timing monitoring
   */
  setupResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 1000) { // Log slow resources (>1s)
          this.recordMetric('SLOW_RESOURCE', entry.duration, {
            name: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize,
            url: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('RESOURCE', observer);
  }

  /**
   * Setup Navigation Timing
   */
  setupNavigationTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric('TTFB', entry.responseStart - entry.requestStart, {
          url: entry.name,
          type: entry.type,
          redirectCount: entry.redirectCount
        });
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('NAVIGATION', observer);
  }

  /**
   * Setup Long Task Detection
   */
  setupLongTaskDetection() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric('LONG_TASK', entry.duration, {
          startTime: entry.startTime,
          name: entry.name
        });
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    this.observers.set('LONG_TASK', observer);
  }

  /**
   * Setup Memory Monitoring
   */
  setupMemoryMonitoring() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      this.recordMetric('MEMORY_USAGE', memory.usedJSHeapSize, {
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      });
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata
    };

    this.metrics.set(name, metric);

    // Check against thresholds
    if (this.thresholds[name] && value > this.thresholds[name]) {
      this.reportThresholdExceeded(metric);
    }

    // Send to analytics (if configured)
    this.sendToAnalytics(metric);
  }

  /**
   * Report when threshold is exceeded
   */
  reportThresholdExceeded(metric) {
    console.warn(`Performance threshold exceeded: ${metric.name}`, {
      value: metric.value,
      threshold: this.thresholds[metric.name],
      metadata: metric.metadata
    });

    // Could send to error tracking service
    this.sendToErrorTracking({
      type: 'PERFORMANCE_THRESHOLD_EXCEEDED',
      metric: metric.name,
      value: metric.value,
      threshold: this.thresholds[metric.name],
      url: metric.url,
      timestamp: metric.timestamp
    });
  }

  /**
   * Send metric to analytics
   */
  sendToAnalytics(metric) {
    // Example: Send to Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        page_location: metric.url
      });
    }
  }

  /**
   * Send to error tracking service
   */
  sendToErrorTracking(error) {
    // Example: Send to Sentry, LogRocket, etc.
    console.error('Performance Error:', error);
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metric by name
   */
  getMetric(name) {
    return this.metrics.get(name);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    const summary = {
      coreWebVitals: {},
      performance: {},
      issues: []
    };

    metrics.forEach(metric => {
      if (['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].includes(metric.name)) {
        summary.coreWebVitals[metric.name] = {
          value: metric.value,
          threshold: this.thresholds[metric.name],
          passed: metric.value <= this.thresholds[metric.name]
        };
      } else {
        summary.performance[metric.name] = metric.value;
      }

      if (this.thresholds[metric.name] && metric.value > this.thresholds[metric.name]) {
        summary.issues.push({
          metric: metric.name,
          value: metric.value,
          threshold: this.thresholds[metric.name]
        });
      }
    });

    return summary;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize on import
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}

export default performanceMonitor;
