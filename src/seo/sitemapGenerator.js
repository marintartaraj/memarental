// Local SEO configuration - will be passed as parameter

const BASE_URL = 'https://memarental.com';

// Static pages that should always be in sitemap
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/cars', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/rent-a-car-tirana', priority: '0.9', changefreq: 'weekly' },
  { url: '/rent-a-car-tirana-airport', priority: '0.9', changefreq: 'weekly' },
  { url: '/makina-me-qira-tirane', priority: '0.9', changefreq: 'weekly' },
  { url: '/qira-makine-rinas', priority: '0.9', changefreq: 'weekly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' }
];

// Generate XML sitemap
export const generateSitemapXML = (cars = [], localSeo = {}) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${cars.map(car => `  <url>
    <loc>${BASE_URL}/cars/${car.id || car.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate sitemap index
export const generateSitemapIndex = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-cars.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  return xml;
};

// Generate static pages sitemap
export const generateStaticSitemapXML = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate cars sitemap
export const generateCarsSitemapXML = (cars = []) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cars.map(car => `  <url>
    <loc>${BASE_URL}/cars/${car.id || car.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};
