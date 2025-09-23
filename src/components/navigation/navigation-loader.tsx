"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface NavigationLoaderProps {
  /** Optional CSS class name for the loader container */
  className?: string
}

/**
 * A top-level navigation loading indicator that shows during page transitions
 * Uses pathname and searchParams changes to detect navigation events
 *
 * @param className - Optional CSS class name for custom styling
 * @returns A loading indicator element or null when not loading
 */
export default function NavigationLoader({ className }: NavigationLoaderProps): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const previousPathRef = useRef<string>("")
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Don't show loading on initial page load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      previousPathRef.current = currentPath
      return
    }

    // Only show loading if the path actually changed
    if (currentPath !== previousPathRef.current) {
      setIsLoading(true)
      previousPathRef.current = currentPath

      // Simulate navigation delay for smooth UX
      const loadingTimer = setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return () => {
        clearTimeout(loadingTimer)
      }
    }
  }, [pathname, searchParams])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className={cn(
            "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary z-[200] shadow-lg",
            className
          )}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1, transformOrigin: "right" }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.8, 0.25, 1], // Custom easing for smooth animation
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
