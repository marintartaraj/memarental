/**
 * Conversion Funnel Analysis
 * Track and analyze user conversion through the booking funnel
 */

class ConversionFunnel {
  constructor() {
    this.funnelSteps = [
      { 
        id: 'homepage_view', 
        name: 'Homepage View', 
        description: 'User visits homepage',
        required: true
      },
      { 
        id: 'cars_page_view', 
        name: 'Cars Page View', 
        description: 'User browses available cars',
        required: true
      },
      { 
        id: 'car_detail_view', 
        name: 'Car Detail View', 
        description: 'User views specific car details',
        required: true
      },
      { 
        id: 'booking_start', 
        name: 'Booking Started', 
        description: 'User begins booking process',
        required: true
      },
      { 
        id: 'booking_form_filled', 
        name: 'Booking Form Filled', 
        description: 'User completes booking form',
        required: true
      },
      { 
        id: 'booking_complete', 
        name: 'Booking Completed', 
        description: 'User successfully completes booking',
        required: true
      }
    ];

    this.funnelData = new Map();
    this.conversionRates = new Map();
    this.dropOffPoints = [];
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize conversion funnel tracking
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.setupFunnelTracking();
    this.loadHistoricalData();
  }

  /**
   * Setup funnel tracking
   */
  setupFunnelTracking() {
    // Track page views for funnel steps
    this.trackPageViewFunnel();
    
    // Track form interactions
    this.trackFormFunnel();
    
    // Track booking completion
    this.trackBookingFunnel();
  }

  /**
   * Track page view funnel steps
   */
  trackPageViewFunnel() {
    const currentPath = window.location.pathname;
    
    switch (currentPath) {
      case '/':
        this.trackFunnelStep('homepage_view');
        break;
      case '/cars':
        this.trackFunnelStep('cars_page_view');
        break;
      default:
        if (currentPath.startsWith('/cars/') && currentPath !== '/cars') {
          this.trackFunnelStep('car_detail_view', { carId: currentPath.split('/')[2] });
        }
        break;
    }
  }

