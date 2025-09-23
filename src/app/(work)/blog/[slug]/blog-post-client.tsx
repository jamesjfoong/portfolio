"use client"

import React from "react"
import Link from "next/link"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MDXContent from "@/components/ui/mdx-content"
import { staggerContainer, staggerItem } from "@/lib/animations"
import type { SerializedMDXContent } from "@/lib/mdx"

interface BlogPostClientProps {
  content: SerializedMDXContent
}

export default function BlogPostClient({ content }: BlogPostClientProps): React.ReactElement {
  const { metadata, serialized } = content

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
        {/* Back Button */}
        <motion.div variants={staggerItem}>
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.header variants={staggerItem} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {metadata.category?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Article"}
              </Badge>
              {metadata.featured && <Badge variant="default">Featured</Badge>}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {metadata.title || "Untitled"}
            </h1>

            {metadata.description && (
              <p className="text-xl text-muted-foreground leading-relaxed">{metadata.description}</p>
            )}
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-4 border-y border-border">
            {metadata.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {new Date(metadata.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
            {metadata.updatedAt && metadata.updatedAt !== metadata.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(metadata.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
            {metadata.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{metadata.readingTime} min read</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>By {metadata.author || "James Jeremy Foong"}</span>
            </div>
          </div>

          {/* Tags and Share */}
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {metadata.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          variants={staggerItem}
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-secondary prose-pre:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        >
          <MDXContent serializedContent={serialized} />
        </motion.article>

        {/* Article Footer */}
        <motion.footer variants={staggerItem} className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold mb-1">Written by {metadata.author || "James Jeremy Foong"}</h3>
              <p className="text-sm text-muted-foreground">
                Senior Software Development Engineer passionate about modern web technologies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </motion.footer>

        {/* Related Articles */}
        <motion.section variants={staggerItem} className="pt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="bg-secondary/5 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              More related articles coming soon! Stay tuned for more insights and tutorials.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}
