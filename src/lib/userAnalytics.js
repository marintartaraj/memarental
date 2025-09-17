/**
 * User Analytics and Journey Tracking
 * Comprehensive user behavior analysis and conversion tracking
 */

class UserAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.sessionStart = Date.now();
    this.pageViews = [];
    this.events = [];
    this.userJourney = [];
    this.conversionFunnel = [];
    this.isEnabled = process.env.NODE_ENV === 'production';
    
    // Configuration
    this.config = {
      trackPageViews: true,
      trackClicks: true,
      trackScroll: true,
      trackFormInteractions: true,
      trackTimeOnPage: true,
      trackUserJourney: true,
      trackConversionFunnel: true
    };
  }

  /**
   * Initialize user analytics
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    this.setupPageTracking();
    this.setupClickTracking();
    this.setupScrollTracking();
    this.setupFormTracking();
    this.setupTimeTracking();
    this.setupUserJourneyTracking();
    this.setupConversionFunnelTracking();
    
    // Track initial page view
    this.trackPageView();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create user ID
   */
  getUserId() {
    let userId = localStorage.getItem('user_analytics_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_analytics_id', userId);
    }
    return userId;
  }

  /**
   * Setup page view tracking
   */
  setupPageTracking() {
    if (!this.config.trackPageViews) return;

    // Track page views
    const trackPageView = () => {
      this.trackPageView();
    };

    // Track on route changes
    window.addEventListener('popstate', trackPageView);
    
    // Track on hash changes
    window.addEventListener('hashchange', trackPageView);
  }

  /**
   * Track page view
   */
  trackPageView(pageData = {}) {
    const pageView = {
      type: 'page_view',
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      userAgent: navigator.userAgent,
      ...pageData
    };

    this.pageViews.push(pageView);
    this.addToUserJourney('page_view', pageView);
    this.sendToAnalytics(pageView);
  }

  /**
   * Setup click tracking
   */
  setupClickTracking() {
    if (!this.config.trackClicks) return;

    document.addEventListener('click', (event) => {
      const element = event.target;
      const clickData = {
        type: 'click',
        element: {
          tagName: element.tagName,
          id: element.id,
          className: element.className,
          text: element.textContent?.substring(0, 100),
          href: element.href,
          type: element.type
        },
        position: {
          x: event.clientX,
          y: event.clientY
        },
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href
      };

      this.events.push(clickData);
      this.addToUserJourney('click', clickData);
      this.sendToAnalytics(clickData);
    });
  }

  /**
   * Setup scroll tracking
   */
  setupScrollTracking() {
    if (!this.config.trackScroll) return;

    let scrollTimeout;
    let lastScrollPosition = 0;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.pageYOffset;
        const scrollPercentage = Math.round((scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        // Track significant scroll events (every 25%)
        if (scrollPercentage >= 25 && scrollPercentage % 25 === 0 && scrollPercentage !== lastScrollPosition) {
          const scrollData = {
            type: 'scroll',
            percentage: scrollPercentage,
            position: scrollPosition,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href
          };

          this.events.push(scrollData);
          this.addToUserJourney('scroll', scrollData);
          this.sendToAnalytics(scrollData);
          lastScrollPosition = scrollPercentage;
        }
      }, 150);
    });
  }

  /**
   * Setup form tracking
   */
  setupFormTracking() {
    if (!this.config.trackFormInteractions) return;

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      const formData = {
        type: 'form_submit',
        form: {
          id: form.id,
          className: form.className,
          action: form.action,
          method: form.method,
          fieldCount: form.elements.length
        },
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href
      };

      this.events.push(formData);
      this.addToUserJourney('form_submit', formData);
      this.sendToAnalytics(formData);
    });

    // Track form field interactions
    document.addEventListener('focus', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        const fieldData = {
          type: 'form_field_focus',
          field: {
            tagName: event.target.tagName,
            type: event.target.type,
            name: event.target.name,
            id: event.target.id,
            className: event.target.className
          },
          timestamp: Date.now(),
          sessionId: this.sessionId,
          userId: this.userId,
          url: window.location.href
        };

        this.events.push(fieldData);
        this.sendToAnalytics(fieldData);
      }
    });
  }

  /**
   * Setup time tracking
   */
  setupTimeTracking() {
    if (!this.config.trackTimeOnPage) return;

    let pageStartTime = Date.now();
    let isPageVisible = true;

    // Track time on page
    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - pageStartTime;
      const timeData = {
        type: 'time_on_page',
        duration: timeOnPage,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href
      };

      this.events.push(timeData);
      this.sendToAnalytics(timeData);
    };

    // Track when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackTimeOnPage();
        isPageVisible = false;
      } else {
        pageStartTime = Date.now();
        isPageVisible = true;
      }
    });

    // Track time on page before unload
    window.addEventListener('beforeunload', () => {
      if (isPageVisible) {
        trackTimeOnPage();
      }
    });
  }

  /**
   * Setup user journey tracking
   */
  setupUserJourneyTracking() {
    if (!this.config.trackUserJourney) return;

    // Track user journey milestones
    this.trackUserJourneyMilestone('session_start', {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: this.sessionStart
    });
  }

  /**
   * Add event to user journey
   */
  addToUserJourney(eventType, eventData) {
    const journeyEvent = {
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: eventData
    };

    this.userJourney.push(journeyEvent);
  }

  /**
   * Track user journey milestone
   */
  trackUserJourneyMilestone(milestone, data = {}) {
    const milestoneData = {
      type: 'milestone',
      milestone,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...data
    };

    this.userJourney.push(milestoneData);
    this.sendToAnalytics(milestoneData);
  }

  /**
   * Setup conversion funnel tracking
   */
  setupConversionFunnelTracking() {
    if (!this.config.trackConversionFunnel) return;

    // Define conversion funnel steps
    this.conversionFunnel = [
      { step: 'homepage_view', name: 'Homepage View' },
      { step: 'cars_page_view', name: 'Cars Page View' },
      { step: 'car_detail_view', name: 'Car Detail View' },
      { step: 'booking_start', name: 'Booking Started' },
      { step: 'booking_complete', name: 'Booking Completed' }
    ];

    // Track funnel steps based on page views
    this.trackFunnelStep('homepage_view', { page: '/' });
  }

  /**
   * Track conversion funnel step
   */
  trackFunnelStep(step, data = {}) {
    const funnelData = {
      type: 'funnel_step',
      step,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...data
    };

    this.conversionFunnel.push(funnelData);
    this.sendToAnalytics(funnelData);
  }

  /**
   * Track custom event
   */
  trackEvent(eventName, eventData = {}) {
    const event = {
      type: 'custom_event',
      eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...eventData
    };

    this.events.push(event);
    this.addToUserJourney('custom_event', event);
    this.sendToAnalytics(event);
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType, value = 0, currency = 'USD') {
    const conversionData = {
      type: 'conversion',
      conversionType,
      value,
      currency,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href
    };

    this.events.push(conversionData);
    this.addToUserJourney('conversion', conversionData);
    this.sendToAnalytics(conversionData);
  }

  /**
   * Send data to analytics service
   */
  sendToAnalytics(data) {
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', data.type, {
        event_category: 'user_analytics',
        event_label: data.eventName || data.step || data.milestone,
        value: data.value || 0,
        custom_parameter_1: data.sessionId,
        custom_parameter_2: data.userId
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomAnalytics(data);
  }

  /**
   * Send to custom analytics endpoint
   */
  sendToCustomAnalytics(data) {
    // Example: Send to your own analytics API
    if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
      fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(error => {
        console.error('Analytics error:', error);
      });
    }
  }

  /**
   * Get user journey
   */
  getUserJourney() {
    return this.userJourney;
  }

  /**
   * Get conversion funnel data
   */
  getConversionFunnel() {
    return this.conversionFunnel;
  }

  /**
   * Get session data
   */
  getSessionData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      sessionStart: this.sessionStart,
      sessionDuration: Date.now() - this.sessionStart,
      pageViews: this.pageViews.length,
      events: this.events.length,
      userJourney: this.userJourney.length
    };
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    const sessionData = this.getSessionData();
    const journey = this.getUserJourney();
    const funnel = this.getConversionFunnel();

    return {
      session: sessionData,
      journey: {
        totalEvents: journey.length,
        eventTypes: journey.reduce((acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        }, {})
      },
      funnel: {
        steps: funnel.length,
        completedSteps: funnel.filter(step => step.step).length
      },
      performance: {
        averageTimeOnPage: this.events
          .filter(e => e.type === 'time_on_page')
          .reduce((acc, e) => acc + e.duration, 0) / this.events.filter(e => e.type === 'time_on_page').length || 0
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear analytics data
   */
  clearData() {
    this.pageViews = [];
    this.events = [];
    this.userJourney = [];
    this.conversionFunnel = [];
  }
}

// Create singleton instance
export const userAnalytics = new UserAnalytics();

// Initialize on import
if (typeof window !== 'undefined') {
  userAnalytics.init();
}

export default userAnalytics;
