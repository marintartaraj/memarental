
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars' },
  ];

  const handleNotImplemented = () => {
    toast({
      title: "Coming Soon!",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "destructive"
    });
  };

  const mobileMenuVariants = {
    hidden: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">MEMA <span className="text-yellow-500">Rental</span></span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors duration-300 ${
                    isActive ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Link to="/cars">Book Now</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(true)} variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <Car className="h-8 w-8 text-yellow-500" />
                <span className="text-xl font-bold">MEMA <span className="text-yellow-500">Rental</span></span>
              </Link>
              <Button onClick={() => setIsMenuOpen(false)} variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium p-2 rounded-md transition-colors duration-300 ${
                      isActive ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex flex-col space-y-4">
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/cars" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
  