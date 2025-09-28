// Individual project page - Server Component
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import type { ProjectResponse } from "@/types/api"

interface ProjectProps {
  params: {
    slug: string
  }
  searchParams: {
    preview?: string
  }
}

// Fetch individual project
async function getProject(slug: string, isPreview: boolean = false): Promise<ProjectResponse["data"] | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const params = new URLSearchParams({
    ...(isPreview && { preview: "true" }),
  })

  const response = await fetch(`${baseUrl}/api/content/projects/${slug}?${params}`, {
    next: { revalidate: isPreview ? 0 : 3600 }, // No cache for preview, 1 hour for published
  })

  if (!response.ok) {
    return null
  }

  const result: ProjectResponse = await response.json()
  return result.data || null
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: ProjectProps): Promise<Metadata> {
  const { slug } = params
  const isPreview = searchParams.preview === "true"

  const project = await getProject(slug, isPreview)

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
    keywords: project.technologies,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "website",
      ...(project.images.length > 0 && { images: project.images }),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      ...(project.images.length > 0 && { images: project.images }),
    },
  }
}

// Project status badge component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    completed: "bg-green-100 text-green-800 border-green-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    archived: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${
        colors[status as keyof typeof colors] || colors.archived
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  )
}

// Table of contents component
function TableOfContents({ headings }: { headings: ProjectResponse["data"]["headings"] }) {
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

// Project gallery component
function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  if (!images || images.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Project links component
function ProjectLinks({ projectLinks }: { projectLinks: ProjectResponse["data"]["projectLinks"] }) {
  const links = [
    { key: "demo", label: "Live Demo", url: projectLinks.demo, primary: true },
    { key: "repository", label: "Source Code", url: projectLinks.repository },
    { key: "documentation", label: "Documentation", url: projectLinks.documentation },
  ].filter(link => link.url)

  if (links.length === 0) return null

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Links</h2>
      <div className="flex flex-wrap gap-3">
        {links.map(link => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              link.primary
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {link.label}
            <span className="ml-2">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// Main project content component
function ProjectContent({ project }: { project: ProjectResponse["data"] }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/projects" className="hover:text-gray-800">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{project.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{project.title}</h1>
          <StatusBadge status={project.completionStatus} />
        </div>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">{project.description}</p>

        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <time dateTime={project.publishDate}>
              {new Date(project.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{project.readingTime} min read</span>
            <span>{project.wordCount} words</span>
          </div>
        </div>
      </header>

      {/* Technologies */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <Link
              key={tech}
              href={`/projects?technology=${encodeURIComponent(tech)}`}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              {tech}
            </Link>
          ))}
        </div>
      </div>

      {/* Project Links */}
      <ProjectLinks projectLinks={project.projectLinks} />

      {/* Table of Contents */}
      <TableOfContents headings={project.headings} />

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: project.content }} />
      </div>

      {/* Gallery */}
      <ProjectGallery images={project.images} title={project.title} />

      {/* Back to projects */}
      <footer className="border-t border-gray-200 pt-8">
        <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to all projects
        </Link>
      </footer>
    </article>
  )
}

// Main project page
export default async function ProjectPage({ params, searchParams }: ProjectProps) {
  const { slug } = params
  const isPreview = searchParams.preview === "true"

  const project = await getProject(slug, isPreview)

  if (!project) {
    notFound()
  }

  return (
    <>
      {isPreview && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Preview Mode:</strong> This is a preview of an unpublished project.
            </p>
          </div>
        </div>
      )}

      <ProjectContent project={project} />
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
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>

        {/* Description skeleton */}
        <div className="h-6 bg-gray-200 rounded w-full mb-2" />
        <div className="h-6 bg-gray-200 rounded w-5/6 mb-6" />

        {/* Meta skeleton */}
        <div className="flex space-x-4 mb-8 pb-6 border-b">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Technologies skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-20" />
            ))}
          </div>
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
