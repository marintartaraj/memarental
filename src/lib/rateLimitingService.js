/**
 * Rate Limiting Service
 * Implements client-side rate limiting for login attempts and other sensitive operations
 */

class RateLimitingService {
  constructor() {
    this.attempts = new Map();
    this.locks = new Map();
    this.defaultConfig = {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      lockoutDuration: 30 * 60 * 1000, // 30 minutes
      progressiveDelay: true,
      maxDelay: 5 * 60 * 1000 // 5 minutes max delay
    };
  }

  /**
   * Check if an operation is rate limited
   * @param {string} key - Unique identifier (e.g., IP, email, user ID)
   * @param {Object} config - Rate limiting configuration
   * @returns {Object} - { allowed: boolean, remainingAttempts: number, resetTime: number, delay: number }
   */
  checkRateLimit(key, config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    
    // Check if key is locked
    if (this.locks.has(key)) {
      const lockInfo = this.locks.get(key);
      if (now < lockInfo.until) {
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: lockInfo.until,
          delay: lockInfo.until - now,
          reason: 'LOCKED',
          lockoutDuration: lockInfo.duration
        };
      } else {
        // Lock expired, remove it
        this.locks.delete(key);
        this.attempts.delete(key);
      }
    }

    // Get or create attempt record
    let attemptRecord = this.attempts.get(key) || {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      windowStart: now
    };

    // Reset window if expired
    if (now - attemptRecord.windowStart > finalConfig.windowMs) {
      attemptRecord = {
        attempts: 0,
        firstAttempt: now,
        lastAttempt: now,
        windowStart: now
      };
    }

    const remainingAttempts = Math.max(0, finalConfig.maxAttempts - attemptRecord.attempts);
    const resetTime = attemptRecord.windowStart + finalConfig.windowMs;
    const timeUntilReset = Math.max(0, resetTime - now);

