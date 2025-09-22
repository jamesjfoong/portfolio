"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface NavigationLoaderProps {
  /** Optional CSS class name for the loader container */
  className?: string
}

/**
 * A top-level navigation loading indicator that shows during page transitions
 *
 * @param className - Optional CSS class name for custom styling
 * @returns A loading indicator element or null when not loading
 */
export default function NavigationLoader({ className }: NavigationLoaderProps): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }

    const handleRouteChangeComplete = () => {
      setIsLoading(false)
    }

    // Simulate navigation loading
    handleRouteChangeStart()

    const timer = setTimeout(() => {
      handleRouteChangeComplete()
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn(
            "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary z-[200]",
            className
          )}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1, transformOrigin: "right" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
