// Individual project API endpoint
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
      return NextResponse.json({ error: "Project slug is required" }, { status: 400 })
    }

    // Simulate project data - replace with actual implementation
    const mockProject = {
      slug: "nextjs-portfolio-cms",
      title: "Next.js Portfolio CMS",
      description:
        "A modern portfolio content management system built with Next.js 15, TypeScript, and GitHub integration.",
      content: `<h1>Next.js Portfolio CMS</h1>
      <p>This project demonstrates a complete content management system built with modern web technologies.</p>
      <h2>Features</h2>
      <ul>
        <li>GitHub-based content management</li>
        <li>Server-side rendering with Next.js 15</li>
        <li>TypeScript for type safety</li>
        <li>Responsive design with Tailwind CSS</li>
      </ul>
      <h2>Technical Implementation</h2>
      <p>The system uses GitHub's API to fetch markdown content...</p>`,
      publishDate: "2024-01-20T00:00:00Z",
      lastModified: "2024-01-22T00:00:00Z",
      published: true,
      completionStatus: "in-progress",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub API"],
      projectLinks: {
        demo: "https://portfolio-demo.vercel.app",
        repository: "https://github.com/username/portfolio-cms",
        documentation: "https://docs.portfolio-cms.dev",
      },
      images: [
        "/images/projects/portfolio-cms-1.jpg",
        "/images/projects/portfolio-cms-2.jpg",
        "/images/projects/portfolio-cms-3.jpg",
      ],
      displayPriority: 1,
      readingTime: 3,
      wordCount: 850,
      headings: [
        { level: 1, text: "Next.js Portfolio CMS", id: "nextjs-portfolio-cms" },
        { level: 2, text: "Features", id: "features" },
        { level: 2, text: "Technical Implementation", id: "technical-implementation" },
        { level: 2, text: "Getting Started", id: "getting-started" },
      ],
    }

    // Check if project exists (simulate database check)
    if (slug !== mockProject.slug) {
      return NextResponse.json(
        {
          error: "Project not found",
          slug,
        },
        { status: 404 }
      )
    }

    // Check if published (unless in preview mode)
    const isPreview = request.nextUrl.searchParams.get("preview") === "true"
    if (!mockProject.published && !isPreview) {
      return NextResponse.json(
        {
          error: "Project not published",
          slug,
        },
        { status: 404 }
      )
    }

    const response = {
      data: mockProject,
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
    console.error(`Project API error for slug ${params.slug}:`, error)

    return NextResponse.json(
      {
        error: "Failed to fetch project",
        message: error instanceof Error ? error.message : "Unknown error",
        slug: params.slug,
      },
      { status: 500 }
    )
  }
}