    // Check if rate limit exceeded
    if (attemptRecord.attempts >= finalConfig.maxAttempts) {
      // Apply lockout
      const lockoutDuration = finalConfig.lockoutDuration;
      this.locks.set(key, {
        until: now + lockoutDuration,
        duration: lockoutDuration,
        reason: 'MAX_ATTEMPTS_EXCEEDED'
      });

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: now + lockoutDuration,
        delay: lockoutDuration,
        reason: 'MAX_ATTEMPTS_EXCEEDED',
        lockoutDuration
      };
    }

    // Calculate progressive delay
    let delay = 0;
    if (finalConfig.progressiveDelay && attemptRecord.attempts > 0) {
      const delayMultiplier = Math.pow(2, attemptRecord.attempts - 1); // Exponential backoff
      delay = Math.min(delayMultiplier * 1000, finalConfig.maxDelay); // 1s, 2s, 4s, 8s, max 5min
    }

    return {
      allowed: true,
      remainingAttempts,
      resetTime,
      delay,
      reason: 'ALLOWED'
    };
  }

  /**
   * Record a failed attempt
   * @param {string} key - Unique identifier
   * @param {Object} config - Rate limiting configuration
   */
  recordFailedAttempt(key, config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    
    let attemptRecord = this.attempts.get(key) || {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      windowStart: now
    };

    // Reset window if expired
    if (now - attemptRecord.windowStart > finalConfig.windowMs) {
      attemptRecord = {
        attempts: 0,
        firstAttempt: now,
        lastAttempt: now,
        windowStart: now
      };
    }

    attemptRecord.attempts += 1;
    attemptRecord.lastAttempt = now;
    this.attempts.set(key, attemptRecord);

    console.log(`Rate limiting: Failed attempt recorded for ${key}. Attempts: ${attemptRecord.attempts}/${finalConfig.maxAttempts}`);
  }

  /**
   * Record a successful attempt (reset counter)
   * @param {string} key - Unique identifier
   */
  recordSuccessfulAttempt(key) {
    this.attempts.delete(key);
    this.locks.delete(key);
    console.log(`Rate limiting: Successful attempt for ${key}. Counter reset.`);
  }

  /**
   * Get current status for a key
   * @param {string} key - Unique identifier
   * @param {Object} config - Rate limiting configuration
   * @returns {Object} - Current status information
   */
  getStatus(key, config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    
    // Check lock status
    if (this.locks.has(key)) {
      const lockInfo = this.locks.get(key);
      return {
        isLocked: now < lockInfo.until,
        lockUntil: lockInfo.until,
        lockDuration: lockInfo.duration,
        remainingLockTime: Math.max(0, lockInfo.until - now)
      };
    }

    // Check attempt status
    const attemptRecord = this.attempts.get(key);
    if (!attemptRecord) {
      return {
        isLocked: false,
        attempts: 0,
        remainingAttempts: finalConfig.maxAttempts,
        windowStart: null,
        windowEnd: null
      };
    }

    const windowEnd = attemptRecord.windowStart + finalConfig.windowMs;
    const isWindowExpired = now > windowEnd;

    return {
      isLocked: false,
      attempts: isWindowExpired ? 0 : attemptRecord.attempts,
      remainingAttempts: Math.max(0, finalConfig.maxAttempts - (isWindowExpired ? 0 : attemptRecord.attempts)),
      windowStart: attemptRecord.windowStart,
      windowEnd: windowEnd,
      isWindowExpired
    };
  }

  /**
   * Manually lock a key
   * @param {string} key - Unique identifier
   * @param {number} duration - Lock duration in milliseconds
   * @param {string} reason - Reason for lock
   */
  lockKey(key, duration, reason = 'MANUAL_LOCK') {
    this.locks.set(key, {
      until: Date.now() + duration,
      duration,
      reason
    });
    console.log(`Rate limiting: Manual lock applied to ${key} for ${duration}ms. Reason: ${reason}`);
  }

  /**
   * Manually unlock a key
   * @param {string} key - Unique identifier
   */
  unlockKey(key) {
    this.locks.delete(key);
    this.attempts.delete(key);
    console.log(`Rate limiting: Manual unlock applied to ${key}`);
  }

  /**
   * Clear all rate limiting data
   */
  clearAll() {
    this.attempts.clear();
    this.locks.clear();
    console.log('Rate limiting: All data cleared');
  }

  /**
   * Get all current locks (for admin monitoring)
   * @returns {Array} - Array of lock information
   */
  getAllLocks() {
    const now = Date.now();
    const locks = [];
    
    for (const [key, lockInfo] of this.locks.entries()) {
      if (now < lockInfo.until) {
        locks.push({
          key,
          until: lockInfo.until,
          remaining: lockInfo.until - now,
          reason: lockInfo.reason,
          duration: lockInfo.duration
        });
      }
    }
    
    return locks;
  }

  /**
   * Get all current attempts (for admin monitoring)
   * @returns {Array} - Array of attempt information
   */
  getAllAttempts() {
    const now = Date.now();
    const attempts = [];
    
    for (const [key, attemptInfo] of this.attempts.entries()) {
      attempts.push({
        key,
        attempts: attemptInfo.attempts,
        firstAttempt: attemptInfo.firstAttempt,
        lastAttempt: attemptInfo.lastAttempt,
        windowStart: attemptInfo.windowStart,
        isActive: now - attemptInfo.windowStart < this.defaultConfig.windowMs
      });
    }
    
    return attempts;
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    
    // Remove expired locks
    for (const [key, lockInfo] of this.locks.entries()) {
      if (now >= lockInfo.until) {
        this.locks.delete(key);
      }
    }
    
    // Remove expired attempts
    for (const [key, attemptInfo] of this.attempts.entries()) {
      if (now - attemptInfo.windowStart > this.defaultConfig.windowMs) {
        this.attempts.delete(key);
      }
    }
    
    console.log('Rate limiting: Cleanup completed');
  }

  /**
   * Start periodic cleanup
   * @param {number} intervalMs - Cleanup interval in milliseconds
   */
  startPeriodicCleanup(intervalMs = 5 * 60 * 1000) { // Default: 5 minutes
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMs);
    
    console.log(`Rate limiting: Periodic cleanup started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop periodic cleanup
   */
  stopPeriodicCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Rate limiting: Periodic cleanup stopped');
    }
  }
}

// Create singleton instance
const rateLimitingService = new RateLimitingService();

// Start periodic cleanup
rateLimitingService.startPeriodicCleanup();

export default rateLimitingService;

