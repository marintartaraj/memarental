// Advanced Animation and Micro-interaction Utilities for MEMA Rental

import { motion } from 'framer-motion';

// Animation presets
export const animationPresets = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Card hover animations
  cardHover: {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
  },

  // Button animations
  buttonPress: {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  },

  // Loading animations
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },

  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Slide animations
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  slideInFromBottom: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Bounce animations
  bounceIn: {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },

  // Pulse animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Micro-interaction utilities
export const microInteractions = {
  // Hover effects
  hoverScale: (scale = 1.05) => ({
    whileHover: { scale },
    transition: { duration: 0.2 }
  }),

  // Tap effects
  tapScale: (scale = 0.95) => ({
    whileTap: { scale },
    transition: { duration: 0.1 }
  }),

  // Focus effects
  focusGlow: (color = '#eab308') => ({
    whileFocus: {
      boxShadow: `0 0 0 3px ${color}20`,
      transition: { duration: 0.2 }
    }
  }),

  // Loading states
  loadingPulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Success animations
  successCheck: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },

  // Error animations
  errorShake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  }
};

// Gesture animations
export const gestures = {
  // Drag animations
  dragConstraints: {
    left: -100,
    right: 100,
    top: -100,
    bottom: 100
  },

  // Swipe animations
  swipeAnimation: {
    drag: "x",
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.1,
    onDragEnd: (event, info) => {
      if (Math.abs(info.offset.x) > 100) {
        // Handle swipe
        return info.offset.x > 0 ? 'right' : 'left';
      }
    }
  },

  // Pinch animations
  pinchAnimation: {
    drag: true,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.1
  }
};

// Layout animations
export const layoutAnimations = {
  // List animations
  listAnimation: {
    layout: true,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Grid animations
  gridAnimation: {
    layout: true,
    transition: { duration: 0.3, ease: "easeInOut" }
  },

  // Modal animations
  modalAnimation: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Backdrop animations
  backdropAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  }
};

// Performance optimizations
export const performanceOptimizations = {
  // Reduced motion support
  respectReducedMotion: (animation) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? {} : animation;
  },

  // GPU acceleration
  enableGPUAcceleration: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  },

  // Will-change optimization
  optimizeForAnimation: (property) => ({
    willChange: property
  })
};

// Animation hooks
export const useAnimationHooks = {
  // Intersection observer for scroll animations
  useScrollAnimation: (threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
  },

  // Animation state management
  useAnimationState: (initialState = false) => {
    const [isAnimating, setIsAnimating] = useState(initialState);
    
    const startAnimation = useCallback(() => setIsAnimating(true), []);
    const stopAnimation = useCallback(() => setIsAnimating(false), []);
    
    return { isAnimating, startAnimation, stopAnimation };
  }
};

// Export all utilities
export default {
  animationPresets,
  microInteractions,
  gestures,
  layoutAnimations,
  performanceOptimizations,
  useAnimationHooks
};
