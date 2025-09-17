#!/usr/bin/env node

// Bundle Analysis Script for MEMA Rental
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const analyzeBundle = () => {
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dist folder not found. Run "npm run build" first.');
    return;
  }

  console.log('📊 Bundle Analysis Report\n');
  console.log('=' .repeat(50));

  // Analyze JS files
  const jsFiles = fs.readdirSync(distPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('\n📦 JavaScript Files:');
  jsFiles.forEach(file => {
    const size = file.sizeKB;
    const status = size > 500 ? '🔴' : size > 200 ? '🟡' : '🟢';
    console.log(`${status} ${file.name}: ${size} KB`);
  });

  // Analyze CSS files
  const cssFiles = fs.readdirSync(distPath)
    .filter(file => file.endsWith('.css'))
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('\n🎨 CSS Files:');
  cssFiles.forEach(file => {
    const size = file.sizeKB;
    const status = size > 100 ? '🔴' : size > 50 ? '🟡' : '🟢';
    console.log(`${status} ${file.name}: ${size} KB`);
  });

  // Calculate totals
  const totalJS = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCSS = cssFiles.reduce((sum, file) => sum + file.size, 0);
  const totalAssets = totalJS + totalCSS;

  console.log('\n📈 Summary:');
  console.log(`Total JS: ${(totalJS / 1024).toFixed(2)} KB`);
  console.log(`Total CSS: ${(totalCSS / 1024).toFixed(2)} KB`);
  console.log(`Total Assets: ${(totalAssets / 1024).toFixed(2)} KB`);

  // Performance recommendations
  console.log('\n💡 Recommendations:');
  
  if (totalJS > 500 * 1024) {
    console.log('🔴 JavaScript bundle is large. Consider:');
    console.log('   - Code splitting with React.lazy()');
    console.log('   - Tree shaking unused code');
    console.log('   - Dynamic imports for heavy libraries');
  }
  
  if (totalCSS > 100 * 1024) {
    console.log('🔴 CSS bundle is large. Consider:');
    console.log('   - Purge unused CSS');
    console.log('   - Critical CSS inlining');
    console.log('   - CSS minification');
  }

  if (totalAssets < 200 * 1024) {
    console.log('🟢 Bundle size is excellent!');
  } else if (totalAssets < 500 * 1024) {
    console.log('🟡 Bundle size is good, but could be optimized further.');
  } else {
    console.log('🔴 Bundle size needs optimization.');
  }

  console.log('\n' + '=' .repeat(50));
};

// Run analysis
analyzeBundle();
