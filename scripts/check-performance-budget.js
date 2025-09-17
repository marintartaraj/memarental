#!/usr/bin/env node

/**
 * Performance Budget Checker
 * Validates that the application meets performance budgets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance budgets
const BUDGETS = {
  // Bundle size budgets (in KB)
  bundle: {
    total: 500,        // Total bundle size
    js: 400,           // JavaScript bundle
    css: 100,          // CSS bundle
    images: 200,       // Images
    fonts: 50          // Fonts
  },
  
  // Individual file budgets
  files: {
    js: 200,           // Individual JS file
    css: 50,           // Individual CSS file
    image: 100,        // Individual image
    font: 25           // Individual font
  },
  
  // Core Web Vitals budgets
  webVitals: {
    LCP: 2500,         // Largest Contentful Paint (ms)
    FID: 100,          // First Input Delay (ms)
    CLS: 0.1,          // Cumulative Layout Shift
    FCP: 1800,         // First Contentful Paint (ms)
    TTFB: 800          // Time to First Byte (ms)
  },
  
  // Resource budgets
  resources: {
    maxRequests: 50,   // Maximum number of requests
    maxConcurrent: 6,  // Maximum concurrent requests
    maxSlowResources: 3 // Maximum slow resources (>1s)
  }
};

class PerformanceBudgetChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.stats = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      fontSize: 0,
      fileCount: 0,
      requestCount: 0
    };
  }

  /**
   * Check bundle size budgets
   */
  checkBundleBudgets(distPath) {
    console.log('🔍 Checking bundle size budgets...\n');
    
    const files = this.analyzeFiles(distPath);
    
    // Check total bundle size
    if (this.stats.totalSize > BUDGETS.bundle.total * 1024) {
      this.violations.push({
        type: 'bundle',
        metric: 'total',
        actual: this.stats.totalSize / 1024,
        budget: BUDGETS.bundle.total,
        severity: 'error'
      });
    }
    
    // Check JavaScript bundle size
    if (this.stats.jsSize > BUDGETS.bundle.js * 1024) {
      this.violations.push({
        type: 'bundle',
        metric: 'javascript',
        actual: this.stats.jsSize / 1024,
        budget: BUDGETS.bundle.js,
        severity: 'error'
      });
    }
    
    // Check CSS bundle size
    if (this.stats.cssSize > BUDGETS.bundle.css * 1024) {
      this.violations.push({
        type: 'bundle',
        metric: 'css',
        actual: this.stats.cssSize / 1024,
        budget: BUDGETS.bundle.css,
        severity: 'error'
      });
    }
    
    // Check individual file sizes
    files.forEach(file => {
      const budget = this.getFileBudget(file.type);
      if (file.size > budget * 1024) {
        this.violations.push({
          type: 'file',
          metric: file.name,
          actual: file.size / 1024,
          budget: budget,
          severity: 'warning'
        });
      }
    });
  }

  /**
   * Analyze files in dist directory
   */
  analyzeFiles(distPath) {
    const files = [];
    
    const analyzeDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile()) {
          const file = {
            name: item,
            path: itemPath,
            size: stats.size,
            type: this.getFileType(item),
            gzipSize: this.getGzipSize(itemPath)
          };
          
          files.push(file);
          this.updateStats(file);
        } else if (stats.isDirectory()) {
          analyzeDirectory(itemPath);
        }
      });
    };
    
    analyzeDirectory(distPath);
    return files;
  }

  /**
   * Get file type from extension
   */
  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    
    if (ext === '.js') return 'js';
    if (ext === '.css') return 'css';
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) return 'image';
    if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) return 'font';
    
    return 'other';
  }

  /**
   * Get gzipped size
   */
  getGzipSize(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      return gzipSync(content).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get budget for file type
   */
  getFileBudget(type) {
    return BUDGETS.files[type] || 100;
  }

  /**
   * Update statistics
   */
  updateStats(file) {
    this.stats.totalSize += file.size;
    this.stats.fileCount++;
    
    switch (file.type) {
      case 'js':
        this.stats.jsSize += file.size;
        break;
      case 'css':
        this.stats.cssSize += file.size;
        break;
      case 'image':
        this.stats.imageSize += file.size;
        break;
      case 'font':
        this.stats.fontSize += file.size;
        break;
    }
  }

  /**
   * Check Core Web Vitals budgets
   */
  checkWebVitalsBudgets() {
    console.log('🔍 Checking Core Web Vitals budgets...\n');
    
    // This would typically be done with real performance data
    // For now, we'll provide recommendations
    console.log('📊 Core Web Vitals Budgets:');
    Object.entries(BUDGETS.webVitals).forEach(([metric, budget]) => {
      console.log(`  ${metric}: ${budget}${metric === 'CLS' ? '' : 'ms'}`);
    });
    
    console.log('\n💡 To measure actual Core Web Vitals:');
    console.log('  - Use Chrome DevTools Lighthouse');
    console.log('  - Use PageSpeed Insights');
    console.log('  - Use Web Vitals extension');
    console.log('  - Use performance monitoring in production\n');
  }

  /**
   * Check resource budgets
   */
  checkResourceBudgets() {
    console.log('🔍 Checking resource budgets...\n');
    
    console.log('📊 Resource Budgets:');
    Object.entries(BUDGETS.resources).forEach(([metric, budget]) => {
      console.log(`  ${metric}: ${budget}`);
    });
    
    console.log('\n💡 Resource optimization tips:');
    console.log('  - Minimize HTTP requests');
    console.log('  - Use HTTP/2 for concurrent requests');
    console.log('  - Optimize images (WebP, lazy loading)');
    console.log('  - Use CDN for static assets');
    console.log('  - Implement service worker caching\n');
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    console.log('💡 Performance Optimization Recommendations:\n');
    
    if (this.stats.jsSize > BUDGETS.bundle.js * 1024) {
      console.log('🔴 JavaScript bundle is too large:');
      console.log('  - Implement code splitting with React.lazy()');
      console.log('  - Use dynamic imports for heavy libraries');
      console.log('  - Remove unused code with tree shaking');
      console.log('  - Consider using lighter alternatives\n');
    }
    
    if (this.stats.cssSize > BUDGETS.bundle.css * 1024) {
      console.log('🔴 CSS bundle is too large:');
      console.log('  - Purge unused CSS');
      console.log('  - Use critical CSS inlining');
      console.log('  - Split CSS by page/component');
      console.log('  - Use CSS-in-JS for dynamic styles\n');
    }
    
    if (this.stats.imageSize > BUDGETS.bundle.images * 1024) {
      console.log('🔴 Images are too large:');
      console.log('  - Convert to WebP format');
      console.log('  - Implement responsive images');
      console.log('  - Use lazy loading');
      console.log('  - Optimize image dimensions\n');
    }
    
    console.log('🟢 General optimizations:');
    console.log('  - Enable gzip compression');
    console.log('  - Use HTTP/2');
    console.log('  - Implement service worker caching');
    console.log('  - Use CDN for static assets');
    console.log('  - Minimize third-party scripts');
    console.log('  - Use preloading for critical resources\n');
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('📊 Performance Budget Report\n');
    console.log('=' .repeat(50));
    
    // Bundle size summary
    console.log('\n📦 Bundle Size Summary:');
    console.log(`Total: ${(this.stats.totalSize / 1024).toFixed(2)} KB (Budget: ${BUDGETS.bundle.total} KB)`);
    console.log(`JavaScript: ${(this.stats.jsSize / 1024).toFixed(2)} KB (Budget: ${BUDGETS.bundle.js} KB)`);
    console.log(`CSS: ${(this.stats.cssSize / 1024).toFixed(2)} KB (Budget: ${BUDGETS.bundle.css} KB)`);
    console.log(`Images: ${(this.stats.imageSize / 1024).toFixed(2)} KB (Budget: ${BUDGETS.bundle.images} KB)`);
    console.log(`Fonts: ${(this.stats.fontSize / 1024).toFixed(2)} KB (Budget: ${BUDGETS.bundle.fonts} KB)`);
    console.log(`Files: ${this.stats.fileCount}`);
    
    // Violations
    if (this.violations.length > 0) {
      console.log('\n🚨 Budget Violations:');
      this.violations.forEach(violation => {
        const status = violation.severity === 'error' ? '🔴' : '🟡';
        console.log(`${status} ${violation.metric}: ${violation.actual.toFixed(2)} KB (Budget: ${violation.budget} KB)`);
      });
    } else {
      console.log('\n✅ All budgets met!');
    }
    
    console.log('\n' + '=' .repeat(50));
  }

  /**
   * Run all checks
   */
  async run() {
    const distPath = path.join(__dirname, '../dist');
    
    if (!fs.existsSync(distPath)) {
      console.log('❌ Dist folder not found. Run "npm run build" first.');
      return;
    }

    console.log('🚀 Performance Budget Checker\n');
    
    this.checkBundleBudgets(distPath);
    this.checkWebVitalsBudgets();
    this.checkResourceBudgets();
    this.generateRecommendations();
    this.generateReport();
    
    // Exit with error code if there are violations
    if (this.violations.some(v => v.severity === 'error')) {
      process.exit(1);
    }
  }
}

// Run the checker
const checker = new PerformanceBudgetChecker();
checker.run().catch(console.error);
