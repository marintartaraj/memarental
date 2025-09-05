import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import localSeo from '../seo/local_seo.json';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-mobile py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold text-white">
                MEMA <span className="text-yellow-500">Rental</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              {t('footerDescription')}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">{t('contactUs')}</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-yellow-500" />
                <span>{localSeo.address.streetAddress}, {localSeo.address.addressLocality}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-500" />
                <span>{localSeo.email}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-500" />
                <span>{localSeo.phone}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MEMA Rental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;