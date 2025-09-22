import type { Variants } from "framer-motion"

// Fade in animations
export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
}

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
}

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
}

// Stagger animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

// Slide animations
export const slideInLeft: Variants = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
}

export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
}

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 },
}

export const hoverLift = {
  y: -5,
  transition: { duration: 0.2 },
}

// Transition presets
export const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
}

export const smoothTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
}

export const quickTransition = {
  duration: 0.3,
  ease: "easeOut",
}

// Advanced scroll-triggered animations
export const revealUp: Variants = {
  initial: {
    opacity: 0,
    y: 100,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const revealLeft: Variants = {
  initial: {
    opacity: 0,
    x: -100,
    rotateY: -15,
  },
  animate: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const revealRight: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    rotateY: 15,
  },
  animate: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Staggered reveal animations
export const staggerReveal: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export const staggerRevealItem: Variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Magnetic hover effects
export const magneticHover = {
  scale: 1.05,
  rotateZ: 2,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
}

export const magneticPress = {
  scale: 0.95,
  rotateZ: -1,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  },
}

// Card hover animations
export const cardHover = {
  y: -8,
  scale: 1.02,
  rotateX: 5,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
}

export const cardPress = {
  y: -2,
  scale: 0.98,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  },
}

// Text reveal animations
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    clipPath: "inset(100% 0 0 0)",
  },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Floating animations
export const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    ease: "easeInOut",
    repeat: Infinity,
  },
}

export const rotatingAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 20,
    ease: "linear",
    repeat: Infinity,
  },
}

// Page transition animations
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}
