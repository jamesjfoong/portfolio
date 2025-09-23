"use client"

import React from "react"
import Link from "next/link"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/ui/project-card"
import { useInView } from "@/hooks/useScrollAnimation"
import { cardHover, revealUp, staggerItem, staggerReveal, staggerRevealItem, textReveal } from "@/lib/animations"
import { cn } from "@/lib/utils"

import type { Project } from "@/types"

interface ProjectShowcaseProps {
  projects: Project[]
  className?: string
}

export default function ProjectShowcase({ projects, className }: ProjectShowcaseProps): React.ReactElement {
  const featuredProjects = projects.slice(0, 6)
  const { ref, isInView } = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -5% 0px",
    initialCheck: true,
  })

  return (
    <section ref={ref} data-section="projects" className={cn("py-20 relative overflow-hidden", className)}>
      {/* Seamless Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/3 to-background" />

      {/* Subtle floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/4 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/4 rounded-full blur-3xl opacity-70" />

      {/* Smooth transition overlays */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/40 to-transparent" />

      <motion.div
        variants={staggerReveal}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="container max-w-6xl mx-auto px-6 relative z-10"
      >
        <motion.div variants={textReveal} className="text-center mb-16">
          <motion.h2 variants={revealUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </motion.h2>
          <motion.p variants={revealUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of projects that I&apos;ve worked on, showcasing my skills and passion for creating innovative
            solutions.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerReveal}
          className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-12"
        >
          {featuredProjects.map((project, _index) => (
            <motion.div
              key={project.id}
              variants={staggerRevealItem}
              whileHover={cardHover}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-10%" }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

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
