"use client"

import { useState } from "react"
import Link from "next/link"

import { motion } from "framer-motion"
import { Calendar, Clock, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import BlogCard from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"

import { BlogCategory } from "@/types/enums"

// Sample blog data - in a real app, this would come from a CMS or API
const samplePosts = [
  {
    id: "1",
    slug: "understanding-react-server-components",
    title: "Understanding React Server Components",
    excerpt: "A deep dive into React Server Components and how they change the way we think about React applications.",
    category: BlogCategory.TECHNICAL,
    publishedAt: "2024-01-15",
    readingTime: 8,
    tags: ["React", "Next.js", "Server Components"],
    featured: true,
  },
  {
    id: "2",
    slug: "building-scalable-design-systems",
    title: "Building Scalable Design Systems",
    excerpt: "Learn how to create and maintain design systems that scale with your team and product.",
    category: BlogCategory.TUTORIAL,
    publishedAt: "2024-01-10",
    readingTime: 12,
    tags: ["Design Systems", "CSS", "Components"],
    featured: false,
  },
]

export default function BlogPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "all">("all")

  const categories = Object.values(BlogCategory)

  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-12">
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blog & Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, design, and technology.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Posts
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts */}
        <motion.div variants={staggerItem}>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div variants={staggerItem} className="text-center py-12 bg-secondary/5 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">More Content Coming Soon!</h3>
          <p className="text-muted-foreground">
            I&apos;m working on creating more valuable content. Stay tuned for tutorials, insights, and technical
            deep-dives.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
