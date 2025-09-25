/**
 * Service Worker for performance optimization
 */

const CACHE_NAME = 'mema-rental-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.png',
  '/images/hero-bg.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy: Cache First for static assets, Network First for API calls
  if (request.url.includes('/api/') || request.url.includes('supabase')) {
    // Network First for API calls
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Return offline page or error response
              return new Response(
                JSON.stringify({ error: 'Offline' }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
              );
            });
        })
    );
  } else {
    // Cache First for static assets
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'booking-sync') {
    event.waitUntil(syncBookings());
  }
});

// Sync bookings when back online
async function syncBookings() {
  try {
    const bookings = await getStoredBookings();
    for (const booking of bookings) {
      await submitBooking(booking);
    }
    await clearStoredBookings();
  } catch (error) {
    console.error('Failed to sync bookings:', error);
  }
}

// Utility functions
async function getStoredBookings() {
  // Implementation for getting stored bookings from IndexedDB
  return [];
}

async function submitBooking(booking) {
  // Implementation for submitting booking to server
  return Promise.resolve();
}

async function clearStoredBookings() {
  // Implementation for clearing stored bookings
  return Promise.resolve();
}
