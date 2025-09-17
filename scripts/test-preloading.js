#!/usr/bin/env node

/**
 * Preloading Test Script
 * Tests the preloading system functionality
 */

import { preloader } from '../src/lib/preloader.js';

class PreloadingTester {
  constructor() {
    this.testResults = [];
  }

  /**
   * Test critical resource preloading
   */
  async testCriticalPreloading() {
    console.log('🧪 Testing critical resource preloading...');
    
    try {
      await preloader.preloadCriticalResources();
      this.testResults.push({
        test: 'Critical Resources',
        status: 'PASS',
        message: 'Critical resources preloaded successfully'
      });
    } catch (error) {
      this.testResults.push({
        test: 'Critical Resources',
        status: 'FAIL',
        message: `Failed to preload critical resources: ${error.message}`
      });
    }
  }

  /**
   * Test route preloading
   */
  async testRoutePreloading() {
    console.log('🧪 Testing route preloading...');
    
    const routes = ['/cars', '/booking', '/admin'];
    
    for (const route of routes) {
      try {
        await preloader.preloadRouteResources(route);
        this.testResults.push({
          test: `Route Preloading (${route})`,
          status: 'PASS',
          message: `Route ${route} preloaded successfully`
        });
      } catch (error) {
        this.testResults.push({
          test: `Route Preloading (${route})`,
          status: 'FAIL',
          message: `Failed to preload route ${route}: ${error.message}`
        });
      }
    }
  }

  /**
   * Test image preloading
   */
  async testImagePreloading() {
    console.log('🧪 Testing image preloading...');
    
    const testImages = [
      '/images/cars/placeholder-car.jpg',
      '/images/logo.svg',
      '/images/hero-bg.webp'
    ];
    
    try {
      await preloader.preloadImages(testImages, {
        priority: 'low',
        maxConcurrent: 2,
        delay: 100
      });
      
      this.testResults.push({
        test: 'Image Preloading',
        status: 'PASS',
        message: `${testImages.length} images preloaded successfully`
      });
    } catch (error) {
      this.testResults.push({
        test: 'Image Preloading',
        status: 'FAIL',
        message: `Failed to preload images: ${error.message}`
      });
    }
  }

  /**
   * Test module preloading
   */
  async testModulePreloading() {
    console.log('🧪 Testing module preloading...');
    
    const testModules = [
      '@/components/OptimizedImage',
      '@/lib/advancedCache',
      '@/lib/preloader'
    ];
    
    try {
      await preloader.preloadModules(testModules);
      this.testResults.push({
        test: 'Module Preloading',
        status: 'PASS',
        message: `${testModules.length} modules preloaded successfully`
      });
    } catch (error) {
      this.testResults.push({
        test: 'Module Preloading',
        status: 'FAIL',
        message: `Failed to preload modules: ${error.message}`
      });
    }
  }

  /**
   * Test API data preloading
   */
  async testAPIPreloading() {
    console.log('🧪 Testing API data preloading...');
    
    const testEndpoints = [
      '/api/cars',
      '/api/bookings',
      '/api/users'
    ];
    
    try {
      await preloader.preloadAPIData(testEndpoints);
      this.testResults.push({
        test: 'API Data Preloading',
        status: 'PASS',
        message: `${testEndpoints.length} API endpoints preloaded successfully`
      });
    } catch (error) {
      this.testResults.push({
        test: 'API Data Preloading',
        status: 'FAIL',
        message: `Failed to preload API data: ${error.message}`
      });
    }
  }

  /**
   * Test connection speed detection
   */
  testConnectionSpeedDetection() {
    console.log('🧪 Testing connection speed detection...');
    
    const connectionSpeed = preloader.detectConnectionSpeed();
    
    if (connectionSpeed.effectiveType) {
      this.testResults.push({
        test: 'Connection Speed Detection',
        status: 'PASS',
        message: `Connection speed detected: ${connectionSpeed.effectiveType}`
      });
    } else {
      this.testResults.push({
        test: 'Connection Speed Detection',
        status: 'FAIL',
        message: 'Failed to detect connection speed'
      });
    }
  }

  /**
   * Test user preferences detection
   */
  testUserPreferencesDetection() {
    console.log('🧪 Testing user preferences detection...');
    
    const userPreferences = preloader.detectUserPreferences();
    
    if (userPreferences.prefersReducedMotion !== undefined) {
      this.testResults.push({
        test: 'User Preferences Detection',
        status: 'PASS',
        message: 'User preferences detected successfully'
      });
    } else {
      this.testResults.push({
        test: 'User Preferences Detection',
        status: 'FAIL',
        message: 'Failed to detect user preferences'
      });
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n📊 Preloading Test Report\n');
    console.log('=' .repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;
    
    console.log(`\n📈 Summary:`);
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
    });
    
    console.log('\n' + '=' .repeat(50));
    
    // Get preloader stats
    const stats = preloader.getStats();
    console.log('\n📊 Preloader Statistics:');
    console.log(`Preloaded Resources: ${stats.preloadedResources}`);
    console.log(`Connection Speed: ${stats.connectionSpeed.effectiveType}`);
    console.log(`User Preferences: ${JSON.stringify(stats.userPreferences, null, 2)}`);
    
    return failed === 0;
  }

  /**
   * Run all tests
   */
  async run() {
    console.log('🚀 Preloading System Test Suite\n');
    
    await this.testCriticalPreloading();
    await this.testRoutePreloading();
    await this.testImagePreloading();
    await this.testModulePreloading();
    await this.testAPIPreloading();
    this.testConnectionSpeedDetection();
    this.testUserPreferencesDetection();
    
    const success = this.generateReport();
    
    if (!success) {
      process.exit(1);
    }
  }
}

// Run the tests
const tester = new PreloadingTester();
tester.run().catch(console.error);
