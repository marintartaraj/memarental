import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Client pages
import HomePage from '@/pages/client/HomePage';
import CarsPage from '@/pages/client/CarsPage';
import CarDetailPage from '@/pages/client/CarDetailPage';
import BookingPage from '@/pages/client/BookingPage';
import AboutPage from '@/pages/client/AboutPage';
import ContactPage from '@/pages/client/ContactPage';
import BookingConfirmation from '@/pages/client/BookingConfirmation';
// Admin pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Removed ScrollToTop and BackToTopButton per request

// Component to conditionally render navbar and footer
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${isAdminRoute ? 'bg-white' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:carId" element={<CarDetailPage />} />
          
          {/* Booking route - accessible to all users */}
          <Route path="/booking/:carId" element={<BookingPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster />
      {/* Back-to-top removed */}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <LanguageProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;