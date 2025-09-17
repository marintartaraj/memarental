/**
 * Bundle Size Monitoring
 * Track bundle sizes, analyze performance impact, and set performance budgets
 */

class BundleMonitor {
  constructor() {
    this.budgets = {
      // Performance budgets (in KB)
      total: 500,        // Total bundle size
      vendor: 200,       // Vendor chunks
      app: 150,         // App chunks
      css: 50,          // CSS files
      images: 1000,     // Images (KB)
      fonts: 100        // Fonts (KB)
    };
    
    this.currentSizes = new Map();
    this.history = [];
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize bundle monitoring
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.analyzeCurrentBundle();
    this.setupResourceMonitoring();
    this.trackBundleChanges();
  }

  /**
   * Analyze current bundle sizes
   */
  analyzeCurrentBundle() {
    const resources = performance.getEntriesByType('resource');
    const bundleInfo = this.categorizeResources(resources);
    
    this.currentSizes = bundleInfo;
    this.history.push({
      timestamp: Date.now(),
      sizes: { ...bundleInfo },
      url: window.location.href
    });

    this.checkBudgets(bundleInfo);
  }

  /**
   * Categorize resources by type
   */
  categorizeResources(resources) {
    const categories = {
      js: 0,
      css: 0,
      images: 0,
      fonts: 0,
      vendor: 0,
      app: 0,
      total: 0
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      const name = resource.name;
      
      categories.total += size;

      if (name.includes('.js')) {
        categories.js += size;
        
        if (name.includes('vendor') || name.includes('chunk')) {
          categories.vendor += size;
        } else {
          categories.app += size;
        }
      } else if (name.includes('.css')) {
        categories.css += size;
      } else if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        categories.images += size;
      } else if (name.match(/\.(woff|woff2|ttf|eot)$/i)) {
        categories.fonts += size;
      }
    });

    return categories;
  }

  /**
   * Check against performance budgets
   */
  checkBudgets(sizes) {
    const violations = [];

    Object.keys(this.budgets).forEach(category => {
      const actualSize = sizes[category] || 0;
      const budget = this.budgets[category] * 1024; // Convert KB to bytes
      
      if (actualSize > budget) {
        violations.push({
          category,
          actual: Math.round(actualSize / 1024), // Convert to KB
          budget: this.budgets[category],
          overage: Math.round((actualSize - budget) / 1024)
        });
      }
    });

    if (violations.length > 0) {
      this.reportBudgetViolations(violations);
    }
  }

  /**
   * Report budget violations
   */
  reportBudgetViolations(violations) {
    console.warn('Bundle size budget violations:', violations);
    
    violations.forEach(violation => {
      this.sendToAnalytics({
        type: 'BUNDLE_BUDGET_VIOLATION',
        category: violation.category,
        actual: violation.actual,
        budget: violation.budget,
        overage: violation.overage,
        url: window.location.href,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup resource monitoring
   */
  setupResourceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.transferSize > 100000) { // Log large resources (>100KB)
          this.reportLargeResource(entry);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Report large resources
   */
  reportLargeResource(resource) {
    const sizeKB = Math.round(resource.transferSize / 1024);
    
    this.sendToAnalytics({
      type: 'LARGE_RESOURCE',
      name: resource.name,
      size: sizeKB,
      type: resource.initiatorType,
      duration: resource.duration,
      url: window.location.href,
      timestamp: Date.now()
    });
  }

  /**
   * Track bundle changes over time
   */
  trackBundleChanges() {
    // Track changes every 5 minutes
    setInterval(() => {
      this.analyzeCurrentBundle();
    }, 5 * 60 * 1000);
  }

  /**
   * Send to analytics
   */
  sendToAnalytics(data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'bundle_monitoring', {
        event_category: data.type,
        event_label: data.category || data.name,
        value: data.size || data.actual || data.overage
      });
    }
  }

  /**
   * Get current bundle sizes
   */
  getCurrentSizes() {
    return Object.fromEntries(this.currentSizes);
  }

  /**
   * Get bundle history
   */
  getHistory() {
    return this.history;
  }

  /**
   * Get performance budgets
   */
  getBudgets() {
    return this.budgets;
  }

  /**
   * Update performance budgets
   */
  updateBudgets(newBudgets) {
    this.budgets = { ...this.budgets, ...newBudgets };
  }

  /**
   * Get bundle analysis report
   */
  getBundleReport() {
    const currentSizes = this.getCurrentSizes();
    const budgets = this.getBudgets();
    
    const report = {
      current: {},
      budgets: {},
      status: 'good',
      recommendations: []
    };

    // Convert bytes to KB and compare with budgets
    Object.keys(budgets).forEach(category => {
      const actualKB = Math.round((currentSizes[category] || 0) / 1024);
      const budgetKB = budgets[category];
      
      report.current[category] = actualKB;
      report.budgets[category] = budgetKB;
      
      if (actualKB > budgetKB) {
        report.status = 'warning';
        report.recommendations.push(
          `${category} bundle (${actualKB}KB) exceeds budget (${budgetKB}KB)`
        );
      }
    });

    return report;
  }

  /**
   * Analyze bundle composition
   */
  analyzeComposition() {
    const sizes = this.getCurrentSizes();
    const total = sizes.total || 1;
    
    return {
      js: Math.round((sizes.js / total) * 100),
      css: Math.round((sizes.css / total) * 100),
      images: Math.round((sizes.images / total) * 100),
      fonts: Math.round((sizes.fonts / total) * 100),
      other: Math.round(((total - sizes.js - sizes.css - sizes.images - sizes.fonts) / total) * 100)
    };
  }
}

// Create singleton instance
export const bundleMonitor = new BundleMonitor();

// Initialize on import
if (typeof window !== 'undefined') {
  bundleMonitor.init();
}

export default bundleMonitor;
