import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OptimizedAdminLayout from './OptimizedAdminLayout';

// Lazy load admin components
const OptimizedAdminOverview = React.lazy(() => import('./OptimizedAdminOverview'));
const OptimizedAdminBookings = React.lazy(() => import('./OptimizedAdminBookings'));
const OptimizedAdminCars = React.lazy(() => import('./OptimizedAdminCars'));
const OptimizedAdminUsers = React.lazy(() => import('./OptimizedAdminUsers'));

// Admin loading component
const AdminPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
  </div>
);

const OptimizedAdminRouter = () => {
  return (
    <Suspense fallback={<AdminPageLoader />}>
      <Routes>
        <Route path="/" element={<OptimizedAdminLayout />}>
          <Route index element={<OptimizedAdminOverview />} />
          <Route path="bookings" element={<OptimizedAdminBookings />} />
          <Route path="cars" element={<OptimizedAdminCars />} />
          <Route path="users" element={<OptimizedAdminUsers />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default OptimizedAdminRouter;

