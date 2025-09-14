/**
 * File Upload Service
 * Secure file upload with validation, compression, and progress tracking
 */

import { supabase } from './customSupabaseClient';
import { validationService } from './validation';
import { monitoringService } from './monitoring';

class FileUploadService {
  constructor() {
    this.maxFileSize = 5 * 1024 * 1024; // 5MB default
    this.allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    };
    this.allowedExtensions = {
      image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      document: ['.pdf', '.doc', '.docx'],
      spreadsheet: ['.xls', '.xlsx']
    };
    this.uploadQueue = new Map();
    this.activeUploads = new Set();
  }

  /**
   * Upload file with security validation
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result
   */
  async uploadFile(file, options = {}) {
    const {
      bucket = 'uploads',
      folder = 'general',
      category = 'image',
      onProgress = () => {},
      onError = () => {},
      compress = true,
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8
    } = options;

    const uploadId = this.generateUploadId();
    
    try {
      // Validate file
      const validation = this.validateFile(file, category);
      if (!validation.isValid) {
        throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        throw new Error(`File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`);
      }

      // Add to upload queue
      this.uploadQueue.set(uploadId, {
        file,
        status: 'queued',
        progress: 0,
        startTime: Date.now()
      });

      // Process file (compress if needed)
      let processedFile = file;
      if (compress && this.isImage(file)) {
        processedFile = await this.compressImage(file, maxWidth, maxHeight, quality);
      }

      // Generate secure filename
      const filename = this.generateSecureFilename(file.name);
      const filePath = `${folder}/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Update upload status
      this.uploadQueue.set(uploadId, {
        file,
        status: 'completed',
        progress: 100,
        url: urlData.publicUrl,
        path: filePath,
        endTime: Date.now()
      });

      // Track successful upload
      monitoringService.trackUserAction('file_upload_success', {
        filename: file.name,
        size: file.size,
        type: file.type,
        category
      });

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        filename: filename,
        size: processedFile.size,
        originalSize: file.size,
        compressed: file.size !== processedFile.size
      };

    } catch (error) {
      // Update upload status
      this.uploadQueue.set(uploadId, {
        file,
        status: 'failed',
        progress: 0,
        error: error.message,
        endTime: Date.now()
      });

      // Track failed upload
      monitoringService.trackUserAction('file_upload_failed', {
        filename: file.name,
        size: file.size,
        type: file.type,
        error: error.message
      });

      onError(error);
      throw error;
    } finally {
      // Remove from active uploads
      this.activeUploads.delete(uploadId);
    }
  }

  /**
   * Upload multiple files
   * @param {FileList|Array} files - Files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} - Upload results
   */
  async uploadMultipleFiles(files, options = {}) {
    const fileArray = Array.from(files);
    const results = [];

    for (const file of fileArray) {
      try {
        const result = await this.uploadFile(file, options);
        results.push({ success: true, file, result });
      } catch (error) {
        results.push({ success: false, file, error: error.message });
      }
    }

    return results;
  }

  /**
   * Validate file
   * @param {File} file - File to validate
   * @param {string} category - File category
   * @returns {Object} - Validation result
   */
  validateFile(file, category = 'image') {
    const errors = [];

    // Check file type
    if (!this.allowedTypes[category]?.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${this.allowedTypes[category].join(', ')}`);
    }

    // Check file extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!this.allowedExtensions[category]?.includes(extension)) {
      errors.push(`File extension not allowed. Allowed extensions: ${this.allowedExtensions[category].join(', ')}`);
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check for malicious file names
    if (this.isMaliciousFilename(file.name)) {
      errors.push('File name contains potentially malicious characters');
    }

    // Additional validation for images
    if (category === 'image') {
      if (!this.isImage(file)) {
        errors.push('File is not a valid image');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if file is an image
   * @param {File} file - File to check
   * @returns {boolean} - Whether file is an image
   */
  isImage(file) {
    return file.type.startsWith('image/');
  }

  /**
   * Check if filename is malicious
   * @param {string} filename - Filename to check
   * @returns {boolean} - Whether filename is malicious
   */
  isMaliciousFilename(filename) {
    const maliciousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Invalid characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
      /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i // Executable extensions
    ];

    return maliciousPatterns.some(pattern => pattern.test(filename));
  }

  /**
   * Compress image
   * @param {File} file - Image file to compress
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @param {number} quality - Compression quality (0-1)
   * @returns {Promise<File>} - Compressed file
   */
  async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate secure filename
   * @param {string} originalName - Original filename
   * @returns {string} - Secure filename
   */
  generateSecureFilename(originalName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    
    // Remove any potentially dangerous characters
    const safeName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50); // Limit length
    
    return `${timestamp}_${randomString}_${safeName}${extension}`;
  }

  /**
   * Generate upload ID
   * @returns {string} - Upload ID
   */
  generateUploadId() {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delete uploaded file
   * @param {string} path - File path
   * @param {string} bucket - Storage bucket
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(path, bucket = 'uploads') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      monitoringService.trackUserAction('file_delete_success', { path, bucket });
      return true;
    } catch (error) {
      monitoringService.trackUserAction('file_delete_failed', { path, bucket, error: error.message });
      throw error;
    }
  }

  /**
   * Get file info
   * @param {string} path - File path
   * @param {string} bucket - Storage bucket
   * @returns {Promise<Object>} - File info
   */
  async getFileInfo(path, bucket = 'uploads') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path.split('/').slice(0, -1).join('/'), {
          search: path.split('/').pop()
        });

      if (error) {
        throw error;
      }

      return data[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get upload progress
   * @param {string} uploadId - Upload ID
   * @returns {Object} - Upload progress
   */
  getUploadProgress(uploadId) {
    return this.uploadQueue.get(uploadId) || null;
  }

  /**
   * Get all uploads
   * @returns {Array} - All uploads
   */
  getAllUploads() {
    return Array.from(this.uploadQueue.values());
  }

  /**
   * Clear completed uploads
   */
  clearCompletedUploads() {
    for (const [id, upload] of this.uploadQueue.entries()) {
      if (upload.status === 'completed' || upload.status === 'failed') {
        this.uploadQueue.delete(id);
      }
    }
  }

  /**
   * Set file size limit
   * @param {number} sizeInBytes - Size limit in bytes
   */
  setMaxFileSize(sizeInBytes) {
    this.maxFileSize = sizeInBytes;
  }

  /**
   * Add allowed file type
   * @param {string} category - File category
   * @param {string} mimeType - MIME type
   * @param {string} extension - File extension
   */
  addAllowedType(category, mimeType, extension) {
    if (!this.allowedTypes[category]) {
      this.allowedTypes[category] = [];
      this.allowedExtensions[category] = [];
    }
    
    this.allowedTypes[category].push(mimeType);
    this.allowedExtensions[category].push(extension);
  }

  /**
   * Remove allowed file type
   * @param {string} category - File category
   * @param {string} mimeType - MIME type
   * @param {string} extension - File extension
   */
  removeAllowedType(category, mimeType, extension) {
    if (this.allowedTypes[category]) {
      this.allowedTypes[category] = this.allowedTypes[category].filter(type => type !== mimeType);
      this.allowedExtensions[category] = this.allowedExtensions[category].filter(ext => ext !== extension);
    }
  }
}

// Create singleton instance
export const fileUploadService = new FileUploadService();

// Export for use in components
export default fileUploadService;

