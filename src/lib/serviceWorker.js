// Service Worker Registration and Management
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
  }

  async register() {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, show update notification
            this.showUpdateNotification();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  showUpdateNotification() {
    // Create a simple update notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MEMA Rental Update Available', {
        body: 'A new version is available. Refresh to update.',
        icon: '/car-icon.svg',
        tag: 'update-notification'
      });
    } else {
      // Fallback to console message
      console.log('New version available! Refresh to update.');
    }
  }

  async unregister() {
    if (this.registration) {
      const success = await this.registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
    return false;
  }

  async update() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Cache management
  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  async getCacheSize() {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }

  // Background sync
  async requestBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
      console.log('Background sync registered');
    }
  }

  // Push notifications
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Offline detection
  isOnline() {
    return navigator.onLine;
  }

  onOnline(callback) {
    window.addEventListener('online', callback);
  }

  onOffline(callback) {
    window.addEventListener('offline', callback);
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Auto-register service worker in development/production
if (process.env.NODE_ENV === 'production') {
  serviceWorkerManager.register();
}

export default serviceWorkerManager;
