import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm',
  {
    variants: {
      variant: {
        default:
          'border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm hover:shadow-md hover:scale-105 hover:bg-primary/15',
        secondary:
          'border-secondary/20 bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary-foreground hover:shadow-md hover:scale-105 hover:bg-secondary/15',
        destructive:
          'border-destructive/20 bg-gradient-to-r from-destructive/10 to-destructive/5 text-destructive shadow-sm hover:shadow-md hover:scale-105 hover:bg-destructive/15',
        outline:
          'border-border/50 bg-background/50 text-foreground hover:bg-accent/50 hover:scale-105 hover:shadow-sm',
        tech: 'border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-md hover:scale-105 hover:from-blue-500/15 hover:to-cyan-500/10',
        skill:
          'border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5 text-emerald-600 dark:text-emerald-400 shadow-sm hover:shadow-md hover:scale-105 hover:from-emerald-500/15 hover:to-green-500/10',
        category:
          'border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-purple-600 dark:text-purple-400 shadow-sm hover:shadow-md hover:scale-105 hover:from-purple-500/15 hover:to-pink-500/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), 'cursor-default', className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
