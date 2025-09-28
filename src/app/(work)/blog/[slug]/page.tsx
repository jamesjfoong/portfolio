// Individual blog post page - Server Component
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import type { BlogPostResponse } from "@/types/api"

interface BlogPostProps {
  params: {
    slug: string
  }
  searchParams: {
    preview?: string
  }
}

// Fetch individual blog post
async function getBlogPost(slug: string, isPreview: boolean = false): Promise<BlogPostResponse["data"] | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const params = new URLSearchParams({
    ...(isPreview && { preview: "true" }),
  })

  const response = await fetch(`${baseUrl}/api/content/blog/${slug}?${params}`, {
    next: { revalidate: isPreview ? 0 : 3600 }, // No cache for preview, 1 hour for published
  })

  if (!response.ok) {
    return null
  }

  const result: BlogPostResponse = await response.json()
  return result.data || null
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: BlogPostProps): Promise<Metadata> {
  const { slug } = params
  const isPreview = searchParams.preview === "true"

  const post = await getBlogPost(slug, isPreview)

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description || post.excerpt || "Read this blog post on our website.",
    keywords: post.tags,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.lastModified,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      ...(post.ogImage && { images: [post.ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.excerpt,
      ...(post.ogImage && { images: [post.ogImage] }),
    },
  }
}

// Table of contents component
function TableOfContents({ headings }: { headings: BlogPostResponse["data"]["headings"] }) {
  if (!headings || headings.length === 0) return null

  return (
    <nav className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map(heading => (
          <li
            key={heading.id}
            className={`${heading.level === 1 ? "font-semibold" : ""} ${heading.level === 2 ? "ml-0" : ""} ${
              heading.level === 3 ? "ml-4" : ""
            } ${heading.level >= 4 ? "ml-8" : ""}`}
          >
            <a href={`#${heading.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Reading progress component
function ReadingProgress() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div className="h-full bg-blue-600 transition-all duration-150 ease-out w-0" />
    </div>
  )
}

// Blog post content component
function BlogPostContent({ post }: { post: BlogPostResponse["data"] }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-gray-800">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

        {post.excerpt && <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>}

        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <time dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.author && <span>by {post.author}</span>}
            <span>{post.readingTime} min read</span>
            <span>{post.wordCount} words</span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents headings={post.headings} />

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Tags and Categories */}
      <footer className="border-t border-gray-200 pt-8">
        <div className="flex flex-wrap gap-4">
          {post.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {post.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {post.categories.map(category => (
                  <Link
                    key={category}
                    href={`/blog?category=${encodeURIComponent(category)}`}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to all blog posts
          </Link>
        </div>
      </footer>
    </article>
  )
}

// Main blog post page
export default async function BlogPostPage({ params, searchParams }: BlogPostProps) {
  const { slug } = params
  const isPreview = searchParams.preview === "true"

  const post = await getBlogPost(slug, isPreview)

  if (!post) {
    notFound()
  }

  return (
    <>
      <ReadingProgress />

      {isPreview && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Preview Mode:</strong> This is a preview of an unpublished blog post.
            </p>
          </div>
        </div>
      )}

      <BlogPostContent post={post} />
    </>
  )
}

// Loading component
export function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 rounded w-64 mb-6" />

        {/* Title skeleton */}
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6" />

        {/* Excerpt skeleton */}
        <div className="h-6 bg-gray-200 rounded w-full mb-2" />
        <div className="h-6 bg-gray-200 rounded w-5/6 mb-6" />

        {/* Meta skeleton */}
        <div className="flex space-x-4 mb-8">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
