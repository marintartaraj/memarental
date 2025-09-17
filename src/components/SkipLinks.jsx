import React from 'react';
import { focusManagement } from '@/lib/accessibility';

const SkipLinks = () => {
  const handleSkipToMain = () => {
    focusManagement.skipToMain();
  };

  const handleSkipToCars = () => {
    const carsSection = document.querySelector('[data-section="cars"]');
    if (carsSection) {
      carsSection.focus();
      carsSection.scrollIntoView();
    }
  };

  const handleSkipToContact = () => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.focus();
      contactSection.scrollIntoView();
    }
  };

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          handleSkipToMain();
        }}
      >
        Skip to main content
      </a>
      <a
        href="#cars-section"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          handleSkipToCars();
        }}
      >
        Skip to cars section
      </a>
      <a
        href="#contact-section"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          handleSkipToContact();
        }}
      >
        Skip to contact
      </a>
      
      <style jsx="true">{`
        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 1000;
        }
        
        .skip-link {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--brand-primary);
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-weight: 600;
          transition: top 0.3s ease;
          z-index: 1001;
        }
        
        .skip-link:focus {
          top: 0;
          outline: 2px solid white;
          outline-offset: 2px;
        }
        
        .skip-link:hover {
          background: var(--brand-primary-hover);
        }
      `}</style>
    </div>
  );
};

export default SkipLinks;
