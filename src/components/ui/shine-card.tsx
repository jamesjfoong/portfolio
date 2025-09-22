"use client"

import React from "react"

import { motion } from "framer-motion"

import { useCursorShine } from "@/hooks/useCursorShine"
import { cn } from "@/lib/utils"

interface ShineCardProps {
  className?: string
  enableShine?: boolean
  enableBorderHighlight?: boolean
  motionProps?: React.ComponentProps<typeof motion.div>
  children?: React.ReactNode
}

/**
 * ShineCard component with cursor-following shine effect
 * A wrapper around motion.div that adds a premium shine effect on hover
 */
export default function ShineCard({
  className,
  enableShine = true,
  enableBorderHighlight = true,
  motionProps,
  children,
}: ShineCardProps): React.ReactElement {
  const { cardRef, shineStyle, borderStyle } = useCursorShine()

  return (
    <motion.div ref={cardRef} className={cn("relative overflow-hidden", className)} {...motionProps}>
      {/* Enhanced Border Highlight */}
      {enableBorderHighlight && (
        <div className="absolute inset-0 pointer-events-none opacity-70 z-10" style={borderStyle} />
      )}

      {/* Cursor Shine Effect */}
      {enableShine && <div className="absolute inset-0 pointer-events-none opacity-50 z-20" style={shineStyle} />}

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </motion.div>
  )
}
