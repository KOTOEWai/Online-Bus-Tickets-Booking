 import {  type Variants } from 'framer-motion';
 export const heroVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 1, 0.3, 1] } },
  };

 export const formVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.6, ease: [0.2, 1, 0.3, 1] } },
  };

 export const sectionTitleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 1, 0.3, 1], delay: 0.2 } },
  };

 export const cardStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

 export const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 1, 0.3, 1] } },
  };

export const fadeInUp : Variants  = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

 export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 1, 0.3, 1] } },
  };

export  const loadingSpinnerVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 1,
      },
    },
  };


 export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 1, 0.3, 1] } },
  };



 export const messageVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
  };


   export const pageTitleVariants: Variants = {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 1, 0.3, 1] } },
    };
  
  export  const sectionVariants: Variants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 1, 0.3, 1], delay: 0.2 } },
    };
  
   export const formItemVariants: Variants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

 export const widgetVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

export  const chatWindowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
  };

export  const messageBubbleVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  export  const hourglassSpinVariants: Variants = {
      animate: {
        rotate: 360,
        transition: {
          repeat: Infinity, // Keep spinning indefinitely
          ease: "linear",   // Smooth, constant speed
          duration: 2,      // One full rotation in 2 seconds
        },
      },
    };





