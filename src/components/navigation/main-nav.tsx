"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Lab", href: "/lab" },
  { name: "About", href: "/about" },
]

export default function MainNav(): React.ReactElement {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeItem, setActiveItem] = useState(pathname)

  // Update active item immediately when pathname changes
  useEffect(() => {
    // Handle detail pages for projects and blog
    let activeHref = pathname
    if (pathname.startsWith("/projects/")) {
      activeHref = "/projects"
    } else if (pathname.startsWith("/blog/")) {
      activeHref = "/blog"
    }
    setActiveItem(activeHref)
  }, [pathname])

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false)
      } else {
        // Scrolling up or at the top
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        className="hidden md:fixed md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 md:z-50 md:block"
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <nav className="relative bg-background/80 backdrop-blur-xl border border-border/30 rounded-3xl px-6 py-3 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 ease-out group overflow-hidden">
          {/* Fluid background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
          <div className="flex items-center gap-1 relative z-10">
            {navigation.map(item => {
              const isActive = activeItem === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out rounded-xl z-10",
                    "hover:scale-105 hover:shadow-sm",
                    "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/10 before:to-purple-500/10",
                    "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
                    isActive ? "text-primary shadow-sm" : "text-foreground/70 hover:text-foreground hover:text-primary"
                  )}
                  onClick={() => setActiveItem(item.href)}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/15 to-purple-500/15 border border-primary/30 rounded-xl shadow-sm -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 0.8,
                      }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl -z-20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.div
            className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            JF
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-primary/10 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M3 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="md:hidden fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 z-40"
        >
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    "hover:scale-[1.02] hover:shadow-sm",
                    pathname === item.href
                      ? "text-primary bg-gradient-to-r from-primary/15 to-purple-500/10 border border-primary/20 shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  )
}
