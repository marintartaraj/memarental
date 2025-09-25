/**
 * Offline Service - Handles offline detection and service availability
 */

class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.serviceStatus = {
      supabase: true,
      images: true
    };
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyStatusChange();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyStatusChange();
    });
  }

  /**
   * Check if the service is available
   */
  async checkServiceHealth(serviceName = 'supabase') {
    try {
      if (serviceName === 'supabase') {
        const response = await fetch('https://nozhsvniwbcvdbbokaig.supabase.co/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vemhzdm5pd2JjdmRiYm9rYWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Nzg5MzQsImV4cCI6MjA3MDA1NDkzNH0.OB0pZBcLFqmaavd6dKEIc5IB-L2817P3cv_TG8wBoAQ'
          }
        });
        this.serviceStatus.supabase = response.ok;
      }
      
      return this.serviceStatus[serviceName];
    } catch (error) {
      this.serviceStatus[serviceName] = false;
      return false;
    }
  }

  /**
   * Get offline message based on service status
   */
  getOfflineMessage() {
    if (!this.isOnline) {
      return 'You are currently offline. Please check your internet connection.';
    }
    
    if (!this.serviceStatus.supabase) {
      return 'Service temporarily unavailable. Please try again later.';
    }
    
    return null;
  }

  /**
   * Check if any critical services are offline
   */
  isAnyServiceOffline() {
    return !this.isOnline || !this.serviceStatus.supabase;
  }

  /**
   * Notify components of status change
   */
  notifyStatusChange() {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('serviceStatusChange', {
      detail: {
        isOnline: this.isOnline,
        serviceStatus: this.serviceStatus
      }
    }));
  }

  /**
   * Retry failed requests with exponential backoff
   */
  async retryWithBackoff(requestFn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Check if it's a network error
        if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
          const delay = baseDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Don't retry non-network errors
        }
      }
    }
  }
}

// Create singleton instance
export const offlineService = new OfflineService();

// Export for use in components
export default offlineService;
