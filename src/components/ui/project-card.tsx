'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  className?: string
}

export default function ProjectCard({
  project,
  className,
}: ProjectCardProps): React.ReactElement {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      data-cursor="project"
      className={cn(
        'group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/20 w-full max-w-sm mx-auto sm:max-w-none',
        className
      )}
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {/* Project Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <Image
          src={project.media.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={project.status === 'completed' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {project.status}
          </Badge>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            {project.links.live && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Live Project"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.links.github && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Source Code"
                  onClick={e => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs">
              {project.category
                .replace('-', ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{project.year}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Badge
                key={tech.name}
                variant="tech"
                className="text-xs hover:scale-110 transition-transform duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tech.name}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {project.metrics.users && (
                  <span>{project.metrics.users.toLocaleString()} users</span>
                )}
                {project.metrics.github_stars && (
                  <span>⭐ {project.metrics.github_stars}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
