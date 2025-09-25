import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/use-toast.jsx';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MobileMenuProvider } from '@/contexts/MobileMenuContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import BookNowButton from '@/components/BookNowButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('@/pages/client/HomePage'));
const CarsPage = React.lazy(() => import('@/pages/client/CarsPage'));
const CarDetailPage = React.lazy(() => import('@/pages/client/CarDetailPage'));
const BookingPage = React.lazy(() => import('@/pages/client/BookingPage'));
const AboutPage = React.lazy(() => import('@/pages/client/AboutPage'));
const ContactPage = React.lazy(() => import('@/pages/client/ContactPage'));
const BookingConfirmation = React.lazy(() => import('@/pages/client/BookingConfirmation'));
const RentACarTirana = React.lazy(() => import('@/pages/client/RentACarTirana'));
const RentACarTiranaAirport = React.lazy(() => import('@/pages/client/RentACarTiranaAirport'));
const MakinaMeQiraTirane = React.lazy(() => import('@/pages/client/MakinaMeQiraTirane'));
const QiraMakineRinas = React.lazy(() => import('@/pages/client/QiraMakineRinas'));
const FAQPage = React.lazy(() => import('@/pages/client/FAQPage'));
const OptimizedAdminRouter = React.lazy(() => import('@/pages/admin/OptimizedAdminRouter'));
const AdminLoginPage = React.lazy(() => import('@/pages/admin/AdminLoginPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
  </div>
);

// Removed ScrollToTop and BackToTopButton per request

// Component to conditionally render navbar and footer
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${isAdminRoute ? 'bg-white' : 'pt-16'}`}>
        <Suspense fallback={<PageLoader />}>
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
            
            {/* Admin login - NOT protected */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Admin routes - protected */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminOnly>
                  <OptimizedAdminRouter />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ToastProvider>
            <LanguageProvider>
              <AuthProvider>
                <MobileMenuProvider>
                  <AppContent />
                  <WhatsAppButton />
                  <BookNowButton />
                </MobileMenuProvider>
              </AuthProvider>
            </LanguageProvider>
          </ToastProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;