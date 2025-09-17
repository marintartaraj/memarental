/**
 * Global Error Tracking System
 * Comprehensive error monitoring, reporting, and analysis
 */

class ErrorTracking {
  constructor() {
    this.errors = [];
    this.errorTypes = new Map();
    this.errorFrequency = new Map();
    this.userSessions = new Map();
    this.isEnabled = true;
    
    // Configuration
    this.config = {
      maxErrors: 100,            // Maximum errors to store (reduced to prevent quota issues)
      errorRetentionDays: 7,    // Days to retain error data (reduced)
      batchSize: 10,             // Errors to batch before sending
      retryAttempts: 3,          // Retry attempts for failed sends
      enableConsoleLogging: true, // Log errors to console
      enableUserReporting: true,  // Allow users to report errors
      enablePerformanceErrors: true, // Track performance-related errors
      enableNetworkErrors: true,  // Track network-related errors
      enableJavaScriptErrors: true // Track JavaScript errors
    };

    // Error severity levels
    this.severityLevels = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };
  }

  /**
   * Initialize error tracking
   */
  init() {
    if (typeof window === 'undefined') return;

    this.setupGlobalErrorHandlers();
    this.setupUnhandledRejectionHandler();
    this.setupNetworkErrorTracking();
    this.setupPerformanceErrorTracking();
    this.setupUserErrorReporting();
    this.loadStoredErrors();
    this.startErrorCleanup();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    if (!this.config.enableJavaScriptErrors) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        severity: this.determineSeverity(event.error),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        severity: this.severityLevels.HIGH,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  /**
   * Setup unhandled rejection handler
   */
  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack,
        severity: this.severityLevels.MEDIUM,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  /**
   * Setup network error tracking
   */
  setupNetworkErrorTracking() {
    if (!this.config.enableNetworkErrors) return;

    // Track fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.trackError({
            type: 'network_error',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            severity: this.determineNetworkSeverity(response.status),
            timestamp: Date.now()
          });
        }
        return response;
      } catch (error) {
        this.trackError({
          type: 'network_error',
          message: error.message,
          url: args[0],
          severity: this.severityLevels.HIGH,
          timestamp: Date.now()
        });
        throw error;
      }
    };

    // Track XMLHttpRequest errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._trackingUrl = url;
      this._trackingMethod = method;
      return originalXHROpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('error', () => {
        this._trackError({
          type: 'xhr_error',
          message: 'XMLHttpRequest failed',
          url: this._trackingUrl,
          method: this._trackingMethod,
          severity: this.severityLevels.MEDIUM,
          timestamp: Date.now()
        });
      });

      this.addEventListener('load', () => {
        if (this.status >= 400) {
          this._trackError({
            type: 'xhr_error',
            message: `HTTP ${this.status}: ${this.statusText}`,
            url: this._trackingUrl,
            method: this._trackingMethod,
            status: this.status,
            statusText: this.statusText,
            severity: this.determineNetworkSeverity(this.status),
            timestamp: Date.now()
          });
        }
      });

      return originalXHRSend.call(this, ...args);
    };
  }

  /**
   * Setup performance error tracking
   */
  setupPerformanceErrorTracking() {
    if (!this.config.enablePerformanceErrors) return;

    // Track resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const resourceUrl = event.target.src || event.target.href;
        
        // Filter out known non-existent CSS files to reduce noise
        const ignoredResources = [
          '/css/critical.css',
          '/css/admin.css',
          '/css/booking.css'
        ];
        
        if (ignoredResources.some(ignored => resourceUrl.includes(ignored))) {
          return; // Skip tracking these known 404s
        }
        
        this.trackError({
          type: 'resource_error',
          message: `Failed to load resource: ${resourceUrl}`,
          resourceType: event.target.tagName,
          resourceUrl: resourceUrl,
          severity: this.severityLevels.MEDIUM,
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    }, true);

    // Track long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 200) { // Tasks longer than 200ms (reduced noise)
            this.trackError({
              type: 'long_task',
              message: `Long task detected: ${entry.duration}ms`,
              duration: entry.duration,
              startTime: entry.startTime,
              severity: this.severityLevels.LOW,
              timestamp: Date.now(),
              url: window.location.href
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * Setup user error reporting
   */
  setupUserErrorReporting() {
    if (!this.config.enableUserReporting) return;

    // Add error reporting button to error boundaries
    this.addErrorReportingButton();
  }

  /**
   * Add error reporting button
   */
  addErrorReportingButton() {
    // This will be called by error boundaries
    window.reportError = (error, context = {}) => {
      this.trackError({
        type: 'user_reported_error',
        message: error.message || 'User reported error',
        stack: error.stack,
        context,
        severity: this.severityLevels.MEDIUM,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    };
  }

  /**
   * Track error
   */
  trackError(errorData) {
    const error = {
      id: this.generateErrorId(),
      ...errorData,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Add to errors array
    this.errors.push(error);

    // Update error type frequency
    const errorType = error.type;
    this.errorFrequency.set(errorType, (this.errorFrequency.get(errorType) || 0) + 1);

    // Update error types
    if (!this.errorTypes.has(errorType)) {
      this.errorTypes.set(errorType, []);
    }
    this.errorTypes.get(errorType).push(error);

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      this.logError(error);
    }

    // Send to external services
    this.sendToExternalServices(error);

    // Store error
    this.storeError(error);

    // Cleanup old errors
    this.cleanupOldErrors();
  }

  /**
   * Determine error severity
   */
  determineSeverity(error) {
    if (!error) return this.severityLevels.MEDIUM;

    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) {
      return this.severityLevels.HIGH;
    }
    
    if (message.includes('syntax') || message.includes('reference')) {
      return this.severityLevels.CRITICAL;
    }
    
    if (message.includes('type') || message.includes('undefined')) {
      return this.severityLevels.MEDIUM;
    }
    
    return this.severityLevels.LOW;
  }

  /**
   * Determine network error severity
   */
  determineNetworkSeverity(status) {
    if (status >= 500) return this.severityLevels.HIGH;
    if (status >= 400) return this.severityLevels.MEDIUM;
    return this.severityLevels.LOW;
  }

  /**
   * Log error to console
   */
  logError(error) {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[ErrorTracker] ${error.type}: ${error.message}`;
    
    switch (logLevel) {
      case 'error':
        console.error(logMessage, error);
        break;
      case 'warn':
        console.warn(logMessage, error);
        break;
      case 'info':
        console.info(logMessage, error);
        break;
      default:
        console.log(logMessage, error);
    }
  }

  /**
   * Get log level based on severity
   */
  getLogLevel(severity) {
    switch (severity) {
      case this.severityLevels.CRITICAL:
      case this.severityLevels.HIGH:
        return 'error';
      case this.severityLevels.MEDIUM:
        return 'warn';
      case this.severityLevels.LOW:
        return 'info';
      default:
        return 'log';
    }
  }

  /**
   * Send to external services
   */
  sendToExternalServices(error) {
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: error.severity === this.severityLevels.CRITICAL,
        custom_parameter_1: error.type,
        custom_parameter_2: error.severity
      });
    }

    // Send to custom error tracking endpoint
    this.sendToCustomEndpoint(error);
  }

  /**
   * Send to custom endpoint
   */
  sendToCustomEndpoint(error) {
    // Check for environment variable safely
    const endpoint = typeof process !== 'undefined' && process.env 
      ? process.env.REACT_APP_ERROR_TRACKING_ENDPOINT 
      : import.meta.env?.REACT_APP_ERROR_TRACKING_ENDPOINT;
    
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error)
      }).catch(err => {
        console.error('Failed to send error to tracking endpoint:', err);
      });
    }
  }

  /**
   * Store error locally
   */
  storeError(error) {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('error_tracking') || '[]');
      storedErrors.push(error);
      
      // Keep only recent errors
      const recentErrors = storedErrors.slice(-this.config.maxErrors);
      
      // Try to store, but handle quota exceeded errors
      try {
        localStorage.setItem('error_tracking', JSON.stringify(recentErrors));
      } catch (quotaError) {
        console.warn('localStorage quota exceeded, clearing old errors');
        // If quota exceeded, try with fewer errors
        const reducedErrors = recentErrors.slice(-Math.floor(this.config.maxErrors / 2));
        localStorage.setItem('error_tracking', JSON.stringify(reducedErrors));
      }
    } catch (error) {
      console.warn('Failed to store error:', error);
      // If all else fails, clear localStorage
      try {
        localStorage.removeItem('error_tracking');
      } catch (clearError) {
        console.warn('Failed to clear error storage:', clearError);
      }
    }
  }

  /**
   * Load stored errors
   */
  loadStoredErrors() {
    const storedErrors = JSON.parse(localStorage.getItem('error_tracking') || '[]');
    this.errors = storedErrors;
    
    // Rebuild error types and frequency
    this.errors.forEach(error => {
      const errorType = error.type;
      this.errorFrequency.set(errorType, (this.errorFrequency.get(errorType) || 0) + 1);
      
      if (!this.errorTypes.has(errorType)) {
        this.errorTypes.set(errorType, []);
      }
      this.errorTypes.get(errorType).push(error);
    });
  }

  /**
   * Start error cleanup
   */
  startErrorCleanup() {
    // Cleanup old errors every hour
    setInterval(() => {
      this.cleanupOldErrors();
    }, 60 * 60 * 1000);
  }

  /**
   * Cleanup old errors
   */
  cleanupOldErrors() {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('error_tracking') || '[]');
      const cutoffTime = Date.now() - (this.config.errorRetentionDays * 24 * 60 * 60 * 1000);
      
      // Filter out old errors
      const recentErrors = storedErrors.filter(error => error.timestamp > cutoffTime);
      
      // Keep only the most recent errors (respect maxErrors limit)
      const limitedErrors = recentErrors.slice(-this.config.maxErrors);
      
      // Update stored errors only if we have changes
      if (limitedErrors.length !== storedErrors.length) {
        localStorage.setItem('error_tracking', JSON.stringify(limitedErrors));
      }
      
      // Update in-memory errors
      this.errors = limitedErrors;
    } catch (error) {
      console.warn('Error during cleanup:', error);
      // If cleanup fails, clear localStorage to prevent quota issues
      try {
        localStorage.removeItem('error_tracking');
        this.errors = [];
      } catch (clearError) {
        console.warn('Failed to clear error storage:', clearError);
      }
    }
  }

  /**
   * Clear all stored errors (emergency cleanup)
   */
  clearAllErrors() {
    try {
      localStorage.removeItem('error_tracking');
      this.errors = [];
      console.log('All error tracking data cleared');
    } catch (error) {
      console.warn('Failed to clear error tracking data:', error);
    }
  }

  /**
   * Generate error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session ID
   */
  getSessionId() {
    return sessionStorage.getItem('session_id') || `session_${Date.now()}`;
  }

  /**
   * Get user ID
   */
  getUserId() {
    return localStorage.getItem('user_analytics_id') || `user_${Date.now()}`;
  }

  /**
   * Get error analytics
   */
  getErrorAnalytics() {
    const analytics = {
      totalErrors: this.errors.length,
      errorsByType: Array.from(this.errorFrequency.entries()).map(([type, count]) => ({
        type,
        count,
        percentage: (count / this.errors.length) * 100
      })),
      errorsBySeverity: this.getErrorsBySeverity(),
      recentErrors: this.getRecentErrors(),
      errorTrends: this.getErrorTrends(),
      topErrors: this.getTopErrors()
    };

    return analytics;
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity() {
    const severityCounts = {};
    Object.values(this.severityLevels).forEach(severity => {
      severityCounts[severity] = 0;
    });

    this.errors.forEach(error => {
      severityCounts[error.severity] = (severityCounts[error.severity] || 0) + 1;
    });

    return severityCounts;
  }

  /**
   * Get recent errors
   */
  getRecentErrors() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return this.errors.filter(error => error.timestamp > oneDayAgo);
  }

  /**
   * Get error trends
   */
  getErrorTrends() {
    const trends = {};
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    this.errors.filter(error => error.timestamp > oneWeekAgo).forEach(error => {
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
    
    this.errors.forEach(error => {
      const message = error.message;
      errorMessages[message] = (errorMessages[message] || 0) + 1;
    });

    return Object.entries(errorMessages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));
  }

  /**
   * Get error summary
   */
  getErrorSummary() {
    const analytics = this.getErrorAnalytics();
    const summary = {
      totalErrors: analytics.totalErrors,
      criticalErrors: analytics.errorsBySeverity[this.severityLevels.CRITICAL] || 0,
      highErrors: analytics.errorsBySeverity[this.severityLevels.HIGH] || 0,
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
    const recentErrors = this.errors.filter(error => error.timestamp > oneHourAgo);
    return recentErrors.length;
  }

  /**
   * Export error data
   */
  exportErrorData() {
    return {
      errors: this.errors,
      analytics: this.getErrorAnalytics(),
      summary: this.getErrorSummary(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear error data
   */
  clearErrorData() {
    this.errors = [];
    this.errorTypes.clear();
    this.errorFrequency.clear();
    localStorage.removeItem('error_tracking');
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const errorTracking = new ErrorTracking();

// Initialize on import
if (typeof window !== 'undefined') {
  errorTracking.init();
}

export default errorTracking;
