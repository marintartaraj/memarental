/**
 * Authentication Service
 * Handles role-based authentication and security features
 */

import { supabase } from './customSupabaseClient';

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Session timeout configuration
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
const SESSION_WARNING_TIME = 7 * 60 * 60 * 1000; // 7 hours

class AuthService {
  constructor() {
    this.sessionStartTime = null;
    this.sessionWarningShown = false;
    this.setupSessionMonitoring();
  }

  /**
   * Check if user has admin role
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Whether user is admin
   */
  async isAdmin(userId) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  /**
   * Check if user has specific role
   * @param {string} userId - User ID
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} - Whether user has role
   */
  async hasRole(userId, role) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', role)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  /**
   * Get all roles for a user
   * @param {string} userId - User ID
   * @returns {Promise<string[]>} - Array of user roles
   */
  async getUserRoles(userId) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data?.map(item => item.role) || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }

  /**
   * Check rate limiting for login attempts
   * @param {string} email - User email
   * @returns {boolean} - Whether login is allowed
   */
  checkRateLimit(email) {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

    // Reset count if lockout period has passed
    if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
      attempts.count = 0;
    }

    return attempts.count < MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Record failed login attempt
   * @param {string} email - User email
   */
  recordFailedAttempt(email) {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

    // Reset count if lockout period has passed
    if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
      attempts.count = 0;
    }

    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(email, attempts);
  }

  /**
   * Clear failed attempts for successful login
   * @param {string} email - User email
   */
  clearFailedAttempts(email) {
    loginAttempts.delete(email);
  }

  /**
   * Get remaining lockout time
   * @param {string} email - User email
   * @returns {number} - Remaining lockout time in milliseconds
   */
  getRemainingLockoutTime(email) {
    const attempts = loginAttempts.get(email);
    if (!attempts || attempts.count < MAX_LOGIN_ATTEMPTS) {
      return 0;
    }

    const elapsed = Date.now() - attempts.lastAttempt;
    return Math.max(0, LOCKOUT_DURATION - elapsed);
  }

  /**
   * Setup session monitoring
   */
  setupSessionMonitoring() {
    // Check session timeout every minute
    setInterval(() => {
      this.checkSessionTimeout();
    }, 60000);

    // Reset session on user activity
    document.addEventListener('click', () => this.resetSession());
    document.addEventListener('keypress', () => this.resetSession());
    document.addEventListener('scroll', () => this.resetSession());
  }

  /**
   * Start session timer
   */
  startSession() {
    this.sessionStartTime = Date.now();
    this.sessionWarningShown = false;
  }

  /**
   * Reset session timer
   */
  resetSession() {
    if (this.sessionStartTime) {
      this.sessionStartTime = Date.now();
      this.sessionWarningShown = false;
    }
  }

  /**
   * Check if session is about to timeout
   */
  checkSessionTimeout() {
    if (!this.sessionStartTime) return;

    const elapsed = Date.now() - this.sessionStartTime;
    const remaining = SESSION_TIMEOUT - elapsed;

    // Show warning 1 hour before timeout
    if (remaining <= SESSION_WARNING_TIME && remaining > 0 && !this.sessionWarningShown) {
      this.sessionWarningShown = true;
      this.showSessionWarning(remaining);
    }

    // Force logout on timeout
    if (remaining <= 0) {
      this.forceLogout();
    }
  }

  /**
   * Show session timeout warning
   * @param {number} remainingTime - Remaining time in milliseconds
   */
  showSessionWarning(remainingTime) {
    const minutes = Math.floor(remainingTime / (1000 * 60));
    
    // Create a custom notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-semibold">Session Expiring Soon</span>
      </div>
      <p class="mt-2 text-sm">Your session will expire in ${minutes} minutes. Click anywhere to extend.</p>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  /**
   * Force logout due to session timeout
   */
  async forceLogout() {
    try {
      await supabase.auth.signOut();
      window.location.href = '/admin/login?reason=session_timeout';
    } catch (error) {
      console.error('Error during forced logout:', error);
      window.location.href = '/admin/login?reason=session_timeout';
    }
  }

  /**
   * Generate CSRF token
   * @returns {string} - CSRF token
   */
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSRF token
   * @param {string} token - Token to validate
   * @param {string} sessionToken - Session token
   * @returns {boolean} - Whether token is valid
   */
  validateCSRFToken(token, sessionToken) {
    // In a real implementation, you'd store and validate against server-side tokens
    // For now, we'll use a simple validation
    return token && token.length === 64 && token === sessionToken;
  }

  /**
   * Audit log for admin actions
   * @param {string} userId - User ID
   * @param {string} action - Action performed
   * @param {object} details - Additional details
   */
  async logAdminAction(userId, action, details = {}) {
    try {
      const { error } = await supabase
        .from('admin_audit_log')
        .insert({
          user_id: userId,
          action,
          details,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging admin action:', error);
      }
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  /**
   * Get client IP (simplified)
   * @returns {Promise<string>} - Client IP
   */
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export for use in components
export default authService;

