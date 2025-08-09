import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">MEMA <span className="text-yellow-500">Rental</span></span>
            </Link>
            <p className="text-gray-400">
              {t('footerDescription')}
            </p>
          </div>

          <div>
            <p className="font-semibold text-lg mb-4">{t('quickLinks')}</p>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-yellow-500 transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors">{t('about')}</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-yellow-500 transition-colors">{t('cars')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-lg mb-4">{t('contactUs')}</p>
            <ul className="space-y-2 text-gray-400">
              <li>Rruga e Kavajës, Tirana, Albania</li>
              <li>Email: contact@memarental.al</li>
              <li>Phone: +355 69 123 4567</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-lg mb-4">{t('followUs')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Facebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Twitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MEMA Rental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;