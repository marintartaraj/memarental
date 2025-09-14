/**
 * CSRF Protected Form Component
 * Wrapper component that automatically adds CSRF protection to forms
 */

import React, { useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';
import useCSRF from '@/hooks/useCSRF';

const CSRFProtectedForm = ({ 
  children, 
  onSubmit, 
  sessionId = 'default',
  showCSRFInfo = false,
  className = '',
  ...props 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { token, error: csrfError, validateAndUseToken } = useCSRF(sessionId);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    if (!token) {
      setSubmitError('CSRF token not available. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate CSRF token
      const validation = validateAndUseToken(token);
      
      if (!validation.valid) {
        setSubmitError(`Security validation failed: ${validation.reason}`);
        return;
      }

      // Create form data with CSRF token
      const formData = new FormData(event.target);
      formData.append('_csrf_token', token);

      // Call the provided onSubmit function
      await onSubmit(event, formData, token);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  }, [token, validateAndUseToken, onSubmit]);

  // Show CSRF error if token generation failed
  if (csrfError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Security initialization failed: {csrfError}. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      {/* Hidden CSRF token field */}
      <input type="hidden" name="_csrf_token" value={token || ''} />
      
      {/* CSRF Info (optional) */}
      {showCSRFInfo && token && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">CSRF Protection Active</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This form is protected against cross-site request forgery attacks.
          </p>
        </div>
      )}

      {/* Submit error display */}
      {submitError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Form content */}
      {children}

      {/* Submit button with loading state */}
      <Button 
        type="submit" 
        disabled={isSubmitting || !token}
        className="w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
};

export default CSRFProtectedForm;

