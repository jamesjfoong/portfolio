"use client"

import React, { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface ScrollToTopProps {
  className?: string
  showAfter?: number
  smooth?: boolean
}

export default function ScrollToTop({
  className,
  showAfter = 300,
  smooth = true,
}: ScrollToTopProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (scrolled / maxHeight) * 100

      setScrollProgress(progress)
      setIsVisible(scrolled > showAfter)
    }

    // Throttled scroll handler for better performance
    let timeoutId: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(toggleVisibility, 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [showAfter])

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50 group",
            "w-12 h-12 rounded-full",
            "bg-primary text-primary-foreground",
            "shadow-lg hover:shadow-xl",
            "border border-primary/20",
            "transition-all duration-300 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "hover:bg-primary/90",
            "backdrop-blur-sm",
            className
          )}
          aria-label="Scroll to top"
        >
          {/* Progress ring */}
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Arrow icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
