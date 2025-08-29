import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, User, LogOut, Globe, Home, Info, Phone, Search, BookOpen, MapPin, Clock, Shield } from 'lucide-react';
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
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container-mobile">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="MEMA Rental Home"
          >
            <div className="relative">
              <Car className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg md:text-2xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
              MEMA <span className="text-yellow-500">Rental</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation">
            {navItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className={`relative text-base font-medium transition-colors duration-300 min-h-[44px] flex items-center ${
                  isActive(item.to) 
                    ? 'text-yellow-600' 
                    : 'text-gray-600 hover:text-yellow-500'
                }`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
                {isActive(item.to) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-300 text-sm font-medium text-gray-700"
              aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'Shqip' : 'English'}</span>
            </button>

            {/* User Actions */}
            {user && isAdmin ? (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">
                    <User className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                asChild 
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Link to="/cars">Book Now</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Car className="h-8 w-8 text-yellow-500" />
                  <span className="text-xl font-bold text-gray-800">Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Language Switcher */}
                <div className="mb-8">
                  <button
                    onClick={() => {
                      switchLanguage(language === 'en' ? 'sq' : 'en');
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                    aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Language</span>
                    </div>
                    <span className="font-bold text-yellow-600">
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
                        className={`flex items-center space-x-3 p-4 rounded-xl transition-colors duration-300 ${
                          isActive(item.to)
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive(item.to) ? 'page' : undefined}
                      >
                        <item.icon className={`h-5 w-5 ${
                          isActive(item.to) ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{item.label}</span>
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
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                    >
                      <Search className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Search Cars</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/cars');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-300"
                    >
                      <BookOpen className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">Book Now</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300"
                    >
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Locations</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300"
                    >
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">24/7 Support</span>
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
                      className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Admin Panel</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-gray-200">
                {user && isAdmin ? (
                  <Button 
                    onClick={() => { 
                      handleLogout(); 
                      setIsMobileMenuOpen(false); 
                    }} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button 
                    asChild 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Link to="/cars" onClick={() => setIsMobileMenuOpen(false)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Book Now
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