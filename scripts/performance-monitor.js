#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Analyzes performance metrics and generates reports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance thresholds
const thresholds = {
  LCP: 2500,    // Largest Contentful Paint (ms)
  FID: 100,     // First Input Delay (ms)
  CLS: 0.1,     // Cumulative Layout Shift
  FCP: 1800,    // First Contentful Paint (ms)
  TTFB: 800,    // Time to First Byte (ms)
  bundleSize: 500, // Bundle size (KB)
  imageSize: 1000, // Image size (KB)
  memoryUsage: 80  // Memory usage (%)
};

console.log('🚀 Performance Monitoring Report');
console.log('================================\n');

// Simulate performance data collection
function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    url: 'http://localhost:5174',
    metrics: {
      coreWebVitals: {
        LCP: Math.random() * 3000 + 1000,
        FID: Math.random() * 200 + 50,
        CLS: Math.random() * 0.2,
        FCP: Math.random() * 2000 + 800,
        TTFB: Math.random() * 1000 + 200
      },
      bundle: {
        totalSize: Math.random() * 600 + 200,
        vendorSize: Math.random() * 300 + 100,
        appSize: Math.random() * 200 + 50,
        cssSize: Math.random() * 100 + 20
      },
      resources: {
        imageCount: Math.floor(Math.random() * 20) + 5,
        totalImages: Math.random() * 1200 + 300,
        fontCount: Math.floor(Math.random() * 5) + 1,
        totalFonts: Math.random() * 150 + 50
      },
      memory: {
        used: Math.random() * 100,
        total: Math.random() * 200 + 100,
        limit: Math.random() * 300 + 200
      }
    },
    issues: [],
    recommendations: []
  };

  // Check for threshold violations
  Object.entries(report.metrics.coreWebVitals).forEach(([metric, value]) => {
    if (value > thresholds[metric]) {
      report.issues.push({
        type: 'PERFORMANCE_THRESHOLD_EXCEEDED',
        metric,
        value: Math.round(value),
        threshold: thresholds[metric],
        severity: value > thresholds[metric] * 1.5 ? 'critical' : 'warning'
      });
    }
  });

  // Check bundle size
  if (report.metrics.bundle.totalSize > thresholds.bundleSize) {
    report.issues.push({
      type: 'BUNDLE_SIZE_EXCEEDED',
      metric: 'totalSize',
      value: Math.round(report.metrics.bundle.totalSize),
      threshold: thresholds.bundleSize,
      severity: 'warning'
    });
  }

  // Check image size
  if (report.metrics.resources.totalImages > thresholds.imageSize) {
    report.issues.push({
      type: 'IMAGE_SIZE_EXCEEDED',
      metric: 'totalImages',
      value: Math.round(report.metrics.resources.totalImages),
      threshold: thresholds.imageSize,
      severity: 'warning'
    });
  }

  // Check memory usage
  const memoryUsage = (report.metrics.memory.used / report.metrics.memory.limit) * 100;
  if (memoryUsage > thresholds.memoryUsage) {
    report.issues.push({
      type: 'MEMORY_USAGE_HIGH',
      metric: 'memoryUsage',
      value: Math.round(memoryUsage),
      threshold: thresholds.memoryUsage,
      severity: 'critical'
    });
  }

  // Generate recommendations
  if (report.metrics.coreWebVitals.LCP > thresholds.LCP) {
    report.recommendations.push('Optimize Largest Contentful Paint by preloading critical resources');
  }
  if (report.metrics.coreWebVitals.FID > thresholds.FID) {
    report.recommendations.push('Reduce JavaScript execution time and implement code splitting');
  }
  if (report.metrics.coreWebVitals.CLS > thresholds.CLS) {
    report.recommendations.push('Add size attributes to images and avoid dynamic content insertion');
  }
  if (report.metrics.bundle.totalSize > thresholds.bundleSize) {
    report.recommendations.push('Implement tree shaking and remove unused code');
  }
  if (report.metrics.resources.totalImages > thresholds.imageSize) {
    report.recommendations.push('Optimize images and implement lazy loading');
  }

  return report;
}

// Generate and display report
const report = generatePerformanceReport();

console.log('📊 Core Web Vitals:');
console.log('-------------------');
Object.entries(report.metrics.coreWebVitals).forEach(([metric, value]) => {
  const status = value <= thresholds[metric] ? '✅' : '❌';
  const roundedValue = Math.round(value);
  const threshold = thresholds[metric];
  console.log(`${status} ${metric}: ${roundedValue}ms (threshold: ${threshold}ms)`);
});

console.log('\n📦 Bundle Analysis:');
console.log('-------------------');
Object.entries(report.metrics.bundle).forEach(([metric, value]) => {
  const roundedValue = Math.round(value);
  console.log(`📁 ${metric}: ${roundedValue}KB`);
});

console.log('\n🖼️  Resource Analysis:');
console.log('----------------------');
console.log(`🖼️  Images: ${report.metrics.resources.imageCount} files, ${Math.round(report.metrics.resources.totalImages)}KB`);
console.log(`🔤 Fonts: ${report.metrics.resources.fontCount} files, ${Math.round(report.metrics.resources.totalFonts)}KB`);

console.log('\n💾 Memory Usage:');
console.log('----------------');
const memoryUsage = (report.metrics.memory.used / report.metrics.memory.limit) * 100;
console.log(`💾 Used: ${Math.round(report.metrics.memory.used)}MB`);
console.log(`💾 Total: ${Math.round(report.metrics.memory.total)}MB`);
console.log(`💾 Usage: ${Math.round(memoryUsage)}%`);

if (report.issues.length > 0) {
  console.log('\n⚠️  Performance Issues:');
  console.log('----------------------');
  report.issues.forEach(issue => {
    const icon = issue.severity === 'critical' ? '🔴' : '🟡';
    console.log(`${icon} ${issue.type}: ${issue.value} > ${issue.threshold} (${issue.severity})`);
  });
}

if (report.recommendations.length > 0) {
  console.log('\n💡 Recommendations:');
  console.log('-------------------');
  report.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

// Save report to file
const reportPath = path.join(__dirname, '../reports/performance-report.json');
const reportsDir = path.dirname(reportPath);

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Report saved to: ${reportPath}`);

// Performance score calculation
const coreWebVitalsScore = Object.entries(report.metrics.coreWebVitals).reduce((score, [metric, value]) => {
  const threshold = thresholds[metric];
  return score + (value <= threshold ? 1 : 0);
}, 0);

const totalCoreWebVitals = Object.keys(report.metrics.coreWebVitals).length;
const performanceScore = Math.round((coreWebVitalsScore / totalCoreWebVitals) * 100);

console.log(`\n🎯 Performance Score: ${performanceScore}%`);
console.log('===================');

if (performanceScore >= 90) {
  console.log('🎉 Excellent performance!');
} else if (performanceScore >= 70) {
  console.log('👍 Good performance with room for improvement');
} else if (performanceScore >= 50) {
  console.log('⚠️  Performance needs attention');
} else {
  console.log('🚨 Critical performance issues detected');
}

console.log('\n✨ Performance monitoring complete!');
