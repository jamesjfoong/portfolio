// Individual blog post API endpoint
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { slug } = params

    if (!slug || slug.trim() === "") {
      return NextResponse.json({ error: "Blog post slug is required" }, { status: 400 })
    }

    // Simulate blog post data - replace with actual implementation
    const mockBlogPost = {
      slug: "getting-started-with-nextjs",
      title: "Getting Started with Next.js 15",
      content: `<h1>Getting Started with Next.js 15</h1>
      <p>Next.js 15 introduces several exciting features that make building web applications even more powerful and efficient.</p>
      <h2>Key Features</h2>
      <ul>
        <li>App Router with improved performance</li>
        <li>Server Components by default</li>
        <li>Enhanced TypeScript support</li>
      </ul>
      <p>In this comprehensive guide, we'll explore how to leverage these new features...</p>`,
      excerpt: "Learn how to build modern web applications with Next.js 15 and the App Router.",
      publishDate: "2024-01-15T00:00:00Z",
      lastModified: "2024-01-15T00:00:00Z",
      published: true,
      tags: ["nextjs", "react", "tutorial"],
      categories: ["Frontend", "Tutorial"],
      author: "John Doe",
      description:
        "Complete guide to getting started with Next.js 15, covering App Router, Server Components, and modern development practices.",
      ogImage: "/images/blog/nextjs-15-guide.jpg",
      readingTime: 5,
      wordCount: 1250,
      headings: [
        { level: 1, text: "Getting Started with Next.js 15", id: "getting-started-with-nextjs-15" },
        { level: 2, text: "Key Features", id: "key-features" },
        { level: 2, text: "Installation", id: "installation" },
        { level: 2, text: "Configuration", id: "configuration" },
      ],
    }

    // Check if blog post exists (simulate database check)
    if (slug !== mockBlogPost.slug) {
      return NextResponse.json(
        {
          error: "Blog post not found",
          slug,
        },
        { status: 404 }
      )
    }

    // Check if published (unless in preview mode)
    const isPreview = request.nextUrl.searchParams.get("preview") === "true"
    if (!mockBlogPost.published && !isPreview) {
      return NextResponse.json(
        {
          error: "Blog post not published",
          slug,
        },
        { status: 404 }
      )
    }

    const response = {
      data: mockBlogPost,
      meta: {
        lastSync: new Date().toISOString(),
        source: "github",
        cached: false,
      },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": isPreview
          ? "no-cache, no-store, must-revalidate"
          : "s-maxage=3600, stale-while-revalidate=86400", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error(`Blog post API error for slug ${params.slug}:`, error)

    return NextResponse.json(
      {
        error: "Failed to fetch blog post",
        message: error instanceof Error ? error.message : "Unknown error",
        slug: params.slug,
      },
      { status: 500 }
    )
  }
}
