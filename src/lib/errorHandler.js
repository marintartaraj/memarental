/**
 * Error Handler Service
 * Centralized error handling and logging
 */

import { authService } from './authService';

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Handle and log errors
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   * @param {string} severity - Error severity (low, medium, high, critical)
   */
  async handleError(error, context = {}, severity = 'medium') {
    const errorInfo = {
      id: this.generateErrorId(),
      message: error.message,
      stack: error.stack,
      severity,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add to local log
    this.addToLog(errorInfo);

    // Log to server if available
    await this.logToServer(errorInfo);

    // Show user-friendly message
    this.showUserMessage(error, severity);

    return errorInfo;
  }

  /**
   * Generate unique error ID
   * @returns {string} - Error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add error to local log
   * @param {Object} errorInfo - Error information
   */
  addToLog(errorInfo) {
    this.errorLog.unshift(errorInfo);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
  }

  /**
   * Log error to server
   * @param {Object} errorInfo - Error information
   */
  async logToServer(errorInfo) {
    try {
      // In a real implementation, you'd send this to your logging service
      // For now, we'll use the audit log
      await authService.logAdminAction(
        (await import('./customSupabaseClient')).supabase.auth.getUser().then(r => r.data.user?.id),
        'error_occurred',
        errorInfo
      );
    } catch (logError) {
      console.error('Failed to log error to server:', logError);
    }
  }

  /**
   * Show user-friendly error message
   * @param {Error} error - Error object
   * @param {string} severity - Error severity
   */
  showUserMessage(error, severity) {
    let message = 'An unexpected error occurred';
    let title = 'Error';

    // Map error types to user-friendly messages
    if (error.message.includes('network') || error.message.includes('fetch')) {
      message = 'Network error. Please check your connection and try again.';
      title = 'Connection Error';
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      message = 'You do not have permission to perform this action.';
      title = 'Access Denied';
    } else if (error.message.includes('not found')) {
      message = 'The requested resource was not found.';
      title = 'Not Found';
    } else if (error.message.includes('validation')) {
      message = 'Please check your input and try again.';
      title = 'Validation Error';
    }

    // Show toast notification
    this.showToast(title, message, severity);
  }

  /**
   * Show toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {string} severity - Error severity
   */
  showToast(title, message, severity) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      severity === 'critical' ? 'bg-red-500' :
      severity === 'high' ? 'bg-orange-500' :
      severity === 'medium' ? 'bg-yellow-500' :
      'bg-blue-500'
    } text-white`;

    toast.innerHTML = `
      <div class="flex items-start gap-2">
        <div class="flex-shrink-0">
          ${this.getSeverityIcon(severity)}
        </div>
        <div class="flex-1">
          <h4 class="font-semibold">${title}</h4>
          <p class="text-sm mt-1">${message}</p>
        </div>
        <button class="flex-shrink-0 ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }

  /**
   * Get severity icon
   * @param {string} severity - Error severity
   * @returns {string} - SVG icon
   */
  getSeverityIcon(severity) {
    const icons = {
      critical: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
      high: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
      medium: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
      low: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
    };

    return icons[severity] || icons.medium;
  }

  /**
   * Get error log
   * @returns {Array} - Error log
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Create error boundary component
   * @param {React.Component} Component - Component to wrap
   * @returns {React.Component} - Error boundary component
   */
  createErrorBoundary(Component) {
    return class ErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        this.handleError(error, errorInfo);
      }

      handleError = async (error, errorInfo) => {
        await errorHandler.handleError(error, errorInfo, 'high');
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Refresh Page
                  </button>
                  <button
                    onClick={() => this.setState({ hasError: false, error: null })}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return this.props.children;
      }
    };
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export for use in components
export default errorHandler;

