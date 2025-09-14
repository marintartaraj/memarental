/**
 * Error Service - Comprehensive Error Handling
 * Centralized error management with monitoring and recovery
 */

class ErrorService {
  constructor() {
    this.errorQueue = [];
    this.errorHandlers = new Map();
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    };
    this.errorTypes = {
      NETWORK: 'network',
      AUTHENTICATION: 'authentication',
      VALIDATION: 'validation',
      DATABASE: 'database',
      UNKNOWN: 'unknown'
    };
  }

  /**
   * Classify error type based on error properties
   */
  classifyError(error) {
    if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
      return this.errorTypes.NETWORK;
    }
    if (error.code === 'PGRST301' || error.message.includes('JWT')) {
      return this.errorTypes.AUTHENTICATION;
    }
    if (error.code === 'PGRST116' || error.message.includes('validation')) {
      return this.errorTypes.VALIDATION;
    }
    if (error.code && error.code.startsWith('PGRST')) {
      return this.errorTypes.DATABASE;
    }
    return this.errorTypes.UNKNOWN;
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error, context = {}) {
    const errorType = this.classifyError(error);
    const { operation, resource } = context;

    const errorMessages = {
      [this.errorTypes.NETWORK]: {
        default: 'Network connection error. Please check your internet connection and try again.',
        fetch: 'Unable to load data. Please check your connection and try again.',
        save: 'Unable to save changes. Please try again.',
        delete: 'Unable to delete item. Please try again.'
      },
      [this.errorTypes.AUTHENTICATION]: {
        default: 'Authentication error. Please log in again.',
        login: 'Invalid credentials. Please check your email and password.',
        session: 'Your session has expired. Please log in again.',
        permission: 'You do not have permission to perform this action.'
      },
      [this.errorTypes.VALIDATION]: {
        default: 'Please check your input and try again.',
        required: 'This field is required.',
        format: 'Please enter a valid format.',
        unique: 'This value already exists.'
      },
      [this.errorTypes.DATABASE]: {
        default: 'Database error. Please try again.',
        notFound: `${resource || 'Item'} not found.`,
        conflict: 'This item already exists.',
        constraint: 'This operation violates database constraints.'
      },
      [this.errorTypes.UNKNOWN]: {
        default: 'An unexpected error occurred. Please try again.',
        retry: 'Something went wrong. Please try again.'
      }
    };

    const typeMessages = errorMessages[errorType] || errorMessages[this.errorTypes.UNKNOWN];
    return typeMessages[operation] || typeMessages.default;
  }

  /**
   * Log error with context
   */
  logError(error, context = {}) {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: this.classifyError(error),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add to error queue
    this.errorQueue.push(errorInfo);

    // Keep only last 100 errors
    if (this.errorQueue.length > 100) {
      this.errorQueue = this.errorQueue.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Send to monitoring service (if configured)
    this.sendToMonitoring(errorInfo);

    return errorInfo;
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send error to monitoring service
   */
  sendToMonitoring(errorInfo) {
    // In a real application, you would send this to a monitoring service
    // like Sentry, LogRocket, or your own error tracking system
    try {
      // Example: Send to external monitoring service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo)
      // });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  /**
   * Handle error with retry logic
   */
  async handleWithRetry(operation, context = {}, retryConfig = {}) {
    const config = { ...this.retryConfig, ...retryConfig };
    let lastError;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        lastError = error;
        
        // Don't retry for certain error types
        const errorType = this.classifyError(error);
        if (errorType === this.errorTypes.AUTHENTICATION || 
            errorType === this.errorTypes.VALIDATION) {
          break;
        }

        // If this is the last attempt, don't wait
        if (attempt === config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );

        await this.delay(delay);
      }
    }

    // Log the final error
    this.logError(lastError, { ...context, attempts: config.maxRetries + 1 });
    throw lastError;
  }

  /**
   * Delay utility for retry logic
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Register error handler for specific error types
   */
  registerErrorHandler(errorType, handler) {
    this.errorHandlers.set(errorType, handler);
  }

  /**
   * Handle error with registered handlers
   */
  handleError(error, context = {}) {
    const errorType = this.classifyError(error);
    const handler = this.errorHandlers.get(errorType);
    
    if (handler) {
      return handler(error, context);
    }

    // Default error handling
    this.logError(error, context);
    return {
      message: this.getUserFriendlyMessage(error, context),
      type: errorType,
      retryable: this.isRetryable(error)
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error) {
    const errorType = this.classifyError(error);
    return errorType === this.errorTypes.NETWORK || 
           errorType === this.errorTypes.DATABASE;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      byType: {},
      recent: this.errorQueue.slice(-10),
      last24Hours: this.getRecentErrors(24)
    };

    // Count errors by type
    this.errorQueue.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get recent errors within specified hours
   */
  getRecentErrors(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.errorQueue.filter(error => 
      new Date(error.timestamp) > cutoff
    );
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = [];
  }

  /**
   * Export errors for analysis
   */
  exportErrors() {
    return {
      errors: this.errorQueue,
      stats: this.getErrorStats(),
      exportedAt: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const errorService = new ErrorService();

// Export error types for use in components
export const ERROR_TYPES = errorService.errorTypes;

export default errorService;

