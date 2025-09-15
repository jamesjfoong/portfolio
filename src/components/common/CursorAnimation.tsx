'use client'

import React, { useEffect, useRef } from 'react'
import { useCursorStore } from '@/lib/stores/cursor-store'

import './CursorAnimation.css'

export default function CursorAnimation(): React.ReactElement {
  const trailIdRef = useRef(0)
  const {
    position,
    isHovering,
    cursorVariant,
    isClicking,
    trail,
    updatePosition,
    setHovering,
    setCursorVariant,
    setClicking,
    addTrailPoint,
  } = useCursorStore()

  useEffect(() => {
    let animationFrame: number

    const handleMouseMove = (event: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      animationFrame = requestAnimationFrame(() => {
        const newPosition = { x: event.clientX, y: event.clientY }
        updatePosition(newPosition)

        // Add trail effect less frequently
        addTrailPoint({ ...newPosition, id: trailIdRef.current++ })
      })
    }

    const handleMouseDown = () => setClicking(true)
    const handleMouseUp = () => setClicking(false)

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target || typeof target.closest !== 'function') return

      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setHovering(true)
        setCursorVariant('button')
      } else if (target.closest('[data-cursor="project"]')) {
        setHovering(true)
        setCursorVariant('project')
      }
    }

    const handleMouseLeave = () => {
      setHovering(false)
      setCursorVariant('default')
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  const getGradientColors = () => {
    switch (cursorVariant) {
      case 'button':
        return 'rgba(59, 130, 246, 0.25), rgba(147, 51, 234, 0.15)'
      case 'text':
        return 'rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.1)'
      case 'project':
        return 'rgba(236, 72, 153, 0.25), rgba(59, 130, 246, 0.15)'
      default:
        return 'rgba(29, 78, 216, 0.15), rgba(147, 51, 234, 0.08)'
    }
  }

  const getSize = () => {
    switch (cursorVariant) {
      case 'button':
        return '800px'
      case 'text':
        return '400px'
      case 'project':
        return '1000px'
      default:
        return '600px'
    }
  }

  return (
    <>
      {/* Trail effect */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="cursor-dot"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: '6px',
            height: '6px',
            background: `rgba(59, 130, 246, ${
              0.1 + (index / trail.length) * 0.3
            })`,
            transform: `scale(${0.3 + (index / trail.length) * 0.7})`,
            zIndex: 35,
          }}
        />
      ))}

      <div
        className="cursor-gradient"
        style={{
          background: `radial-gradient(${getSize()} at ${position.x}px ${
            position.y
          }px, ${getGradientColors()}, transparent 80%)`,
          opacity: isHovering ? 1 : 0.7,
        }}
      />

      {/* Custom cursor dot */}
      <div
        className="cursor-dot"
        style={{
          left: position.x - 6,
          top: position.y - 6,
          width: isHovering || isClicking ? '20px' : '12px',
          height: isHovering || isClicking ? '20px' : '12px',
          background:
            isHovering || isClicking
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.6))'
              : 'rgba(59, 130, 246, 0.6)',
          transform: isClicking
            ? 'scale(0.8)'
            : isHovering
            ? 'scale(1.2)'
            : 'scale(1)',
          boxShadow:
            isHovering || isClicking
              ? '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)'
              : '0 0 10px rgba(59, 130, 246, 0.3)',
        }}
      />
    </>
  )
}
