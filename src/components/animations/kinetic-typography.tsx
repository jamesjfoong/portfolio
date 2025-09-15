'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin)
}

interface KineticTypographyProps {
  texts: string[]
  className?: string
  speed?: number
}

export function KineticTypography({
  texts,
  className = '',
  speed = 2000,
}: KineticTypographyProps): React.ReactElement {
  const textRef = useRef<HTMLSpanElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!textRef.current || texts.length === 0) return

    // Fallback for when GSAP TextPlugin isn't available
    if (typeof window === 'undefined' || !gsap.plugins.TextPlugin) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % texts.length)
      }, speed)
      return () => clearInterval(interval)
    }

    const tl = gsap.timeline({ repeat: -1 })

    texts.forEach((text, index) => {
      tl.to(textRef.current, {
        duration: 0.8,
        text: text,
        ease: 'none',
      })
        .to({}, { duration: speed / 1000 }) // Pause
        .to(textRef.current, {
          duration: 0.3,
          text: '',
          ease: 'none',
        })
    })

    return () => {
      tl.kill()
    }
  }, [texts, speed])

  return (
    <span ref={textRef} className={`inline-block min-h-[1.2em] ${className}`}>
      {textRef.current?.textContent || texts[currentIndex] || texts[0] || ''}
    </span>
  )
}

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
}: AnimatedTextProps): React.ReactElement {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} className="inline-block" variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({
  text,
  className = '',
}: GlitchTextProps): React.ReactElement {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 text-red-500 opacity-70 animate-pulse"
        style={{
          animation: 'glitch-1 0.3s infinite linear alternate-reverse',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
        }}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 text-blue-500 opacity-70 animate-pulse"
        style={{
          animation: 'glitch-2 0.3s infinite linear alternate-reverse',
          clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)',
        }}
      >
        {text}
      </span>
      <style jsx>{`
        @keyframes glitch-1 {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
        @keyframes glitch-2 {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, 2px);
          }
          80% {
            transform: translate(-2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  )
}

interface WaveTextProps {
  text: string
  className?: string
}

export function WaveText({
  text,
  className = '',
}: WaveTextProps): React.ReactElement {
  const letters = text.split('')

  return (
    <div className={`inline-flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  )
}
