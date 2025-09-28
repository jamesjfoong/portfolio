// Projects listing page - Server Component

import type { Metadata } from "next"
import Link from "next/link"

import type { ProjectListResponse } from "@/types/api"

// Metadata for SEO
export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "Explore my web development projects, including Next.js applications, React components, and more.",
  openGraph: {
    title: "Projects Portfolio",
    description: "A collection of web development projects and applications.",
  },
}

interface ProjectListProps {
  searchParams: {
    page?: string
    technology?: string
    status?: string
    sortBy?: string
  }
}

// Fetch projects from API
async function getProjects(
  page: number = 1,
  technology?: string,
  status?: string,
  sortBy: string = "priority"
): Promise<ProjectListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    sortBy,
    ...(technology && { technology }),
    ...(status && { status }),
    published: "true",
  })

  const response = await fetch(`${baseUrl}/api/content/projects?${params}`, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }

  return response.json()
}

// Project status badge component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-800",
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        colors[status as keyof typeof colors] || colors.archived
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  )
}

// Project card component
function ProjectCard({ project }: { project: ProjectListResponse["data"][0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project image */}
      {project.images.length > 0 && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header with status */}
        <div className="flex items-start justify-between mb-3">
          <Link href={`/projects/${project.slug}`} className="block hover:opacity-80 transition-opacity">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{project.title}</h3>
          </Link>
          <StatusBadge status={project.completionStatus} />
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map(tech => (
              <Link
                key={tech}
                href={`/projects?technology=${encodeURIComponent(tech)}`}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100 transition-colors"
              >
                {tech}
              </Link>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {project.projectLinks.demo && (
              <a
                href={project.projectLinks.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Live Demo ↗
              </a>
            )}
            {project.projectLinks.repository && (
              <a
                href={project.projectLinks.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Source Code ↗
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  )
}

// Filter controls component
function ProjectFilters({
  currentTechnology,
  currentStatus,
  currentSortBy,
  availableFilters,
}: {
  currentTechnology?: string
  currentStatus?: string
  currentSortBy: string
  availableFilters: {
    technologies: string[]
    statuses: string[]
  }
}) {
  const createUrl = (filters: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    Object.entries({ ...filters, sortBy: currentSortBy }).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    return `/projects?${params.toString()}`
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Technology filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
          <select
            value={currentTechnology || ""}
            onChange={e => {
              window.location.href = createUrl({
                technology: e.target.value || undefined,
                status: currentStatus,
              })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Technologies</option>
            {availableFilters.technologies.map(tech => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={currentStatus || ""}
            onChange={e => {
              window.location.href = createUrl({
                technology: currentTechnology,
                status: e.target.value || undefined,
              })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {availableFilters.statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Sort filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
          <select
            value={currentSortBy}
            onChange={e => {
              window.location.href = createUrl({
                technology: currentTechnology,
                status: currentStatus,
                sortBy: e.target.value,
              })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="priority">Priority</option>
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {(currentTechnology || currentStatus) && (
        <div className="mt-4">
          <Link href="/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
function ProjectLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse" />
            <div className="flex space-x-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Pagination component (reused from blog page)
function Pagination({
  currentPage,
  totalPages,
  technology,
  status,
  sortBy,
}: {
  currentPage: number
  totalPages: number
  technology?: string
  status?: string
  sortBy: string
}) {
  if (totalPages <= 1) return null

  const createUrl = (page: number) => {
    const params = new URLSearchParams({ page: page.toString(), sortBy })
    if (technology) params.set("technology", technology)
    if (status) params.set("status", status)
    return `/projects?${params.toString()}`
  }

  return (
    <nav className="flex justify-center space-x-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </Link>
      )}

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1
        const isActive = page === currentPage

        return (
          <Link
            key={page}
            href={createUrl(page)}
            className={`px-4 py-2 border rounded-md transition-colors ${
              isActive ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        )
      })}

      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Next
        </Link>
      )}
    </nav>
  )
}

// Main projects page component
export default async function ProjectsPage({ searchParams }: ProjectListProps) {
  const page = parseInt(searchParams.page || "1")
  const { technology, status, sortBy = "priority" } = searchParams

  try {
    const { data: projects, meta, filters } = await getProjects(page, technology, status, sortBy)

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            A collection of web applications, tools, and experiments I've built using modern technologies like React,
            Next.js, TypeScript, and more.
          </p>
        </header>

        <ProjectFilters
          currentTechnology={technology}
          currentStatus={status}
          currentSortBy={sortBy}
          availableFilters={filters.available}
        />

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No projects found</h2>
            <p className="text-gray-600 mb-6">
              {technology || status ? "Try adjusting your filters or" : "Check back later for new projects or"}
            </p>
            <Link
              href="/projects"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View all projects
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {projects.length} of {meta.total} projects
              {page > 1 && ` (Page ${page} of ${meta.totalPages})`}
              {sortBy !== "priority" && ` • Sorted by ${sortBy}`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              technology={technology}
              status={status}
              sortBy={sortBy}
            />
          </>
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Error loading projects</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't load the projects right now. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
}

// Loading page component
export function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse mb-12">
        <div className="h-10 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-96" />
      </div>
      <div className="bg-gray-50 p-6 rounded-lg mb-8 h-48 animate-pulse" />
      <ProjectLoadingSkeleton />
    </div>
  )
}
