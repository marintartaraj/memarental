import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, MapPin, Mail, Phone, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import localSeo from '../seo/local_seo.json';

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
            <Link to="/" className="flex items-center space-x-3 group relative overflow-hidden" aria-label="MEMA Rental Home">
              {/* Modern Footer Logo Icon */}
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 rounded-2xl shadow-lg group-hover:shadow-xl flex items-center justify-center relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Car Icon */}
                  <svg className="w-6 h-6 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12L5 8H19L21 12V18H19V20H17V18H7V20H5V18H3V12Z" fill="currentColor"/>
                    <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
                    <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
                    <path d="M7 8V6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Modern Footer Typography */}
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent tracking-tight group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-yellow-400 transition-all duration-300">
                    MEMA
                  </span>
                  <span className="text-lg font-medium text-yellow-400 tracking-wide group-hover:text-yellow-300 transition-colors duration-300">®</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent tracking-wide group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-yellow-400 transition-all duration-300">
                    RENTAL
                  </span>
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse group-hover:animate-bounce transition-all duration-300"></div>
                </div>
                <span className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-1 group-hover:text-yellow-300 transition-colors duration-300">
                  {t('footerDescription') ? 'Premium Car Rental' : 'CAR RENTAL'}
                </span>
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
                <span>{localSeo.address.streetAddress}, {localSeo.address.addressLocality}, {localSeo.address.addressCountry}</span>
              </li>
              <li className="flex items-center space-x-2 group">
                <Mail className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
                <span>Email: {localSeo.email}</span>
              </li>
              <li className="flex items-center space-x-2 group">
                <Phone className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
                <span>Phone: {localSeo.phone}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-lg mb-4 relative">
              <span className="relative z-10">{t('followUs')}</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex space-x-4">
              {localSeo.sameAs.map((social, index) => {
                const isFacebook = social.includes('facebook');
                const isInstagram = social.includes('instagram');
                const Icon = isFacebook ? Facebook : isInstagram ? Instagram : Twitter;
                const label = isFacebook ? 'Facebook' : isInstagram ? 'Instagram' : 'Social Media';
                
                return (
                  <a 
                    key={index}
                    href={social} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-500 transition-colors group relative overflow-hidden p-2 rounded-lg" 
                    aria-label={label}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                      isFacebook ? 'from-blue-500/20 to-indigo-500/20' : 
                      isInstagram ? 'from-pink-500/20 to-purple-500/20' : 
                      'from-blue-400/20 to-cyan-400/20'
                    } rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <Icon size={24} className="relative z-10 group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
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