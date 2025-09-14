import React, { Component, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home, Bug, X } from 'lucide-react';
import { errorService, ERROR_TYPES } from '@/lib/errorService';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = errorService.logError(error, {
      component: this.props.componentName || 'Unknown',
      errorBoundary: true,
      errorInfo
    });

    this.setState({
      error,
      errorInfo,
      errorId: errorId.id
    });

    // Report to monitoring service
    this.reportError(error, errorInfo, errorId.id);
  }

  reportError(error, errorInfo, errorId) {
    // In a real application, you would send this to a monitoring service
    console.error('Error Boundary caught error:', {
      error,
      errorInfo,
      errorId,
      component: this.props.componentName
    });
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1,
        showDetails: false
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, showDetails } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      // Custom fallback component
      if (fallback) {
        return fallback(error, errorInfo, this.handleRetry);
      }

      const errorType = errorService.classifyError(error);
      const userMessage = errorService.getUserFriendlyMessage(error, {
        component: componentName
      });

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-900">Something went wrong</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {componentName ? `Error in ${componentName}` : 'An unexpected error occurred'}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User-friendly message */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{userMessage}</p>
                {errorId && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {errorId}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  disabled={retryCount >= 3}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </Button>

                {process.env.NODE_ENV === 'development' && (
                  <Button
                    variant="outline"
                    onClick={this.toggleDetails}
                    className="flex items-center gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    {showDetails ? 'Hide' : 'Show'} Details
                  </Button>
                )}
              </div>

              {/* Error details (development only) */}
              {showDetails && process.env.NODE_ENV === 'development' && (
                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Error Details</h4>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm font-mono text-red-600">
                          {error?.message || 'Unknown error'}
                        </p>
                      </div>
                    </div>

                    {error?.stack && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Stack Trace</h4>
                        <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      </div>
                    )}

                    {errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Component Stack</h4>
                        <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Help text */}
              <div className="text-sm text-gray-600">
                <p>
                  If this error persists, please contact support with the error ID above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Suspense wrapper for lazy-loaded components
export const ErrorBoundaryWithSuspense = ({ children, fallback, ...props }) => (
  <ErrorBoundary {...props}>
    <Suspense fallback={fallback || <div>Loading...</div>}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default ErrorBoundary;