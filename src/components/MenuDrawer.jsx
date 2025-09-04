import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, Car, Globe, BookOpen, User, LogOut, 
  Home, Info, Phone
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
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [open]);

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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-yellow-600" />
            <span className="text-lg font-semibold text-gray-800">
              MEMA <span className="text-yellow-600">Rental</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Language Switcher */}
          <button
            onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Language</span>
            </div>
            <span className="text-sm text-yellow-600 font-medium">
              {language === 'en' ? 'Shqip' : 'English'}
            </span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => handleNavigation(item.to)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  isActive(item.to)
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Admin Section */}
          {user && isAdmin && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleNavigation('/admin')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Admin Panel</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {user && isAdmin ? (
            <Button 
              onClick={handleLogout} 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button 
              asChild 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Link to="/cars" onClick={onClose}>
                <BookOpen className="mr-2 h-4 w-4" />
                Book Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
