// Security Utilities for MEMA Rental

// Input validation utilities
export const inputValidation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone number validation (Albanian format)
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+355|0)[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Name validation
  isValidName: (name) => {
    const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]{2,50}$/;
    return nameRegex.test(name.trim());
  },

  // Password validation
  isValidPassword: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  },

  // License plate validation (Albanian format)
  isValidLicensePlate: (plate) => {
    const plateRegex = /^[A-Z]{2}-[0-9]{3}[A-Z]{2}$/;
    return plateRegex.test(plate.toUpperCase());
  },

  // Date validation
  isValidDate: (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
  },

  // Future date validation
  isFutureDate: (date) => {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj > today;
  },

  // Age validation
  isValidAge: (birthDate, minAge = 18, maxAge = 100) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= minAge && age <= maxAge;
  },

  // Credit card validation (Luhn algorithm)
  isValidCreditCard: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  // CVV validation
  isValidCVV: (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Expiry date validation
  isValidExpiryDate: (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    return expiry > today;
  }
};

// XSS protection utilities
export const xssProtection = {
  // Sanitize HTML content
  sanitizeHTML: (html) => {
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
    const allowedAttributes = ['href', 'title'];
    
    // Simple HTML sanitization (in production, use a library like DOMPurify)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  // Escape HTML entities
  escapeHTML: (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return text.replace(/[&<>"'/]/g, (s) => map[s]);
  },

  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  // Validate and sanitize URL
  sanitizeURL: (url) => {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return null;
      }
      
      return urlObj.toString();
    } catch {
      return null;
    }
  }
};

// CSRF protection utilities
export const csrfProtection = {
  // Generate CSRF token
  generateToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate CSRF token
  validateToken: (token, sessionToken) => {
    return token && sessionToken && token === sessionToken;
  },

  // Add CSRF token to forms
  addCSRFToken: (formData, token) => {
    formData.append('_csrf', token);
    return formData;
  }
};

// Content Security Policy utilities
export const cspUtils = {
  // Generate CSP header
  generateCSP: () => {
    return {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://api.supabase.co"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
  },

  // Validate CSP
  validateCSP: (cspHeader) => {
    const requiredDirectives = [
      'default-src',
      'script-src',
      'style-src',
      'img-src',
      'connect-src'
    ];
    
    return requiredDirectives.every(directive => 
      cspHeader.includes(directive)
    );
  }
};

// Rate limiting utilities
export const rateLimiting = {
  // Simple in-memory rate limiter
  createRateLimiter: (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();
    
    return (identifier) => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Clean old entries
      for (const [key, timestamp] of requests.entries()) {
        if (timestamp < windowStart) {
          requests.delete(key);
        }
      }
      
      // Check current requests
      const currentRequests = Array.from(requests.values())
        .filter(timestamp => timestamp > windowStart).length;
      
      if (currentRequests >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      // Add current request
      requests.set(identifier, now);
      return true; // Request allowed
    };
  },

  // IP-based rate limiting
  createIPRateLimiter: (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const rateLimiter = rateLimiting.createRateLimiter(maxRequests, windowMs);
    
    return (req) => {
      const ip = req.ip || req.connection.remoteAddress;
      return rateLimiter(ip);
    };
  }
};

// Data encryption utilities
export const encryption = {
  // Simple encryption (for non-sensitive data)
  encrypt: async (text, password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      keyMaterial,
      data
    );
    
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      salt: Array.from(salt),
      iv: Array.from(iv)
    };
  },

  // Simple decryption
  decrypt: async (encryptedData, password) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const keyMaterial = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(encryptedData.salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      keyMaterial,
      new Uint8Array(encryptedData.encrypted)
    );
    
    return decoder.decode(decrypted);
  }
};

// Security headers utilities
export const securityHeaders = {
  // Generate security headers
  generateHeaders: () => {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': Object.entries(cspUtils.generateCSP())
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ')
    };
  },

  // Validate security headers
  validateHeaders: (headers) => {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Referrer-Policy'
    ];
    
    return requiredHeaders.every(header => 
      headers[header] !== undefined
    );
  }
};

// Export all utilities
export default {
  inputValidation,
  xssProtection,
  csrfProtection,
  cspUtils,
  rateLimiting,
  encryption,
  securityHeaders
};
