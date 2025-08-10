import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'MEMA Rental';
const SITE_URL = 'https://memarental.com';
const DEFAULT_IMAGE = `${SITE_URL}/hero-image.jpg`;

/**
 * Standardized SEO Helmet component for consistent head tags across pages
 */
function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords,
  schema,
  locale = 'en_US',
  robots = 'index, follow',
  author = SITE_NAME,
}) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={robots} />
      <meta name="language" content="English" />
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="AL" />
      <meta name="geo.placename" content="Tirana" />
      <meta name="geo.position" content="41.3275;19.8187" />
      <meta name="ICBM" content="41.3275, 19.8187" />
      <meta name="DC.title" content={fullTitle} />
      {description && <meta name="DC.description" content={description} />}
      <meta name="DC.subject" content="Car Rental, Tirana, Albania" />
      <meta name="DC.creator" content={SITE_NAME} />
      <meta name="DC.publisher" content={SITE_NAME} />
      <meta name="DC.coverage" content="Tirana, Albania" />
      <meta name="DC.language" content="en" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export default Seo;

