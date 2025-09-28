// Content search API endpoint
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") // 'blog', 'project', or 'all'
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50)

    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Simulate search results - replace with actual search implementation
    const mockResults = [
      {
        type: "blog",
        slug: "getting-started-with-nextjs",
        title: "Getting Started with Next.js 15",
        excerpt: "Learn how to build modern web applications with Next.js 15 and the App Router.",
        publishDate: "2024-01-15T00:00:00Z",
        tags: ["nextjs", "react", "tutorial"],
        matchType: "title",
        relevanceScore: 0.95,
        highlights: {
          title: "Getting Started with <mark>Next.js</mark> 15",
          content: "Learn how to build modern web applications with <mark>Next.js</mark> 15...",
        },
      },
      {
        type: "project",
        slug: "nextjs-portfolio-cms",
        title: "Next.js Portfolio CMS",
        description:
          "A modern portfolio content management system built with Next.js 15, TypeScript, and GitHub integration.",
        publishDate: "2024-01-20T00:00:00Z",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        matchType: "content",
        relevanceScore: 0.87,
        highlights: {
          title: "<mark>Next.js</mark> Portfolio CMS",
          content: "A modern portfolio content management system built with <mark>Next.js</mark> 15...",
        },
      },
    ]

    // Filter by type if specified
    let filteredResults = mockResults
    if (type && type !== "all") {
      filteredResults = mockResults.filter(result => result.type === type)
    }

    // Simple search filter (in production, use proper search engine)
    const searchQuery = query.toLowerCase()
    filteredResults = filteredResults.filter(result => {
      return (
        result.title.toLowerCase().includes(searchQuery) ||
        (result.excerpt && result.excerpt.toLowerCase().includes(searchQuery)) ||
        (result.description && result.description.toLowerCase().includes(searchQuery)) ||
        result.tags?.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        result.technologies?.some(tech => tech.toLowerCase().includes(searchQuery))
      )
    })

    // Sort by relevance score
    filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Pagination
    const totalResults = filteredResults.length
    const totalPages = Math.ceil(totalResults / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = filteredResults.slice(startIndex, endIndex)

    // Generate search suggestions based on query
    const suggestions =
      query.length > 2
        ? ["nextjs", "typescript", "react components", "portfolio", "cms"].filter(
            suggestion => suggestion.toLowerCase().includes(searchQuery) && suggestion.toLowerCase() !== searchQuery
          )
        : []

    const response = {
      data: paginatedResults,
      meta: {
        query,
        type: type || "all",
        page,
        limit,
        total: totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        searchTime: Math.random() * 100 + 50, // Simulate search time in ms
      },
      suggestions: suggestions.slice(0, 5), // Limit to 5 suggestions
      filters: {
        availableTypes: ["all", "blog", "project"],
      },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300", // Cache for 1 minute
      },
    })
  } catch (error) {
    console.error("Search API error:", error)

    return NextResponse.json(
      {
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
