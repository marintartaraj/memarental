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
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">M</span>
                </div>
                <span className="font-semibold text-gray-900">MEMA Admin</span>
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
