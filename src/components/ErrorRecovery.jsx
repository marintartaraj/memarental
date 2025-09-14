import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { errorService } from '@/lib/errorService';

const ErrorRecovery = ({ 
  error, 
  onRetry, 
  onGoHome, 
  onGoBack,
  retryCount = 0,
  maxRetries = 3,
  className = ''
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (retryError) {
      // Log retry attempt
      errorService.logError(retryError, {
        recoveryAttempt: recoveryAttempts + 1,
        originalError: error?.message
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const canRetry = retryCount < maxRetries;
  const errorType = errorService.classifyError(error);
  const isRetryable = errorService.isRetryable(error);

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-orange-900">Recovery Options</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Choose how to proceed after this error
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Retry option */}
        {isRetryable && (
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              disabled={!canRetry || isRetrying}
              className="w-full flex items-center gap-2"
              variant={canRetry ? "default" : "outline"}
            >
              {isRetrying ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isRetrying 
                ? 'Retrying...' 
                : canRetry 
                  ? `Try Again (${retryCount}/${maxRetries})`
                  : 'Max Retries Reached'
              }
            </Button>
            
            {retryCount > 0 && (
              <div className="text-xs text-gray-500 text-center">
                Previous attempts: {retryCount}
              </div>
            )}
          </div>
        )}

        {/* Navigation options */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="w-full flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Button>
        </div>

        {/* Error information */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Error Type:</span>
              <span className="font-medium capitalize">{errorType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Retryable:</span>
              <span className="flex items-center gap-1">
                {isRetryable ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                {isRetryable ? 'Yes' : 'No'}
              </span>
            </div>
            {retryCount > 0 && (
              <div className="flex items-center justify-between">
                <span>Attempts:</span>
                <span className="font-medium">{retryCount}/{maxRetries}</span>
              </div>
            )}
          </div>
        </div>

        {/* Help text */}
        <div className="text-xs text-gray-500 text-center pt-2">
          {isRetryable && canRetry 
            ? 'This error may be temporary. Try again to see if it resolves.'
            : 'This error cannot be retried. Please navigate away or contact support.'
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorRecovery;

