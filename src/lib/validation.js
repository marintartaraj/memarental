// Validation utilities for booking form
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateLicenseNumber = (license) => {
  return license.length >= 5 && license.length <= 20;
};

export const validateDateRange = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return false;
  
  const pickup = new Date(pickupDate);
  const returnDateObj = new Date(returnDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return pickup >= today && returnDateObj > pickup;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateLicenseExpiry = (expiryDate) => {
  if (!expiryDate) return false;
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  return expiry > today;
};

export const getValidationErrors = (formData, step) => {
  const errors = {};

  if (step === 1) {
    if (!validateRequired(formData.pickupDate)) {
      errors.pickupDate = 'Pickup date is required';
    } else if (new Date(formData.pickupDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.pickupDate = 'Pickup date must be in the future';
    }

    if (!validateRequired(formData.returnDate)) {
      errors.returnDate = 'Return date is required';
    } else if (new Date(formData.returnDate) <= new Date(formData.pickupDate)) {
      errors.returnDate = 'Return date must be after pickup date';
    }

    if (!validateRequired(formData.pickupTime)) {
      errors.pickupTime = 'Pickup time is required';
    }

    if (!validateRequired(formData.returnTime)) {
      errors.returnTime = 'Return time is required';
    }
  }

  if (step === 2) {
    if (!validateRequired(formData.firstName)) {
      errors.firstName = 'First name is required';
    }

    if (!validateRequired(formData.lastName)) {
      errors.lastName = 'Last name is required';
    }

    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.phone)) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!validateRequired(formData.licenseNumber)) {
      errors.licenseNumber = 'Driver license number is required';
    } else if (!validateLicenseNumber(formData.licenseNumber)) {
      errors.licenseNumber = 'License number must be 5-20 characters';
    }

    if (!validateRequired(formData.licenseExpiry)) {
      errors.licenseExpiry = 'License expiry date is required';
    } else if (!validateLicenseExpiry(formData.licenseExpiry)) {
      errors.licenseExpiry = 'License must be valid (not expired)';
    }
  }

  if (step === 3) {
    if (!validateRequired(formData.pickupLocation)) {
      errors.pickupLocation = 'Pickup location is required';
    }

    if (!validateRequired(formData.returnLocation)) {
      errors.returnLocation = 'Return location is required';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
  }

  return errors;
};

export const canProceedToNextStep = (formData, currentStep) => {
  const errors = getValidationErrors(formData, currentStep);
  return Object.keys(errors).length === 0;
};
