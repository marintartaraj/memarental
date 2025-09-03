import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MobileMenuProvider } from '@/contexts/MobileMenuContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
// Client pages
import HomePage from '@/pages/client/HomePage';
import CarsPage from '@/pages/client/CarsPage';
import CarDetailPage from '@/pages/client/CarDetailPage';
import BookingPage from '@/pages/client/BookingPage';
import AboutPage from '@/pages/client/AboutPage';
import ContactPage from '@/pages/client/ContactPage';
import BookingConfirmation from '@/pages/client/BookingConfirmation';
import RentACarTirana from '@/pages/client/RentACarTirana';
import RentACarTiranaAirport from '@/pages/client/RentACarTiranaAirport';
import MakinaMeQiraTirane from '@/pages/client/MakinaMeQiraTirane';
import QiraMakineRinas from '@/pages/client/QiraMakineRinas';
import FAQPage from '@/pages/client/FAQPage';
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
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${isAdminRoute ? 'bg-white' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:carId" element={<CarDetailPage />} />
          
          {/* SEO Landing Pages */}
          <Route path="/rent-a-car-tirana" element={<RentACarTirana />} />
          <Route path="/rent-a-car-tirana-airport" element={<RentACarTiranaAirport />} />
          <Route path="/makina-me-qira-tirane" element={<MakinaMeQiraTirane />} />
          <Route path="/qira-makine-rinas" element={<QiraMakineRinas />} />
          <Route path="/faq" element={<FAQPage />} />
          
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
              <MobileMenuProvider>
                <AppContent />
                <WhatsAppButton />
              </MobileMenuProvider>
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;