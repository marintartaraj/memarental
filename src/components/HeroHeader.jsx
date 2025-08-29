import React from 'react';
import { motion } from 'framer-motion';

function HeroHeader({
  title,
  subtitle,
  stats = [],
  gradientClassName = 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600',
  className = '',
}) {
  return (
    <section className={`relative overflow-hidden ${gradientClassName} ${className}`}>
      <div className="container-mobile py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={`${stat.label}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  {stat.icon && <stat.icon className="h-4 w-4 text-white" />}
                  <span className="text-white text-sm font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroHeader;

