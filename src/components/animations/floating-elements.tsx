'use client'

import React from 'react'

import { motion } from 'framer-motion'

interface FloatingDotProps {
  index: number
}

const FloatingDot: React.FC<FloatingDotProps> = ({ index }) => {
  const positions = [
    { x: 20, y: 30 },
    { x: 80, y: 20 },
    { x: 70, y: 80 },
    { x: 30, y: 70 },
    { x: 10, y: 60 },
    { x: 90, y: 40 },
  ]

  const position = positions[index % positions.length]

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-primary/40"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{
        y: [-15, 15, -15],
        opacity: [0.4, 1, 0.4],
      }}
      transition={{
        duration: 6 + index,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.8,
      }}
    />
  )
}

/**
 * Simplified floating elements component with optimized performance
 * Uses predefined positions instead of random generation for consistency
 */
export default function FloatingElements(): React.ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating dots with predefined positions */}
      {Array.from({ length: 6 }).map((_, i) => (
        <FloatingDot key={i} index={i} />
      ))}

      {/* Static geometric shapes with subtle animations */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16 border border-primary/10 rounded-lg"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-500/5 to-primary/5 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
