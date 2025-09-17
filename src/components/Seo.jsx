import React from 'react';
import { Helmet } from 'react-helmet-async';
import { metaTags, structuredData } from '@/lib/seoUtils';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://memarental.com';
const SITE_NAME = 'MEMA Rental';

const toAbsoluteUrl = (path) => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const base = SITE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
};

export default function Seo({
  title,
  description,
  image,
  path,
  canonical,
  alternates = [], // [{hrefLang:'en', href:'...'}, ...]
  schema,          // object or array of objects
  noindex = false,
  notranslate = false,
  language = 'en',
  hreflang = true, // Enable hreflang by default
  keywords = [],
  author = 'MEMA Rental',
  type = 'website',
  locale = 'en_US',
  businessData = null,
  carData = null,
  faqData = null,
  breadcrumbs = null
}) {
  const url = canonical || toAbsoluteUrl(path || '/');
  const ogImage = toAbsoluteUrl(image || '/og-image.jpg');
  
  // Generate enhanced meta data
  const metaData = metaTags.generateMetaTags({
    title,
    description,
    keywords,
    image: ogImage,
    url,
    type,
    locale,
    author
  });

  // Generate Open Graph and Twitter Card tags
  const ogTags = metaTags.generateOpenGraphTags(metaData);
  const twitterTags = metaTags.generateTwitterCardTags(metaData);

  // Generate structured data
  const structuredDataBlocks = [];
  
  // Add business schema if provided
  if (businessData) {
    structuredDataBlocks.push(structuredData.generateLocalBusinessSchema(businessData));
  }
  
  // Add car schema if provided
  if (carData) {
    structuredDataBlocks.push(structuredData.generateCarSchema(carData));
  }
  
  // Add FAQ schema if provided
  if (faqData) {
    structuredDataBlocks.push(structuredData.generateFAQSchema(faqData));
  }
  
  // Add breadcrumb schema if provided
  if (breadcrumbs) {
    structuredDataBlocks.push(structuredData.generateBreadcrumbSchema(breadcrumbs));
  }
  
  // Add website schema
  structuredDataBlocks.push(structuredData.generateWebSiteSchema({
    name: SITE_NAME,
    url: SITE_URL,
    description: metaData.description
  }));

  // Combine with custom schema
  const blocks = [...structuredDataBlocks, ...(Array.isArray(schema) ? schema : schema ? [schema] : [])];
  
  // Generate hreflang tags for Albanian and English
  const defaultAlternates = hreflang ? [
    { hrefLang: 'sq-AL', href: `${url}${url.includes('?') ? '&' : '?'}lang=sq` },
    { hrefLang: 'en-AL', href: `${url}${url.includes('?') ? '&' : '?'}lang=en` },
    { hrefLang: 'x-default', href: url }
  ] : [];
  
  const allAlternates = [...defaultAlternates, ...alternates];

  return (
    <Helmet prioritizeSeoTags>
      {/* Title and Description */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={metaData.keywords} />
      <meta name="author" content={metaData.author} />

      {/* Canonical + hreflang */}
      <link rel="canonical" href={url} />
      {allAlternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}

      {/* Mobile viewport + safe area */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

      {/* Robots */}
      {noindex ? (
        <>
          <meta name="robots" content="noindex,nofollow,max-image-preview:large" />
          <meta name="googlebot" content="noindex,nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index,follow,max-image-preview:large" />
          <meta name="googlebot" content="index,follow" />
        </>
      )}

      {/* Translation control */}
      {notranslate && <meta name="google" content="notranslate" />}

      {/* Open Graph */}
      {Object.entries(ogTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* JSON-LD blocks */}
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
}
