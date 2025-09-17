import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast icons
const TOAST_ICONS = {
  [TOAST_TYPES.SUCCESS]: CheckCircle,
  [TOAST_TYPES.ERROR]: XCircle,
  [TOAST_TYPES.WARNING]: AlertCircle,
  [TOAST_TYPES.INFO]: Info
};

// Toast colors
const TOAST_COLORS = {
  [TOAST_TYPES.SUCCESS]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500'
  },
  [TOAST_TYPES.ERROR]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500'
  },
  [TOAST_TYPES.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500'
  },
  [TOAST_TYPES.INFO]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500'
  }
};

// Individual toast component
const Toast = ({ toast, onRemove }) => {
  const { id, type, title, message, duration = 5000, action } = toast;
  const Icon = TOAST_ICONS[type];
  const colors = TOAST_COLORS[type];

  // Auto-remove toast after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative max-w-sm w-full bg-white shadow-lg rounded-lg border
        ${colors.border} ${colors.bg}
        pointer-events-auto ring-1 ring-black ring-opacity-5
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${colors.icon}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-medium ${colors.text}`}>
                {title}
              </p>
            )}
            {message && (
              <p className={`mt-1 text-sm ${colors.text} ${title ? 'opacity-90' : ''}`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${colors.text} hover:opacity-80 transition-opacity`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onRemove(id)}
              className={`inline-flex ${colors.text} hover:opacity-80 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${colors.icon.replace('text-', 'bg-')}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

// Toast container component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast context and provider
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience methods
export const toast = {
  success: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: TOAST_TYPES.SUCCESS,
      title,
      message,
      ...options
    });
  },

  error: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: TOAST_TYPES.ERROR,
      title,
      message,
      ...options
    });
  },

  warning: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: TOAST_TYPES.WARNING,
      title,
      message,
      ...options
    });
  },

  info: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: TOAST_TYPES.INFO,
      title,
      message,
      ...options
    });
  }
};

// Toast notification component
const ToastNotification = ({ type, title, message, duration, action, onClose }) => {
  const { addToast } = useToast();

  useEffect(() => {
    const id = addToast({
      type,
      title,
      message,
      duration,
      action
    });

    return () => {
      if (onClose) onClose(id);
    };
  }, [type, title, message, duration, action, addToast, onClose]);

  return null;
};

export default ToastNotification;
