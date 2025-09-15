'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

import FloatingElements from '@/components/animations/floating-elements'
import Interactive3D from '@/components/animations/interactive-3d'
import {
  KineticTypography,
  AnimatedText,
} from '@/components/animations/kinetic-typography'
import { Button } from '@/components/ui/button'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { PersonalData } from '@/types'

interface ModernHeroProps {
  data: Pick<PersonalData, 'name' | 'title' | 'quote' | 'socials'>
}

export default function ModernHero({
  data,
}: ModernHeroProps): React.ReactElement {
  const { name, title, quote, socials } = data
  const titleVariations = [
    'Senior Software Development Engineer',
    'Full Stack Developer',
    'AI & Web Development Expert',
    'Problem Solver & Innovator',
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* 3D Interactive Background */}
      <div className="absolute inset-0 z-0">
        <Interactive3D />
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-20 container max-w-4xl mx-auto px-6 text-center"
      >
        {/* Greeting */}
        <motion.div variants={staggerItem} className="mb-8">
          <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
            Hello World!
          </span>
        </motion.div>

        {/* Main Title with Kinetic Typography */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">I'm </span>
          <AnimatedText
            text={name.split(' ')[0]}
            className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent"
          />
        </motion.h1>

        {/* Subtitle with Kinetic Typography */}
        <motion.h2
          variants={fadeInUp}
          className="text-xl md:text-2xl text-muted-foreground font-medium mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          <KineticTypography
            texts={titleVariations}
            speed={3000}
            className="font-medium"
          />
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {quote}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button size="lg" className="group" asChild>
            <Link href="/about">
              Learn More About Me
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View My Work</Link>
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center items-center gap-6"
        >
          {socials.map(social => {
            const Icon = getIconForPlatform(social.platform)
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={`Follow me on ${social.platform}`}
              >
                <Icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </motion.a>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/20 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-primary/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

function getIconForPlatform(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github':
      return Github
    case 'linkedin':
      return Linkedin
    case 'email':
    case 'mail':
      return Mail
    default:
      return Github
  }
}
