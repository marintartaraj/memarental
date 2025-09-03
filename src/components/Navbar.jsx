import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, User, LogOut, Globe, Home, Info, Phone, Search, BookOpen, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { MenuDrawer } from './MenuDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { t, language, switchLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();

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
          <nav className="hidden lg:flex items-center space-x-8 overflow-x-auto scrollbar-hide" role="navigation">
            {navItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className={`relative text-base font-medium transition-colors duration-300 min-h-[44px] flex items-center group flex-shrink-0 ${
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
            ) : null}
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
      <MenuDrawer 
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </header>
  );
};

export default Navbar;