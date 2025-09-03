import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminBookings from './AdminBookings';
import AdminCars from './AdminCars';
import AdminUsers from './AdminUsers';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MEMA Rental</title>
        <meta name="description" content="Admin dashboard for MEMA Rental management" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Sidebar */}
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Top bar for mobile */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuClick}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                {/* Modern Admin Header Logo */}
                <div className="relative group">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* M Icon */}
                    <span className="text-white font-bold text-sm relative z-10">M</span>
                    
                    {/* Subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                
                {/* Modern Admin Typography */}
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-1">
                    <span className="font-bold text-gray-900">MEMA</span>
                    <span className="text-xs font-medium text-yellow-600">®</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 tracking-wide">ADMIN</span>
                </div>
              </div>
              <div className="w-10" />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="*" element={<AdminOverview />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
