import Image from "next/image"
import Link from "next/link"

import type { Project } from "@/types/content"

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    completed: "bg-green-100 text-green-800 border-green-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    archived: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        colors[status as keyof typeof colors] || colors.archived
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  )
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {project.featuredImage && (
        <div className="relative aspect-video">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500">
            {new Date(project.publishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </time>
          <StatusBadge status={project.completionStatus} />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link href={`/projects/${project.slug}`} className="hover:text-blue-600 transition-colors">
            {project.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map(tech => (
              <Link
                key={tech}
                href={`/projects?technology=${encodeURIComponent(tech)}`}
                className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
              >
                {tech}
              </Link>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs text-gray-500">+{project.technologies.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View project →
          </Link>

          {project.projectLinks.demo && (
            <a
              href={project.projectLinks.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
