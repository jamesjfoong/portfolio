'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Star,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'

import personalData from '@/data/unified-data'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProjectPage({
  params,
}: ProjectPageProps): React.ReactElement {
  return <ProjectPageContent params={params} />
}

function ProjectPageContent({ params }: ProjectPageProps): React.ReactElement {
  const [slug, setSlug] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  if (!slug) {
    return <div>Loading...</div>
  }

  const project = personalData.projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        {/* Back Button */}
        <motion.div variants={staggerItem}>
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div variants={staggerItem} className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary">{project.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Project Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{project.year}</span>
            </div>
            {project.metrics?.users && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{project.metrics.users.toLocaleString()} users</span>
              </div>
            )}
            {project.metrics?.github_stars && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{project.metrics.github_stars} stars</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.links.live && (
              <Button asChild>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Site
                </a>
              </Button>
            )}
            {project.links.github && (
              <Button variant="outline" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Project Image */}
        <motion.div
          variants={staggerItem}
          className="relative aspect-video rounded-lg overflow-hidden"
        >
          <Image
            src={project.media.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section variants={staggerItem}>
              <h2 className="text-2xl font-semibold mb-4">
                About This Project
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>{project.fullDescription}</p>
              </div>
            </motion.section>

            {/* Features */}
            {project.features.length > 0 && (
              <motion.section variants={staggerItem}>
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Challenges & Solutions */}
            {project.challenges.length > 0 && (
              <motion.section variants={staggerItem}>
                <h2 className="text-2xl font-semibold mb-4">
                  Challenges & Solutions
                </h2>
                <div className="space-y-6">
                  {project.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-primary/20 pl-6"
                    >
                      <h3 className="font-medium mb-2">Challenge</h3>
                      <p className="text-muted-foreground mb-3">{challenge}</p>
                      {project.solutions[index] && (
                        <>
                          <h3 className="font-medium mb-2">Solution</h3>
                          <p className="text-muted-foreground">
                            {project.solutions[index]}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            <motion.section variants={staggerItem}>
              <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech.name} variant="outline">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </motion.section>

            {/* Project Info */}
            <motion.section variants={staggerItem}>
              <h3 className="text-lg font-semibold mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant="secondary" className="ml-2">
                    {project.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-muted-foreground">
                    {project.category}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Timeline:</span>
                  <span className="ml-2 text-muted-foreground">
                    {project.startDate}{' '}
                    {project.endDate && `- ${project.endDate}`}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Metrics */}
            {project.metrics && (
              <motion.section variants={staggerItem}>
                <h3 className="text-lg font-semibold mb-4">Impact</h3>
                <div className="space-y-3 text-sm">
                  {project.metrics.impact && (
                    <div>
                      <span className="font-medium">Impact:</span>
                      <p className="text-muted-foreground mt-1">
                        {project.metrics.impact}
                      </p>
                    </div>
                  )}
                  {project.metrics.users && (
                    <div>
                      <span className="font-medium">Users:</span>
                      <span className="ml-2 text-muted-foreground">
                        {project.metrics.users.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
