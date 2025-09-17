#!/usr/bin/env node

/**
 * Cache Clear Script
 * Clears all application caches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CacheClearer {
  constructor() {
    this.cachePaths = [
      path.join(__dirname, '../dist'),
      path.join(__dirname, '../node_modules/.vite'),
      path.join(__dirname, '../.vite'),
      path.join(__dirname, '../.cache')
    ];
  }

  /**
   * Clear file system caches
   */
  clearFileSystemCaches() {
    console.log('🗑️ Clearing file system caches...');
    
    this.cachePaths.forEach(cachePath => {
      if (fs.existsSync(cachePath)) {
        try {
          fs.rmSync(cachePath, { recursive: true, force: true });
          console.log(`✅ Cleared: ${cachePath}`);
        } catch (error) {
          console.log(`❌ Failed to clear: ${cachePath} - ${error.message}`);
        }
      } else {
        console.log(`ℹ️ Path does not exist: ${cachePath}`);
      }
    });
  }

  /**
   * Clear browser caches (instructions)
   */
  showBrowserCacheInstructions() {
    console.log('\n🌐 Browser Cache Clear Instructions:');
    console.log('To clear browser caches, users can:');
    console.log('1. Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)');
    console.log('2. Open DevTools > Application > Storage > Clear storage');
    console.log('3. Use the application\'s cache clear functionality');
    console.log('4. Clear IndexedDB: DevTools > Application > IndexedDB > Delete');
    console.log('5. Clear Service Worker: DevTools > Application > Service Workers > Unregister');
  }

  /**
   * Clear application-specific caches
   */
  clearApplicationCaches() {
    console.log('\n🗑️ Clearing application-specific caches...');
    
    const appCachePaths = [
      path.join(__dirname, '../src/lib/cache'),
      path.join(__dirname, '../src/lib/storage'),
      path.join(__dirname, '../public/cache')
    ];
    
    appCachePaths.forEach(cachePath => {
      if (fs.existsSync(cachePath)) {
        try {
          fs.rmSync(cachePath, { recursive: true, force: true });
          console.log(`✅ Cleared: ${cachePath}`);
        } catch (error) {
          console.log(`❌ Failed to clear: ${cachePath} - ${error.message}`);
        }
      } else {
        console.log(`ℹ️ Path does not exist: ${cachePath}`);
      }
    });
  }

  /**
   * Clear build artifacts
   */
  clearBuildArtifacts() {
    console.log('\n🗑️ Clearing build artifacts...');
    
    const buildPaths = [
      path.join(__dirname, '../dist'),
      path.join(__dirname, '../build'),
      path.join(__dirname, '../.next'),
      path.join(__dirname, '../out')
    ];
    
    buildPaths.forEach(buildPath => {
      if (fs.existsSync(buildPath)) {
        try {
          fs.rmSync(buildPath, { recursive: true, force: true });
          console.log(`✅ Cleared: ${buildPath}`);
        } catch (error) {
          console.log(`❌ Failed to clear: ${buildPath} - ${error.message}`);
        }
      } else {
        console.log(`ℹ️ Path does not exist: ${buildPath}`);
      }
    });
  }

  /**
   * Clear temporary files
   */
  clearTempFiles() {
    console.log('\n🗑️ Clearing temporary files...');
    
    const tempPaths = [
      path.join(__dirname, '../tmp'),
      path.join(__dirname, '../temp'),
      path.join(__dirname, '../.tmp'),
      path.join(__dirname, '../.temp')
    ];
    
    tempPaths.forEach(tempPath => {
      if (fs.existsSync(tempPath)) {
        try {
          fs.rmSync(tempPath, { recursive: true, force: true });
          console.log(`✅ Cleared: ${tempPath}`);
        } catch (error) {
          console.log(`❌ Failed to clear: ${tempPath} - ${error.message}`);
        }
      } else {
        console.log(`ℹ️ Path does not exist: ${tempPath}`);
      }
    });
  }

  /**
   * Clear log files
   */
  clearLogFiles() {
    console.log('\n🗑️ Clearing log files...');
    
    const logPaths = [
      path.join(__dirname, '../logs'),
      path.join(__dirname, '../*.log'),
      path.join(__dirname, '../npm-debug.log*'),
      path.join(__dirname, '../yarn-debug.log*'),
      path.join(__dirname, '../yarn-error.log*')
    ];
    
    logPaths.forEach(logPath => {
      if (fs.existsSync(logPath)) {
        try {
          fs.rmSync(logPath, { recursive: true, force: true });
          console.log(`✅ Cleared: ${logPath}`);
        } catch (error) {
          console.log(`❌ Failed to clear: ${logPath} - ${error.message}`);
        }
      } else {
        console.log(`ℹ️ Path does not exist: ${logPath}`);
      }
    });
  }

  /**
   * Show cache statistics
   */
  showCacheStatistics() {
    console.log('\n📊 Cache Statistics:');
    
    let totalSize = 0;
    let totalFiles = 0;
    
    this.cachePaths.forEach(cachePath => {
      if (fs.existsSync(cachePath)) {
        const stats = this.getDirectoryStats(cachePath);
        totalSize += stats.size;
        totalFiles += stats.files;
        console.log(`${cachePath}: ${stats.files} files, ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      }
    });
    
    console.log(`Total: ${totalFiles} files, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * Get directory statistics
   */
  getDirectoryStats(dirPath) {
    let size = 0;
    let files = 0;
    
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile()) {
          size += stats.size;
          files++;
        } else if (stats.isDirectory()) {
          const subStats = this.getDirectoryStats(itemPath);
          size += subStats.size;
          files += subStats.files;
        }
      });
    };
    
    try {
      walkDir(dirPath);
    } catch (error) {
      console.log(`Error reading directory ${dirPath}: ${error.message}`);
    }
    
    return { size, files };
  }

  /**
   * Run cache clear
   */
  run() {
    console.log('🚀 Cache Clear Utility\n');
    console.log('=' .repeat(50));
    
    this.showCacheStatistics();
    this.clearFileSystemCaches();
    this.clearApplicationCaches();
    this.clearBuildArtifacts();
    this.clearTempFiles();
    this.clearLogFiles();
    this.showBrowserCacheInstructions();
    
    console.log('\n✅ Cache clear completed!');
    console.log('=' .repeat(50));
  }
}

// Run the cache clearer
const clearer = new CacheClearer();
clearer.run();
