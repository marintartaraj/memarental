/**
 * A/B Testing Framework
 * Simple but powerful A/B testing system for user experience optimization
 */

class ABTesting {
  constructor() {
    this.experiments = new Map();
    this.userVariants = new Map();
    this.results = new Map();
    this.isEnabled = process.env.NODE_ENV === 'production';
    
    // Default configuration
    this.config = {
      defaultTrafficSplit: 0.5, // 50/50 split
      minSampleSize: 100,       // Minimum users per variant
      confidenceLevel: 0.95,    // 95% confidence level
      maxDuration: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    };
  }

  /**
   * Initialize A/B testing
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.loadUserVariants();
    this.loadExperimentResults();
    this.setupExperimentTracking();
  }

  /**
   * Create a new experiment
   */
  createExperiment(experimentId, variants, options = {}) {
    const experiment = {
      id: experimentId,
      name: options.name || experimentId,
      description: options.description || '',
      variants: variants.map((variant, index) => ({
        id: `variant_${index}`,
        name: variant.name || `Variant ${index + 1}`,
        weight: variant.weight || 1,
        config: variant.config || {},
        isControl: index === 0
      })),
      trafficSplit: options.trafficSplit || this.config.defaultTrafficSplit,
      startDate: Date.now(),
      endDate: options.endDate || (Date.now() + this.config.maxDuration),
      status: 'active',
      metrics: options.metrics || ['conversion', 'engagement'],
      minSampleSize: options.minSampleSize || this.config.minSampleSize,
      confidenceLevel: options.confidenceLevel || this.config.confidenceLevel,
      createdAt: Date.now()
    };

    this.experiments.set(experimentId, experiment);
    this.saveExperiment(experiment);
    return experiment;
  }

  /**
   * Get user variant for experiment
   */
  getUserVariant(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    // Check if user already has a variant assigned
    const userId = this.getUserId();
    const userKey = `${userId}_${experimentId}`;
    
    if (this.userVariants.has(userKey)) {
      return this.userVariants.get(userKey);
    }

    // Assign variant based on traffic split
    const variant = this.assignVariant(experiment);
    this.userVariants.set(userKey, variant);
    this.saveUserVariant(userKey, variant);
    
    return variant;
  }

  /**
   * Assign variant to user
   */
  assignVariant(experiment) {
    const userId = this.getUserId();
    const hash = this.hashString(userId + experiment.id);
    const random = hash % 100;
    
    // Calculate cumulative weights
    const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0);
    let cumulativeWeight = 0;
    
    for (const variant of experiment.variants) {
      cumulativeWeight += (variant.weight / totalWeight) * 100;
      if (random < cumulativeWeight) {
        return variant;
      }
    }
    
