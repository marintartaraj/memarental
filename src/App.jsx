import React, { Suspense, lazy, useEffect } from 'react';
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
import BookNowButton from '@/components/BookNowButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipLinks from '@/components/SkipLinks';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ErrorDashboard from '@/components/ErrorDashboard';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { serviceWorkerManager } from '@/lib/serviceWorker';
import { performanceMonitor } from '@/lib/performanceMonitoring';
import { bundleMonitor } from '@/lib/bundleMonitoring';
import { performanceAlerts } from '@/lib/performanceAlerts';
import { userAnalytics } from '@/lib/userAnalytics';
import { conversionFunnel } from '@/lib/conversionFunnel';
import { abTesting } from '@/lib/abTesting';
import { errorTracking } from '@/lib/errorTracking';
import { performanceErrorTracking } from '@/lib/performanceErrorTracking';
import { preloader } from '@/lib/preloader';
import { advancedCache } from '@/lib/advancedCache';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('@/pages/client/HomePage'));
const CarsPage = lazy(() => import('@/pages/client/CarsPage'));
const CarDetailPage = lazy(() => import('@/pages/client/CarDetailPage'));
const BookingPage = lazy(() => 
  import('@/pages/client/BookingPage.jsx').catch(error => {
    console.error('Failed to load BookingPage:', error);
    // Return a fallback component
    return { default: () => <div>Error loading booking page</div> };
  })
);
const AboutPage = lazy(() => import('@/pages/client/AboutPage'));
const ContactPage = lazy(() => import('@/pages/client/ContactPage'));
const BookingConfirmation = lazy(() => import('@/pages/client/BookingConfirmation'));
const RentACarTirana = lazy(() => import('@/pages/client/RentACarTirana'));
const RentACarTiranaAirport = lazy(() => import('@/pages/client/RentACarTiranaAirport'));
const MakinaMeQiraTirane = lazy(() => import('@/pages/client/MakinaMeQiraTirane'));
const QiraMakineRinas = lazy(() => import('@/pages/client/QiraMakineRinas'));
const FAQPage = lazy(() => import('@/pages/client/FAQPage'));

// Admin pages
const OptimizedAdminRouter = lazy(() => 
  import('@/pages/admin/OptimizedAdminRouter').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Panel Unavailable</h2>
          <p className="text-gray-600">Unable to load admin panel. Please try again later.</p>
        </div>
      </div>
    )
  }))
);
const AdminLoginPage = lazy(() => 
  import('@/pages/admin/AdminLoginPage').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Login Page Unavailable</h2>
          <p className="text-gray-600">Unable to load login page. Please try again later.</p>
        </div>
      </div>
    )
  }))
);

// Loading component for Suspense fallback
const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Component to conditionally render navbar and footer
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [showPerformanceDashboard, setShowPerformanceDashboard] = React.useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = React.useState(false);
  const [showErrorDashboard, setShowErrorDashboard] = React.useState(false);

  // Initialize performance monitoring and analytics
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      performanceMonitor.init();
      bundleMonitor.init();
      performanceAlerts.init();
    }
    
    // Initialize analytics (always enabled)
    userAnalytics.init();
    conversionFunnel.init();
    abTesting.init();
    
    // Initialize error tracking (always enabled)
    errorTracking.init();
    performanceErrorTracking.init();
    
    // Initialize advanced optimizations
    preloader.init();
    advancedCache.init();
  }, []);

  // Add keyboard shortcuts for dashboards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === 'P') {
          e.preventDefault();
          setShowPerformanceDashboard(true);
        } else if (e.key === 'A') {
          e.preventDefault();
          setShowAnalyticsDashboard(true);
        } else if (e.key === 'E') {
          e.preventDefault();
          setShowErrorDashboard(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SkipLinks />
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main id="main-content" className={`flex-grow ${isAdminRoute ? 'bg-white' : 'pt-16'}`} tabIndex="-1">
        <Suspense fallback={<PageLoadingSpinner />}>
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
      <PerformanceDashboard 
        isOpen={showPerformanceDashboard} 
        onClose={() => setShowPerformanceDashboard(false)} 
      />
      <AnalyticsDashboard 
        isOpen={showAnalyticsDashboard} 
        onClose={() => setShowAnalyticsDashboard(false)} 
      />
      <ErrorDashboard 
        isOpen={showErrorDashboard} 
        onClose={() => setShowErrorDashboard(false)} 
      />
      {/* Back-to-top removed */}
    </div>
  );
};

function App() {
  // Initialize service worker
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      serviceWorkerManager.register();
    }
  }, []);

  return (
    <HelmetProvider>
      <EnhancedErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LanguageProvider>
            <AuthProvider>
              <MobileMenuProvider>
                <AppContent />
                <WhatsAppButton />
                <BookNowButton />
              </MobileMenuProvider>
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </EnhancedErrorBoundary>
    </HelmetProvider>
  );
}

export default App;