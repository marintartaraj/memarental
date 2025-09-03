import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read local SEO config
const localSeoPath = path.join(__dirname, '../src/seo/local_seo.json');
const localSeo = JSON.parse(fs.readFileSync(localSeoPath, 'utf8'));

// Import sitemap generators
import { 
  generateSitemapIndex, 
  generateStaticSitemapXML, 
  generateCarsSitemapXML 
} from '../src/seo/sitemapGenerator.js';

// Mock cars data for sitemap generation
// In a real app, this would come from your database or API
const mockCars = [
  { id: 1, slug: 'bmw-3-series-2023' },
  { id: 2, slug: 'mercedes-c-class-2023' },
  { id: 3, slug: 'audi-a4-2023' },
  { id: 4, slug: 'volkswagen-passat-2023' },
  { id: 5, slug: 'toyota-camry-2023' },
  { id: 6, slug: 'ford-focus-2023' },
  { id: 7, slug: 'hyundai-santa-fe-2023' },
  { id: 8, slug: 'volvo-xc60-2023' },
  { id: 9, slug: 'toyota-yaris-2023' }
];

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate sitemaps
try {
  console.log('🚀 Generating sitemaps...');

  // Generate main sitemap index
  const sitemapIndex = generateSitemapIndex();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
  console.log('✅ Generated sitemap.xml (index)');

  // Generate static pages sitemap
  const staticSitemap = generateStaticSitemapXML();
  fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticSitemap);
  console.log('✅ Generated sitemap-static.xml');

  // Generate cars sitemap
  const carsSitemap = generateCarsSitemapXML(mockCars);
  fs.writeFileSync(path.join(publicDir, 'sitemap-cars.xml'), carsSitemap);
  console.log('✅ Generated sitemap-cars.xml');

  console.log('🎉 All sitemaps generated successfully!');
  console.log('📁 Sitemaps saved in:', publicDir);
  
  // List generated files
  const files = fs.readdirSync(publicDir).filter(file => file.startsWith('sitemap'));
  console.log('📋 Generated files:', files.join(', '));

} catch (error) {
  console.error('❌ Error generating sitemaps:', error);
  process.exit(1);
}
