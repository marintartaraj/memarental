/**
 * CSRF Validation Utility
 * Provides utilities for validating CSRF tokens in API calls and form submissions
 */

import csrfService from './csrfService';
import useSecurityStore from '@/stores/securityStore';

/**
 * Validate CSRF token from form data
 * @param {FormData} formData - Form data containing CSRF token
 * @param {string} sessionId - Session identifier
 * @returns {Object} - Validation result
 */
export const validateFormCSRF = (formData, sessionId = 'default') => {
  const token = formData.get('_csrf_token');
  
  if (!token) {
    return {
      valid: false,
      reason: 'NO_TOKEN',
      message: 'CSRF token is required'
    };
  }

  const validation = csrfService.validateToken(token, sessionId);
  
  if (!validation.valid) {
    // Log security event
    const securityStore = useSecurityStore.getState();
    securityStore.addSecurityEvent('CSRF_ATTEMPT', {
      reason: validation.reason,
      token: token.substring(0, 8) + '...',
      source: 'form_submission'
    });
  }

  return {
    valid: validation.valid,
    reason: validation.reason,
    message: getCSRFErrorMessage(validation.reason)
  };
};

/**
 * Validate CSRF token from request headers
 * @param {Headers} headers - Request headers
 * @param {string} sessionId - Session identifier
 * @returns {Object} - Validation result
 */
export const validateHeaderCSRF = (headers, sessionId = 'default') => {
  const token = headers.get('X-CSRF-Token') || headers.get('x-csrf-token');
  
  if (!token) {
    return {
      valid: false,
      reason: 'NO_TOKEN',
      message: 'CSRF token is required in headers'
    };
  }

  const validation = csrfService.validateToken(token, sessionId);
  
  if (!validation.valid) {
    // Log security event
    const securityStore = useSecurityStore.getState();
    securityStore.addSecurityEvent('CSRF_ATTEMPT', {
      reason: validation.reason,
      token: token.substring(0, 8) + '...',
      source: 'api_request'
    });
  }

  return {
    valid: validation.valid,
    reason: validation.reason,
    message: getCSRFErrorMessage(validation.reason)
  };
};

/**
 * Validate CSRF token from request body
 * @param {Object} body - Request body containing CSRF token
 * @param {string} sessionId - Session identifier
 * @returns {Object} - Validation result
 */
export const validateBodyCSRF = (body, sessionId = 'default') => {
  const token = body._csrf_token || body.csrf_token;
  
  if (!token) {
    return {
      valid: false,
      reason: 'NO_TOKEN',
      message: 'CSRF token is required in request body'
    };
  }

  const validation = csrfService.validateToken(token, sessionId);
  
  if (!validation.valid) {
    // Log security event
    const securityStore = useSecurityStore.getState();
    securityStore.addSecurityEvent('CSRF_ATTEMPT', {
      reason: validation.reason,
      token: token.substring(0, 8) + '...',
      source: 'api_request'
    });
  }

  return {
    valid: validation.valid,
    reason: validation.reason,
    message: getCSRFErrorMessage(validation.reason)
  };
};

/**
 * Get user-friendly error message for CSRF validation failure
 * @param {string} reason - Validation failure reason
 * @returns {string} - Error message
 */
export const getCSRFErrorMessage = (reason) => {
  const messages = {
    'NO_TOKEN': 'CSRF token is required',
    'INVALID_TOKEN': 'Invalid CSRF token',
    'SESSION_MISMATCH': 'CSRF token does not match current session',
    'TOKEN_EXPIRED': 'CSRF token has expired. Please refresh the page.',
    'TOKEN_REUSED': 'CSRF token has already been used. Please refresh the page.',
    'VALIDATION_ERROR': 'CSRF validation failed due to a system error'
  };
  
  return messages[reason] || 'CSRF validation failed';
};

/**
 * Create CSRF-protected fetch wrapper
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {string} sessionId - Session identifier
 * @returns {Promise<Response>} - Fetch response
 */
export const csrfProtectedFetch = async (url, options = {}, sessionId = 'default') => {
  // Generate CSRF token
  const token = csrfService.generateToken(sessionId);
  
  // Add CSRF token to headers
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
    ...options.headers
  };

  // Add CSRF token to body if it's a POST/PUT/PATCH request
  let body = options.body;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
    if (typeof body === 'string') {
      try {
        const bodyObj = JSON.parse(body);
        bodyObj._csrf_token = token;
        body = JSON.stringify(bodyObj);
      } catch (e) {
        // If body is not JSON, add as query parameter or header only
        console.warn('CSRF: Could not add token to non-JSON body');
      }
    } else if (body instanceof FormData) {
      body.append('_csrf_token', token);
    } else if (body && typeof body === 'object') {
      body._csrf_token = token;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body
  });

  // Validate CSRF token in response if provided
  const responseToken = response.headers.get('X-CSRF-Token');
  if (responseToken) {
    const validation = csrfService.validateToken(responseToken, sessionId);
    if (!validation.valid) {
      console.warn('CSRF: Invalid token in response:', validation.reason);
    }
  }

  return response;
};

/**
 * Middleware for validating CSRF tokens in API routes
 * @param {Function} handler - API route handler
 * @param {Object} options - Middleware options
 * @returns {Function} - Wrapped handler with CSRF protection
 */
export const withCSRFProtection = (handler, options = {}) => {
  const { 
    sessionId = 'default',
    tokenSource = 'auto', // 'auto', 'header', 'body', 'form'
    requireToken = true
  } = options;

  return async (request, context) => {
    // Skip CSRF validation for GET requests unless explicitly required
    if (request.method === 'GET' && !requireToken) {
      return handler(request, context);
    }

    let validation = { valid: true }; // Default to valid for non-protected methods

    // Determine token source and validate
    switch (tokenSource) {
      case 'header':
        validation = validateHeaderCSRF(request.headers, sessionId);
        break;
      case 'body':
        const body = await request.json();
        validation = validateBodyCSRF(body, sessionId);
        break;
      case 'form':
        const formData = await request.formData();
        validation = validateFormCSRF(formData, sessionId);
        break;
      case 'auto':
      default:
        // Try to validate from multiple sources
        if (request.headers.get('X-CSRF-Token')) {
          validation = validateHeaderCSRF(request.headers, sessionId);
        } else {
          try {
            const body = await request.json();
            validation = validateBodyCSRF(body, sessionId);
          } catch (e) {
            try {
              const formData = await request.formData();
              validation = validateFormCSRF(formData, sessionId);
            } catch (e2) {
              validation = { valid: false, reason: 'NO_TOKEN' };
            }
          }
        }
        break;
    }

    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          error: 'CSRF validation failed',
          reason: validation.reason,
          message: validation.message
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Mark token as used
    if (validation.tokenInfo) {
      csrfService.useToken(validation.tokenInfo.token);
    }

    return handler(request, context);
  };
};

/**
 * Generate CSRF token for client-side use
 * @param {string} sessionId - Session identifier
 * @returns {string} - Generated CSRF token
 */
export const generateClientToken = (sessionId = 'default') => {
  return csrfService.generateToken(sessionId);
};

/**
 * Get CSRF token statistics
 * @returns {Object} - Token statistics
 */
export const getCSRFStats = () => {
  return csrfService.getStats();
};

export default {
  validateFormCSRF,
  validateHeaderCSRF,
  validateBodyCSRF,
  getCSRFErrorMessage,
  csrfProtectedFetch,
  withCSRFProtection,
  generateClientToken,
  getCSRFStats
};

