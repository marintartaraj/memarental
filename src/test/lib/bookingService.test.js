import { bookingService } from '@/lib/bookingService';

// Mock Supabase
jest.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            range: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        order: jest.fn(() => ({
          range: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        range: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
        in: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })),
    },
  },
}));

// Mock authService
jest.mock('@/lib/authService', () => ({
  authService: {
    logAdminAction: jest.fn(() => Promise.resolve()),
  },
}));

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bookingService.clearCache();
  });

  describe('getBookings', () => {
    it('should fetch bookings with default options', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await bookingService.getBookings();
      
      expect(result).toHaveProperty('bookings');
      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('totalPages');
      expect(result).toHaveProperty('currentPage');
    });

    it('should apply search filter', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        }),
      });

      await bookingService.getBookings({ search: 'test' });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    });

    it('should apply status filter', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        }),
      });

      await bookingService.getBookings({ status: 'confirmed' });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    });
  });

  describe('getBookingStats', () => {
    it('should return booking statistics', async () => {
      const mockData = [
        { status: 'confirmed', total_price: '100', pickup_date: '2024-01-01' },
        { status: 'active', total_price: '200', pickup_date: '2024-01-02' },
        { status: 'completed', total_price: '150', pickup_date: '2023-12-01' },
      ];

      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const stats = await bookingService.getBookingStats();
      
      expect(stats).toHaveProperty('totalRevenue');
      expect(stats).toHaveProperty('activeBookings');
      expect(stats).toHaveProperty('confirmedBookings');
      expect(stats).toHaveProperty('completedBookings');
      expect(stats).toHaveProperty('totalBookings');
    });

    it('should use cache for subsequent calls', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      // First call
      await bookingService.getBookingStats();
      
      // Second call should use cache
      await bookingService.getBookingStats();
      
      // Should only be called once due to caching
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateBooking', () => {
    it('should update booking successfully', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
            }),
          }),
        }),
      });

      const result = await bookingService.updateBooking('1', { status: 'active' });
      
      expect(result).toBeDefined();
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    });

    it('should clear cache after update', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
            }),
          }),
        }),
      });

      await bookingService.updateBooking('1', { status: 'active' });
      
      // Cache should be cleared
      expect(bookingService.cache.size).toBe(0);
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking successfully', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await bookingService.deleteBooking('1');
      
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    });
  });

  describe('bulkDeleteBookings', () => {
    it('should delete multiple bookings', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await bookingService.bulkDeleteBookings(['1', '2', '3']);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    });
  });

  describe('getBookedDatesForCar', () => {
    it('should return booked dates for a car', async () => {
      const mockData = [
        { pickup_date: '2024-01-01', return_date: '2024-01-03', status: 'confirmed' },
      ];

      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockReturnValue({
              neq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            }),
          }),
        }),
      });

      const dates = await bookingService.getBookedDatesForCar('car-1');
      
      expect(Array.isArray(dates)).toBe(true);
      expect(dates.length).toBeGreaterThan(0);
    });
  });

  describe('exportBookings', () => {
    it('should export bookings to CSV format', async () => {
      const mockData = [
        {
          id: '1',
          profiles: { full_name: 'John Doe', email: 'john@example.com' },
          cars: { brand: 'Toyota', model: 'Camry', year: '2020' },
          pickup_date: '2024-01-01',
          return_date: '2024-01-03',
          total_price: '150',
          status: 'confirmed',
          notes: 'Test booking',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const csvContent = await bookingService.exportBookings();
      
      expect(csvContent).toContain('ID,Customer,Email');
      expect(csvContent).toContain('John Doe');
      expect(csvContent).toContain('Toyota Camry');
    });

    it('should throw error when no bookings to export', async () => {
      const mockSupabase = require('@/lib/customSupabaseClient').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      await expect(bookingService.exportBookings()).rejects.toThrow('No bookings to export');
    });
  });

  describe('cache management', () => {
    it('should clear cache for specific key', () => {
      bookingService.cache.set('test-key', { data: 'test', timestamp: Date.now() });
      bookingService.clearCache('test-key');
      
      expect(bookingService.cache.has('test-key')).toBe(false);
    });

    it('should clear all cache', () => {
      bookingService.cache.set('key1', { data: 'test1', timestamp: Date.now() });
      bookingService.cache.set('key2', { data: 'test2', timestamp: Date.now() });
      bookingService.clearCache();
      
      expect(bookingService.cache.size).toBe(0);
    });
  });
});

