import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Car, User, LogOut, Globe, Home, Info, Phone, 
  Search, BookOpen, ChevronDown, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { MenuDrawer } from './MenuDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, signOut, isAdmin } = useAuth();
  const { t, language, switchLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
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
    { 
      to: '/', 
      label: t('home') || 'Home', 
      icon: Home,
      description: t('homeDescription') || 'Discover our premium car rental service',
      mobileIcon: Home
    },
    { 
      to: '/about', 
      label: t('about') || 'About', 
      icon: Info,
      description: t('aboutDescription') || 'Learn about our story and values',
      mobileIcon: Info
    },
    { 
      to: '/cars', 
      label: t('cars') || 'Cars', 
      icon: Car,
      description: t('carsDescription') || 'Browse our luxury fleet of vehicles',
      badge: '50+ Cars',
      mobileIcon: Car
    },
    { 
      to: '/contact', 
      label: t('contact') || 'Contact', 
      icon: Phone,
      description: t('contactDescription') || 'Get in touch with our team',
      mobileIcon: Phone
    },
    { 
      to: '/faq', 
      label: t('faq') || 'FAQ', 
      icon: BookOpen,
      description: t('faqDescription') || 'Find answers to common questions',
      mobileIcon: BookOpen
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Simple dropdown items for cars section
  const carDropdownItems = [
    { to: '/cars', label: 'All Cars', icon: Car, description: 'Browse complete fleet' },
    { to: '/cars?category=economy', label: 'Economy', icon: Car, description: 'Affordable options' },
    { to: '/cars?category=premium', label: 'Premium', icon: Car, description: 'Luxury vehicles' },
    { to: '/cars?category=suv', label: 'SUV', icon: Car, description: 'Family & adventure' },
  ];

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-out navbar-desktop ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60" />

      <div className="container-mobile relative z-10">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-18">
          {/* Minimal Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-shrink-0 ml-1 lg:ml-0"
          >
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="MEMA Rental Home"
            >
              <div className="p-1.5 rounded-lg bg-yellow-50 border border-yellow-100 group-hover:bg-yellow-100 transition-all duration-300 flex-shrink-0">
                <Car className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-yellow-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-800 tracking-wide leading-tight">
                  MEMA <span className="font-medium text-yellow-600">Rental</span>
                </span>
                <span className="text-xs lg:text-sm text-gray-400 font-light tracking-widest leading-tight">
                  {language === 'en' ? 'QIRA MAKINE' : 'CAR RENTAL'}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <motion.nav 
            className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto" 
            role="navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 lg:space-x-4">
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.to} 
                  className="relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    to={item.to} 
                    className={`relative px-4 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base font-light transition-all duration-300 min-h-[40px] lg:min-h-[48px] flex items-center rounded-lg nav-item ${
                      isActive(item.to) 
                        ? 'text-yellow-700 bg-yellow-50/50 active' 
                        : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/30'
                    }`}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                    onMouseEnter={() => setActiveDropdown(item.to === '/cars' ? 'cars' : null)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <item.icon className={`mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 transition-all duration-300 ${
                      isActive(item.to) ? 'text-yellow-600' : 'text-gray-500'
                    }`} />
                    <span className="tracking-wide">{item.label}</span>
                    
                    {/* Badge for cars */}
                    {item.badge && (
                      <motion.span 
                        className="ml-2 lg:ml-3 px-2 py-0.5 text-xs lg:text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        {item.badge}
                      </motion.span>
                    )}

                    {/* Dropdown indicator */}
                    {item.to === '/cars' && (
                      <ChevronDown className={`ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4 transition-all duration-300 ${
                        activeDropdown === 'cars' ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>

                  {/* Minimal Cars Dropdown */}
                  {item.to === '/cars' && activeDropdown === 'cars' && (
                    <motion.div 
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Dropdown header */}
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                        <h3 className="font-medium text-gray-800 text-sm">Our Fleet</h3>
                        <p className="text-xs text-gray-500 mt-1">Choose from our selection</p>
                      </div>

                      {/* Dropdown items */}
                      <div className="p-2">
                        {carDropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.to}
                            to={dropdownItem.to}
                            className="flex items-center p-3 rounded-lg hover:bg-yellow-50/50 transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="p-1.5 rounded-md bg-yellow-50 group-hover:bg-yellow-100 transition-colors duration-200">
                              <dropdownItem.icon className="h-3.5 w-3.5 text-yellow-600" />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="font-medium text-gray-800 text-sm group-hover:text-yellow-700 transition-colors duration-200">
                                {dropdownItem.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {dropdownItem.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown footer */}
                      <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                        <Link
                          to="/cars"
                          className="w-full flex items-center justify-center px-3 py-2 bg-yellow-50 text-yellow-700 font-medium rounded-lg hover:bg-yellow-100 transition-all duration-200 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <Search className="mr-2 h-3.5 w-3.5" />
                          View All Cars
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.nav>

          {/* Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-3 lg:space-x-4 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg bg-gray-50 hover:bg-yellow-50 transition-all duration-300 text-xs lg:text-sm font-light text-gray-600 border border-gray-100 hover:border-yellow-200"
              aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
            >
              <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-500" />
              <span>{language === 'en' ? 'Shqip' : 'English'}</span>
            </button>

            {/* User Actions */}
            {user && isAdmin ? (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Button asChild variant="ghost" size="sm" className="bg-green-50 hover:bg-green-100 border border-green-100 text-green-700 text-xs lg:text-sm font-light px-3 lg:px-4 py-2 lg:py-2.5">
                  <Link to="/admin">
                    <User className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    <span>Admin</span>
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 text-xs lg:text-sm font-light px-3 lg:px-4 py-2 lg:py-2.5"
                >
                  <LogOut className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              /* Minimal CTA Button */
              <Button 
                asChild
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 hover:border-yellow-300 px-4 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm font-medium transition-all duration-300"
              >
                <Link to="/cars">
                  <span className="flex items-center">
                    <BookOpen className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    Book Now
                  </span>
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Minimal Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 transition-all duration-300"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MenuDrawer 
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </motion.header>
  );
};

export default Navbar;