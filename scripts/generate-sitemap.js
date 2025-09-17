#!/usr/bin/env node

// Dynamic Sitemap Generator for MEMA Rental
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.VITE_SITE_URL || 'https://memarental.com';
const OUTPUT_DIR = path.join(__dirname, '../public');

// Define all routes with their metadata
const routes = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/cars',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/faq',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  },
  // SEO Landing Pages
  {
    path: '/rent-a-car-tirana',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/rent-a-car-tirana-airport',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/makina-me-qira-tirane',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/qira-makine-rinas',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate sitemap XML
const generateSitemap = () => {
  console.log('🗺️  Generating sitemap...');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${routes.length}`);
  
  return sitemapPath;
};

// Generate robots.txt
const generateRobotsTxt = () => {
  console.log('🤖 Generating robots.txt...');
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /cars
Allow: /about
Allow: /contact
Allow: /faq`;

  // Write robots.txt to public directory
  const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  
  console.log(`✅ Robots.txt generated: ${robotsPath}`);
  
  return robotsPath;
};

// Generate sitemap index (for multiple sitemaps)
const generateSitemapIndex = () => {
  console.log('📑 Generating sitemap index...');
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Write sitemap index to public directory
  const sitemapIndexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(sitemapIndexPath, sitemapIndex);
  
  console.log(`✅ Sitemap index generated: ${sitemapIndexPath}`);
  
  return sitemapIndexPath;
};

// Main execution
const main = () => {
  console.log('🚀 MEMA Rental Sitemap Generator\n');
  console.log('=' .repeat(50));
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Generate all files
    generateSitemap();
    generateRobotsTxt();
    generateSitemapIndex();
    
    console.log('\n🎉 All SEO files generated successfully!');
    console.log('\n📋 Generated files:');
    console.log('  - sitemap.xml');
    console.log('  - robots.txt');
    console.log('  - sitemap-index.xml');
    
    console.log('\n💡 Next steps:');
    console.log('  1. Submit sitemap to Google Search Console');
    console.log('  2. Submit sitemap to Bing Webmaster Tools');
    console.log('  3. Test robots.txt with Google\'s robots.txt tester');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  generateSitemapIndex,
  routes
};
