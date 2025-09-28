// Projects list API endpoint
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50) // Cap at 50
    const technology = searchParams.get("technology")
    const status = searchParams.get("status")
    const published = searchParams.get("published")
    const sortBy = searchParams.get("sortBy") || "priority" // priority, date, title

    // Simulate projects data - replace with actual implementation
    const mockProjects = [
      {
        slug: "nextjs-portfolio-cms",
        title: "Next.js Portfolio CMS",
        description:
          "A modern portfolio content management system built with Next.js 15, TypeScript, and GitHub integration.",
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
        images: ["/images/projects/portfolio-cms-1.jpg", "/images/projects/portfolio-cms-2.jpg"],
        displayPriority: 1,
      },
      {
        slug: "react-component-library",
        title: "React Component Library",
        description: "A comprehensive React component library with TypeScript support and Storybook documentation.",
        publishDate: "2024-01-01T00:00:00Z",
        lastModified: "2024-01-15T00:00:00Z",
        published: true,
        completionStatus: "completed",
        technologies: ["React", "TypeScript", "Storybook", "Jest"],
        projectLinks: {
          demo: "https://components.example.com",
          repository: "https://github.com/username/react-components",
        },
        images: ["/images/projects/components-1.jpg"],
        displayPriority: 2,
      },
    ]

    // Apply filters
    let filteredProjects = mockProjects

    if (published !== null) {
      const isPublished = published === "true"
      filteredProjects = filteredProjects.filter(project => project.published === isPublished)
    }

    if (status) {
      filteredProjects = filteredProjects.filter(project => project.completionStatus === status)
    }

    if (technology) {
      filteredProjects = filteredProjects.filter(project =>
        project.technologies.some(tech => tech.toLowerCase().includes(technology.toLowerCase()))
      )
    }

    // Sorting
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "priority":
        default:
          return a.displayPriority - b.displayPriority
      }
    })

    // Pagination
    const totalProjects = filteredProjects.length
    const totalPages = Math.ceil(totalProjects / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    // Get unique technologies and statuses for filter options
    const allTechnologies = [...new Set(mockProjects.flatMap(p => p.technologies))]
    const allStatuses = [...new Set(mockProjects.map(p => p.completionStatus))]

    const response = {
      data: paginatedProjects,
      meta: {
        page,
        limit,
        total: totalProjects,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        sortBy,
      },
      filters: {
        technology,
        status,
        published,
        available: {
          technologies: allTechnologies,
          statuses: allStatuses,
        },
      },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400", // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error("Projects list API error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
