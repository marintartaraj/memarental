import React, { useState, useCallback } from 'react';
import { errorService, ERROR_TYPES } from '@/lib/errorService';
import { useToast } from '@/components/ui/use-toast.jsx';

/**
 * useErrorHandler Hook
 * Provides error handling utilities for components
 */
export const useErrorHandler = (options = {}) => {
  const { 
    showToast = true, 
    logErrors = true, 
    retryable = false,
    componentName = 'Unknown'
  } = options;
  
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Handle error with user feedback
   */
  const handleError = useCallback((error, context = {}) => {
    const errorInfo = errorService.handleError(error, {
      component: componentName,
      ...context
    });

    // Log error if enabled
    if (logErrors) {
      errorService.logError(error, {
        component: componentName,
        ...context
      });
    }

    // Show toast if enabled
    if (showToast) {
      toast({
        variant: errorInfo.type === ERROR_TYPES.AUTHENTICATION ? 'destructive' : 'default',
        title: 'Error',
        description: errorInfo.message,
        duration: 5000
      });
    }

    return errorInfo;
  }, [showToast, logErrors, componentName, toast]);

  /**
   * Handle async operation with error handling and retry
   */
  const handleAsync = useCallback(async (operation, context = {}) => {
    try {
      setIsRetrying(false);
      const result = await operation();
      setRetryCount(0); // Reset retry count on success
      return result;
    } catch (error) {
      const errorInfo = handleError(error, context);
      
      // Handle retry logic
      if (retryable && errorService.isRetryable(error) && retryCount < 3) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        
        try {
          const result = await operation();
          setIsRetrying(false);
          setRetryCount(0);
          return result;
        } catch (retryError) {
          setIsRetrying(false);
          throw retryError;
        }
      }
      
      throw error;
    }
  }, [handleError, retryable, retryCount]);

  /**
   * Handle async operation with retry service
   */
  const handleWithRetry = useCallback(async (operation, context = {}, retryConfig = {}) => {
    try {
      setIsRetrying(false);
      const result = await errorService.handleWithRetry(operation, {
        component: componentName,
        ...context
      }, retryConfig);
      
      setRetryCount(0);
      return result;
    } catch (error) {
      const errorInfo = handleError(error, context);
      throw error;
    }
  }, [handleError, componentName]);

  /**
   * Handle form validation errors
   */
  const handleValidationError = useCallback((errors, fieldName = null) => {
    if (fieldName && errors[fieldName]) {
      const error = new Error(errors[fieldName]);
      error.type = ERROR_TYPES.VALIDATION;
      return handleError(error, { field: fieldName, validation: true });
    }
    
    // Handle multiple validation errors
    Object.entries(errors).forEach(([field, message]) => {
      const error = new Error(message);
      error.type = ERROR_TYPES.VALIDATION;
      handleError(error, { field, validation: true });
    });
  }, [handleError]);

  /**
   * Handle network errors specifically
   */
  const handleNetworkError = useCallback((error, context = {}) => {
    const networkError = new Error('Network connection failed');
    networkError.type = ERROR_TYPES.NETWORK;
    networkError.originalError = error;
    
    return handleError(networkError, {
      ...context,
      network: true
    });
  }, [handleError]);

  /**
   * Handle authentication errors
   */
  const handleAuthError = useCallback((error, context = {}) => {
    const authError = new Error('Authentication failed');
    authError.type = ERROR_TYPES.AUTHENTICATION;
    authError.originalError = error;
    
    return handleError(authError, {
      ...context,
      authentication: true
    });
  }, [handleError]);

  /**
   * Clear retry state
   */
  const clearRetryState = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  /**
   * Get error statistics for this component
   */
  const getComponentErrorStats = useCallback(() => {
    const allErrors = errorService.getErrorStats();
    return allErrors.recent.filter(error => 
      error.context.component === componentName
    );
  }, [componentName]);

  return {
    handleError,
    handleAsync,
    handleWithRetry,
    handleValidationError,
    handleNetworkError,
    handleAuthError,
    clearRetryState,
    getComponentErrorStats,
    isRetrying,
    retryCount,
    canRetry: retryCount < 3
  };
};

export default useErrorHandler;

