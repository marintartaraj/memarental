import React from 'react';
import { Helmet } from 'react-helmet-async';

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
}) {
  const url = canonical || toAbsoluteUrl(path || '/');
  const ogImage = toAbsoluteUrl(image || '/og-image.jpg');
  const blocks = Array.isArray(schema) ? schema : schema ? [schema] : [];
  
  // Generate hreflang tags for Albanian and English
  const defaultAlternates = hreflang ? [
    { hrefLang: 'sq-AL', href: `${url}${url.includes('?') ? '&' : '?'}lang=sq` },
    { hrefLang: 'en-AL', href: `${url}${url.includes('?') ? '&' : '?'}lang=en` },
    { hrefLang: 'x-default', href: url }
  ] : [];
  
  const allAlternates = [...defaultAlternates, ...alternates];

  return (
    <Helmet prioritizeSeoTags>
      {/* Title */}
      <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
      <meta name="description" content={description} />

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
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title || SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || SITE_NAME} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD blocks */}
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
}
