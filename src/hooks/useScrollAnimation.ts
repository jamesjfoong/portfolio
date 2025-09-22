"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  initialCheck?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -10% 0px", triggerOnce = true, initialCheck = true } = options

  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting

        if (isIntersecting) {
          setIsVisible(true)
          if (triggerOnce && currentRef) {
            observer.unobserve(currentRef)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin,
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, triggerOnce, initialCheck])

  return { ref, isVisible }
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(Math.min(Math.max(progress, 0), 100))
    }

    // Initial calculation
    handleScroll()

    // Throttled scroll handler for performance
    let timeoutId: NodeJS.Timeout | null = null
    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(handleScroll, 10)
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
      window.removeEventListener("resize", handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return scrollProgress
}

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed)
    }

    // Initial calculation
    handleScroll()

    // Throttled scroll handler
    let rafId: number | null = null
    const throttledHandleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [speed])

  return offset
}

// New hook for element visibility with better performance
export function useInView(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -5% 0px", triggerOnce = false, initialCheck = true } = options

  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if element is initially visible
    const checkInitialVisibility = () => {
      if (!initialCheck) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const isVisible = rect.top < windowHeight * 0.9 && rect.bottom > windowHeight * 0.1

      if (isVisible) {
        setIsInView(true)
        setHasBeenInView(true)
      }
    }

    checkInitialVisibility()

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting

        if (visible && !hasBeenInView) {
          setIsInView(true)
          setHasBeenInView(true)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(visible)
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [0, threshold],
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, initialCheck, hasBeenInView])

  return { ref, isInView, hasBeenInView }
}
