import { Github, Linkedin, Mail } from "lucide-react"

import ModernHero from "@/components/sections/modern-hero"
import ProjectShowcase from "@/components/sections/project-showcase"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import personalData from "@/data/unified-data"

import type { Social } from "@/types"

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

export default function Home() {
  const { name, title, bio, projects, socials, quote } = personalData

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <ModernHero data={{ name, title, quote, socials }} />

      {/* About Section */}
      <section id="about" data-section="about" className="py-20 relative overflow-hidden">
        {/* Smooth gradient background that blends with hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/3 to-background" />

        {/* Enhanced transition from hero */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Subtle floating elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/8 to-purple-500/4 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/4 to-cyan-500/6 rounded-full blur-3xl opacity-60" />

        <div className="container max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full" />
          </div>
          <EnhancedCard
            className="p-8 md:p-12"
            motionProps={{
              whileHover: { y: -2 },
              transition: { duration: 0.2 },
            }}
          >
            <div
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </EnhancedCard>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectShowcase projects={projects} className="py-20" />

      {/* Footer */}
      <footer data-section="footer" className="relative py-12 overflow-hidden">
        {/* Seamless background transition */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/3 to-background" />

        {/* Enhanced smooth transition from projects section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent" />

        {/* Subtle floating elements */}
        <div className="absolute top-8 left-1/4 w-32 h-32 bg-primary/4 rounded-full blur-2xl opacity-60" />
        <div
          className="absolute bottom-8 right-1/4 w-24 h-24 bg-purple-500/4 rounded-full blur-2xl opacity-60"
          style={{ animationDelay: "1s" }}
        />

        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
                James Jeremy Foong
              </h3>
              <p className="text-muted-foreground text-sm">Senior Software Development Engineer</p>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              {socials.map((social: Social) => {
                const Icon = getIconForPlatform(social.platform)
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    title={`Connect on ${social.platform}`}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )
              })}
            </div>

            {/* Tech Stack */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-2">Built with modern technologies</p>
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
                  Next.js 15
                </span>
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">
                  TypeScript
                </span>
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-emerald-500/10 to-green-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} James Jeremy Foong. All rights reserved. • Designed & Developed with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
