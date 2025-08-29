import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  // Debug logging
  console.log('ProtectedRoute Debug:', { user: user?.email, loading, isAdmin, adminOnly });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log('User is not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Access granted to admin dashboard');
  return children;
};

export default ProtectedRoute;