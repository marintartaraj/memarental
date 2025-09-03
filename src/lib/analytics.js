// Simple analytics utility for tracking pageviews and events
// In production, you would integrate with Google Analytics 4, Facebook Pixel, etc.

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize analytics
export const initAnalytics = () => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track pageview
export const trackPageview = (url, title) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track booking events
export const trackBookingStart = (carId, carName) => {
  trackEvent('begin_checkout', 'booking', carName, carId);
};

export const trackBookingComplete = (carId, carName, value) => {
  trackEvent('purchase', 'booking', carName, value);
};

// Track car view events
export const trackCarView = (carId, carName) => {
  trackEvent('view_item', 'car', carName, carId);
};

// Track search events
export const trackSearch = (searchTerm) => {
  trackEvent('search', 'search', searchTerm);
};

// Track contact form submissions
export const trackContactForm = (formType) => {
  trackEvent('form_submit', 'contact', formType);
};

// Track phone calls
export const trackPhoneCall = (phoneNumber) => {
  trackEvent('phone_call', 'contact', phoneNumber);
};

// Track email clicks
export const trackEmailClick = (emailAddress) => {
  trackEvent('email_click', 'contact', emailAddress);
};
