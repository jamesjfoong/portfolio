"use client"

import * as React from "react"

import { motion, type MotionProps } from "framer-motion"

import { useCursorShine } from "@/hooks/useCursorShine"
import { cn } from "@/lib/utils"

interface EnhancedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  enableShine?: boolean
  enableBorderHighlight?: boolean
  motionProps?: MotionProps
  children?: React.ReactNode
}

/**
 * Enhanced Card component with unified cursor effects
 * Combines the best features of Card, ProjectCard, and ShineCard
 */
export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, enableShine = true, enableBorderHighlight = true, motionProps, children, ...props }, ref) => {
    const { cardRef, shineStyle, borderStyle } = useCursorShine()

    // Use the provided ref or the shine ref
    const elementRef = ref || cardRef

    return (
      <motion.div
        ref={elementRef}
        className={cn(
          "group relative rounded-xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden",
          "border-border/50 hover:border-primary/50",
          "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
          "will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...motionProps}
        {...props}
      >
        {/* Background hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl will-change-opacity" />

        {/* Enhanced Border Highlight */}
        {enableBorderHighlight && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10 opacity-70 will-change-opacity"
            style={borderStyle}
          />
        )}

        {/* Cursor Shine Effect */}
        {enableShine && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-20 opacity-60 will-change-opacity"
            style={shineStyle}
          />
        )}

        {/* Content */}
        <div className="relative z-30">{children}</div>
      </motion.div>
    )
  }
)
EnhancedCard.displayName = "EnhancedCard"

const EnhancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
EnhancedCardHeader.displayName = "EnhancedCardHeader"

const EnhancedCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
)
EnhancedCardTitle.displayName = "EnhancedCardTitle"

const EnhancedCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
EnhancedCardDescription.displayName = "EnhancedCardDescription"

const EnhancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
)
EnhancedCardContent.displayName = "EnhancedCardContent"

const EnhancedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
)
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export { EnhancedCardContent,EnhancedCardDescription, EnhancedCardFooter, EnhancedCardHeader, EnhancedCardTitle }
