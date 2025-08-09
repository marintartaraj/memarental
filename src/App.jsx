import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <LanguageProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cars" element={<CarsPage />} />
                    <Route path="/cars/:carId" element={<CarDetailPage />} />
                    
                    {/* Booking route - accessible to all users */}
                    <Route path="/booking/:carId" element={<BookingPage />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;