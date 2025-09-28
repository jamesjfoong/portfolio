// Blog posts list API endpoint
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50) // Cap at 50
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const published = searchParams.get("published")

    // Simulate blog posts data - replace with actual implementation
    const mockBlogPosts = [
      {
        slug: "getting-started-with-nextjs",
        title: "Getting Started with Next.js 15",
        excerpt: "Learn how to build modern web applications with Next.js 15 and the App Router.",
        publishDate: "2024-01-15T00:00:00Z",
        lastModified: "2024-01-15T00:00:00Z",
        published: true,
        tags: ["nextjs", "react", "tutorial"],
        categories: ["Frontend", "Tutorial"],
        author: "John Doe",
        readingTime: 5,
      },
      {
        slug: "typescript-best-practices",
        title: "TypeScript Best Practices for 2024",
        excerpt: "Discover the latest TypeScript patterns and practices for building scalable applications.",
        publishDate: "2024-01-10T00:00:00Z",
        lastModified: "2024-01-12T00:00:00Z",
        published: true,
        tags: ["typescript", "best-practices", "development"],
        categories: ["Development", "TypeScript"],
        author: "Jane Smith",
        readingTime: 8,
      },
    ]

    // Apply filters
    let filteredPosts = mockBlogPosts

    if (published !== null) {
      const isPublished = published === "true"
      filteredPosts = filteredPosts.filter(post => post.published === isPublished)
    }

    if (category) {
      filteredPosts = filteredPosts.filter(post =>
        post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
      )
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
    }

    // Pagination
    const totalPosts = filteredPosts.length
    const totalPages = Math.ceil(totalPosts / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    const response = {
      data: paginatedPosts,
      meta: {
        page,
        limit,
        total: totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters: {
        category,
        tag,
        published,
      },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400", // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error("Blog list API error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
