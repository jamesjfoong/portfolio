import React from "react"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TimelineItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  achievements?: string[]
  technologies?: string[]
  current?: boolean
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps): React.ReactElement {
  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 flex items-center justify-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 bg-background flex items-center justify-center",
                  item.current ? "border-primary bg-primary/10" : "border-muted-foreground/30"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    item.current ? "bg-primary animate-pulse" : "bg-muted-foreground/50"
                  )}
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.current && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                      Current
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{item.date}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>

              {item.achievements && item.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {item.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.technologies.slice(0, 6).map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full hover:scale-105 transition-transform duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 6 && (
                    <span className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground border border-border rounded-full">
                      +{item.technologies.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
