// Blog listing page - Server Component

import type { Metadata } from "next"
import Link from "next/link"

import type { BlogListResponse } from "@/types/api"

// Metadata for SEO
export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Read the latest blog posts about web development, TypeScript, React, and more.",
  openGraph: {
    title: "Blog Posts",
    description: "Latest articles and tutorials on modern web development.",
  },
}

interface BlogListProps {
  searchParams: {
    page?: string
    category?: string
    tag?: string
  }
}

// Fetch blog posts from API
async function getBlogPosts(page: number = 1, category?: string, tag?: string): Promise<BlogListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(category && { category }),
    ...(tag && { tag }),
    published: "true",
  })

  const response = await fetch(`${baseUrl}/api/content/blog?${params}`, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts")
  }

  return response.json()
}

// Loading component
function BlogLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  )
}

// Blog post card component
function BlogPostCard({ post }: { post: BlogListResponse["posts"][0] }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <time className="text-sm text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</time>
        {post.readingTime && <span className="text-sm text-gray-500">{post.readingTime} min read</span>}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
          {post.title}
        </Link>
      </h2>

      <p className="text-gray-600 mb-4 line-clamp-3">{post.description || post.excerpt}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              {tag}
            </Link>
          ))}
          {post.tags.length > 3 && <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>}
        </div>
      )}

      <Link
        href={`/blog/${post.slug}`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        Read more →
      </Link>
    </article>
  )
}

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number
  totalPages: number
  baseUrl: string
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
  )

  return (
    <nav className="flex justify-center mt-12" aria-label="Blog pagination">
      <div className="flex items-center space-x-1">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous page"
          >
            ← Previous
          </Link>
        )}

        {visiblePages.map((page, index) => {
          const showEllipsis = index > 0 && visiblePages[index - 1] !== page - 1

          return (
            <div key={page} className="flex items-center">
              {showEllipsis && <span className="px-2 text-gray-500">…</span>}
              <Link
                href={`${baseUrl}?page=${page}`}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            </div>
          )
        })}

        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next page"
          >
            Next →
          </Link>
        )}
      </div>
    </nav>
  )
}

// Category filter component
function CategoryFilter({ currentCategory }: { currentCategory?: string }) {
  const categories = ["All", "Web Development", "TypeScript", "React", "Next.js"]

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map(category => {
        const isActive = (category === "All" && !currentCategory) || currentCategory === category

        const href = category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`

        return (
          <Link
            key={category}
            href={href}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category}
          </Link>
        )
      })}
    </div>
  )
}

// Main blog page component
export default async function BlogPage({ searchParams }: BlogListProps) {
  const page = parseInt(searchParams.page || "1", 10)
  const category = searchParams.category
  const tag = searchParams.tag

  let blogData: BlogListResponse

  try {
    blogData = await getBlogPosts(page, category, tag)
  } catch (_error) {
    // Return empty results with error message
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    )
  }

  const { posts, pagination } = blogData

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p className="text-gray-600 mb-6">
          Explore articles about web development, TypeScript, React, and modern frontend technologies.
        </p>

        <CategoryFilter currentCategory={category} />

        {tag && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Filtered by tag: </span>
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">{tag}</span>
            <Link href="/blog" className="ml-2 text-sm text-blue-600 hover:text-blue-800">
              Clear filter
            </Link>
          </div>
        )}
      </header>

      {posts.length > 0 ? (
        <>
          <div className="space-y-8">
            {posts.map(post => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>

          <Pagination currentPage={pagination.page} totalPages={pagination.pages} baseUrl="/blog" />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No posts found</h2>
          <p className="text-gray-600 mb-8">
            {category || tag
              ? "Try adjusting your filters or check back later for new content."
              : "Check back later for new blog posts."}
          </p>
          {(category || tag) && (
            <Link
              href="/blog"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View all posts
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
