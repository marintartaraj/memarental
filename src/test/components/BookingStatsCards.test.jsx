import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingStatsCards from '@/components/admin/BookingStatsCards';

describe('BookingStatsCards', () => {
  const mockStats = {
    totalRevenue: 15000.50,
    activeBookings: 5,
    upcomingBookings: 8,
    totalBookings: 25
  };

  it('renders loading state when stats is null', () => {
    render(<BookingStatsCards stats={null} />);
    
    // Check for loading skeleton elements
    const cards = screen.getAllByRole('region');
    expect(cards).toHaveLength(4);
  });

  it('renders stats cards with correct data', () => {
    render(<BookingStatsCards stats={mockStats} />);
    
    // Check for all stat cards
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Bookings')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    
    // Check for values
    expect(screen.getByText('€15000.50')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<BookingStatsCards stats={mockStats} />);
    
    const regions = screen.getAllByRole('region');
    regions.forEach(region => {
      expect(region).toHaveAttribute('aria-label');
    });
  });

  it('handles zero values correctly', () => {
    const zeroStats = {
      totalRevenue: 0,
      activeBookings: 0,
      upcomingBookings: 0,
      totalBookings: 0
    };
    
    render(<BookingStatsCards stats={zeroStats} />);
    
    expect(screen.getByText('€0.00')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});

