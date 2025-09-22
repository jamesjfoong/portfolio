"use client"

import React from "react"

import { motion } from "framer-motion"

interface GeometricShapeProps {
  className?: string
  delay?: number
  size?: "sm" | "md" | "lg"
  variant?: "circle" | "square" | "triangle" | "hexagon"
}

const GeometricShape: React.FC<GeometricShapeProps> = ({
  className = "",
  delay = 0,
  size = "md",
  variant = "circle",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-lg rotate-45",
    triangle: "rounded-sm",
    hexagon: "rounded-xl",
  }

  const clipPaths = {
    circle: "",
    square: "",
    triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
    hexagon: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
  }

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} ${shapeClasses[variant]} bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/15 backdrop-blur-sm shadow-lg ${className}`}
      style={{
        clipPath: clipPaths[variant],
      }}
      animate={{
        y: [-15, 15, -15],
        x: [-10, 10, -10],
        rotate: variant === "square" ? [45, 405, 45] : [0, 360, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{
        scale: 1.2,
        rotate: variant === "square" ? 90 : 45,
        transition: { duration: 0.3 },
      }}
    />
  )
}

/**
 * Enhanced interactive 3D-like background with amazing visual effects
 * Uses advanced CSS animations and gradients for stunning visuals
 */
export default function Interactive3D(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full h-[400px] md:h-[500px] relative overflow-hidden"
    >
      {/* Dynamic background with multiple gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10"
          animate={{
            background: [
              "linear-gradient(135deg, hsl(142, 76%, 36%, 0.1) 0%, hsl(217, 91%, 60%, 0.05) 50%, hsl(271, 91%, 65%, 0.1) 100%)",
              "linear-gradient(225deg, hsl(271, 91%, 65%, 0.1) 0%, hsl(142, 76%, 36%, 0.05) 50%, hsl(217, 91%, 60%, 0.1) 100%)",
              "linear-gradient(315deg, hsl(217, 91%, 60%, 0.1) 0%, hsl(271, 91%, 65%, 0.05) 50%, hsl(142, 76%, 36%, 0.1) 100%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/5 to-transparent" />
      </div>

      {/* Enhanced geometric shapes with different variants */}
      <GeometricShape className="top-1/4 left-1/4" delay={0} size="lg" variant="hexagon" />
      <GeometricShape className="top-3/4 right-1/4" delay={1} size="md" variant="triangle" />
      <GeometricShape className="top-1/2 right-1/3" delay={2} size="lg" variant="square" />
      <GeometricShape className="top-1/6 right-1/2" delay={1.5} size="sm" variant="circle" />
      <GeometricShape className="bottom-1/4 left-1/3" delay={0.5} size="md" variant="hexagon" />

      {/* Enhanced floating particles with trails */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-gradient-to-r from-primary/60 to-blue-500/40 shadow-lg"
            animate={{
              y: [-20, 20, -20],
              x: [-15, 15, -15],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
          {/* Particle trail effect */}
          <motion.div
            className="absolute top-0 left-0 w-1 h-1 rounded-full bg-primary/30"
            animate={{
              y: [-25, 25, -25],
              x: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3 + 0.1,
            }}
          />
        </motion.div>
      ))}

      {/* Central orb with pulsing energy */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            className="w-40 h-40 rounded-full border-2 border-primary/30 backdrop-blur-sm"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/30 backdrop-blur-md shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 20px hsla(142, 76%, 36%, 0.4)",
                "0 0 40px hsla(142, 76%, 36%, 0.6)",
                "0 0 20px hsla(142, 76%, 36%, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Energy particles around orb */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`orb-particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-primary/80"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: [i * 60, i * 60 + 360],
                x: [0, 60, 0],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Ambient light rays */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-gradient-to-r from-primary/20 to-transparent"
          style={{
            width: "200px",
            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </motion.div>
  )
}
