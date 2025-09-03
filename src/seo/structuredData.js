import localSeo from './local_seo.json';

// LocalBusiness schema for homepage
export const generateLocalBusinessSchema = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || "https://memarental.com";
  
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRental", "LocalBusiness"],
    "@id": `${baseUrl}#organization`,
    "name": localSeo.businessName,
    "legalName": localSeo.legalName,
    "telephone": localSeo.phone,
    "email": localSeo.email,
    "priceRange": localSeo.priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": localSeo.address.streetAddress,
      "addressLocality": localSeo.address.addressLocality,
      "postalCode": localSeo.address.postalCode,
      "addressCountry": localSeo.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": localSeo.geo.latitude,
      "longitude": localSeo.geo.longitude
    },
    "areaServed": localSeo.areaServed,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "sameAs": localSeo.sameAs,
    "serviceType": "Car Rental Service",
    "currenciesAccepted": localSeo.currencies,
    "paymentAccepted": localSeo.paymentMethods.join(", "),
    "languages": localSeo.languages
  };
};

// BreadcrumbList schema
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Product schema for car detail pages
export const generateCarProductSchema = (car, canonicalUrl) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${car.make} ${car.model} (${car.year}) – Rent in Tirana`,
  "brand": {
    "@type": "Brand",
    "name": car.make
  },
  "category": "Car rental",
  "image": car.images || [],
  "description": car.description ? car.description.substring(0, 200) + "..." : `Rent a ${car.make} ${car.model} in Tirana, Albania.`,
  "sku": car.id?.toString() || car.model,
  "isConsumableFor": {
    "@type": "Car",
    "name": `${car.make} ${car.model}`,
    "brand": car.make,
    "model": car.model,
    "vehicleModelDate": car.year?.toString(),
    "numberOfSeatingCapacity": car.seats,
    "fuelType": car.fuel,
    "vehicleTransmission": car.transmission
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": car.dailyPrice?.toString() || "0",
    "availability": "https://schema.org/InStock",
    "url": canonicalUrl,
    "validFrom": new Date().toISOString().split('T')[0],
    "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  "areaServed": localSeo.areaServed,
  "aggregateRating": car.rating ? {
    "@type": "AggregateRating",
    "ratingValue": car.rating,
    "reviewCount": car.reviewCount || 1
  } : undefined
});

// FAQ schema
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Organization schema
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": localSeo.businessName,
  "legalName": localSeo.legalName,
  "url": "https://memarental.com",
  "logo": "https://memarental.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": localSeo.phone,
    "contactType": "customer service",
    "availableLanguage": localSeo.languages,
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": localSeo.address.streetAddress,
    "addressLocality": localSeo.address.addressLocality,
    "postalCode": localSeo.address.postalCode,
    "addressCountry": localSeo.address.addressCountry
  },
  "sameAs": localSeo.sameAs
});

// WebSite schema
export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": localSeo.businessName,
  "url": "https://memarental.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://memarental.com/cars?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});
