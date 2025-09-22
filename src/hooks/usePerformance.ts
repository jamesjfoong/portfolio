import { useEffect, useState } from "react"

interface PerformanceMetrics {
  isSlowConnection: boolean
  prefersReducedMotion: boolean
  isLowEndDevice: boolean
}

export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isSlowConnection: false,
    prefersReducedMotion: false,
    isLowEndDevice: false,
  })

  useEffect(() => {
    // Check for slow connection
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const isSlowConnection = connection
      ? connection.effectiveType === "slow-2g" || connection.effectiveType === "2g" || connection.saveData === true
      : false

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Estimate if device is low-end based on hardware concurrency
    const isLowEndDevice = navigator.hardwareConcurrency <= 2

    setMetrics({
      isSlowConnection,
      prefersReducedMotion,
      isLowEndDevice,
    })
  }, [])

  return metrics
}

// Hook for intersection observer with performance considerations
export function useIntersectionObserver(elementRef: React.RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const { isLowEndDevice } = usePerformance()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Use more conservative thresholds for low-end devices
    const observerOptions = {
      threshold: isLowEndDevice ? 0.1 : 0.3,
      rootMargin: isLowEndDevice ? "50px" : "100px",
      ...options,
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, observerOptions)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, isLowEndDevice, options])

  return isIntersecting
}

// Hook for preloading critical resources
export function usePreloadCriticalResources() {
  useEffect(() => {
    // Preload critical fonts
    const fontPreloads = [
      "/fonts/inter-var.woff2",
      // Add other critical font files
    ]

    fontPreloads.forEach(font => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "font"
      link.type = "font/woff2"
      link.crossOrigin = "anonymous"
      link.href = font
      document.head.appendChild(link)
    })

    // Preload critical images
    const criticalImages = [
      "/projects/coding.svg", // Hero section image
      // Add other above-the-fold images
    ]

    criticalImages.forEach(imageSrc => {
      const img = new Image()
      img.src = imageSrc
    })
  }, [])
}

