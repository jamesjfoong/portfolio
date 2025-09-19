'use client'

import React, { useEffect, useState } from 'react'

import './cursor-animation.css'

interface CursorPosition {
  x: number
  y: number
}

/**
 * Simplified cursor animation with better performance
 * Removed complex store logic and trail effects for smoother experience
 */
export default function CursorAnimation(): React.ReactElement {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleMouseMove = (event: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setPosition({ x: event.clientX, y: event.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target) return

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="interactive"]')

      setIsHovering(Boolean(isInteractive))
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      {/* Subtle background glow */}
      <div
        className="cursor-gradient"
        style={{
          background: `radial-gradient(400px at ${position.x}px ${position.y}px,
            hsla(142, 76%, 36%, ${isHovering ? '0.15' : '0.08'}),
            transparent 70%)`,
          transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Main cursor dot */}
      <div
        className="cursor-dot"
        style={{
          left: position.x - 6,
          top: position.y - 6,
          width: '12px',
          height: '12px',
          background: 'hsl(142, 76%, 36%)',
          borderRadius: '50%',
          transform: `scale(${isClicking ? '0.8' : isHovering ? '1.5' : '1'})`,
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovering
            ? '0 0 20px hsla(142, 76%, 36%, 0.6)'
            : '0 0 10px hsla(142, 76%, 36%, 0.4)',
        }}
      />
    </>
  )
}
