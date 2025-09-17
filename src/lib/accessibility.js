// Advanced Accessibility Utilities for MEMA Rental

// Focus management utilities
export const focusManagement = {
  // Trap focus within a container
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
    if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
        e.preventDefault();
      }
    } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
        e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  // Restore focus to previous element
  restoreFocus: (previousElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  },

  // Skip to main content
  skipToMain: () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  }
};

// ARIA utilities
export const ariaUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Set up ARIA live region for announcements
  announce: (message, priority = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region') || createLiveRegion();
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
  },

  // Create live region if it doesn't exist
  createLiveRegion: () => {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    return liveRegion;
  }
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle arrow key navigation for lists
  handleArrowKeys: (currentIndex, items, direction) => {
    if (direction === 'up' || direction === 'left') {
      return currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else {
      return currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    }
  },

  // Handle Enter and Space key activation
  handleActivation: (callback) => {
    return (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    };
  },

  // Handle Escape key
  handleEscape: (callback) => {
    return (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
  }
};

// Screen reader utilities
export const screenReader = {
  // Hide content from screen readers
  hideFromScreenReader: (element) => {
    element.setAttribute('aria-hidden', 'true');
  },

  // Show content to screen readers only
  showToScreenReaderOnly: (element) => {
    element.classList.add('sr-only');
  },

  // Provide screen reader friendly text
  getScreenReaderText: (text, context = '') => {
    return context ? `${text}, ${context}` : text;
  }
};

// Color contrast utilities
export const colorContrast = {
  // Check if color meets WCAG AA standards
  meetsWCAGAA: (foreground, background) => {
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                    (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrast >= 4.5; // WCAG AA standard
  },

  // Get luminance of a color
  getLuminance: (color) => {
    const rgb = hexToRgb(color);
    const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};

// Accessibility testing utilities
export const accessibilityTesting = {
    // Check for missing alt text
  checkAltText: () => {
    const images = document.querySelectorAll('img');
    const missingAlt = Array.from(images).filter(img => !img.alt);
    return missingAlt;
  },

    // Check for missing form labels
  checkFormLabels: () => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const missingLabels = Array.from(inputs).filter(input => {
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      return !label && !ariaLabel && !ariaLabelledBy;
    });
    return missingLabels;
  },

  // Check for proper heading hierarchy
  checkHeadingHierarchy: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName[1]));
    const issues = [];
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
      issues.push({
          element: headings[i],
          issue: `Heading level jumps from h${levels[i-1]} to h${levels[i]}`
        });
      }
    }
    
    return issues;
  }
};

// Export all utilities
export default {
  focusManagement,
  ariaUtils,
  keyboardNavigation,
  screenReader,
  colorContrast,
  accessibilityTesting
};