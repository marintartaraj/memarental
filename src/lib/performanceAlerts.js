/**
 * Performance Alert System
 * Real-time alerts for performance issues and threshold violations
 */

class PerformanceAlerts {
  constructor() {
    this.alerts = [];
    this.subscribers = new Set();
    this.alertThresholds = {
      LCP: 4000,      // 4 seconds
      FID: 300,       // 300ms
      CLS: 0.25,      // 0.25
      FCP: 3000,      // 3 seconds
      TTFB: 1500,     // 1.5 seconds
      MEMORY: 80,     // 80% memory usage
      BUNDLE_SIZE: 1000 // 1MB bundle
    };
    
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize alert system
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.setupPerformanceAlerts();
    this.setupMemoryAlerts();
    this.setupBundleAlerts();
  }

  /**
   * Setup performance alerts
   */
  setupPerformanceAlerts() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.checkPerformanceEntry(entry);
        });
      });

      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] 
      });
    }
  }

  /**
   * Check performance entry for alerts
   */
  checkPerformanceEntry(entry) {
    let alertType = null;
    let value = 0;
    let threshold = 0;

    switch (entry.entryType) {
      case 'largest-contentful-paint':
        alertType = 'LCP';
        value = entry.startTime;
        threshold = this.alertThresholds.LCP;
        break;
      case 'first-input':
        alertType = 'FID';
        value = entry.processingStart - entry.startTime;
        threshold = this.alertThresholds.FID;
        break;
      case 'layout-shift':
        alertType = 'CLS';
        value = entry.value;
        threshold = this.alertThresholds.CLS;
        break;
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          alertType = 'FCP';
          value = entry.startTime;
          threshold = this.alertThresholds.FCP;
        }
        break;
      case 'navigation':
        alertType = 'TTFB';
        value = entry.responseStart - entry.requestStart;
        threshold = this.alertThresholds.TTFB;
        break;
    }

    if (alertType && value > threshold) {
      this.createAlert({
        type: 'PERFORMANCE_THRESHOLD_EXCEEDED',
        metric: alertType,
        value: Math.round(value),
        threshold: threshold,
        severity: this.getSeverity(value, threshold),
        metadata: {
          entryType: entry.entryType,
          url: window.location.href,
          timestamp: Date.now()
        }
      });
    }
  }

  /**
   * Setup memory alerts
   */
  setupMemoryAlerts() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > this.alertThresholds.MEMORY) {
        this.createAlert({
          type: 'MEMORY_USAGE_HIGH',
          metric: 'MEMORY',
          value: Math.round(usagePercent),
          threshold: this.alertThresholds.MEMORY,
          severity: this.getSeverity(usagePercent, this.alertThresholds.MEMORY),
          metadata: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            url: window.location.href,
            timestamp: Date.now()
          }
        });
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  /**
   * Setup bundle alerts
   */
  setupBundleAlerts() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.transferSize > this.alertThresholds.BUNDLE_SIZE * 1024) {
          this.createAlert({
            type: 'LARGE_RESOURCE',
            metric: 'BUNDLE_SIZE',
            value: Math.round(entry.transferSize / 1024),
            threshold: this.alertThresholds.BUNDLE_SIZE,
            severity: this.getSeverity(entry.transferSize / 1024, this.alertThresholds.BUNDLE_SIZE),
            metadata: {
              name: entry.name,
              type: entry.initiatorType,
              size: entry.transferSize,
              duration: entry.duration,
              url: window.location.href,
              timestamp: Date.now()
            }
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Get severity level
   */
  getSeverity(value, threshold) {
    const ratio = value / threshold;
    if (ratio >= 2) return 'critical';
    if (ratio >= 1.5) return 'high';
    if (ratio >= 1.2) return 'medium';
    return 'low';
  }

  /**
   * Create alert
   */
  createAlert(alertData) {
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      createdAt: new Date().toISOString(),
      acknowledged: false,
      resolved: false
    };

    this.alerts.push(alert);
    this.notifySubscribers(alert);
    this.sendToExternalServices(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Notify subscribers
   */
  notifySubscribers(alert) {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error notifying alert subscriber:', error);
      }
    });
  }

  /**
   * Send to external services
   */
  sendToExternalServices(alert) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_alert', {
        alert_type: alert.type,
        metric: alert.metric,
        severity: alert.severity,
        value: alert.value,
        threshold: alert.threshold,
        page_location: alert.metadata.url
      });
    }

    // Send to error tracking
    if (alert.severity === 'critical' || alert.severity === 'high') {
      this.sendToErrorTracking(alert);
    }
  }

  /**
   * Send to error tracking service
   */
  sendToErrorTracking(alert) {
    // Example: Send to Sentry, LogRocket, etc.
    console.error('Performance Alert:', alert);
  }

  /**
   * Subscribe to alerts
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Get all alerts
   */
  getAlerts() {
    return [...this.alerts];
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity) {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(minutes = 60) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.alerts.filter(alert => 
      new Date(alert.createdAt).getTime() > cutoff
    );
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Clear resolved alerts
   */
  clearResolvedAlerts() {
    this.alerts = this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Get alert statistics
   */
  getAlertStats() {
    const stats = {
      total: this.alerts.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byType: {},
      recent: this.getRecentAlerts().length,
      acknowledged: 0,
      resolved: 0
    };

    this.alerts.forEach(alert => {
      stats.bySeverity[alert.severity]++;
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
      if (alert.acknowledged) stats.acknowledged++;
      if (alert.resolved) stats.resolved++;
    });

    return stats;
  }

  /**
   * Update alert thresholds
   */
  updateThresholds(newThresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...newThresholds };
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return { ...this.alertThresholds };
  }
}

// Create singleton instance
export const performanceAlerts = new PerformanceAlerts();

// Initialize on import
if (typeof window !== 'undefined') {
  performanceAlerts.init();
}

export default performanceAlerts;