  /**
   * Track form funnel steps
   */
  trackFormFunnel() {
    // Track booking form start
    const bookingForms = document.querySelectorAll('form[data-booking-form]');
    bookingForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        this.trackFunnelStep('booking_start');
      });
    });

    // Track form field completion
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => {
        if (this.isFormComplete()) {
          this.trackFunnelStep('booking_form_filled');
        }
      });
    });
  }

  /**
   * Track booking funnel completion
   */
  trackBookingFunnel() {
    // Track booking completion
    const bookingCompleteElements = document.querySelectorAll('[data-booking-complete]');
    bookingCompleteElements.forEach(element => {
      element.addEventListener('click', () => {
        this.trackFunnelStep('booking_complete');
      });
    });
  }

  /**
   * Check if form is complete
   */
  isFormComplete() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
  }

  /**
   * Track funnel step
   */
  trackFunnelStep(stepId, data = {}) {
    const step = this.funnelSteps.find(s => s.id === stepId);
    if (!step) return;

    const funnelEvent = {
      stepId,
      stepName: step.name,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      url: window.location.href,
      ...data
    };

    // Store funnel data
    if (!this.funnelData.has(stepId)) {
      this.funnelData.set(stepId, []);
    }
    this.funnelData.get(stepId).push(funnelEvent);

    // Calculate conversion rates
    this.calculateConversionRates();

    // Send to analytics
    this.sendToAnalytics(funnelEvent);

    // Check for drop-off points
    this.checkDropOffPoints(stepId);
  }

  /**
   * Calculate conversion rates
   */
  calculateConversionRates() {
    const rates = new Map();
    
    this.funnelSteps.forEach((step, index) => {
      const stepData = this.funnelData.get(step.id) || [];
      const stepCount = stepData.length;
      
      if (index === 0) {
        rates.set(step.id, 100); // First step is always 100%
      } else {
        const previousStep = this.funnelSteps[index - 1];
        const previousStepData = this.funnelData.get(previousStep.id) || [];
        const previousStepCount = previousStepData.length;
        
        const conversionRate = previousStepCount > 0 ? (stepCount / previousStepCount) * 100 : 0;
        rates.set(step.id, conversionRate);
      }
    });

    this.conversionRates = rates;
  }

  /**
   * Check for drop-off points
   */
  checkDropOffPoints(currentStepId) {
    const currentStepIndex = this.funnelSteps.findIndex(step => step.id === currentStepId);
    
    if (currentStepIndex > 0) {
      const previousStep = this.funnelSteps[currentStepIndex - 1];
      const currentStepData = this.funnelData.get(currentStepId) || [];
      const previousStepData = this.funnelData.get(previousStep.id) || [];
      
      const dropOffRate = previousStepData.length - currentStepData.length;
      
      if (dropOffRate > 0) {
        const dropOffPoint = {
          fromStep: previousStep.id,
          toStep: currentStepId,
          dropOffCount: dropOffRate,
          dropOffRate: (dropOffRate / previousStepData.length) * 100,
          timestamp: Date.now()
        };
        
        this.dropOffPoints.push(dropOffPoint);
      }
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    return sessionStorage.getItem('session_id') || `session_${Date.now()}`;
  }

  /**
   * Get user ID
   */
  getUserId() {
    return localStorage.getItem('user_analytics_id') || `user_${Date.now()}`;
  }

  /**
   * Send to analytics
   */
  sendToAnalytics(data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'funnel_step', {
        event_category: 'conversion_funnel',
        event_label: data.stepName,
        value: data.stepId,
        custom_parameter_1: data.sessionId,
        custom_parameter_2: data.userId
      });
    }
  }

  /**
   * Load historical data
   */
  loadHistoricalData() {
    // Load from localStorage for demo purposes
    const storedData = localStorage.getItem('funnel_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.funnelData = new Map(parsedData.funnelData);
        this.conversionRates = new Map(parsedData.conversionRates);
        this.dropOffPoints = parsedData.dropOffPoints || [];
      } catch (error) {
        console.error('Error loading funnel data:', error);
      }
    }
  }

  /**
   * Save data
   */
  saveData() {
    const dataToSave = {
      funnelData: Array.from(this.funnelData.entries()),
      conversionRates: Array.from(this.conversionRates.entries()),
      dropOffPoints: this.dropOffPoints
    };
    
    localStorage.setItem('funnel_data', JSON.stringify(dataToSave));
  }

  /**
   * Get funnel analysis
   */
  getFunnelAnalysis() {
    const analysis = {
      steps: this.funnelSteps.map(step => ({
        ...step,
        count: this.funnelData.get(step.id)?.length || 0,
        conversionRate: this.conversionRates.get(step.id) || 0
      })),
      overallConversionRate: this.getOverallConversionRate(),
      dropOffPoints: this.dropOffPoints,
      recommendations: this.getRecommendations()
    };

    return analysis;
  }

  /**
   * Get overall conversion rate
   */
  getOverallConversionRate() {
    const firstStep = this.funnelSteps[0];
    const lastStep = this.funnelSteps[this.funnelSteps.length - 1];
    
    const firstStepCount = this.funnelData.get(firstStep.id)?.length || 0;
    const lastStepCount = this.funnelData.get(lastStep.id)?.length || 0;
    
    return firstStepCount > 0 ? (lastStepCount / firstStepCount) * 100 : 0;
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations() {
    const recommendations = [];
    const analysis = this.getFunnelAnalysis();
    
    // Check for low conversion rates
    analysis.steps.forEach((step, index) => {
      if (index > 0 && step.conversionRate < 50) {
        recommendations.push({
          type: 'low_conversion',
          step: step.name,
          rate: step.conversionRate,
          suggestion: `Optimize ${step.name} to improve conversion rate`
        });
      }
    });

    // Check for drop-off points
    this.dropOffPoints.forEach(dropOff => {
      if (dropOff.dropOffRate > 30) {
        recommendations.push({
          type: 'high_dropoff',
          fromStep: dropOff.fromStep,
          toStep: dropOff.toStep,
          rate: dropOff.dropOffRate,
          suggestion: `Address drop-off between ${dropOff.fromStep} and ${dropOff.toStep}`
        });
      }
    });

    return recommendations;
  }

  /**
   * Get funnel metrics
   */
  getFunnelMetrics() {
    const metrics = {
      totalSteps: this.funnelSteps.length,
      completedSteps: this.funnelSteps.filter(step => 
        this.funnelData.get(step.id)?.length > 0
      ).length,
      overallConversionRate: this.getOverallConversionRate(),
      averageStepConversionRate: this.getAverageStepConversionRate(),
      totalDropOffs: this.dropOffPoints.length,
      highestDropOffPoint: this.getHighestDropOffPoint()
    };

    return metrics;
  }

  /**
   * Get average step conversion rate
   */
  getAverageStepConversionRate() {
    const rates = Array.from(this.conversionRates.values());
    return rates.length > 0 ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0;
  }

  /**
   * Get highest drop-off point
   */
  getHighestDropOffPoint() {
    if (this.dropOffPoints.length === 0) return null;
    
    return this.dropOffPoints.reduce((highest, current) => 
      current.dropOffRate > highest.dropOffRate ? current : highest
    );
  }

  /**
   * Export funnel data
   */
  exportFunnelData() {
    return {
      funnelSteps: this.funnelSteps,
      funnelData: Array.from(this.funnelData.entries()),
      conversionRates: Array.from(this.conversionRates.entries()),
      dropOffPoints: this.dropOffPoints,
      analysis: this.getFunnelAnalysis(),
      metrics: this.getFunnelMetrics(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear funnel data
   */
  clearData() {
    this.funnelData.clear();
    this.conversionRates.clear();
    this.dropOffPoints = [];
    localStorage.removeItem('funnel_data');
  }
}

// Create singleton instance
export const conversionFunnel = new ConversionFunnel();

// Initialize on import
if (typeof window !== 'undefined') {
  conversionFunnel.init();
}

export default conversionFunnel;
