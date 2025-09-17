// Advanced SEO Utilities for MEMA Rental

// Meta tag utilities
export const metaTags = {
  // Generate dynamic meta tags
  generateMetaTags: (pageData) => {
    const {
      title,
      description,
      keywords = [],
      image,
      url,
      type = 'website',
      locale = 'en_US',
      siteName = 'MEMA Rental',
      author = 'MEMA Rental'
    } = pageData;

    return {
      title: title ? `${title} | ${siteName}` : siteName,
      description: description || 'Premium car rental service in Tirana, Albania. Quality vehicles, competitive prices, excellent service.',
      keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords || '',
      image: image || '/images/cars/placeholder-car.jpg',
      url: url || window.location.href,
      type,
      locale,
      siteName,
      author
    };
  },

  // Generate Open Graph tags
  generateOpenGraphTags: (metaData) => {
    return {
      'og:title': metaData.title,
      'og:description': metaData.description,
      'og:image': metaData.image,
      'og:url': metaData.url,
      'og:type': metaData.type,
      'og:locale': metaData.locale,
      'og:site_name': metaData.siteName,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': metaData.description
    };
  },

  // Generate Twitter Card tags
  generateTwitterCardTags: (metaData) => {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': metaData.title,
      'twitter:description': metaData.description,
      'twitter:image': metaData.image,
      'twitter:image:alt': metaData.description,
      'twitter:site': '@MEMARental',
      'twitter:creator': '@MEMARental'
    };
  }
};

// Structured data utilities
export const structuredData = {
  // Generate LocalBusiness schema
  generateLocalBusinessSchema: (businessData = {}) => {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://memarental.com/#business",
      "name": businessData.name || "MEMA Rental",
      "description": businessData.description || "Premium car rental service in Tirana, Albania",
      "url": businessData.url || "https://memarental.com",
      "telephone": businessData.phone || "+355 69 123 4567",
      "email": businessData.email || "info@memarental.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessData.address || "Rruga Dritan Hoxha",
        "addressLocality": "Tirana",
        "addressCountry": "AL",
        "postalCode": "1001"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": businessData.latitude || "41.3275",
        "longitude": businessData.longitude || "19.8187"
      },
      "openingHours": businessData.openingHours || [
        "Mo-Fr 08:00-20:00",
        "Sa 08:00-18:00",
        "Su 09:00-17:00"
      ],
      "priceRange": "$$",
      "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
      "currenciesAccepted": "EUR, USD, ALL",
      "image": businessData.image || "https://memarental.com/images/logo.png",
      "logo": businessData.logo || "https://memarental.com/images/logo.png",
      "sameAs": businessData.socialMedia || [
        "https://www.facebook.com/memarental",
        "https://www.instagram.com/memarental"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1000",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
  },

  // Generate Car schema
  generateCarSchema: (carData = {}) => {
    return {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": `${carData.brand} ${carData.model}`,
      "description": `Premium ${carData.brand} ${carData.model} rental car in Tirana, Albania`,
      "brand": {
        "@type": "Brand",
        "name": carData.brand
      },
      "model": carData.model,
      "vehicleModelDate": carData.year,
      "numberOfDoors": carData.doors || 4,
      "vehicleSeatingCapacity": carData.seats,
      "fuelType": carData.fuel_type,
      "vehicleTransmission": carData.transmission,
      "vehicleEngine": {
        "@type": "EngineSpecification",
        "name": carData.engine
      },
      "image": carData.image_url,
      "offers": {
        "@type": "Offer",
        "price": carData.daily_rate,
        "priceCurrency": "EUR",
        "availability": carData.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "validFrom": new Date().toISOString().split('T')[0],
        "seller": {
          "@type": "LocalBusiness",
          "name": "MEMA Rental"
        }
      }
    };
  },

  // Generate Service schema
  generateServiceSchema: (serviceData = {}) => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceData.name || "Car Rental Service",
      "description": serviceData.description || "Premium car rental service in Tirana, Albania",
      "provider": {
        "@type": "LocalBusiness",
        "name": "MEMA Rental",
        "url": "https://memarental.com"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Albania"
      },
      "serviceType": "Car Rental",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    };
  },

  // Generate FAQ schema
  generateFAQSchema: (faqData = []) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  },

  // Generate BreadcrumbList schema
  generateBreadcrumbSchema: (breadcrumbs = []) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  },

  // Generate WebSite schema
  generateWebSiteSchema: (siteData = {}) => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteData.name || "MEMA Rental",
      "url": siteData.url || "https://memarental.com",
      "description": siteData.description || "Premium car rental service in Tirana, Albania",
      "publisher": {
        "@type": "Organization",
        "name": "MEMA Rental"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://memarental.com/cars?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
  }
};

// Sitemap utilities
export const sitemapUtils = {
  // Generate sitemap data
  generateSitemapData: (routes, baseUrl = 'https://memarental.com') => {
    const priorityMap = {
      '/': 1.0,
      '/cars': 0.9,
      '/about': 0.8,
      '/contact': 0.8,
      '/faq': 0.7
    };

    return routes.map(route => ({
      url: `${baseUrl}${route.path}`,
      lastmod: route.lastmod || new Date().toISOString().split('T')[0],
      changefreq: route.changefreq || 'weekly',
      priority: priorityMap[route.path] || 0.5
    }));
  }
};

// Canonical URL utilities
export const canonicalUtils = {
  // Generate canonical URL
  generateCanonicalUrl: (path, baseUrl = 'https://memarental.com') => {
    return `${baseUrl}${path}`;
  },

  // Check for duplicate content
  checkDuplicateContent: (urls) => {
    const duplicates = [];
    const seen = new Set();
    
    urls.forEach(url => {
      if (seen.has(url)) {
        duplicates.push(url);
      } else {
        seen.add(url);
      }
    });
    
    return duplicates;
  }
};

// Performance monitoring for SEO
export const seoPerformance = {
  // Monitor Core Web Vitals (simplified version without web-vitals dependency)
  monitorCoreWebVitals: () => {
    // Simple performance monitoring without external dependencies
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Performance metric:', entry.name, entry.value);
        }
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        console.log('Performance monitoring not supported');
      }
    }
  },

  // Check page load performance
  checkPageLoadPerformance: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
    };
  }
};

// Export all utilities
export default {
  metaTags,
  structuredData,
  sitemapUtils,
  canonicalUtils,
  seoPerformance
};
