import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, Car, User, LogOut, Globe, Home, Info, Phone, Search, Bell, Settings, Heart, BookOpen, MapPin, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, signOut, isAdmin } = useAuth();
  const { t, language, switchLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const springConfig = { damping: 20, stiffness: 300 };
  const y1 = useTransform(scrollY, [0, 100], [0, -50]);
  const springY1 = useSpring(y1, springConfig);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePosition({ x: x * 5, y: y * 5 });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const mobileMenuVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const navItems = [
    { to: '/', label: t('home'), icon: Home, description: 'Explore our services' },
    { to: '/about', label: t('about'), icon: Info, description: 'Learn about us' },
    { to: '/cars', label: t('cars'), icon: Car, description: 'Browse our fleet' },
    { to: '/contact', label: t('contact'), icon: Phone, description: 'Get in touch' },
  ];

  const quickActions = [
    { icon: Search, label: 'Search Cars', action: () => navigate('/cars') },
    { icon: BookOpen, label: 'Book Now', action: () => navigate('/cars') },
    { icon: MapPin, label: 'Locations', action: () => navigate('/contact') },
    { icon: Clock, label: '24/7 Support', action: () => navigate('/contact') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Parallax Background Elements */}
      <motion.div
        style={{ y: springY1 }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-0 left-10 w-20 h-20 bg-yellow-200 rounded-full blur-2xl opacity-10"></div>
        <div className="absolute top-0 right-20 w-16 h-16 bg-orange-300 rounded-full blur-xl opacity-10"></div>
      </motion.div>

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-white shadow-md'
        }`}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Enhanced with 3D effects */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <Car className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-yellow-200 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="text-lg md:text-2xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                  MEMA <span className="text-yellow-500 group-hover:text-yellow-600">Rental</span>
                </span>
          </Link>
            </motion.div>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <motion.div
                  key={item.to}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={item.to} 
                    className={`relative text-base xl:text-lg font-medium transition-all duration-300 group ${
                      isActive(item.to) 
                        ? 'text-yellow-600' 
                        : 'text-gray-600 hover:text-yellow-500'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {isActive(item.to) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.description}
                    </div>
                  </Link>
                </motion.div>
              ))}
          </nav>

            {/* Desktop Actions - Enhanced */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Switcher */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 mr-4 bg-gray-50 rounded-full px-3 py-1"
              >
              <Globe className="h-4 w-4 text-gray-500" />
              <button
                onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
                  className="text-sm font-medium text-gray-700 hover:text-yellow-500 transition-colors px-2 py-1 rounded"
              >
                {language === 'en' ? 'Shqip' : 'English'}
              </button>
              </motion.div>

              {/* User Actions */}
            {user && isAdmin ? (
                <div className="flex items-center space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button asChild variant="ghost" size="sm" className="relative group">
                  <Link to="/admin">
                    <User className="mr-2 h-4 w-4" />
                    Admin Panel
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Admin Dashboard
                        </div>
                  </Link>
                </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      onClick={handleLogout} 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    asChild 
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                  <Link to="/cars">Book Now</Link>
                </Button>
                </motion.div>
            )}
          </div>

            {/* Mobile Menu Button - Enhanced */}
            <div className="lg:hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={() => setIsOpen(true)} 
                  variant="ghost" 
                  size="icon"
                  className="h-12 w-12 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-300 relative overflow-hidden"
                >
              <Menu className="h-6 w-6" />
                  <div className="absolute inset-0 bg-yellow-200 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
              </motion.div>
            </div>
        </div>
      </div>

        {/* Mobile Menu - Enhanced */}
      <AnimatePresence>
        {isOpen && (
           <>
              {/* Enhanced Backdrop */}
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
              
              {/* Enhanced Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
                className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col"
              >
                {/* Enhanced Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="flex items-center space-x-3">
                    <Car className="h-6 w-6 text-yellow-500" />
                    <span className="text-xl font-bold text-gray-800">MEMA Rental</span>
              </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      onClick={() => setIsOpen(false)} 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                {/* Enhanced Navigation Links */}
                <nav className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-2 mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.to}
                          className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 group ${
                            isActive(item.to)
                              ? 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500'
                              : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className={`h-5 w-5 ${isActive(item.to) ? 'text-yellow-600' : 'text-gray-500 group-hover:text-yellow-600'}`} />
                          <div className="flex-1">
                            <span>{item.label}</span>
                            <p className="text-sm text-gray-500 group-hover:text-yellow-500">{item.description}</p>
                </div>
                          {isActive(item.to) && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => {
                              action.action();
                              setIsOpen(false);
                            }}
                            className="w-full flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-all duration-300 group"
                          >
                            <action.icon className="h-5 w-5 text-gray-600 group-hover:text-yellow-600" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">{action.label}</span>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Language Switcher */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Language</h3>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between px-4 py-4 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <span className="text-lg font-medium text-gray-700">Language</span>
                      </div>
                <button
                  onClick={() => {
                    switchLanguage(language === 'en' ? 'sq' : 'en');
                  }}
                        className="text-lg font-medium text-yellow-600 hover:text-yellow-700 transition-colors px-3 py-1 rounded-lg hover:bg-yellow-100"
                >
                  {language === 'en' ? 'Shqip' : 'English'}
                </button>
                    </motion.div>
                  </div>
                </nav>

                {/* Enhanced User Actions */}
                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  {user && isAdmin ? (
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-4 rounded-xl text-lg font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-300 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          <span>Admin Panel</span>
                          <div className="ml-auto">
                            <Shield className="h-4 w-4 text-green-500" />
                          </div>
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={() => { 
                            handleLogout(); 
                            setIsOpen(false); 
                          }} 
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Logout
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link to="/cars" onClick={() => setIsOpen(false)}>
                          <Zap className="mr-2 h-5 w-5" />
                          Book Now
                        </Link>
                      </Button>
                    </motion.div>
                  )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Navbar;