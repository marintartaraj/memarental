import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, MapPin, Mail, Phone, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Light effects for footer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-200/10 to-orange-200/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-200/8 to-yellow-200/6 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-yellow-100/5 to-transparent rounded-full blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container-mobile py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group relative overflow-hidden" aria-label="MEMA Rental Home">
              <div className="relative">
                <Car className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-2xl font-bold group-hover:text-yellow-400 transition-colors duration-300 relative">
                MEMA <span className="text-yellow-500 group-hover:animate-pulse">Rental</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>

          <div>
            <div className="font-semibold text-lg mb-4 relative">
              <span className="relative z-10">{t('quickLinks')}</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden inline-block">
                  <span className="relative z-10">{t('home')}</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden inline-block">
                  <span className="relative z-10">{t('about')}</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden inline-block">
                  <span className="relative z-10">{t('cars')}</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden inline-block">
                  <span className="relative z-10">{t('contact')}</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-lg mb-4 relative">
              <span className="relative z-10">{t('contactUs')}</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2 group">
                <MapPin className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
                <span>Rruga e Kavajës, Tirana, Albania</span>
              </li>
              <li className="flex items-center space-x-2 group">
                <Mail className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
                <span>Email: contact@memarental.al</span>
              </li>
              <li className="flex items-center space-x-2 group">
                <Phone className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
                <span>Phone: +355 69 123 4567</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-lg mb-4 relative">
              <span className="relative z-10">{t('followUs')}</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden p-2 rounded-lg" 
                aria-label="Facebook"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Facebook size={24} className="relative z-10 group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden p-2 rounded-lg" 
                aria-label="Twitter"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Twitter size={24} className="relative z-10 group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden p-2 rounded-lg" 
                aria-label="Instagram"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Instagram size={24} className="relative z-10 group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          <p className="relative z-10">
            &copy; {new Date().getFullYear()} MEMA Rental. All rights reserved.
            <span className="inline-block ml-2">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;