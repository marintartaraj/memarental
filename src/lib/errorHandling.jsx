// Comprehensive Error Handling Utilities for MEMA Rental

import React from 'react';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error class
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, details = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.id = this.generateId();
  }

  generateId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      message: this.message,
      type: this.type,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// Error handler class
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.listeners = new Map();
  }

  // Register error listener
  onError(callback) {
    const id = Date.now().toString();
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  // Handle error
  handleError(error, context = {}) {
    const appError = this.normalizeError(error);
    const errorWithContext = {
      ...appError,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Log error
    this.logError(errorWithContext);

    // Notify listeners
    this.listeners.forEach(callback => {
      try {
        callback(errorWithContext);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });

    // Report to external service if critical
    if (appError.severity === ERROR_SEVERITY.CRITICAL) {
      this.reportError(errorWithContext);
    }

    return errorWithContext;
  }

  // Normalize error to AppError
  normalizeError(error) {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        this.determineErrorType(error),
        this.determineErrorSeverity(error),
        { originalError: error.name }
      );
    }

    if (typeof error === 'string') {
      return new AppError(error, ERROR_TYPES.CLIENT, ERROR_SEVERITY.LOW);
    }

    return new AppError(
      'An unknown error occurred',
      ERROR_TYPES.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      { originalError: error }
    );
  }

  // Determine error type
  determineErrorType(error) {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return ERROR_TYPES.NETWORK;
    }
    if (error.name === 'ValidationError') {
      return ERROR_TYPES.VALIDATION;
    }
    if (error.name === 'AuthenticationError') {
      return ERROR_TYPES.AUTHENTICATION;
    }
    if (error.name === 'AuthorizationError') {
      return ERROR_TYPES.AUTHORIZATION;
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return ERROR_TYPES.NOT_FOUND;
    }
    if (error.message.includes('500') || error.message.includes('server')) {
      return ERROR_TYPES.SERVER;
    }
    return ERROR_TYPES.CLIENT;
  }

  // Determine error severity
  determineErrorSeverity(error) {
    if (error.name === 'AuthenticationError' || error.name === 'AuthorizationError') {
      return ERROR_SEVERITY.HIGH;
    }
    if (error.message.includes('500') || error.message.includes('critical')) {
      return ERROR_SEVERITY.CRITICAL;
    }
    if (error.name === 'NetworkError') {
      return ERROR_SEVERITY.MEDIUM;
    }
    return ERROR_SEVERITY.LOW;
  }

  // Log error
  logError(error) {
    this.errorLog.push(error);
    
    // Keep only recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', error);
    }
  }

  // Report error to external service
  async reportError(error) {
    try {
      // In production, send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(error)
        });
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  // Get error log
  getErrorLog() {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler();

// Error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    const appError = new AppError(
      error.message,
      ERROR_TYPES.CLIENT,
      ERROR_SEVERITY.HIGH,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.name || 'Unknown'
      }
    );

    globalErrorHandler.handleError(appError, {
      component: this.props.name,
      errorInfo
    });

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error recovery utilities
export const errorRecovery = {
  // Retry mechanism
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  },

  // Fallback mechanism
  withFallback: async (fn, fallbackFn) => {
    try {
      return await fn();
    } catch (error) {
      globalErrorHandler.handleError(error, { context: 'primary_function_failed' });
      return await fallbackFn();
    }
  },

  // Circuit breaker pattern
  createCircuitBreaker: (threshold = 5, timeout = 60000) => {
    let failures = 0;
    let lastFailureTime = 0;
    let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN

    return async (fn) => {
      if (state === 'OPEN') {
        if (Date.now() - lastFailureTime > timeout) {
          state = 'HALF_OPEN';
        } else {
          throw new AppError('Circuit breaker is OPEN', ERROR_TYPES.SERVER, ERROR_SEVERITY.HIGH);
        }
      }

      try {
        const result = await fn();
        
        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
          failures = 0;
        }
        
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();
        
        if (failures >= threshold) {
          state = 'OPEN';
        }
        
        throw error;
      }
    };
  }
};

// User feedback utilities
export const userFeedback = {
  // Show error message to user
  showError: (error, options = {}) => {
    const message = options.userFriendly || this.getUserFriendlyMessage(error);
    const severity = error.severity || ERROR_SEVERITY.MEDIUM;
    
    // Show toast notification
    if (window.toast) {
      window.toast.error('Error', message);
    }
    
    // Show modal for critical errors
    if (severity === ERROR_SEVERITY.CRITICAL) {
      this.showCriticalErrorModal(error);
    }
  },

  // Get user-friendly error message
  getUserFriendlyMessage: (error) => {
    const messages = {
      [ERROR_TYPES.NETWORK]: 'Please check your internet connection and try again.',
      [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
      [ERROR_TYPES.AUTHENTICATION]: 'Please log in again to continue.',
      [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
      [ERROR_TYPES.SERVER]: 'Our servers are experiencing issues. Please try again later.',
      [ERROR_TYPES.CLIENT]: 'Something went wrong. Please try again.',
      [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    };

    return messages[error.type] || messages[ERROR_TYPES.UNKNOWN];
  },

  // Show critical error modal
  showCriticalErrorModal: (error) => {
    // Implementation would depend on your modal system
    console.error('Critical error:', error);
  },

  // Show success message
  showSuccess: (message) => {
    if (window.toast) {
      window.toast.success('Success', message);
    }
  },

  // Show warning message
  showWarning: (message) => {
    if (window.toast) {
      window.toast.warning('Warning', message);
    }
  },

  // Show info message
  showInfo: (message) => {
    if (window.toast) {
      window.toast.info('Info', message);
    }
  }
};

// Error monitoring utilities
export const errorMonitoring = {
  // Track user actions
  trackAction: (action, context = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Action tracked:', action, context);
    }
  },

  // Track performance metrics
  trackPerformance: (name, startTime, endTime) => {
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} took ${duration}ms`);
    }
  },

  // Track user journey
  trackJourney: (step, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Journey step:', step, data);
    }
  }
};

// Export all utilities
export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  AppError,
  ErrorHandler,
  globalErrorHandler,
  ErrorBoundary,
  errorRecovery,
  userFeedback,
  errorMonitoring
};
