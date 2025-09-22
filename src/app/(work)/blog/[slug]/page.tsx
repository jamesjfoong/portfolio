"use client"

import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { staggerContainer, staggerItem } from "@/lib/animations"

import { BlogCategory } from "@/types/enums"

// Sample blog data - in a real app, this would come from a CMS or API
const samplePosts = [
  {
    id: "1",
    slug: "understanding-react-server-components",
    title: "Understanding React Server Components",
    excerpt: "A deep dive into React Server Components and how they change the way we think about React applications.",
    content: `
      <p>React Server Components represent a fundamental shift in how we build React applications. They allow us to render components on the server, reducing the JavaScript bundle size and improving performance.</p>

      <h2>What are Server Components?</h2>
      <p>Server Components are a new type of React component that runs on the server instead of the client. This means they can access server-side resources like databases, file systems, and APIs directly.</p>

      <h2>Benefits</h2>
      <ul>
        <li>Reduced bundle size</li>
        <li>Better performance</li>
        <li>Direct server access</li>
        <li>Improved SEO</li>
      </ul>

      <h2>Getting Started</h2>
      <p>To use Server Components, you need to use a framework that supports them, like Next.js 13+ with the app directory.</p>
    `,
    category: BlogCategory.TECHNICAL,
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-16",
    readingTime: 8,
    tags: ["React", "Next.js", "Server Components"],
    author: "James Jeremy Foong",
    featured: true,
  },
]

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps): React.ReactElement {
  return <BlogPostContent params={params} />
}

function BlogPostContent({ params }: BlogPostPageProps): React.ReactElement {
  const [slug, setSlug] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  if (!slug) {
    return <div>Loading...</div>
  }

  const post = samplePosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

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
                {post.category.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
              {post.featured && <Badge variant="default">Featured</Badge>}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            {post.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Share Button */}
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
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
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-secondary prose-pre:text-foreground"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.article>

        {/* Article Footer */}
        <motion.footer variants={staggerItem} className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold mb-1">Written by {post.author}</h3>
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
