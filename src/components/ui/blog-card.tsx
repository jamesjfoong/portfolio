"use client"

import React from "react"
import Link from "next/link"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useCursorShine } from "@/hooks/useCursorShine"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: number
  tags?: string[]
  featured?: boolean
}

interface BlogCardProps {
  post: BlogPost
  className?: string
  index?: number
}

export default function BlogCard({ post, className, index = 0 }: BlogCardProps): React.ReactElement {
  const { cardRef, shineStyle, borderStyle } = useCursorShine()

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={cn(
        "group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden transition-all duration-300 w-full",
        "max-w-sm mx-auto sm:max-w-none",
        "shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1),_0_1px_2px_-1px_rgb(0_0_0_/_0.1)]",
        "hover:shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]",
        "hover:border-primary/50 hover:scale-[1.02] hover:-translate-y-1",
        "will-change-transform",
        // Mobile optimizations
        "touch-manipulation",
        "min-h-[280px] sm:min-h-[320px]",
        className
      )}
    >
      {/* Enhanced Border Highlight */}
      <div className="absolute inset-0 pointer-events-none opacity-70 z-10 rounded-xl" style={borderStyle} />

      {/* Cursor Shine Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-20 rounded-xl" style={shineStyle} />

      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

      {/* Content */}
      <Link href={`/blog/${post.slug}`} className="block relative z-30">
        <div className="p-4 xs:p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              {post.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            {post.featured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs hover:scale-110 transition-transform duration-200"
                  style={{ animationDelay: `${tagIndex * 0.1}s` }}
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
