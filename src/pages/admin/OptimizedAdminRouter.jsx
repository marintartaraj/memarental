import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OptimizedAdminLayout from './OptimizedAdminLayout';
import OptimizedAdminOverview from './OptimizedAdminOverview';
import OptimizedAdminBookings from './OptimizedAdminBookings';
import OptimizedAdminCars from './OptimizedAdminCars';
import OptimizedAdminUsers from './OptimizedAdminUsers';
import AdminLoginPage from './AdminLoginPage';

const OptimizedAdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/" element={<OptimizedAdminLayout />}>
        <Route index element={<OptimizedAdminOverview />} />
        <Route path="bookings" element={<OptimizedAdminBookings />} />
        <Route path="cars" element={<OptimizedAdminCars />} />
        <Route path="users" element={<OptimizedAdminUsers />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default OptimizedAdminRouter;

