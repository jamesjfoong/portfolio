'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Timeline } from '@/components/ui/timeline'
import { AnimatedText } from '@/components/animations/kinetic-typography'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import personalData from '@/data/unified-data'
import { TechCategory } from '@/types/enums'

export default function AboutPage(): React.ReactElement {
  const { name, title, bio, location, email, education, skills, experiences } =
    personalData

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Transform experiences for timeline
  const timelineItems = experiences.map(exp => ({
    id: exp.id,
    title: exp.role,
    subtitle: `${exp.company} • ${exp.location}`,
    date: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || ''}`,
    description: exp.description,
    achievements: exp.achievements,
    technologies: exp.technologies.map(tech => tech.name),
    current: exp.current,
  }))

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-16"
      >
        {/* Header */}
        <motion.section
          variants={staggerItem}
          className="text-center space-y-6"
        >
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-secondary">
            {/* Placeholder for profile image */}
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">
                {name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <AnimatedText text="About Me" />
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bio */}
        <motion.section variants={staggerItem} className="space-y-6">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <div
            className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: bio }}
          />

          <div className="flex gap-4">
            <Button asChild>
              <a href="/resume.pdf" download="James_Jeremy_Foong_Resume.pdf">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:jamesjfoong2000@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </a>
            </Button>
          </div>
        </motion.section>

        {/* Experience Timeline */}
        <motion.section variants={staggerItem} className="space-y-6">
          <h2 className="text-2xl font-semibold">Professional Experience</h2>
          <Timeline items={timelineItems} />
        </motion.section>

        {/* Skills */}
        <motion.section variants={staggerItem} className="space-y-6">
          <h2 className="text-2xl font-semibold">Technical Skills</h2>
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-medium capitalize">
                    {category.replace('-', ' ')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map(skill => {
                      const getSkillVariant = (level: string) => {
                        switch (level) {
                          case 'expert':
                            return 'default'
                          case 'advanced':
                            return 'skill'
                          case 'intermediate':
                            return 'secondary'
                          default:
                            return 'outline'
                        }
                      }

                      return (
                        <Badge
                          key={skill.name}
                          variant={getSkillVariant(skill.level)}
                          className="text-sm hover:scale-105 transition-transform duration-200"
                        >
                          {skill.name}
                          <span className="ml-1 text-xs opacity-70">
                            ({skill.level})
                          </span>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section variants={staggerItem} className="space-y-6">
          <h2 className="text-2xl font-semibold">Education</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{education.degree}</h3>
                <p className="text-muted-foreground">{education.university}</p>
              </div>
              <Badge variant="secondary">{education.graduation}</Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Concentration:</strong> {education.concentration}
              </p>
              {education.minor && (
                <p>
                  <strong>Minor:</strong> {education.minor}
                </p>
              )}
              {education.gpa && (
                <p>
                  <strong>GPA:</strong> {education.gpa}/4.0
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          variants={staggerItem}
          className="text-center py-12 bg-secondary/5 rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            I'm always interested in new opportunities and collaborations.
            Whether you have a project in mind or just want to chat about
            technology, feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="mailto:jamesjfoong2000@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Me
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/projects">View My Work</a>
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}
