'use client'

import { useEffect, useRef } from 'react'

import './CursorAnimation.css'

export default function CursorAnimation(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      ref.current?.style.setProperty('--mouse-x', `${event.clientX}px`)
      ref.current?.style.setProperty('--mouse-y', `${event.clientY}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 transition"
      style={{
        background:
          'radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(29, 78, 216, 0.15), transparent 80%)',
        animation: 'pulse 1.5s ease-out infinite',
      }}
    />
  )
}
