import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    cars: 'Cars',
    about: 'About Us',
    contact: 'Contact Us',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    heroTitle: 'Premium Car Rental in Tirana',
    heroSubtitle: 'Discover Albania with our modern fleet of vehicles. Best prices, excellent service, and 24/7 support.',
    bookNow: 'Book Now',
    learnMore: 'Learn More',
    whyChooseUs: 'Why Choose MEMA Rental?',
    modernFleet: 'Modern Fleet',
    modernFleetDesc: 'Latest model vehicles with full insurance coverage',
    bestPrices: 'Best Prices',
    bestPricesDesc: 'Competitive rates with no hidden fees',
    support247: '24/7 Support',
    support247Desc: 'Round-the-clock customer assistance',
    availableCars: 'Available Cars',
    filterByBrand: 'Filter by Brand',
    allBrands: 'All Brands',
    priceRange: 'Price Range',
    automatic: 'Automatic',
    manual: 'Manual',
    seats: 'seats',
    luggage: 'luggage',
    perDay: 'per day',
    bookThisCar: 'Book This Car',
    pickupDate: 'Pickup Date',
    dropoffDate: 'Dropoff Date',
    pickupTime: 'Pickup Time',
    dropoffTime: 'Dropoff Time',
    location: 'Location',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    totalCost: 'Total Cost',
    confirmBooking: 'Confirm Booking',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    adminDashboard: 'Admin Dashboard',
    manageBookings: 'Manage Bookings',
    manageCars: 'Manage Cars',
    analytics: 'Analytics',
    users: 'Users',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    status: 'Status',
    available: 'Available',
    booked: 'Booked',
    maintenance: 'Under Maintenance',
    footerDescription: 'Your trusted partner for car rentals in Tirana, Albania. Quality service and competitive prices.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    ourStory: 'Our Story',
    ourMission: 'Our Mission',
    meetTheTeam: 'Meet The Team',
    getInTouch: 'Get In Touch',
    sendMessage: 'Send Message',
    message: 'Message',
    ourLocation: 'Our Location',
  },
  sq: {
    home: 'Kryefaqja',
    cars: 'Makinat',
    about: 'Rreth Nesh',
    contact: 'Na Kontaktoni',
    login: 'Hyrje',
    register: 'Regjistrohu',
    dashboard: 'Paneli',
    logout: 'Dalje',
    heroTitle: 'Qira Makinash Premium në Tiranë',
    heroSubtitle: 'Zbuloni Shqipërinë me flotën tonë moderne të automjeteve. Çmimet më të mira, shërbim i shkëlqyer dhe mbështetje 24/7.',
    bookNow: 'Rezervo Tani',
    learnMore: 'Mëso Më Shumë',
    whyChooseUs: 'Pse të Zgjidhni MEMA Rental?',
    modernFleet: 'Flotë Moderne',
    modernFleetDesc: 'Automjete të modeleve të fundit me mbulim të plotë sigurie',
    bestPrices: 'Çmimet Më të Mira',
    bestPricesDesc: 'Tarifa konkurruese pa tarifa të fshehura',
    support247: 'Mbështetje 24/7',
    support247Desc: 'Asistencë e klientit gjatë gjithë kohës',
    availableCars: 'Makinat e Disponueshme',
    filterByBrand: 'Filtro sipas Markës',
    allBrands: 'Të Gjitha Markat',
    priceRange: 'Intervali i Çmimit',
    automatic: 'Automatike',
    manual: 'Manuale',
    seats: 'ulëse',
    luggage: 'bagazh',
    perDay: 'në ditë',
    bookThisCar: 'Rezervo Këtë Makinë',
    pickupDate: 'Data e Marrjes',
    dropoffDate: 'Data e Kthimit',
    pickupTime: 'Ora e Marrjes',
    dropoffTime: 'Ora e Kthimit',
    location: 'Vendndodhja',
    fullName: 'Emri i Plotë',
    email: 'Email',
    phone: 'Telefoni',
    totalCost: 'Kostoja Totale',
    confirmBooking: 'Konfirmo Rezervimin',
    signIn: 'Hyrje',
    signUp: 'Regjistrohu',
    password: 'Fjalëkalimi',
    confirmPassword: 'Konfirmo Fjalëkalimin',
    adminDashboard: 'Paneli i Administratorit',
    manageBookings: 'Menaxho Rezervimet',
    manageCars: 'Menaxho Makinat',
    analytics: 'Analitika',
    users: 'Përdoruesit',
    loading: 'Duke ngarkuar...',
    save: 'Ruaj',
    cancel: 'Anulo',
    edit: 'Ndrysho',
    delete: 'Fshi',
    add: 'Shto',
    search: 'Kërko',
    filter: 'Filtro',
    status: 'Statusi',
    available: 'I Disponueshëm',
    booked: 'I Rezervuar',
    maintenance: 'Në Mirëmbajtje',
    footerDescription: 'Partneri juaj i besuar për makina me qira në Tiranë, Shqipëri. Shërbim cilësor dhe çmime konkurruese.',
    quickLinks: 'Linqe të Shpejta',
    contactUs: 'Na Kontaktoni',
    followUs: 'Na Ndiqni',
    ourStory: 'Historia Jonë',
    ourMission: 'Misioni Ynë',
    meetTheTeam: 'Njihuni me Ekipin',
    getInTouch: 'Na Kontaktoni',
    sendMessage: 'Dërgo Mesazh',
    message: 'Mesazhi',
    ourLocation: 'Vendndodhja Jonë',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  const value = {
    language,
    t,
    switchLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};