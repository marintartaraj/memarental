/**
 * Booking Statistics Cards Component
 * Displays key booking metrics in card format
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, Clock, Users } from 'lucide-react';

const BookingStatsCards = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 border-l-4 border-green-500',
      iconColor: 'text-green-600'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'bg-blue-50 border-l-4 border-blue-500',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingBookings,
      icon: Clock,
      color: 'bg-yellow-50 border-l-4 border-yellow-500',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Users,
      color: 'bg-purple-50 border-l-4 border-purple-500',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card 
          key={stat.title} 
          className={`hover:shadow-lg transition-all duration-200 border-0 shadow-sm ${stat.color}`}
          role="region"
          aria-label={`${stat.title} statistics`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              {stat.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingStatsCards;

