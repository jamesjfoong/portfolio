import type { Variants } from "framer-motion"

// Used fade animations
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
}

// Used stagger animations
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

// Used reveal animations
export const revealUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
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
    y: 40,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Used hover animations
export const magneticHover = {
  scale: 1.05,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
}

export const magneticPress = {
  scale: 0.95,
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
}

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
}

export const textReveal: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}
