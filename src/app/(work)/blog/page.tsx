'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { BlogCategory } from '@/types/enums'

// Sample blog data - in a real app, this would come from a CMS or API
const samplePosts = [
  {
    id: '1',
    slug: 'understanding-react-server-components',
    title: 'Understanding React Server Components',
    excerpt:
      'A deep dive into React Server Components and how they change the way we think about React applications.',
    category: BlogCategory.TECHNICAL,
    publishedAt: '2024-01-15',
    readingTime: 8,
    tags: ['React', 'Next.js', 'Server Components'],
    featured: true,
  },
  {
    id: '2',
    slug: 'building-scalable-design-systems',
    title: 'Building Scalable Design Systems',
    excerpt:
      'Learn how to create and maintain design systems that scale with your team and product.',
    category: BlogCategory.TUTORIAL,
    publishedAt: '2024-01-10',
    readingTime: 12,
    tags: ['Design Systems', 'CSS', 'Components'],
    featured: false,
  },
]

export default function BlogPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | 'all'
  >('all')

  const categories = Object.values(BlogCategory)

  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Blog & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, design, and
            technology.
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
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Posts
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category
                  .replace('-', ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts */}
        <motion.div variants={staggerItem}>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {post.category
                            .replace('-', ' ')
                            .replace(/\b\w/g, l => l.toUpperCase())}
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

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          variants={staggerItem}
          className="text-center py-12 bg-secondary/5 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">
            More Content Coming Soon!
          </h3>
          <p className="text-muted-foreground">
            I'm working on creating more valuable content. Stay tuned for
            tutorials, insights, and technical deep-dives.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