    // Fallback to first variant
    return experiment.variants[0];
  }

  /**
   * Track experiment event
   */
  trackEvent(experimentId, eventType, eventData = {}) {
    const variant = this.getUserVariant(experimentId);
    if (!variant) return;

    const event = {
      experimentId,
      variantId: variant.id,
      variantName: variant.name,
      eventType,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: Date.now(),
      url: window.location.href,
      ...eventData
    };

    // Store event
    if (!this.results.has(experimentId)) {
      this.results.set(experimentId, []);
    }
    this.results.get(experimentId).push(event);

    // Send to analytics
    this.sendToAnalytics(event);

    // Save results
    this.saveExperimentResults(experimentId);
  }

  /**
   * Track conversion for experiment
   */
  trackConversion(experimentId, conversionType, value = 0) {
    this.trackEvent(experimentId, 'conversion', {
      conversionType,
      value,
      currency: 'USD'
    });
  }

  /**
   * Track engagement for experiment
   */
  trackEngagement(experimentId, engagementType, engagementData = {}) {
    this.trackEvent(experimentId, 'engagement', {
      engagementType,
      ...engagementData
    });
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    const events = this.results.get(experimentId) || [];
    const results = {
      experiment,
      totalUsers: this.getUniqueUsers(experimentId),
      events: events,
      variants: this.analyzeVariants(experimentId),
      statisticalSignificance: this.calculateStatisticalSignificance(experimentId),
      recommendations: this.getRecommendations(experimentId)
    };

    return results;
  }

  /**
   * Analyze variants
   */
  analyzeVariants(experimentId) {
    const experiment = this.experiments.get(experimentId);
    const events = this.results.get(experimentId) || [];
    
    const variantAnalysis = experiment.variants.map(variant => {
      const variantEvents = events.filter(event => event.variantId === variant.id);
      const conversions = variantEvents.filter(event => event.eventType === 'conversion');
      const engagements = variantEvents.filter(event => event.eventType === 'engagement');
      
      return {
        ...variant,
        totalUsers: this.getUniqueUsersForVariant(experimentId, variant.id),
        totalEvents: variantEvents.length,
        conversions: conversions.length,
        engagements: engagements.length,
        conversionRate: this.getUniqueUsersForVariant(experimentId, variant.id) > 0 
          ? (conversions.length / this.getUniqueUsersForVariant(experimentId, variant.id)) * 100 
          : 0,
        engagementRate: this.getUniqueUsersForVariant(experimentId, variant.id) > 0
          ? (engagements.length / this.getUniqueUsersForVariant(experimentId, variant.id)) * 100
          : 0
      };
    });

    return variantAnalysis;
  }

  /**
   * Calculate statistical significance
   */
  calculateStatisticalSignificance(experimentId) {
    const experiment = this.experiments.get(experimentId);
    const events = this.results.get(experimentId) || [];
    
    if (events.length < experiment.minSampleSize) {
      return {
        isSignificant: false,
        confidence: 0,
        message: `Need at least ${experiment.minSampleSize} users for statistical significance`
      };
    }

    // Simple chi-square test for conversion rates
    const variants = this.analyzeVariants(experimentId);
    const controlVariant = variants.find(v => v.isControl);
    const testVariant = variants.find(v => !v.isControl);
    
    if (!controlVariant || !testVariant) {
      return {
        isSignificant: false,
        confidence: 0,
        message: 'Control and test variants required for significance testing'
      };
    }

    // Calculate confidence interval
    const controlRate = controlVariant.conversionRate / 100;
    const testRate = testVariant.conversionRate / 100;
    const controlUsers = controlVariant.totalUsers;
    const testUsers = testVariant.totalUsers;
    
    const pooledRate = (controlRate * controlUsers + testRate * testUsers) / (controlUsers + testUsers);
    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlUsers + 1/testUsers));
    const zScore = Math.abs(testRate - controlRate) / standardError;
    
    // 95% confidence level (z = 1.96)
    const isSignificant = zScore > 1.96;
    const confidence = Math.min(95, (1 - Math.exp(-zScore)) * 100);

    return {
      isSignificant,
      confidence,
      zScore,
      message: isSignificant 
        ? `Results are statistically significant (${confidence.toFixed(1)}% confidence)`
        : `Results are not statistically significant (${confidence.toFixed(1)}% confidence)`
    };
  }

  /**
   * Get recommendations
   */
  getRecommendations(experimentId) {
    const results = this.getExperimentResults(experimentId);
    const recommendations = [];

    if (!results.statisticalSignificance.isSignificant) {
      recommendations.push({
        type: 'sample_size',
        message: 'Increase sample size for more reliable results',
        priority: 'high'
      });
    }

    const variants = results.variants;
    const controlVariant = variants.find(v => v.isControl);
    const testVariant = variants.find(v => !v.isControl);

    if (controlVariant && testVariant) {
      const improvement = testVariant.conversionRate - controlVariant.conversionRate;
      
      if (improvement > 5) {
        recommendations.push({
          type: 'winner',
          message: `${testVariant.name} is performing ${improvement.toFixed(1)}% better than control`,
          priority: 'high'
        });
      } else if (improvement < -5) {
        recommendations.push({
          type: 'loser',
          message: `${testVariant.name} is performing ${Math.abs(improvement).toFixed(1)}% worse than control`,
          priority: 'medium'
        });
      }
    }

    return recommendations;
  }

  /**
   * Get unique users for experiment
   */
  getUniqueUsers(experimentId) {
    const events = this.results.get(experimentId) || [];
    const uniqueUsers = new Set(events.map(event => event.userId));
    return uniqueUsers.size;
  }

  /**
   * Get unique users for variant
   */
  getUniqueUsersForVariant(experimentId, variantId) {
    const events = this.results.get(experimentId) || [];
    const variantEvents = events.filter(event => event.variantId === variantId);
    const uniqueUsers = new Set(variantEvents.map(event => event.userId));
    return uniqueUsers.size;
  }

  /**
   * Hash string for consistent user assignment
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get user ID
   */
  getUserId() {
    return localStorage.getItem('user_analytics_id') || `user_${Date.now()}`;
  }

  /**
   * Get session ID
   */
  getSessionId() {
    return sessionStorage.getItem('session_id') || `session_${Date.now()}`;
  }

  /**
   * Send to analytics
   */
  sendToAnalytics(event) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test', {
        event_category: 'experiment',
        event_label: `${event.experimentId}_${event.variantId}`,
        value: event.value || 0,
        custom_parameter_1: event.experimentId,
        custom_parameter_2: event.variantId,
        custom_parameter_3: event.eventType
      });
    }
  }

  /**
   * Save experiment
   */
  saveExperiment(experiment) {
    const experiments = JSON.parse(localStorage.getItem('ab_experiments') || '{}');
    experiments[experiment.id] = experiment;
    localStorage.setItem('ab_experiments', JSON.stringify(experiments));
  }

  /**
   * Save user variant
   */
  saveUserVariant(userKey, variant) {
    const variants = JSON.parse(localStorage.getItem('ab_user_variants') || '{}');
    variants[userKey] = variant;
    localStorage.setItem('ab_user_variants', JSON.stringify(variants));
  }

  /**
   * Save experiment results
   */
  saveExperimentResults(experimentId) {
    const events = this.results.get(experimentId) || [];
    const results = JSON.parse(localStorage.getItem('ab_results') || '{}');
    results[experimentId] = events;
    localStorage.setItem('ab_results', JSON.stringify(results));
  }

  /**
   * Load user variants
   */
  loadUserVariants() {
    const variants = JSON.parse(localStorage.getItem('ab_user_variants') || '{}');
    Object.entries(variants).forEach(([key, value]) => {
      this.userVariants.set(key, value);
    });
  }

  /**
   * Load experiment results
   */
  loadExperimentResults() {
    const results = JSON.parse(localStorage.getItem('ab_results') || '{}');
    Object.entries(results).forEach(([experimentId, events]) => {
      this.results.set(experimentId, events);
    });
  }

  /**
   * Setup experiment tracking
   */
  setupExperimentTracking() {
    // Track page views for all active experiments
    this.experiments.forEach((experiment, experimentId) => {
      if (experiment.status === 'active') {
        this.trackEvent(experimentId, 'page_view');
      }
    });
  }

  /**
   * Get all experiments
   */
  getAllExperiments() {
    return Array.from(this.experiments.values());
  }

  /**
   * Get active experiments
   */
  getActiveExperiments() {
    return this.getAllExperiments().filter(exp => exp.status === 'active');
  }

  /**
   * End experiment
   */
  endExperiment(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = 'ended';
      experiment.endDate = Date.now();
      this.saveExperiment(experiment);
    }
  }

  /**
   * Export experiment data
   */
  exportExperimentData(experimentId) {
    const results = this.getExperimentResults(experimentId);
    return {
      ...results,
      exportedAt: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const abTesting = new ABTesting();

// Initialize on import
if (typeof window !== 'undefined') {
  abTesting.init();
}

export default abTesting;
