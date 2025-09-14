import { authService } from '@/lib/authService';

// Mock Supabase
jest.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAdmin', () => {
    it('should return true for admin user', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
          }),
        }),
      });

      const result = await authService.isAdmin('test-user-id');
      expect(result).toBe(true);
    });

    it('should return false for non-admin user', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      });

      const result = await authService.isAdmin('test-user-id');
      expect(result).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow login when under limit', () => {
      const result = authService.checkRateLimit('test@example.com');
      expect(result).toBe(true);
    });

    it('should block login when over limit', () => {
      const email = 'test@example.com';
      
      // Record multiple failed attempts
      for (let i = 0; i < 6; i++) {
        authService.recordFailedAttempt(email);
      }
      
      const result = authService.checkRateLimit(email);
      expect(result).toBe(false);
    });
  });

  describe('recordFailedAttempt', () => {
    it('should increment failed attempts counter', () => {
      const email = 'test@example.com';
      
      authService.recordFailedAttempt(email);
      authService.recordFailedAttempt(email);
      
      const remainingTime = authService.getRemainingLockoutTime(email);
      expect(remainingTime).toBeGreaterThan(0);
    });
  });

  describe('clearFailedAttempts', () => {
    it('should clear failed attempts for email', () => {
      const email = 'test@example.com';
      
      authService.recordFailedAttempt(email);
      authService.clearFailedAttempts(email);
      
      const result = authService.checkRateLimit(email);
      expect(result).toBe(true);
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate a 64-character token', () => {
      const token = authService.generateCSRFToken();
      expect(token).toHaveLength(64);
      expect(typeof token).toBe('string');
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate correct token', () => {
      const token = 'a'.repeat(64);
      const result = authService.validateCSRFToken(token, token);
      expect(result).toBe(true);
    });

    it('should reject invalid token', () => {
      const result = authService.validateCSRFToken('invalid', 'valid');
      expect(result).toBe(false);
    });
  });

  describe('session management', () => {
    it('should start session timer', () => {
      authService.startSession();
      expect(authService.sessionStartTime).toBeDefined();
    });

    it('should reset session timer', () => {
      authService.startSession();
      const originalTime = authService.sessionStartTime;
      
      // Wait a bit to ensure time difference
      setTimeout(() => {
        authService.resetSession();
        expect(authService.sessionStartTime).toBeGreaterThan(originalTime);
      }, 10);
    });
  });
});

