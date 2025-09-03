import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, User, LogOut, Globe, Home, Info, Phone, Search, BookOpen, MapPin, Clock, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { t, language, switchLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { to: '/', label: t('home') || 'Home', icon: Home },
    { to: '/about', label: t('about') || 'About', icon: Info },
    { to: '/cars', label: t('cars') || 'Cars', icon: Car },
    { to: '/contact', label: t('contact') || 'Contact', icon: Phone },
    { to: '/faq', label: t('faq') || 'FAQ', icon: BookOpen },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 relative overflow-hidden ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white shadow-sm'
      }`}
    >
      {/* Light effects for navbar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container-mobile relative z-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group relative overflow-hidden"
            aria-label="MEMA Rental Home"
          >
            <div className="relative">
              <Car className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-lg md:text-2xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300 relative">
              MEMA <span className="text-yellow-500 group-hover:animate-pulse">Rental</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation">
            {navItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className={`relative text-base font-medium transition-colors duration-300 min-h-[44px] flex items-center group ${
                  isActive(item.to) 
                    ? 'text-yellow-600' 
                    : 'text-gray-600 hover:text-yellow-500'
                }`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive(item.to) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-300 text-sm font-medium text-gray-700 group relative overflow-hidden"
              aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Globe className="h-4 w-4 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">{language === 'en' ? 'Shqip' : 'English'}</span>
            </button>

            {/* User Actions */}
            {user && isAdmin ? (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" size="sm" className="group relative overflow-hidden">
                  <Link to="/admin">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <User className="mr-2 h-4 w-4 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">Admin</span>
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <LogOut className="mr-2 h-4 w-4 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Logout</span>
                </Button>
              </div>
            ) : (
              <Button 
                asChild 
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white group relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Link to="/cars">
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Book Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group relative overflow-hidden"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Menu className="h-6 w-6 text-gray-600 group-hover:animate-pulse relative z-10" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl z-50 lg:hidden flex flex-col relative overflow-hidden"
            >
              {/* Light effects for mobile menu */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-32 h-32 bg-gradient-to-br from-yellow-200/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-0 w-24 h-24 bg-gradient-to-br from-orange-200/8 to-transparent rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
              </div>

              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 relative z-10">
                <div className="flex items-center space-x-3 group">
                  <div className="relative">
                    <Car className="h-8 w-8 text-yellow-500 group-hover:animate-pulse" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-xl font-bold text-gray-800">Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group relative overflow-hidden"
                  aria-label="Close mobile menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <X className="h-6 w-6 text-gray-600 group-hover:animate-pulse relative z-10" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto p-6 relative z-10">
                {/* Language Switcher */}
                <div className="mb-8">
                  <button
                    onClick={() => {
                      switchLanguage(language === 'en' ? 'sq' : 'en');
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 group relative overflow-hidden"
                    aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center space-x-3 relative z-10">
                      <Globe className="h-5 w-5 text-blue-600 group-hover:animate-pulse" />
                      <span className="font-medium text-gray-700">Language</span>
                    </div>
                    <span className="font-bold text-yellow-600 relative z-10 group-hover:animate-pulse">
                      {language === 'en' ? 'Shqip' : 'English'}
                    </span>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center space-x-3 p-4 rounded-xl transition-colors duration-300 group relative overflow-hidden ${
                          isActive(item.to)
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive(item.to) ? 'page' : undefined}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <item.icon className={`h-5 w-5 group-hover:animate-pulse relative z-10 ${
                          isActive(item.to) ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium relative z-10">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigate('/cars');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Search className="h-5 w-5 text-blue-600 group-hover:animate-pulse relative z-10" />
                      <span className="text-sm font-medium text-blue-700 relative z-10">Search Cars</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/cars');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <BookOpen className="h-5 w-5 text-yellow-600 group-hover:animate-pulse relative z-10" />
                      <span className="text-sm font-medium text-yellow-700 relative z-10">Book Now</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <MapPin className="h-5 w-5 text-green-600 group-hover:animate-pulse relative z-10" />
                      <span className="text-sm font-medium text-green-700 relative z-10">Locations</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-violet-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Clock className="h-5 w-5 text-purple-600 group-hover:animate-pulse relative z-10" />
                      <span className="text-sm font-medium text-purple-700 relative z-10">24/7 Support</span>
                    </button>
                  </div>
                </div>

                {/* Admin Section */}
                {user && isAdmin && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Admin
                    </h3>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300 group relative overflow-hidden"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <User className="h-5 w-5 text-green-600 group-hover:animate-pulse relative z-10" />
                      <span className="font-medium text-green-700 relative z-10">Admin Panel</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-gray-200 relative z-10">
                {user && isAdmin ? (
                  <Button 
                    onClick={() => { 
                      handleLogout(); 
                      setIsMobileMenuOpen(false); 
                    }} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <LogOut className="mr-2 h-4 w-4 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">Logout</span>
                  </Button>
                ) : (
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white group relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Link to="/cars" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="relative z-10 flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                        Book Now
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;