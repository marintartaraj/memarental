/**
 * Performance Error Tracking
 * Track performance-related errors and issues
 */

class PerformanceErrorTracking {
  constructor() {
    this.performanceErrors = [];
    this.thresholds = {
      LCP: 4000,      // Largest Contentful Paint (ms)
      FID: 300,       // First Input Delay (ms)
      CLS: 0.25,      // Cumulative Layout Shift
      FCP: 3000,      // First Contentful Paint (ms)
      TTFB: 1500,     // Time to First Byte (ms)
      resourceLoad: 5000,  // Resource load time (ms)
      longTask: 50,   // Long task duration (ms)
      memoryUsage: 80 // Memory usage percentage
    };
    
    this.isEnabled = true;
  }

  /**
   * Initialize performance error tracking
   */
  init() {
    if (typeof window === 'undefined') return;

    this.setupCoreWebVitalsTracking();
    this.setupResourceErrorTracking();
    this.setupLongTaskTracking();
    this.setupMemoryErrorTracking();
    this.setupNetworkErrorTracking();
  }

  /**
   * Setup Core Web Vitals tracking
   */
  setupCoreWebVitalsTracking() {
    if (!('PerformanceObserver' in window)) return;

    // Track LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry.startTime > this.thresholds.LCP) {
        this.trackPerformanceError({
          type: 'slow_lcp',
          metric: 'LCP',
          value: lastEntry.startTime,
          threshold: this.thresholds.LCP,
          severity: this.getSeverity(lastEntry.startTime, this.thresholds.LCP),
          element: lastEntry.element?.tagName,
          url: lastEntry.url,
          size: lastEntry.size
        });
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Track FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        
        if (fid > this.thresholds.FID) {
          this.trackPerformanceError({
            type: 'slow_fid',
            metric: 'FID',
            value: fid,
            threshold: this.thresholds.FID,
            severity: this.getSeverity(fid, this.thresholds.FID),
            target: entry.target?.tagName,
            eventType: entry.name
          });
        }
      });
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // Track CLS
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.value > this.thresholds.CLS) {
          this.trackPerformanceError({
            type: 'high_cls',
            metric: 'CLS',
            value: entry.value,
            threshold: this.thresholds.CLS,
            severity: this.getSeverity(entry.value, this.thresholds.CLS),
            sources: entry.sources?.map(source => ({
              element: source.element?.tagName,
              previousRect: source.previousRect,
              currentRect: source.currentRect
            }))
          });
        }
      });
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Track FCP
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry && fcpEntry.startTime > this.thresholds.FCP) {
        this.trackPerformanceError({
          type: 'slow_fcp',
          metric: 'FCP',
          value: fcpEntry.startTime,
          threshold: this.thresholds.FCP,
          severity: this.getSeverity(fcpEntry.startTime, this.thresholds.FCP),
          url: fcpEntry.url
        });
      }
    });

    fcpObserver.observe({ entryTypes: ['paint'] });
  }

  /**
   * Setup resource error tracking
   */
  setupResourceErrorTracking() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Track slow resources
        if (entry.duration > this.thresholds.resourceLoad) {
          this.trackPerformanceError({
            type: 'slow_resource',
            metric: 'Resource Load Time',
            value: entry.duration,
            threshold: this.thresholds.resourceLoad,
            severity: this.getSeverity(entry.duration, this.thresholds.resourceLoad),
            name: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize,
            url: entry.name
          });
        }

        // Track large resources
        if (entry.transferSize > 1000000) { // 1MB
          this.trackPerformanceError({
            type: 'large_resource',
            metric: 'Resource Size',
            value: entry.transferSize,
            threshold: 1000000,
            severity: this.getSeverity(entry.transferSize, 1000000),
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration,
            url: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Setup long task tracking
   */
  setupLongTaskTracking() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > this.thresholds.longTask) {
          this.trackPerformanceError({
            type: 'long_task',
            metric: 'Task Duration',
            value: entry.duration,
            threshold: this.thresholds.longTask,
            severity: this.getSeverity(entry.duration, this.thresholds.longTask),
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  /**
   * Setup memory error tracking
   */
  setupMemoryErrorTracking() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > this.thresholds.memoryUsage) {
        this.trackPerformanceError({
          type: 'high_memory_usage',
          metric: 'Memory Usage',
          value: usagePercent,
          threshold: this.thresholds.memoryUsage,
          severity: this.getSeverity(usagePercent, this.thresholds.memoryUsage),
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  /**
   * Setup network error tracking
   */
  setupNetworkErrorTracking() {
    // Track network connectivity
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.trackPerformanceError({
          type: 'slow_connection',
          metric: 'Network Speed',
          value: connection.effectiveType,
          threshold: '3g',
          severity: 'medium',
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      }
    }

    // Track offline/online events
    window.addEventListener('offline', () => {
      this.trackPerformanceError({
        type: 'network_offline',
        metric: 'Network Status',
        value: 'offline',
        threshold: 'online',
        severity: 'high'
      });
    });

    window.addEventListener('online', () => {
      this.trackPerformanceError({
        type: 'network_online',
        metric: 'Network Status',
        value: 'online',
        threshold: 'online',
        severity: 'low'
      });
    });
  }

  /**
   * Track performance error
   */
  trackPerformanceError(errorData) {
    const error = {
      id: this.generateErrorId(),
      ...errorData,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.performanceErrors.push(error);
    this.sendToAnalytics(error);
    this.storeError(error);
  }

  /**
   * Get severity level
   */
  getSeverity(value, threshold) {
    const ratio = value / threshold;
    if (ratio >= 2) return 'critical';
    if (ratio >= 1.5) return 'high';
    if (ratio >= 1.2) return 'medium';
    return 'low';
  }

  /**
   * Generate error ID
   */
  generateErrorId() {
    return `perf_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send to analytics
   */
  sendToAnalytics(error) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_error', {
        event_category: 'performance',
        event_label: error.type,
        value: Math.round(error.value),
        custom_parameter_1: error.metric,
        custom_parameter_2: error.severity
      });
    }
  }

  /**
   * Store error
   */
  storeError(error) {
    const storedErrors = JSON.parse(localStorage.getItem('performance_errors') || '[]');
    storedErrors.push(error);
    
    // Keep only recent errors
    const recentErrors = storedErrors.slice(-100);
    localStorage.setItem('performance_errors', JSON.stringify(recentErrors));
  }

  /**
   * Get performance error analytics
   */
  getPerformanceErrorAnalytics() {
    const analytics = {
      totalErrors: this.performanceErrors.length,
      errorsByType: this.getErrorsByType(),
      errorsBySeverity: this.getErrorsBySeverity(),
      recentErrors: this.getRecentErrors(),
      errorTrends: this.getErrorTrends(),
      topErrors: this.getTopErrors()
    };

    return analytics;
  }

  /**
   * Get errors by type
   */
  getErrorsByType() {
    const typeCounts = {};
    this.performanceErrors.forEach(error => {
      typeCounts[error.type] = (typeCounts[error.type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / this.performanceErrors.length) * 100
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity() {
    const severityCounts = {};
    this.performanceErrors.forEach(error => {
      severityCounts[error.severity] = (severityCounts[error.severity] || 0) + 1;
    });

    return severityCounts;
  }

  /**
   * Get recent errors
   */
  getRecentErrors() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return this.performanceErrors.filter(error => error.timestamp > oneDayAgo);
  }

  /**
   * Get error trends
   */
  getErrorTrends() {
    const trends = {};
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    this.performanceErrors.filter(error => error.timestamp > oneWeekAgo).forEach(error => {
      const date = new Date(error.timestamp).toDateString();
      trends[date] = (trends[date] || 0) + 1;
    });

    return trends;
  }

  /**
   * Get top errors
   */
  getTopErrors() {
    const errorMessages = {};
    
    this.performanceErrors.forEach(error => {
      const message = `${error.type}: ${error.metric}`;
      errorMessages[message] = (errorMessages[message] || 0) + 1;
    });

    return Object.entries(errorMessages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));
  }

  /**
   * Get performance error summary
   */
  getPerformanceErrorSummary() {
    const analytics = this.getPerformanceErrorAnalytics();
    const summary = {
      totalErrors: analytics.totalErrors,
      criticalErrors: analytics.errorsBySeverity.critical || 0,
      highErrors: analytics.errorsBySeverity.high || 0,
      recentErrors: analytics.recentErrors.length,
      topErrorType: analytics.errorsByType[0]?.type || 'none',
      errorRate: this.calculateErrorRate()
    };

    return summary;
  }

  /**
   * Calculate error rate
   */
  calculateErrorRate() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentErrors = this.performanceErrors.filter(error => error.timestamp > oneHourAgo);
    return recentErrors.length;
  }

  /**
   * Export performance error data
   */
  exportPerformanceErrorData() {
    return {
      errors: this.performanceErrors,
      analytics: this.getPerformanceErrorAnalytics(),
      summary: this.getPerformanceErrorSummary(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear performance error data
   */
  clearPerformanceErrorData() {
    this.performanceErrors = [];
    localStorage.removeItem('performance_errors');
  }

  /**
   * Update thresholds
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return { ...this.thresholds };
  }
}

// Create singleton instance
export const performanceErrorTracking = new PerformanceErrorTracking();

// Initialize on import
if (typeof window !== 'undefined') {
  performanceErrorTracking.init();
}

export default performanceErrorTracking;
