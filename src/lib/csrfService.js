/**
 * CSRF Protection Service
 * Implements Cross-Site Request Forgery protection for form submissions
 */

class CSRFService {
  constructor() {
    this.tokens = new Map();
    this.config = {
      tokenLength: 32,
      tokenExpiry: 60 * 60 * 1000, // 1 hour
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      maxTokensPerSession: 10
    };
    this.cleanupInterval = null;
    this.startPeriodicCleanup();
  }

  /**
   * Generate a new CSRF token
   * @param {string} sessionId - Session identifier
   * @returns {string} - Generated CSRF token
   */
  generateToken(sessionId = 'default') {
    const token = this.generateRandomToken();
    const expires = Date.now() + this.config.tokenExpiry;
    
    // Clean up old tokens for this session
    this.cleanupSessionTokens(sessionId);
    
    this.tokens.set(token, {
      sessionId,
      expires,
      createdAt: Date.now(),
      used: false
    });

    console.log(`CSRF: Generated token for session ${sessionId}`);
    return token;
  }

  /**
   * Validate a CSRF token
   * @param {string} token - Token to validate
   * @param {string} sessionId - Session identifier
   * @returns {Object} - Validation result
   */
  validateToken(token, sessionId = 'default') {
    if (!token) {
      return { valid: false, reason: 'NO_TOKEN' };
    }

    const tokenInfo = this.tokens.get(token);
    
    if (!tokenInfo) {
      return { valid: false, reason: 'INVALID_TOKEN' };
    }

    if (tokenInfo.sessionId !== sessionId) {
      return { valid: false, reason: 'SESSION_MISMATCH' };
    }

    if (Date.now() > tokenInfo.expires) {
      this.tokens.delete(token);
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }

    if (tokenInfo.used) {
      return { valid: false, reason: 'TOKEN_REUSED' };
    }

    return { valid: true, tokenInfo };
  }

  /**
   * Use a CSRF token (mark as used)
   * @param {string} token - Token to use
   * @returns {boolean} - Success status
   */
  useToken(token) {
    const tokenInfo = this.tokens.get(token);
    if (tokenInfo && !tokenInfo.used) {
      tokenInfo.used = true;
      tokenInfo.usedAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Generate a random token
   * @returns {string} - Random token
   */
  generateRandomToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < this.config.tokenLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Clean up expired tokens for a session
   * @param {string} sessionId - Session identifier
   */
  cleanupSessionTokens(sessionId) {
    const now = Date.now();
    const sessionTokens = Array.from(this.tokens.entries())
      .filter(([token, info]) => info.sessionId === sessionId)
      .sort((a, b) => b[1].createdAt - a[1].createdAt); // Sort by creation time, newest first

    // Keep only the most recent tokens
    if (sessionTokens.length >= this.config.maxTokensPerSession) {
      const tokensToRemove = sessionTokens
        .slice(this.config.maxTokensPerSession - 1)
        .map(([token]) => token);
      
      tokensToRemove.forEach(token => this.tokens.delete(token));
    }

    // Remove expired tokens
    sessionTokens.forEach(([token, info]) => {
      if (now > info.expires) {
        this.tokens.delete(token);
      }
    });
  }

  /**
   * Clean up all expired tokens
   */
  cleanup() {
    const now = Date.now();
    const expiredTokens = [];
    
    for (const [token, info] of this.tokens.entries()) {
      if (now > info.expires) {
        expiredTokens.push(token);
      }
    }
    
    expiredTokens.forEach(token => this.tokens.delete(token));
    
    if (expiredTokens.length > 0) {
      console.log(`CSRF: Cleaned up ${expiredTokens.length} expired tokens`);
    }
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
    
    console.log(`CSRF: Periodic cleanup started (interval: ${this.config.cleanupInterval}ms)`);
  }

  /**
   * Stop periodic cleanup
   */
  stopPeriodicCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('CSRF: Periodic cleanup stopped');
    }
  }

  /**
   * Get token statistics
   * @returns {Object} - Token statistics
   */
  getStats() {
    const now = Date.now();
    const stats = {
      totalTokens: this.tokens.size,
      activeTokens: 0,
      expiredTokens: 0,
      usedTokens: 0,
      sessions: new Set()
    };

    for (const [token, info] of this.tokens.entries()) {
      stats.sessions.add(info.sessionId);
      
      if (now > info.expires) {
        stats.expiredTokens++;
      } else {
        stats.activeTokens++;
      }
      
      if (info.used) {
        stats.usedTokens++;
      }
    }

    stats.sessionCount = stats.sessions.size;
    return stats;
  }

  /**
   * Clear all tokens
   */
  clearAll() {
    this.tokens.clear();
    console.log('CSRF: All tokens cleared');
  }

  /**
   * Clear tokens for a specific session
   * @param {string} sessionId - Session identifier
   */
  clearSession(sessionId) {
    const tokensToRemove = [];
    
    for (const [token, info] of this.tokens.entries()) {
      if (info.sessionId === sessionId) {
        tokensToRemove.push(token);
      }
    }
    
    tokensToRemove.forEach(token => this.tokens.delete(token));
    
    if (tokensToRemove.length > 0) {
      console.log(`CSRF: Cleared ${tokensToRemove.length} tokens for session ${sessionId}`);
    }
  }

  /**
   * Get all tokens (for debugging)
   * @returns {Array} - Array of token information
   */
  getAllTokens() {
    const now = Date.now();
    return Array.from(this.tokens.entries()).map(([token, info]) => ({
      token: token.substring(0, 8) + '...', // Partial token for security
      sessionId: info.sessionId,
      createdAt: info.createdAt,
      expires: info.expires,
      used: info.used,
      usedAt: info.usedAt,
      isExpired: now > info.expires
    }));
  }
}

// Create singleton instance
const csrfService = new CSRFService();

export default csrfService;

