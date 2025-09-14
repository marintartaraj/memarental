/**
 * Security Store
 * Global state management for security features using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import rateLimitingService from '@/lib/rateLimitingService';
import csrfService from '@/lib/csrfService';

const useSecurityStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Rate Limiting State
        loginAttempts: new Map(),
        lockedAccounts: new Map(),
        rateLimitConfig: {
          maxAttempts: 5,
          windowMs: 15 * 60 * 1000, // 15 minutes
          lockoutDuration: 30 * 60 * 1000, // 30 minutes
          progressiveDelay: true,
          maxDelay: 5 * 60 * 1000 // 5 minutes max delay
        },

        // Security Events
        securityEvents: [],
        failedLogins: [],
        suspiciousActivity: [],

        // Session Management
        sessionTimeout: 60 * 60 * 1000, // 1 hour
        lastActivity: Date.now(),
        isSessionExpired: false,

        // CSRF Protection
        csrfTokens: new Map(),
        csrfEnabled: true,
        csrfStats: null,

        // Security Settings
        securitySettings: {
          enableRateLimiting: true,
          enableSessionTimeout: true,
          enableCSRFProtection: true,
          enableSuspiciousActivityDetection: true,
          maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
          activityTimeout: 30 * 60 * 1000, // 30 minutes
          requireStrongPasswords: true,
          enableTwoFactor: false
        },

        // Actions - Rate Limiting
        checkLoginRateLimit: (identifier) => {
          const config = get().rateLimitConfig;
          const result = rateLimitingService.checkRateLimit(identifier, config);
          
          // Update local state
          set((state) => ({
            loginAttempts: new Map(state.loginAttempts.set(identifier, {
              attempts: config.maxAttempts - result.remainingAttempts,
              lastAttempt: Date.now(),
              isLocked: !result.allowed
            }))
          }));

          if (!result.allowed && result.reason === 'LOCKED') {
            set((state) => ({
              lockedAccounts: new Map(state.lockedAccounts.set(identifier, {
                until: result.resetTime,
                reason: result.reason,
                duration: result.lockoutDuration
              }))
            }));
          }

          return result;
        },

        recordFailedLogin: (identifier, reason = 'INVALID_CREDENTIALS') => {
          const config = get().rateLimitConfig;
          rateLimitingService.recordFailedAttempt(identifier, config);
          
          // Update local state
          set((state) => ({
            failedLogins: [...state.failedLogins, {
              identifier,
              timestamp: Date.now(),
              reason,
              ip: 'client-side', // Would be server-side in production
              userAgent: navigator.userAgent
            }].slice(-100) // Keep only last 100 entries
          }));

          // Check if this triggers a lockout
          const rateLimitResult = get().checkLoginRateLimit(identifier);
          if (!rateLimitResult.allowed) {
            get().addSecurityEvent('ACCOUNT_LOCKED', {
              identifier,
              reason: rateLimitResult.reason,
              duration: rateLimitResult.lockoutDuration
            });
          }
        },

        recordSuccessfulLogin: (identifier) => {
          rateLimitingService.recordSuccessfulAttempt(identifier);
          
          // Clear local state
          set((state) => {
            const newAttempts = new Map(state.loginAttempts);
            const newLocked = new Map(state.lockedAccounts);
            newAttempts.delete(identifier);
            newLocked.delete(identifier);
            
            return {
              loginAttempts: newAttempts,
              lockedAccounts: newLocked,
              lastActivity: Date.now()
            };
          });
        },

        // Actions - Security Events
        addSecurityEvent: (type, data) => {
          const event = {
            id: Date.now(),
            type,
            timestamp: Date.now(),
            data,
            severity: get().getEventSeverity(type)
          };

          set((state) => ({
            securityEvents: [event, ...state.securityEvents].slice(-200) // Keep last 200 events
          }));

          // Check for suspicious patterns
          get().checkSuspiciousActivity(event);
        },

        getEventSeverity: (type) => {
          const severityMap = {
            'ACCOUNT_LOCKED': 'high',
            'MULTIPLE_FAILED_LOGINS': 'high',
            'SUSPICIOUS_ACTIVITY': 'medium',
            'SESSION_EXPIRED': 'low',
            'CSRF_ATTEMPT': 'high',
            'RATE_LIMIT_EXCEEDED': 'medium'
          };
          return severityMap[type] || 'low';
        },

        checkSuspiciousActivity: (event) => {
          const state = get();
          const recentEvents = state.securityEvents
            .filter(e => Date.now() - e.timestamp < 60 * 60 * 1000) // Last hour
            .filter(e => e.type === event.type);

          if (recentEvents.length >= 5) {
            set((state) => ({
              suspiciousActivity: [...state.suspiciousActivity, {
                type: 'PATTERN_DETECTED',
                pattern: event.type,
                count: recentEvents.length,
                timestamp: Date.now(),
                severity: 'high'
              }].slice(-50)
            }));

            get().addSecurityEvent('SUSPICIOUS_ACTIVITY', {
              pattern: event.type,
              count: recentEvents.length,
              timeframe: '1 hour'
            });
          }
        },

        // Actions - Session Management
        updateActivity: () => {
          set({ lastActivity: Date.now(), isSessionExpired: false });
        },

        checkSessionExpiry: () => {
          const state = get();
          const now = Date.now();
          const timeSinceActivity = now - state.lastActivity;
          
          if (timeSinceActivity > state.sessionTimeout) {
            set({ isSessionExpired: true });
            get().addSecurityEvent('SESSION_EXPIRED', {
              duration: timeSinceActivity,
              timeout: state.sessionTimeout
            });
            return true;
          }
          return false;
        },

        extendSession: () => {
          set({ 
            lastActivity: Date.now(), 
            isSessionExpired: false 
          });
        },

        // Actions - CSRF Protection
        generateCSRFToken: (sessionId = 'default') => {
          const token = csrfService.generateToken(sessionId);
          
          // Update local stats
          set({ csrfStats: csrfService.getStats() });
          
          return token;
        },

        validateCSRFToken: (token, sessionId = 'default') => {
          const validation = csrfService.validateToken(token, sessionId);
          
          if (!validation.valid) {
            get().addSecurityEvent('CSRF_ATTEMPT', {
              reason: validation.reason,
              token: token ? token.substring(0, 8) + '...' : 'null',
              sessionId
            });
          }

          // Update local stats
          set({ csrfStats: csrfService.getStats() });
          
          return validation.valid;
        },

        useCSRFToken: (token) => {
          const used = csrfService.useToken(token);
          
          if (used) {
            // Update local stats
            set({ csrfStats: csrfService.getStats() });
          }
          
          return used;
        },

        getCSRFStats: () => {
          const stats = csrfService.getStats();
          set({ csrfStats: stats });
          return stats;
        },

        clearCSRFTokens: () => {
          csrfService.clearAll();
          set({ csrfStats: csrfService.getStats() });
        },

        clearCSRFSession: (sessionId) => {
          csrfService.clearSession(sessionId);
          set({ csrfStats: csrfService.getStats() });
        },

        // Actions - Security Settings
        updateSecuritySettings: (settings) => {
          set((state) => ({
            securitySettings: { ...state.securitySettings, ...settings }
          }));
        },

        updateRateLimitConfig: (config) => {
          set({ rateLimitConfig: { ...get().rateLimitConfig, ...config } });
        },

        // Actions - Admin Functions
        unlockAccount: (identifier) => {
          rateLimitingService.unlockKey(identifier);
          
          set((state) => {
            const newAttempts = new Map(state.loginAttempts);
            const newLocked = new Map(state.lockedAccounts);
            newAttempts.delete(identifier);
            newLocked.delete(identifier);
            
            return {
              loginAttempts: newAttempts,
              lockedAccounts: newLocked
            };
          });

          get().addSecurityEvent('ACCOUNT_UNLOCKED', {
            identifier,
            unlockedBy: 'admin'
          });
        },

        clearSecurityEvents: () => {
          set({ 
            securityEvents: [],
            failedLogins: [],
            suspiciousActivity: []
          });
        },

        // Actions - Utility
        getSecurityStatus: () => {
          const state = get();
          return {
            activeLocks: state.lockedAccounts.size,
            recentFailures: state.failedLogins.filter(
              f => Date.now() - f.timestamp < 60 * 60 * 1000
            ).length,
            securityEvents: state.securityEvents.length,
            suspiciousActivity: state.suspiciousActivity.length,
            isSessionExpired: state.isSessionExpired,
            lastActivity: state.lastActivity
          };
        },

        // Cleanup expired data
        cleanup: () => {
          const now = Date.now();
          const state = get();

          // Clean up expired CSRF tokens
          const validTokens = new Map();
          for (const [token, info] of state.csrfTokens) {
            if (now < info.expires) {
              validTokens.set(token, info);
            }
          }

          // Clean up old security events (keep last 200)
          const recentEvents = state.securityEvents
            .filter(e => now - e.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
            .slice(0, 200);

          // Clean up old failed logins (keep last 100)
          const recentFailures = state.failedLogins
            .filter(f => now - f.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
            .slice(0, 100);

          set({
            csrfTokens: validTokens,
            securityEvents: recentEvents,
            failedLogins: recentFailures
          });

          // Use service cleanup
          rateLimitingService.cleanup();
        },

        // Reset all data
        reset: () => {
          rateLimitingService.clearAll();
          set({
            loginAttempts: new Map(),
            lockedAccounts: new Map(),
            securityEvents: [],
            failedLogins: [],
            suspiciousActivity: [],
            csrfTokens: new Map(),
            lastActivity: Date.now(),
            isSessionExpired: false
          });
        }
      }),
      {
        name: 'security-store',
        partialize: (state) => ({
          // Only persist certain state
          securitySettings: state.securitySettings,
          rateLimitConfig: state.rateLimitConfig,
          sessionTimeout: state.sessionTimeout
        })
      }
    ),
    {
      name: 'security-store'
    }
  )
);

// Start periodic cleanup
setInterval(() => {
  useSecurityStore.getState().cleanup();
}, 5 * 60 * 1000); // Every 5 minutes

export default useSecurityStore;
