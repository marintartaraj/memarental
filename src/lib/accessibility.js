/**
 * Accessibility Service
 * Comprehensive accessibility features and utilities
 */

class AccessibilityService {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.announcements = [];
    this.isReducedMotion = false;
    this.isHighContrast = false;
    this.fontSize = 'normal';
    
    this.setupAccessibilityFeatures();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }

  /**
   * Setup accessibility features
   */
  setupAccessibilityFeatures() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isReducedMotion = true;
      document.documentElement.classList.add('reduced-motion');
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.isHighContrast = true;
      document.documentElement.classList.add('high-contrast');
    }

    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      document.documentElement.classList.toggle('reduced-motion', e.matches);
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.isHighContrast = e.matches;
      document.documentElement.classList.toggle('high-contrast', e.matches);
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }
    });

    // Skip to main content
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey && e.target === document.body) {
        this.createSkipLink();
      }
    });
  }

  /**
   * Setup screen reader support
   */
  setupScreenReaderSupport() {
    // Create live region for announcements
    this.createLiveRegion();
    
    // Setup focus management
    this.setupFocusManagement();
  }

  /**
   * Create live region for screen reader announcements
   */
  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  /**
   * Create skip link
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Handle tab navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleTabNavigation(e) {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.style.display !== 'none') {
      this.trapFocusInModal(e, modal);
    }
  }

  /**
   * Trap focus in modal
   * @param {KeyboardEvent} e - Keyboard event
   * @param {HTMLElement} modal - Modal element
   */
  trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(this.focusableElements);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handle escape key
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleEscapeKey(e) {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.style.display !== 'none') {
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Store last focused element
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', (e) => {
      lastFocusedElement = e.target;
    });

    // Restore focus when modal closes
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-close]')) {
        setTimeout(() => {
          if (lastFocusedElement && lastFocusedElement.focus) {
            lastFocusedElement.focus();
          }
        }, 100);
      }
    });
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level (polite, assertive)
   */
  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Set focus to element
   * @param {HTMLElement} element - Element to focus
   */
  setFocus(element) {
    if (element && element.focus) {
      element.focus();
    }
  }

  /**
   * Get focusable elements within container
   * @param {HTMLElement} container - Container element
   * @returns {NodeList} - Focusable elements
   */
  getFocusableElements(container = document) {
    return container.querySelectorAll(this.focusableElements);
  }

  /**
   * Add ARIA attributes to element
   * @param {HTMLElement} element - Element to modify
   * @param {Object} attributes - ARIA attributes
   */
  addAriaAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('aria-')) {
        element.setAttribute(key, value);
      }
    });
  }

  /**
   * Create accessible button
   * @param {Object} options - Button options
   * @returns {HTMLButtonElement} - Accessible button
   */
  createAccessibleButton(options = {}) {
    const {
      text,
      icon,
      onClick,
      disabled = false,
      ariaLabel,
      ariaDescribedBy,
      className = ''
    } = options;

    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.disabled = disabled;

    if (icon) {
      const iconElement = document.createElement('span');
      iconElement.className = `icon ${icon}`;
      iconElement.setAttribute('aria-hidden', 'true');
      button.insertBefore(iconElement, button.firstChild);
    }

    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }

    if (ariaDescribedBy) {
      button.setAttribute('aria-describedby', ariaDescribedBy);
    }

    if (onClick) {
      button.addEventListener('click', onClick);
    }

    return button;
  }

  /**
   * Create accessible form field
   * @param {Object} options - Field options
   * @returns {HTMLElement} - Accessible form field
   */
  createAccessibleField(options = {}) {
    const {
      type = 'text',
      label,
      id,
      required = false,
      errorMessage,
      helpText,
      className = ''
    } = options;

    const fieldset = document.createElement('div');
    fieldset.className = `form-field ${className}`;

    // Create label
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', id);
    if (required) {
      labelElement.innerHTML += ' <span class="required" aria-label="required">*</span>';
    }
    fieldset.appendChild(labelElement);

    // Create input
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.required = required;
    
    if (errorMessage) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `${id}-error`);
    } else if (helpText) {
      input.setAttribute('aria-describedby', `${id}-help`);
    }

    fieldset.appendChild(input);

    // Add help text
    if (helpText) {
      const helpElement = document.createElement('div');
      helpElement.id = `${id}-help`;
      helpElement.className = 'help-text';
      helpElement.textContent = helpText;
      fieldset.appendChild(helpElement);
    }

    // Add error message
    if (errorMessage) {
      const errorElement = document.createElement('div');
      errorElement.id = `${id}-error`;
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      errorElement.setAttribute('role', 'alert');
      fieldset.appendChild(errorElement);
    }

    return fieldset;
  }

  /**
   * Create accessible table
   * @param {Object} options - Table options
   * @returns {HTMLTableElement} - Accessible table
   */
  createAccessibleTable(options = {}) {
    const {
      caption,
      headers,
      data,
      className = ''
    } = options;

    const table = document.createElement('table');
    table.className = className;
    table.setAttribute('role', 'table');

    // Add caption
    if (caption) {
      const captionElement = document.createElement('caption');
      captionElement.textContent = caption;
      table.appendChild(captionElement);
    }

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.text;
      th.setAttribute('scope', 'col');
      if (header.sortable) {
        th.setAttribute('tabindex', '0');
        th.setAttribute('role', 'button');
        th.setAttribute('aria-sort', 'none');
      }
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    
    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      
      row.forEach((cell, cellIndex) => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);

    return table;
  }

  /**
   * Add keyboard shortcuts
   * @param {Object} shortcuts - Keyboard shortcuts
   */
  addKeyboardShortcuts(shortcuts) {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const modifier = e.ctrlKey || e.metaKey;
      
      if (modifier && shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    });
  }

  /**
   * Check color contrast
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @returns {Object} - Contrast ratio and compliance
   */
  checkColorContrast(foreground, background) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // Calculate relative luminance
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) {
      return { ratio: 0, compliant: false };
    }

    const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

    return {
      ratio: Math.round(ratio * 100) / 100,
      compliant: ratio >= 4.5, // WCAG AA standard
      aaCompliant: ratio >= 4.5,
      aaaCompliant: ratio >= 7
    };
  }

  /**
   * Increase font size
   */
  increaseFontSize() {
    const currentSize = this.fontSize;
    const sizes = ['small', 'normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(currentSize);
    
    if (currentIndex < sizes.length - 1) {
      this.fontSize = sizes[currentIndex + 1];
      document.documentElement.classList.remove(...sizes);
      document.documentElement.classList.add(this.fontSize);
      this.announce(`Font size increased to ${this.fontSize}`);
    }
  }

  /**
   * Decrease font size
   */
  decreaseFontSize() {
    const currentSize = this.fontSize;
    const sizes = ['small', 'normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(currentSize);
    
    if (currentIndex > 0) {
      this.fontSize = sizes[currentIndex - 1];
      document.documentElement.classList.remove(...sizes);
      document.documentElement.classList.add(this.fontSize);
      this.announce(`Font size decreased to ${this.fontSize}`);
    }
  }

  /**
   * Reset font size
   */
  resetFontSize() {
    this.fontSize = 'normal';
    document.documentElement.classList.remove('small', 'large', 'xlarge');
    this.announce('Font size reset to normal');
  }

  /**
   * Toggle high contrast mode
   */
  toggleHighContrast() {
    this.isHighContrast = !this.isHighContrast;
    document.documentElement.classList.toggle('high-contrast', this.isHighContrast);
    this.announce(`High contrast mode ${this.isHighContrast ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get accessibility report
   * @returns {Object} - Accessibility report
   */
  getAccessibilityReport() {
    const issues = [];
    
    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push({
          type: 'missing-alt',
          element: img,
          message: 'Image missing alt text'
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const id = input.id;
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          type: 'missing-label',
          element: input,
          message: 'Form field missing label'
        });
      }
    });

    // Check for missing headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.push({
        type: 'missing-headings',
        element: document.body,
        message: 'Page missing heading structure'
      });
    }

    return {
      issues,
      totalIssues: issues.length,
      compliance: issues.length === 0 ? 'compliant' : 'needs-improvement'
    };
  }
}

// Create singleton instance
export const accessibilityService = new AccessibilityService();

// Export for use in components
export default accessibilityService;

