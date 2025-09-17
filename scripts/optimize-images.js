#!/usr/bin/env node

// Image Optimization Script for MEMA Rental
// This script converts images to WebP format for better performance

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = path.join(__dirname, '../public/images/cars');
const outputDir = path.join(__dirname, '../public/images/cars/webp');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check if sharp is available (for image processing)
let hasSharp = false;
try {
  require('sharp');
  hasSharp = true;
} catch (error) {
  console.log('Sharp not found. Install with: npm install sharp');
}

// Check if imagemagick is available
let hasImageMagick = false;
try {
  execSync('convert -version', { stdio: 'ignore' });
  hasImageMagick = true;
} catch (error) {
  console.log('ImageMagick not found. Install ImageMagick for image optimization.');
}

const optimizeImages = () => {
  console.log('🖼️  Image Optimization Script\n');
  console.log('=' .repeat(50));

  if (!hasSharp && !hasImageMagick) {
    console.log('❌ No image processing tools available.');
    console.log('   Install either Sharp (npm install sharp) or ImageMagick');
    return;
  }

  // Get all image files
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .filter(file => !file.includes('webp')); // Skip already converted files

  console.log(`📁 Found ${imageFiles.length} images to optimize\n`);

  let processedCount = 0;
  let skippedCount = 0;

  imageFiles.forEach(file => {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    // Skip if WebP version already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${file} (WebP already exists)`);
      skippedCount++;
      return;
    }

    try {
      if (hasSharp) {
        // Use Sharp for conversion
        const sharp = require('sharp');
        sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        console.log(`✅ Converted ${file} → ${baseName}.webp`);
        processedCount++;
      } else if (hasImageMagick) {
        // Use ImageMagick for conversion
        execSync(`convert "${inputPath}" -quality 85 "${outputPath}"`, { stdio: 'ignore' });
        console.log(`✅ Converted ${file} → ${baseName}.webp`);
        processedCount++;
      }
    } catch (error) {
      console.log(`❌ Failed to convert ${file}: ${error.message}`);
    }
  });

  console.log('\n📊 Summary:');
  console.log(`✅ Processed: ${processedCount} images`);
  console.log(`⏭️  Skipped: ${skippedCount} images`);
  console.log(`📁 Output directory: ${outputDir}`);

  if (processedCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('1. Update your image components to use WebP versions');
    console.log('2. Add fallback to original formats');
    console.log('3. Test image loading performance');
  }

  console.log('\n' + '=' .repeat(50));
};

// Run optimization
optimizeImages();
