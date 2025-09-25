/**
 * Monitoring Service
 * Comprehensive error monitoring and performance tracking
 */

class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.errors = [];
    this.performance = [];
    this.maxErrors = 100;
    this.maxPerformanceEntries = 100;
    this.isEnabled = true;
    
    this.setupPerformanceObserver();
    this.setupErrorHandlers();
    this.setupUnhandledRejectionHandler();
  }

  /**
   * Setup Performance Observer
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        // Observe navigation timing
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.recordPerformanceMetric('navigation', entry);
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });

        // Observe resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.recordPerformanceMetric('resource', entry);
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });

        // Observe long tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.recordPerformanceMetric('longtask', entry);
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  /**
   * Setup unhandled rejection handler
   */
  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'unhandledrejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  /**
   * Record performance metric
   * @param {string} type - Metric type
   * @param {Object} entry - Performance entry
   */
  recordPerformanceMetric(type, entry) {
    if (!this.isEnabled) return;

    const metric = {
      type,
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.performance.push(metric);

    // Keep only recent entries
    if (this.performance.length > this.maxPerformanceEntries) {
      this.performance = this.performance.slice(-this.maxPerformanceEntries);
    }

    // Track specific metrics
    this.trackMetric(`${type}_duration`, entry.duration);
    this.trackMetric(`${type}_count`, 1);
  }

  /**
   * Record error
   * @param {Object} error - Error information
   */
  recordError(error) {
    if (!this.isEnabled) return;

    const errorInfo = {
      id: this.generateId(),
      ...error,
      severity: this.determineSeverity(error),
      context: this.getContext()
    };

    this.errors.push(errorInfo);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Track error metrics
    this.trackMetric('error_count', 1);
    this.trackMetric(`error_${error.type}_count`, 1);

    // Send to external service if configured
    this.sendToExternalService('error', errorInfo);
  }

  /**
   * Track custom metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {Object} tags - Additional tags
   */
  trackMetric(name, value, tags = {}) {
    if (!this.isEnabled) return;

    const metric = {
      name,
      value,
      tags,
      timestamp: new Date().toISOString()
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name).push(metric);

    // Keep only recent metrics
    const metrics = this.metrics.get(name);
    if (metrics.length > 100) {
      this.metrics.set(name, metrics.slice(-100));
    }
  }

  /**
   * Track user action
   * @param {string} action - Action name
   * @param {Object} properties - Action properties
   */
  trackUserAction(action, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      action,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.trackMetric('user_action', 1, { action });
    this.sendToExternalService('user_action', event);
  }

  /**
   * Track API call
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {number} duration - Request duration
   * @param {number} status - HTTP status
   * @param {Object} error - Error if any
   */
  trackApiCall(endpoint, method, duration, status, error = null) {
    if (!this.isEnabled) return;

    const apiCall = {
      endpoint,
      method,
      duration,
      status,
      error,
      timestamp: new Date().toISOString()
    };

    this.trackMetric('api_call_duration', duration, { endpoint, method, status });
    this.trackMetric('api_call_count', 1, { endpoint, method, status });

    if (error) {
      this.trackMetric('api_error_count', 1, { endpoint, method, status });
      this.recordError({
        type: 'api',
        message: error.message || 'API call failed',
        endpoint,
        method,
        status,
        timestamp: new Date().toISOString()
      });
    }

    this.sendToExternalService('api_call', apiCall);
  }

  /**
   * Track page load performance
   * @param {string} page - Page name
   */
  trackPageLoad(page) {
    if (!this.isEnabled) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const metrics = {
        page,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        timestamp: new Date().toISOString()
      };

      this.trackMetric('page_load_time', metrics.loadTime, { page });
      this.trackMetric('dom_content_loaded', metrics.domContentLoaded, { page });
      
      this.sendToExternalService('page_load', metrics);
    }
  }

  /**
   * Get First Paint time
   * @returns {number} - First Paint time
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  /**
   * Get First Contentful Paint time
   * @returns {number} - First Contentful Paint time
   */
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  /**
   * Determine error severity
   * @param {Object} error - Error object
   * @returns {string} - Severity level
   */
  determineSeverity(error) {
    if (error.type === 'unhandledrejection' || error.type === 'javascript') {
      return 'high';
    }
    if (error.type === 'api' && error.status >= 500) {
      return 'high';
    }
    if (error.type === 'api' && error.status >= 400) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get current context
   * @returns {Object} - Current context
   */
  getContext() {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate unique ID
   * @returns {string} - Unique ID
   */
  generateId() {
    return `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send data to external service
   * @param {string} type - Data type
   * @param {Object} data - Data to send
   */
  async sendToExternalService(type, data) {
    try {
      // In a real implementation, you would send to your monitoring service
      // For now, we'll just log it
      
      // Example: Send to external service
      // await fetch('/api/monitoring', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type, data })
      // });
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }

  /**
   * Get error summary
   * @returns {Object} - Error summary
   */
  getErrorSummary() {
    const summary = {
      total: this.errors.length,
      byType: {},
      bySeverity: {},
      recent: this.errors.slice(-10)
    };

    this.errors.forEach(error => {
      summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
      summary.bySeverity[error.severity] = (summary.bySeverity[error.severity] || 0) + 1;
    });

    return summary;
  }

  /**
   * Get performance summary
   * @returns {Object} - Performance summary
   */
  getPerformanceSummary() {
    const summary = {
      totalEntries: this.performance.length,
      averageLoadTime: 0,
      averageResourceTime: 0,
      longTasks: 0
    };

    if (this.performance.length > 0) {
      const navigationEntries = this.performance.filter(p => p.type === 'navigation');
      const resourceEntries = this.performance.filter(p => p.type === 'resource');
      const longTaskEntries = this.performance.filter(p => p.type === 'longtask');

      if (navigationEntries.length > 0) {
        summary.averageLoadTime = navigationEntries.reduce((sum, entry) => sum + entry.duration, 0) / navigationEntries.length;
      }

      if (resourceEntries.length > 0) {
        summary.averageResourceTime = resourceEntries.reduce((sum, entry) => sum + entry.duration, 0) / resourceEntries.length;
      }

      summary.longTasks = longTaskEntries.length;
    }

    return summary;
  }

  /**
   * Get metrics summary
   * @returns {Object} - Metrics summary
   */
  getMetricsSummary() {
    const summary = {};
    
    for (const [name, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        summary[name] = {
          count: metrics.length,
          average: metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length,
          latest: metrics[metrics.length - 1].value
        };
      }
    }

    return summary;
  }

  /**
   * Enable/disable monitoring
   * @param {boolean} enabled - Whether to enable monitoring
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Clear all data
   */
  clearData() {
    this.errors = [];
    this.performance = [];
    this.metrics.clear();
  }

  /**
   * Export data for analysis
   * @returns {Object} - Exported data
   */
  exportData() {
    return {
      errors: this.errors,
      performance: this.performance,
      metrics: Object.fromEntries(this.metrics),
      summary: {
        errors: this.getErrorSummary(),
        performance: this.getPerformanceSummary(),
        metrics: this.getMetricsSummary()
      }
    };
  }
}

// Create singleton instance
export const monitoringService = new MonitoringService();

// Export for use in components
export default monitoringService;

