"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CursorPosition {
  x: number
  y: number
}

interface UseCursorShineReturn {
  cardRef: React.RefObject<HTMLDivElement | null>
  isHovered: boolean
  cursorPosition: CursorPosition
  shineStyle: React.CSSProperties
  borderStyle: React.CSSProperties
}

/**
 * Custom hook for creating a cursor-following shine effect on card borders
 * Creates a radial gradient that follows the mouse cursor when hovering over the element
 */
export function useCursorShine(): UseCursorShineReturn {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setCursorPosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    element.addEventListener("mousemove", handleMouseMove, { passive: true })
    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave])

  // Create the shine effect style
  const shineStyle: React.CSSProperties = {
    background: isHovered
      ? `radial-gradient(400px circle at ${cursorPosition.x}px ${cursorPosition.y}px,
          hsla(142, 76%, 36%, 0.4) 0%,
          hsla(142, 76%, 36%, 0.2) 25%,
          transparent 50%)`
      : "transparent",
    transition: isHovered ? "none" : "background 0.3s ease-out",
  }

  // Create enhanced border highlighting effect
  const borderStyle: React.CSSProperties = {
    background: isHovered
      ? `radial-gradient(600px circle at ${cursorPosition.x}px ${cursorPosition.y}px,
          hsla(142, 76%, 36%, 0.8) 0%,
          hsla(142, 76%, 36%, 0.4) 20%,
          hsla(142, 76%, 36%, 0.1) 40%,
          transparent 70%)`
      : "transparent",
    transition: isHovered ? "none" : "background 0.3s ease-out",
  }

  return {
    cardRef,
    isHovered,
    cursorPosition,
    shineStyle,
    borderStyle,
  }
}
