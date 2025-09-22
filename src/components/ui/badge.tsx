import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm hover:shadow-lg hover:from-primary/15 hover:to-primary/10",
        secondary:
          "border-secondary/20 bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary-foreground hover:shadow-lg hover:from-secondary/15 hover:to-secondary/10",
        destructive:
          "border-destructive/20 bg-gradient-to-r from-destructive/10 to-destructive/5 text-destructive shadow-sm hover:shadow-lg hover:from-destructive/15 hover:to-destructive/10",
        outline:
          "border-border/50 bg-background/50 text-foreground hover:bg-accent/50 hover:shadow-sm hover:border-primary/30",
        tech: "border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-lg hover:from-blue-500/20 hover:to-cyan-500/15",
        skill:
          "border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5 text-emerald-600 dark:text-emerald-400 shadow-sm hover:shadow-lg hover:from-emerald-500/20 hover:to-green-500/15",
        category:
          "border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-purple-600 dark:text-purple-400 shadow-sm hover:shadow-lg hover:from-purple-500/20 hover:to-pink-500/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), "cursor-default", className)} {...props} />
}

export { Badge, badgeVariants }
