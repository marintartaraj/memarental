import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Car, User, LogOut, Globe, Home, Info, Phone, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { MenuDrawer } from './MenuDrawer';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { t, language, switchLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-yellow-600" />
            <span className="text-xl font-semibold text-gray-800">
              MEMA <span className="text-yellow-600">Rental</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? 'text-yellow-600 bg-yellow-50'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage(language === 'en' ? 'sq' : 'en')}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'Shqip' : 'English'}</span>
            </button>

            {/* User Actions */}
            {user && isAdmin ? (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">
                    <User className="mr-1 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/cars">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Book Now
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-600 hover:text-yellow-600"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
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