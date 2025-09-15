'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/ui/project-card'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectShowcaseProps {
  projects: Project[]
  className?: string
}

export default function ProjectShowcase({
  projects,
  className,
}: ProjectShowcaseProps): React.ReactElement {
  const featuredProjects = projects.slice(0, 6)
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <section
      ref={ref}
      className={cn('py-20 relative overflow-hidden', className)}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? 'animate' : 'initial'}
        className="container max-w-6xl mx-auto px-6 relative z-10"
      >
        <motion.div variants={staggerItem} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of projects that I've worked on, showcasing my skills
            and passion for creating innovative solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={staggerItem} className="text-center">
          <Button asChild size="lg" className="group">
            <Link href="/projects">
              See More Projects
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
