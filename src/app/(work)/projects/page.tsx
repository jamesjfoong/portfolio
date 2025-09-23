"use client"

import { useState } from "react"

import { motion } from "framer-motion"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProjectCard from "@/components/ui/project-card"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"
import personalData from "@/data/unified-data"

import type { ProjectCategory } from "@/types/enums"

export default function ProjectsPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all")
  const { projects } = personalData

  // Dynamically get categories from actual project data
  const categories = Array.from(new Set(projects.map(project => project.category))).sort() // Sort alphabetically for consistency

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-12">
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for creating innovative solutions.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Projects
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={staggerItem}>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
