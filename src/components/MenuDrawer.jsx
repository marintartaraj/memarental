import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Car, Globe, Search, BookOpen, User, LogOut, 
  Home, Info, Phone, ChevronRight
} from "lucide-react";
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
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Subtle Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Minimal Menu Panel */}
        <motion.aside
          className="absolute inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-xl"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Minimal Header */}
          <motion.div 
            className="flex justify-between items-center p-4 border-b border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 id="menu-title" className="sr-only">Menu</h2>
            <div className="flex items-center space-x-3">
              {/* Modern Mobile Logo Icon */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Car Icon */}
                  <svg className="w-5 h-5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12L5 8H19L21 12V18H19V20H17V18H7V20H5V18H3V12Z" fill="currentColor"/>
                    <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
                    <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
                    <path d="M7 8V6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Modern Mobile Typography */}
              <div className="flex flex-col text-center ml-2">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent tracking-tight">
                    MEMA
                  </span>
                  <span className="text-sm font-medium text-yellow-600 tracking-wide">®</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm font-semibold bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 bg-clip-text text-transparent tracking-wide">
                    RENTAL
                  </span>
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs font-medium text-gray-500 tracking-widest uppercase mt-1">
                  {language === 'sq' ? 'QIRA MAKINE' : 'CAR RENTAL'}
                </span>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              aria-label="Close menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </motion.button>
          </motion.div>

          {/* Minimal Content */}
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Language Switcher */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button
                onClick={() => {
                  switchLanguage(language === 'en' ? 'sq' : 'en');
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-yellow-50 transition-all duration-300 border border-gray-100 hover:border-yellow-200"
                aria-label={`Switch to ${language === 'en' ? 'Albanian' : 'English'}`}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="font-serif font-light text-gray-700 text-sm">Language</span>
                </div>
                <span className="font-serif font-medium text-yellow-600 px-2 py-1 bg-yellow-100 rounded text-xs">
                  {language === 'en' ? 'Shqip' : 'English'}
                </span>
              </button>
            </motion.div>

            {/* Navigation Links */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-xs font-serif font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                Navigation
              </h3>
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.to}
                    onClick={() => handleNavigation(item.to)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 text-left ${
                      isActive(item.to)
                        ? 'bg-yellow-50/50 text-yellow-700 border border-yellow-100'
                        : 'text-gray-700 hover:bg-gray-50 hover:border hover:border-gray-100'
                    }`}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-md transition-all duration-300 ${
                      isActive(item.to) 
                        ? 'bg-yellow-100' 
                        : 'bg-gray-100'
                    }`}>
                      <item.mobileIcon className={`h-4 w-4 ${
                        isActive(item.to) ? 'text-yellow-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className="font-serif font-light text-sm">{item.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="text-xs font-serif font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => handleNavigation('/cars')}
                  className="flex flex-col items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 border border-blue-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-md bg-blue-100 mb-2">
                    <Search className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-serif font-light text-blue-700">Search Cars</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleNavigation('/cars')}
                  className="flex flex-col items-center p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 border border-yellow-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-md bg-yellow-100 mb-2">
                    <BookOpen className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-xs font-serif font-light text-yellow-700">Book Now</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Admin Section */}
            {user && isAdmin && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <h3 className="text-xs font-serif font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Admin
                </h3>
                <motion.button
                  onClick={() => handleNavigation('/admin')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-300 text-left border border-green-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-md bg-green-100">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-serif font-light text-green-700 text-sm">Admin Panel</span>
                  <ChevronRight className="h-3.5 w-3.5 text-green-500 ml-auto" />
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Minimal Footer */}
          <motion.div 
            className="p-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {user && isAdmin ? (
              <Button 
                onClick={handleLogout} 
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 font-serif font-light text-sm py-2.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-serif">Logout</span>
              </Button>
            ) : (
              <Button 
                asChild 
                className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 font-serif font-medium text-sm py-2.5"
              >
                <Link to="/cars" onClick={onClose}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="font-serif">Book Your Car Now</span>
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
