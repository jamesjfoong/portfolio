'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Beaker, Code, Cpu, Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Interactive3D from '@/components/animations/interactive-3d'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

// Sample experimental projects
const experiments = [
  {
    id: '1',
    title: 'AI Code Assistant',
    description:
      'An experimental AI-powered code completion and suggestion tool built with OpenAI API.',
    status: 'In Progress',
    technologies: ['TypeScript', 'OpenAI API', 'VS Code Extension'],
    icon: Cpu,
    color: 'text-blue-500',
  },
  {
    id: '2',
    title: 'Real-time Collaboration Canvas',
    description:
      'A collaborative drawing canvas with real-time synchronization using WebSockets.',
    status: 'Prototype',
    technologies: ['Canvas API', 'WebSockets', 'React'],
    icon: Code,
    color: 'text-green-500',
  },
  {
    id: '3',
    title: 'Performance Monitor Dashboard',
    description:
      'Real-time web performance monitoring with custom metrics and visualizations.',
    status: 'Concept',
    technologies: ['Web APIs', 'D3.js', 'Performance API'],
    icon: Zap,
    color: 'text-yellow-500',
  },
]

export default function LabPage(): React.ReactElement {
  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beaker className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Lab
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experimental projects, prototypes, and innovative ideas. This is
            where I explore new technologies and push the boundaries of what's
            possible.
          </p>
        </motion.div>

        {/* 3D Interactive Section */}
        <motion.div variants={staggerItem} className="mb-12">
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-6 border border-border/50">
            <Interactive3D />
          </div>
        </motion.div>

        {/* Experiments Grid */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment, index) => {
              const IconComponent = experiment.icon
              return (
                <motion.div
                  key={experiment.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-secondary/20 ${experiment.color}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge
                      variant={
                        experiment.status === 'In Progress'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {experiment.status}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {experiment.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {experiment.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {experiment.technologies.map(tech => (
                        <Badge key={tech} variant="tech" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={staggerItem}
          className="text-center py-12 bg-secondary/5 rounded-lg"
        >
          <Beaker className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Have an Idea?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            I'm always experimenting with new technologies and ideas. If you
            have an interesting concept or want to collaborate on something
            innovative, let's discuss it!
          </p>
          <Button size="lg" asChild>
            <a href="mailto:jamesjfoong2000@gmail.com">Let's Collaborate</a>
          </Button>
        </motion.div>

        {/* Technologies I'm Exploring */}
        <motion.div variants={staggerItem} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Technologies I'm Exploring
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'WebAssembly',
              'Web3 & Blockchain',
              'Machine Learning',
              'WebXR/AR',
              'Edge Computing',
              'Serverless',
              'GraphQL',
              'Micro Frontends',
            ].map((tech, index) => (
              <motion.div
                key={tech}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
              >
                <span className="font-medium text-sm">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
