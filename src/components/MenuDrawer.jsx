import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, Globe, Search, BookOpen, MapPin, Clock, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";

export function MenuDrawer({ open, onClose, navItems, isActive }) {
  const { user, signOut, isAdmin } = useAuth();
  const { language, switchLanguage } = useLanguage();
  const navigate = useNavigate();

  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Close on ESC key
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === "Escape") onClose?.(); 
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [onClose, open]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
        className="fixed inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        {/* Menu Panel */}
        <motion.aside
          className="absolute inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl outline-none"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
        >
          {/* Light effects for mobile menu */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-32 h-32 bg-gradient-to-br from-yellow-200/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-0 w-24 h-24 bg-gradient-to-br from-orange-200/8 to-transparent rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
          </div>

          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 relative z-10">
            <h2 id="menu-title" className="sr-only">Menu</h2>
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Car className="h-8 w-8 text-yellow-500 group-hover:animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-gray-800">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group relative overflow-hidden"
              aria-label="Close menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <X className="h-6 w-6 text-gray-600 group-hover:animate-pulse relative z-10" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-6 relative z-10 scrollbar-hide">
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
                  <button
                    key={item.to}
                    onClick={() => handleNavigation(item.to)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-colors duration-300 group relative overflow-hidden text-left ${
                      isActive(item.to)
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <item.icon className={`h-5 w-5 group-hover:animate-pulse relative z-10 ${
                      isActive(item.to) ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium relative z-10">{item.label}</span>
                  </button>
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
                  onClick={() => handleNavigation('/cars')}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Search className="h-5 w-5 text-blue-600 group-hover:animate-pulse relative z-10" />
                  <span className="text-sm font-medium text-blue-700 relative z-10">Search Cars</span>
                </button>
                <button
                  onClick={() => handleNavigation('/cars')}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <BookOpen className="h-5 w-5 text-yellow-600 group-hover:animate-pulse relative z-10" />
                  <span className="text-sm font-medium text-yellow-700 relative z-10">Book Now</span>
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <MapPin className="h-5 w-5 text-green-600 group-hover:animate-pulse relative z-10" />
                  <span className="text-sm font-medium text-green-700 relative z-10">Locations</span>
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
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
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="w-full flex items-center space-x-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300 group relative overflow-hidden text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="h-5 w-5 text-green-600 group-hover:animate-pulse relative z-10" />
                  <span className="font-medium text-green-700 relative z-10">Admin Panel</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-200 relative z-10">
            {user && isAdmin ? (
              <Button 
                onClick={handleLogout} 
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
                <Link to="/cars" onClick={onClose}>
                  <span className="relative z-10 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Book Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </Button>
            )}
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
