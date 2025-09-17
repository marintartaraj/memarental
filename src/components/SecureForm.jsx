import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { inputValidation, xssProtection } from '@/lib/security';

// Field validation hook
const useFieldValidation = (initialValue = '', validationRules = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    if (!validationRules.required && !value.trim()) {
      setError('');
      return true;
    }

    if (validationRules.required && !value.trim()) {
      setError(validationRules.requiredMessage || 'This field is required');
      return false;
    }

    if (validationRules.email && !inputValidation.isValidEmail(value)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (validationRules.phone && !inputValidation.isValidPhone(value)) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (validationRules.name && !inputValidation.isValidName(value)) {
      setError('Please enter a valid name (2-50 characters, letters only)');
      return false;
    }

    if (validationRules.minLength && value.length < validationRules.minLength) {
      setError(`Minimum ${validationRules.minLength} characters required`);
      return false;
    }

    if (validationRules.maxLength && value.length > validationRules.maxLength) {
      setError(`Maximum ${validationRules.maxLength} characters allowed`);
      return false;
    }

    if (validationRules.pattern && !validationRules.pattern.test(value)) {
      setError(validationRules.patternMessage || 'Invalid format');
      return false;
    }

    if (validationRules.custom && !validationRules.custom(value)) {
      setError(validationRules.customMessage || 'Invalid value');
      return false;
    }

    setError('');
    return true;
  }, [value, validationRules]);

  const handleChange = useCallback((newValue) => {
    const sanitizedValue = xssProtection.sanitizeInput(newValue);
    setValue(sanitizedValue);
    
    if (touched) {
      validate();
    }
  }, [touched, validate]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: !error && touched,
    handleChange,
    handleBlur,
    validate,
    reset
  };
};

// Secure input component
const SecureInput = ({ 
  type = 'text',
  label,
  placeholder,
  validationRules = {},
  className = '',
  ...props 
}) => {
  const field = useFieldValidation('', validationRules);
  const inputRef = useRef(null);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validationRules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.input
        ref={inputRef}
        type={type}
        value={field.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
          ${field.error && field.touched ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      
      {field.error && field.touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {field.error}
        </motion.p>
      )}
    </div>
  );
};

// Secure textarea component
const SecureTextarea = ({ 
  label,
  placeholder,
  validationRules = {},
  className = '',
  rows = 4,
  ...props 
}) => {
  const field = useFieldValidation('', validationRules);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validationRules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.textarea
        value={field.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm resize-vertical
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
          ${field.error && field.touched ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      
      {field.error && field.touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {field.error}
        </motion.p>
      )}
    </div>
  );
};

// Secure select component
const SecureSelect = ({ 
  label,
  options = [],
  validationRules = {},
  className = '',
  placeholder = 'Select an option',
  ...props 
}) => {
  const field = useFieldValidation('', validationRules);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validationRules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.select
        value={field.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
          ${field.error && field.touched ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      
      {field.error && field.touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {field.error}
        </motion.p>
      )}
    </div>
  );
};

// Password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
  const validation = inputValidation.isValidPassword(password);
  const { requirements } = validation;

  const getStrengthColor = () => {
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    if (metRequirements < 2) return 'bg-red-500';
    if (metRequirements < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    if (metRequirements < 2) return 'Weak';
    if (metRequirements < 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getStrengthColor()}`}
            initial={{ width: 0 }}
            animate={{ 
              width: `${(Object.values(requirements).filter(Boolean).length / 5) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {getStrengthText()}
        </span>
      </div>
      
      <div className="space-y-1">
        {Object.entries(requirements).map(([key, isValid]) => (
          <div key={key} className="flex items-center space-x-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-gray-300'}`}
              animate={{ scale: isValid ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <span className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
              {key === 'minLength' && 'At least 8 characters'}
              {key === 'hasUpperCase' && 'Uppercase letter'}
              {key === 'hasLowerCase' && 'Lowercase letter'}
              {key === 'hasNumbers' && 'Number'}
              {key === 'hasSpecialChar' && 'Special character'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Secure form component
const SecureForm = ({ 
  children, 
  onSubmit, 
  className = '',
  ...props 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Sanitize form data
      const formData = new FormData(e.target);
      const sanitizedData = {};
      
      for (const [key, value] of formData.entries()) {
        sanitizedData[key] = xssProtection.sanitizeInput(value);
      }

      await onSubmit(sanitizedData);
    } catch (error) {
      setSubmitError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
      
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <p className="text-sm text-red-600">{submitError}</p>
        </motion.div>
      )}
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full px-4 py-2 rounded-md font-medium
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500'
          }
          text-white transition-colors duration-200
        `}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </motion.button>
    </motion.form>
  );
};

export {
  SecureInput,
  SecureTextarea,
  SecureSelect,
  PasswordStrengthIndicator,
  SecureForm,
  useFieldValidation
};

export default {
  SecureInput,
  SecureTextarea,
  SecureSelect,
  PasswordStrengthIndicator,
  SecureForm,
  useFieldValidation
};
