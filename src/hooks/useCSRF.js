/**
 * CSRF Protection Hook
 * Provides CSRF token management for forms and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import csrfService from '@/lib/csrfService';
import { useSecurity } from '@/stores/securityStore';

export const useCSRF = (sessionId = 'default') => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const securityStore = useSecurity();

  // Generate a new token
  const generateToken = useCallback(() => {
    try {
      const newToken = csrfService.generateToken(sessionId);
      setToken(newToken);
      setError(null);
      return newToken;
    } catch (err) {
      setError('Failed to generate CSRF token');
      console.error('CSRF token generation error:', err);
      return null;
    }
  }, [sessionId]);

  // Validate a token
  const validateToken = useCallback((tokenToValidate) => {
    try {
      const result = csrfService.validateToken(tokenToValidate, sessionId);
      
      if (!result.valid) {
        securityStore.addSecurityEvent('CSRF_ATTEMPT', {
          reason: result.reason,
          token: tokenToValidate ? tokenToValidate.substring(0, 8) + '...' : 'null'
        });
      }
      
      return result;
    } catch (err) {
      setError('Failed to validate CSRF token');
      console.error('CSRF token validation error:', err);
      return { valid: false, reason: 'VALIDATION_ERROR' };
    }
  }, [sessionId, securityStore]);

  // Use a token (mark as used)
  const useToken = useCallback((tokenToUse) => {
    try {
      return csrfService.useToken(tokenToUse);
    } catch (err) {
      setError('Failed to use CSRF token');
      console.error('CSRF token usage error:', err);
      return false;
    }
  }, []);

  // Get token for form submission
  const getTokenForSubmission = useCallback(() => {
    if (!token) {
      const newToken = generateToken();
      return newToken;
    }
    return token;
  }, [token, generateToken]);

  // Validate and use token for form submission
  const validateAndUseToken = useCallback((tokenToValidate) => {
    const validation = validateToken(tokenToValidate);
    
    if (validation.valid) {
      const used = useToken(tokenToValidate);
      if (used) {
        // Generate new token for next submission
        generateToken();
        return { valid: true, used: true };
      } else {
        return { valid: false, reason: 'TOKEN_USE_FAILED' };
      }
    }
    
    return validation;
  }, [validateToken, useToken, generateToken]);

  // Initialize token on mount
  useEffect(() => {
    generateToken();
  }, [generateToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optionally clear session tokens on unmount
      // csrfService.clearSession(sessionId);
    };
  }, [sessionId]);

  return {
    token,
    loading,
    error,
    generateToken,
    validateToken,
    useToken,
    getTokenForSubmission,
    validateAndUseToken,
    clearError: () => setError(null)
  };
};

export default useCSRF;

