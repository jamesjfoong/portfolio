"use client"

import React from "react"
import Link from "next/link"

import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTypingEffect } from "@/hooks/useTypingEffect"
import { fadeInUp, staggerContainer } from "@/lib/animations"

import type { PersonalData } from "@/types"

interface ModernHeroProps {
  data: Pick<PersonalData, "name" | "title" | "quote" | "socials">
}

export default function ModernHero({ data }: ModernHeroProps): React.ReactElement {
  const { name, socials } = data

  // Typing effect for different roles/titles
  const roles = [
    "Senior Software Development Engineer",
    "Full-Stack Developer",
    "AI Integration Specialist",
    "Performance Optimization Expert",
  ]

  const { displayText: currentRole } = useTypingEffect(roles, {
    speed: 80,
    deleteSpeed: 40,
    deleteDelay: 3000,
    delay: 1500,
    loop: true,
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />

      {/* Subtle floating gradients for smooth animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          style={{
            animation: "gradient-float 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-purple-500/15 to-transparent rounded-full blur-3xl"
          style={{
            animation: "gradient-float 15s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 rounded-full blur-3xl"
          style={{
            animation: "gradient-shift 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Subtle Accent Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, hsl(142, 76%, 36%, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, hsl(142, 76%, 36%, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, hsl(142, 76%, 36%, 0.06) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Minimal Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.01]">
        <div className="h-full w-full bg-[linear-gradient(to_right,hsl(142,76%,36%,0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(142,76%,36%,0.1)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 container max-w-6xl mx-auto px-6 text-center"
      >
        {/* Bold Typography-Focused Title */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[0.9]"
        >
          <span className="text-foreground block mb-2">I'm </span>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block">
            {name.split(" ")[0]}
          </span>
        </motion.h1>

        {/* Dynamic Subtitle with Typing Effect */}
        <motion.h2
          variants={fadeInUp}
          className="text-xl md:text-3xl text-muted-foreground font-light mb-8 max-w-4xl mx-auto leading-relaxed min-h-[2.5rem] md:min-h-[3.5rem]"
        >
          <span className="inline-block">
            {currentRole}
            <span className="animate-pulse text-primary ml-1">|</span>
          </span>
        </motion.h2>

        {/* Concise Value Proposition */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto mb-16 leading-relaxed font-light"
        >
          Building exceptional digital experiences with modern web technologies, AI integration, and performance-first
          development.
        </motion.p>

        {/* Clean CTA Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Button size="lg" className="group px-8 py-4 text-base" asChild>
            <Link href="/projects">
              View My Work
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="px-8 py-4 text-base" asChild>
            <Link href="/about">About Me</Link>
          </Button>
        </motion.div>

        {/* Minimal Social Links */}
        <motion.div variants={fadeInUp} className="flex justify-center items-center gap-8">
          {socials.map(social => {
            const Icon = getIconForPlatform(social.platform)
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={`Connect on ${social.platform}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 p-2">
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

function getIconForPlatform(platform: string) {
  switch (platform.toLowerCase()) {
    case "github":
      return Github
    case "linkedin":
      return Linkedin
    case "email":
    case "mail":
      return Mail
    default:
      return Github
  }
}
