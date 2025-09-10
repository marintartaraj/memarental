import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Phone } from 'lucide-react';

const EnhancedCTA = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton,
  className = "" 
}) => {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600 relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/15 to-transparent animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="container-mobile relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {primaryButton && (
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-yellow-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to={primaryButton.link || "/cars"}>
                  {primaryButton.icon && <primaryButton.icon className="mr-2 h-5 w-5" />}
                  {primaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
            
            {secondaryButton && (
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4 group"
              >
                <Link to={secondaryButton.link || "/contact"}>
                  {secondaryButton.icon && <secondaryButton.icon className="mr-2 h-5 w-5" />}
                  {secondaryButton.text}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedCTA;
