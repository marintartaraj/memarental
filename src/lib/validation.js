/**
 * Validation Service - Simplified Version
 * Handles form validation
 */

class ValidationService {
  constructor() {
    this.rules = new Map();
    this.setupDefaultRules();
  }

  setupDefaultRules() {
    // Email validation
    this.addRule('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }, 'Please enter a valid email address');

    // Phone validation
    this.addRule('phone', (value) => {
      const phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
      return phoneRegex.test(value);
    }, 'Please enter a valid phone number');

    // Required field validation
    this.addRule('required', (value) => {
      return value !== null && value !== undefined && value !== '';
    }, 'This field is required');

    // Minimum length validation
    this.addRule('minLength', (value, minLength) => {
      return value && value.length >= minLength;
    }, (minLength) => `Must be at least ${minLength} characters long`);

    // Maximum length validation
    this.addRule('maxLength', (value, maxLength) => {
      return !value || value.length <= maxLength;
    }, (maxLength) => `Must be no more than ${maxLength} characters long`);
  }

  addRule(name, validator, message) {
    this.rules.set(name, { validator, message });
  }

  validateField(value, ruleName, ...args) {
    const rule = this.rules.get(ruleName);
    if (!rule) return null;

    const isValid = rule.validator(value, ...args);
    if (!isValid) {
      const message = typeof rule.message === 'function' 
        ? rule.message(...args) 
        : rule.message;
      return message;
    }
    return null;
  }

  validateBookingData(data, step) {
    const errors = {};

    // Step 1: Personal Information
    if (step >= 1) {
      if (!data.firstName) errors.firstName = 'First name is required';
      if (!data.lastName) errors.lastName = 'Last name is required';
      if (!data.email) errors.email = 'Email is required';
      else if (!this.validateField(data.email, 'email')) {
        // Email is valid
      } else {
        errors.email = this.validateField(data.email, 'email');
      }
      if (!data.phone) errors.phone = 'Phone is required';
      else if (!this.validateField(data.phone, 'phone')) {
        // Phone is valid
      } else {
        errors.phone = this.validateField(data.phone, 'phone');
      }
    }

    // Step 2: Booking Details
    if (step >= 2) {
      if (!data.pickupDate) errors.pickupDate = 'Pickup date is required';
      if (!data.returnDate) errors.returnDate = 'Return date is required';
      if (data.pickupDate && data.returnDate) {
        const pickup = new Date(data.pickupDate);
        const returnDate = new Date(data.returnDate);
        if (returnDate <= pickup) {
          errors.returnDate = 'Return date must be after pickup date';
        }
      }
    }

    // Step 3: Additional Information
    if (step >= 3) {
      // Add any additional validation rules here
    }

    return errors;
  }

  canProceedToNextStep(data, currentStep) {
    const errors = this.validateBookingData(data, currentStep);
    return Object.keys(errors).length === 0;
  }
}

// Create singleton instance
export const validationService = new ValidationService();

// Export individual functions for convenience
export const getValidationErrors = (data, step) => {
  return validationService.validateBookingData(data, step);
};

export const canProceedToNextStep = (data, currentStep) => {
  return validationService.canProceedToNextStep(data, currentStep);
};

// Export for use in components
export default validationService;