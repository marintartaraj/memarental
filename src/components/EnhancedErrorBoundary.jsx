import React from 'react';
import { AlertTriangle, RefreshCw, Bug, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { errorTracking } from '@/lib/errorTracking';

class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
      isReportingError: false,
      errorReported: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    });

    // Track error
    errorTracking.trackError({
      type: 'react_error_boundary',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      severity: 'high',
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
      errorReported: false
    });
  };

  handleReportError = async () => {
    this.setState({ isReportingError: true });

    try {
      // Report error to external service
      await this.reportErrorToService();
      this.setState({ errorReported: true });
    } catch (error) {
      console.error('Failed to report error:', error);
    } finally {
      this.setState({ isReportingError: false });
    }
  };

  reportErrorToService = async () => {
    const errorData = {
      type: 'user_reported_error',
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo.componentStack,
      severity: 'high',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Send to error tracking
    errorTracking.trackError(errorData);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  toggleErrorDetails = () => {
    this.setState(prevState => ({
      showErrorDetails: !prevState.showErrorDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bug className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
                </p>
              </div>

              {/* Error Details Toggle */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.toggleErrorDetails}
                  className="mb-4"
                >
                  {this.state.showErrorDetails ? 'Hide' : 'Show'} Error Details
                </Button>
              </div>

              {/* Error Details */}
              {this.state.showErrorDetails && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Error Details:</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    {this.state.error?.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReportError}
                  disabled={this.state.isReportingError || this.state.errorReported}
                  className="flex items-center gap-2"
                >
                  {this.state.isReportingError ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Reporting...
                    </>
                  ) : this.state.errorReported ? (
                    <>
                      <Send className="w-4 h-4" />
                      Reported
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Report Error
                    </>
                  )}
                </Button>
              </div>

              {/* Success Message */}
              {this.state.errorReported && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </div>
                    <span className="font-medium">Error reported successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Thank you for helping us improve. We'll investigate this issue.
                  </p>
                </div>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  If this problem persists, please contact our support team or try refreshing the page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
